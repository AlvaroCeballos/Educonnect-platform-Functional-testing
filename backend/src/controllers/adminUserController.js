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

    await pool.execute(`
      UPDATE users
      SET status = ?
      WHERE id = ? AND status = 'PENDING'
    `, [status, userId]);

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

const getTopTutorsReport = async (req, res) => {
  try {
    const query = `
      SELECT 
        tp.id AS tutor_id,
        u.id AS user_id,
        tp.nombre,
        tp.apellido,
        tp.carnet,
        tp.especialidad,
        tp.universidad,
        tp.fotografia_url,
        u.email,
        u.status AS user_status,
        COUNT(CASE WHEN s.status = 'ATTENDED' THEN 1 ELSE NULL END) AS total_atendidos,
        COUNT(DISTINCT CASE WHEN s.status = 'ATTENDED' THEN s.student_id ELSE NULL END) AS estudiantes_distintos,
        COUNT(s.id) AS total_sesiones_historicas
      FROM tutor_profiles tp
      JOIN users u ON u.id = tp.user_id
      LEFT JOIN sessions s ON s.tutor_id = tp.id
      GROUP BY tp.id, u.id, tp.nombre, tp.apellido, tp.carnet, tp.especialidad, tp.universidad, tp.fotografia_url, u.email, u.status
      ORDER BY total_atendidos DESC, estudiantes_distintos DESC, tp.apellido ASC, tp.nombre ASC
    `;

    const [rows] = await pool.execute(query);

    const formatted = rows.map((row, index) => ({
      ranking: index + 1,
      tutorId: row.tutor_id,
      userId: row.user_id,
      nombre: row.nombre,
      apellido: row.apellido,
      nombreCompleto: [row.nombre, row.apellido].filter(Boolean).join(' ') || 'Sin nombre',
      email: row.email,
      carnet: row.carnet || '—',
      especialidad: row.especialidad || 'General',
      universidad: row.universidad || '—',
      fotografiaUrl: row.fotografia_url,
      userStatus: row.user_status,
      totalAtendidos: Number(row.total_atendidos) || 0,
      estudiantesDistintos: Number(row.estudiantes_distintos) || 0,
      totalSesiones: Number(row.total_sesiones_historicas) || 0,
    }));

    return res.json({
      reportTitle: 'Reporte de Tutores con Más Estudiantes Atendidos (HU-026)',
      generatedAt: new Date().toISOString(),
      totalTutors: formatted.length,
      topTutors: formatted,
    });
  } catch (error) {
    console.error('Error generando reporte de tutores por demanda:', error);
    return res.status(500).json({ message: 'Error interno al generar el reporte' });
  }
};

/**
 * HU-027: Reporte de materias con mayor demanda
 * GET /api/admin/reports/top-subjects
 * GET /api/admin/reports/subjects-demand
 */
const getSubjectsDemandReport = async (_req, res) => {
  try {
    const query = `
      SELECT 
        sub.id AS subject_id,
        sub.nombre AS materia,
        COUNT(s.id) AS total_sesiones,
        COUNT(CASE WHEN s.status = 'ATTENDED' THEN 1 ELSE NULL END) AS sesiones_atendidas,
        COUNT(CASE WHEN s.status = 'PENDING' THEN 1 ELSE NULL END) AS sesiones_pendientes,
        COUNT(CASE WHEN s.status LIKE 'CANCELLED%' THEN 1 ELSE NULL END) AS sesiones_canceladas,
        COUNT(DISTINCT s.student_id) AS estudiantes_unicos
      FROM subjects sub
      LEFT JOIN sessions s ON s.subject_id = sub.id
      WHERE sub.is_active = TRUE
      GROUP BY sub.id, sub.nombre
      ORDER BY total_sesiones DESC, sesiones_atendidas DESC, sub.nombre ASC
    `;

    const [rows] = await pool.execute(query);

    const totalSessionsAll = rows.reduce((acc, row) => acc + Number(row.total_sesiones), 0);

    const formatted = rows.map((row, index) => {
      const totalSesiones = Number(row.total_sesiones) || 0;
      const porcentaje = totalSessionsAll > 0 
        ? Math.round((totalSesiones / totalSessionsAll) * 100) 
        : 0;

      return {
        ranking: index + 1,
        subjectId: row.subject_id,
        materia: row.materia,
        totalSesiones,
        sesionesAtendidas: Number(row.sesiones_atendidas) || 0,
        sesionesPendientes: Number(row.sesiones_pendientes) || 0,
        sesionesCanceladas: Number(row.sesiones_canceladas) || 0,
        estudiantesUnicos: Number(row.estudiantes_unicos) || 0,
        porcentaje,
      };
    });

    return res.json({
      reportTitle: 'Reporte de Materias con Mayor Demanda (HU-027)',
      generatedAt: new Date().toISOString(),
      totalSessionsAll,
      topSubject: formatted[0] || null,
      subjectsReport: formatted,
    });
  } catch (error) {
    console.error('Error generando reporte de materias con mayor demanda:', error);
    return res.status(500).json({ message: 'Error interno al generar el reporte de materias' });
  }
};

