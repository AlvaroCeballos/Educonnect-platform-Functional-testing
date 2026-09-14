const pool = require('../config/db');

const ALLOWED_STATUS = new Set(['APPROVED', 'REJECTED']);

const listUsers = async (req, res) => {
  const status = String(req.query.status || 'PENDING').toUpperCase();
  const validStatuses = new Set(['PENDING', 'APPROVED', 'REJECTED', 'DISABLED']);
  if (!validStatuses.has(status)) {
    return res.status(400).json({ message: 'Estado de usuario no válido' });
  }

  try {
    const [rows] = await pool.execute(`
      SELECT
        u.id,
        u.email,
        u.role,
        u.status,
        u.created_at,
        COALESCE(sp.nombre, tp.nombre) AS nombre,
        COALESCE(sp.apellido, tp.apellido) AS apellido,
        COALESCE(sp.carnet, tp.carnet) AS carnet,
        tp.especialidad,
        tp.fotografia_url
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN tutor_profiles tp ON tp.user_id = u.id
      WHERE u.status = ? AND u.role IN ('student', 'tutor')
      ORDER BY u.created_at ASC, u.id ASC
    `, [status]);

    return res.json({ users: rows });
  } catch (error) {
    console.error('Error listando usuarios para administración:', error);
    return res.status(500).json({ message: 'No fue posible cargar los usuarios' });
  }
};

const updateUserStatus = async (req, res) => {
  const userId = Number(req.params.id);
  const status = String(req.body?.status || '').toUpperCase();

  if (!Number.isInteger(userId) || userId < 1) {
    return res.status(400).json({ message: 'El identificador de usuario no es válido' });
  }
  if (!ALLOWED_STATUS.has(status)) {
    return res.status(400).json({ message: 'Solo se permite aprobar o rechazar una solicitud' });
  }

  try {
    const [result] = await pool.execute(`
      UPDATE users
      SET status = ?
      WHERE id = ? AND status = 'PENDING' AND role IN ('student', 'tutor')
    `, [status, userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Solicitud pendiente no encontrada' });
    }

    const [rows] = await pool.execute(`
      SELECT id, email, role, status
      FROM users
      WHERE id = ?
    `, [userId]);

    return res.json({ message: `Solicitud ${status === 'APPROVED' ? 'aprobada' : 'rechazada'}`, user: rows[0] });
  } catch (error) {
    console.error('Error actualizando estado de usuario:', error);
    return res.status(500).json({ message: 'No fue posible actualizar la solicitud' });
  }
};

module.exports = { listUsers, updateUserStatus };
