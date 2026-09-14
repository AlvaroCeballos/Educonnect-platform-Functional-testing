const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

const loginTutor = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');
  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT u.id AS user_id, u.email, u.password_hash, u.status,
              tp.id AS tutor_id, tp.nombre, tp.apellido
         FROM users u
         JOIN tutor_profiles tp ON tp.user_id = u.id
        WHERE u.email = ? AND u.role = 'tutor'
        LIMIT 1`,
      [email],
    );
    const tutor = rows[0];
    if (!tutor || !(await bcrypt.compare(password, tutor.password_hash))) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }
      if (tutor.status !== 'APPROVED') {
        const messages = {
          PENDING: 'Tu cuenta está pendiente de aprobación por el administrador',
          REJECTED: 'Tu solicitud de tutor fue rechazada',
          DISABLED: 'Tu cuenta de tutor ha sido dada de baja por el administrador',
        };
        return res.status(403).json({ message: messages[tutor.status] || 'Tu cuenta no está habilitada' });
      }

    const token = jwt.sign(
      { id: tutor.user_id, tutorId: tutor.tutor_id, role: 'tutor', email: tutor.email, status: tutor.status },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
    );
    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      tutor: { id: tutor.tutor_id, userId: tutor.user_id, nombre: tutor.nombre, apellido: tutor.apellido, email: tutor.email },
    });
  } catch (error) {
    console.error('Error en inicio de sesión de tutor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { normalizeEmail, loginTutor };