/**
 * HU-041: Actualizar información del perfil de un estudiante por el Administrador
 * PUT /api/admin/users/:id/student-profile
 * PUT /api/admin/students/:id
 * Regla de inmutabilidad (PU-11): El correo electrónico no se puede modificar.
 */
const updateStudentProfileByAdmin = async (req, res) => {
  const userId = Number(req.params.id);
  const {
    nombre,
    apellido,
    carnet,
    fecha_nacimiento,
    genero,
    universidad,
    carrera,
    fotografia_url,
    email,
  } = req.body || {};

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: 'El identificador de usuario no es válido' });
  }

  if (!nombre || !apellido || !carnet) {
    return res.status(400).json({ message: 'Nombre, apellido y carnet son obligatorios' });
  }

  let conn;
  try {
    conn = await pool.getConnection();

    // 1. Verificar existencia del usuario con rol student
    const [userRows] = await conn.execute(
      `SELECT u.id, u.email, u.status, sp.id AS profile_id
         FROM users u
         LEFT JOIN student_profiles sp ON sp.user_id = u.id
        WHERE u.id = ? AND u.role = 'student'`,
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    const currentStudent = userRows[0];

    // PU-11: Regla de inmutabilidad estricta del correo electrónico
    if (
      email !== undefined &&
      email !== null &&
      String(email).trim().toLowerCase() !== String(currentStudent.email).trim().toLowerCase()
    ) {
      return res.status(400).json({
        message: 'El correo electrónico no puede ser modificado por políticas de seguridad e inmutabilidad',
      });
    }

    // 2. Verificar que no exista otro estudiante con el mismo carnet
    const [carnetConflict] = await conn.execute(
      'SELECT id FROM student_profiles WHERE carnet = ? AND user_id != ?',
      [String(carnet).trim(), userId]
    );
    if (carnetConflict.length > 0) {
      return res.status(409).json({ message: 'El carnet ya se encuentra registrado por otro estudiante' });
    }

    const validGenders = new Set(['M', 'F', 'OTHER', 'UNSPECIFIED']);
    const normalizedGender = validGenders.has(String(genero || '').toUpperCase())
      ? String(genero).toUpperCase()
      : 'UNSPECIFIED';

    await conn.execute(
      `UPDATE student_profiles
          SET nombre = ?,
              apellido = ?,
              carnet = ?,
              fecha_nacimiento = ?,
              genero = ?,
              universidad = ?,
              carrera = ?,
              fotografia_url = ?
        WHERE user_id = ?`,
      [
        String(nombre).trim(),
        String(apellido).trim(),
        String(carnet).trim(),
        fecha_nacimiento || null,
        normalizedGender,
        universidad ? String(universidad).trim() : null,
        carrera ? String(carrera).trim() : null,
        fotografia_url ? String(fotografia_url).trim() : null,
        userId,
      ]
    );

    return res.json({
      message: 'Perfil de estudiante actualizado exitosamente',
      student: {
        userId,
        email: currentStudent.email,
        nombre: String(nombre).trim(),
        apellido: String(apellido).trim(),
        carnet: String(carnet).trim(),
        fecha_nacimiento: fecha_nacimiento || null,
        genero: normalizedGender,
        universidad: universidad ? String(universidad).trim() : null,
        carrera: carrera ? String(carrera).trim() : null,
        fotografia_url: fotografia_url ? String(fotografia_url).trim() : null,
      },
    });
  } catch (error) {
    console.error('Error actualizando perfil de estudiante:', error);
    return res.status(500).json({ message: 'No fue posible actualizar el perfil del estudiante' });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  listUsers,
  updateUserStatus,
  disableUser,
  getTopTutorsReport,
  getSubjectsDemandReport,
  updateStudentProfileByAdmin,
};