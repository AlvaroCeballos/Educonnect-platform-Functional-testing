const pool = require('../config/db');
const { sendAccountDecisionEmail } = require('../utils/mailer');

const ALLOWED_STATUS = new Set(['APPROVED', 'REJECTED', 'DISABLED']);

const listUsers = async (req, res) => {
  const status = String(req.query.status || 'PENDING').toUpperCase();
  const role = req.query.role ? String(req.query.role).toLowerCase() : null;

  const validStatuses = new Set(['PENDING', 'APPROVED', 'REJECTED', 'DISABLED']);
  if (!validStatuses.has(status)) {
    return res.status(400).json({ message: 'Estado de usuario no válido' });
  }

  if (role && !['student', 'tutor'].includes(role)) {
    return res.status(400).json({ message: 'Rol de usuario no válido' });
  }

  try {
    let query = `
      SELECT
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        COALESCE(sp.nombre, tp.nombre) AS nombre,
        COALESCE(sp.apellido, tp.apellido) AS apellido,
        COALESCE(sp.carnet, tp.carnet) AS carnet,
        COALESCE(sp.genero, tp.genero) AS genero,
        COALESCE(sp.fecha_nacimiento, tp.fecha_nacimiento) AS fecha_nacimiento,
        COALESCE(sp.fotografia_url, tp.fotografia_url) AS fotografia_url,
        sp.carrera,
        COALESCE(sp.universidad, tp.universidad) AS universidad,
        tp.identificacion,
        tp.especialidad,
        tp.direccion_tutoria,
        tp.anio_inicio_experiencia
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
      WHERE u.status = ?
    `;

    const params = [status];

    if (role) {
      query += ` AND u.role = ?`;
      params.push(role);
    } else {
      query += ` AND u.role IN ('student', 'tutor')`;
    }

    query += ` ORDER BY u.created_at ASC, u.id ASC`;

    const [rows] = await pool.execute(query, params);

    return res.json({ users: rows });
  } catch (error) {
    console.error('Error listando usuarios para administración:', error);
    return res.status(500).json({ message: 'No fue posible cargar los usuarios' });
  }
};

const updateUserStatus = async (req, res) => {
  const userId = Number(req.params.id);
  const status = String(req.body?.status || '').toUpperCase();
  const reason = String(req.body?.reason || '').trim();

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: 'El identificador de usuario no es válido' });
  }
  if (!ALLOWED_STATUS.has(status)) {
    return res.status(400).json({ message: 'Solo se permite aprobar o rechazar una solicitud' });
  }

  if (status === 'DISABLED') {
    return disableUser(req, res);
  }

  try {
    // 1. Obtener datos previos del usuario para la notificación
    const [userRows] = await pool.execute(`
      SELECT 
        u.id, 
        u.email, 
        u.role, 
        u.status,
        COALESCE(sp.nombre, tp.nombre) AS nombre,
        COALESCE(sp.apellido, tp.apellido) AS apellido
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
      WHERE u.id = ? AND u.status = 'PENDING' AND u.role IN ('student', 'tutor')
    `, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Solicitud pendiente no encontrada' });
    }

    const targetUser = userRows[0];

    // 2. Actualizar estado
    await pool.execute(`
      UPDATE users
      SET status = ?
      WHERE id = ? AND status = 'PENDING'
    `, [status, userId]);

    // 3. Enviar correo de notificación (HU-004 / HU-005)
    const nombreCompleto = [targetUser.nombre, targetUser.apellido].filter(Boolean).join(' ') || 'Usuario';
    sendAccountDecisionEmail({
      to: targetUser.email,
      nombre: nombreCompleto,
      role: targetUser.role,
      status,
      reason,
    }).catch((mailErr) => {
      console.error('Error enviando notificación por correo:', mailErr);
    });

    return res.json({
      message: `Solicitud ${status === 'APPROVED' ? 'aprobada' : 'rechazada'} exitosamente`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        status,
      },
    });
  } catch (error) {
    console.error('Error actualizando estado de usuario:', error);
    return res.status(500).json({ message: 'No fue posible actualizar la solicitud' });
  }
};

/**
 * HU-024 / HU-025: Dar de baja lógica a un usuario aprobado (estudiante o tutor)
 * PATCH /api/admin/users/:id/disable
 */
const disableUser = async (req, res) => {
  const userId = Number(req.params.id);
  const reason = String(req.body?.reason || '').trim();

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: 'El identificador de usuario no es válido' });
  }

  try {
    const [userRows] = await pool.execute(`
      SELECT 
        u.id, 
        u.email, 
        u.role, 
        u.status,
        COALESCE(sp.nombre, tp.nombre) AS nombre,
        COALESCE(sp.apellido, tp.apellido) AS apellido
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
      WHERE u.id = ? AND u.role IN ('student', 'tutor')
    `, [userId]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const targetUser = userRows[0];

    if (targetUser.status === 'DISABLED') {
      return res.status(409).json({ message: 'El usuario ya se encuentra dado de baja' });
    }

    if (targetUser.status !== 'APPROVED') {
      return res.status(400).json({ message: 'Solo es posible dar de baja a usuarios aprobados' });
    }

    await pool.execute(`
      UPDATE users
      SET status = 'DISABLED'
      WHERE id = ? AND status = 'APPROVED'
    `, [userId]);

    // Notificación por correo al dar de baja
    const nombreCompleto = [targetUser.nombre, targetUser.apellido].filter(Boolean).join(' ') || 'Usuario';
    sendAccountDecisionEmail({
      to: targetUser.email,
      nombre: nombreCompleto,
      role: targetUser.role,
      status: 'DISABLED',
      reason,
    }).catch((mailErr) => {
      console.error('Error enviando notificación de baja por correo:', mailErr);
    });

    const roleLabel = targetUser.role === 'tutor' ? 'Tutor' : 'Estudiante';
    return res.json({
      message: `${roleLabel} dado de baja exitosamente`,
      user: {
        id: targetUser.id,
        email: targetUser.email,
        role: targetUser.role,
        status: 'DISABLED',
      },
    });
  } catch (error) {
    console.error('Error al dar de baja a usuario:', error);
    return res.status(500).json({ message: 'No fue posible dar de baja al usuario' });
  }
};

module.exports = { listUsers, updateUserStatus, disableUser };


