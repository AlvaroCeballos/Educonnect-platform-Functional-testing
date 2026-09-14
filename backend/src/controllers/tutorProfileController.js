const pool = require('../config/db');
const { hashPassword, validatePasswordStrength } = require('../utils/password');

const getTutorId = (req) => Number(req.user?.tutorId || req.user?.id);
const fields = ['nombre', 'apellido', 'carnet', 'identificacion', 'fecha_nacimiento', 'genero', 'especialidad', 'direccion_tutoria', 'anio_inicio_experiencia', 'universidad'];

const getMyProfile = async (req, res, next) => {
  const tutorId = getTutorId(req);
  try {
    const [rows] = await pool.execute(`SELECT tp.id, u.email, u.status, tp.nombre, tp.apellido, tp.carnet, tp.identificacion, tp.fecha_nacimiento, tp.genero, tp.fotografia_url, tp.especialidad, tp.direccion_tutoria, tp.anio_inicio_experiencia, tp.universidad FROM tutor_profiles tp JOIN users u ON u.id = tp.user_id WHERE tp.id = ? AND u.role = 'tutor' LIMIT 1`, [tutorId]);
    if (!rows[0]) return res.status(404).json({ message: 'Perfil de tutor no encontrado' });
    return res.json({ tutor: rows[0] });
  } catch (error) { return next(error); }
};

const updateMyProfile = async (req, res, next) => {
  const tutorId = getTutorId(req);
  if (req.body?.email !== undefined) return res.status(400).json({ message: 'El correo electrónico no se puede modificar' });
  const values = fields.map((field) => req.body?.[field]);
  if (values.some((value) => value === undefined || String(value).trim() === '')) return res.status(400).json({ message: 'Todos los datos del perfil son obligatorios' });
  if (req.body.password) { const check = validatePasswordStrength(String(req.body.password)); if (!check.valid) return res.status(400).json({ message: check.message }); }
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.execute(`UPDATE tutor_profiles SET ${fields.map((field) => `${field} = ?`).join(', ')} WHERE id = ?`, [...values, tutorId]);
    if (req.body.password) await connection.execute('UPDATE users u JOIN tutor_profiles tp ON tp.user_id = u.id SET u.password_hash = ? WHERE tp.id = ?', [await hashPassword(String(req.body.password)), tutorId]);
    await connection.commit();
    return res.json({ message: 'Perfil actualizado correctamente' });
  } catch (error) { if (connection) await connection.rollback(); if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'El carnet o la identificación ya están registrados' }); return next(error); } finally { if (connection) connection.release(); }
};

module.exports = { getMyProfile, updateMyProfile };
