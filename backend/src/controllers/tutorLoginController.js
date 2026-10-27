const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const normalizeEmail = (value) => String(value || '').trim().toLowerCase();

/**
 * HU-007 + HU-031: Login de tutor con soporte de Token en primer inicio
 * POST /api/auth/login/tutor
 */
const loginTutor = async (req, res) => {
  const email = normalizeEmail(req.body?.email);
  const password = String(req.body?.password || '');
  const inputToken = String(req.body?.token || '').trim().toUpperCase();

  if (!email || !password) {
    return res.status(400).json({ message: 'El correo y la contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.execute(
      `SELECT u.id AS user_id, u.email, u.password_hash, u.status, u.email_verified, u.verification_token,
              tp.id AS tutor_id, tp.nombre, tp.apellido
         FROM users u
         JOIN tutor_profiles tp ON tp.user_id = u.id
        WHERE u.email = ? AND u.role = 'tutor'
        LIMIT 1`,
      [email]
    );

    const tutor = rows[0];

    if (!tutor || !(await bcrypt.compare(password, tutor.password_hash))) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    // FLUJO HU-031: PRIMER INICIO DE SESIÓN CON TOKEN (si tiene token asignado)
    if (!tutor.email_verified && tutor.verification_token) {
      if (!inputToken) {
        return res.status(403).json({
          requiresToken: true,
          message:
            'Tu cuenta requiere ingresar el token de verificación enviado a tu correo en tu primer inicio de sesión.',
        });
      }

      if (inputToken !== String(tutor.verification_token || '').trim().toUpperCase()) {
        return res.status(401).json({
          requiresToken: true,
          message: 'El token de verificación ingresado es incorrecto.',
        });
      }

      if (tutor.status !== 'APPROVED') {
        const messages = {
          PENDING:
            'Tu token de correo es correcto, pero tu cuenta de tutor aún está pendiente de aprobación por el administrador.',
          REJECTED:
            'Tu token de correo es correcto, pero tu solicitud de tutor fue rechazada por el administrador.',
          DISABLED:
            'Tu cuenta de tutor ha sido dada de baja por el administrador.',
        };
        return res.status(403).json({
          requiresToken: true,
          message: messages[tutor.status] || 'Tu cuenta no está aprobada.',
        });
      }

      // Marcar correo verificado y limpiar token
      await pool.execute(
        `UPDATE users 
            SET email_verified = TRUE, verification_token = NULL 
          WHERE id = ?`,
        [tutor.user_id]
      );
    } else {
      // INICIOS SIN TOKEN O POSTERIORES
      if (tutor.status !== 'APPROVED') {
        const messages = {
          PENDING: 'Tu cuenta está pendiente de aprobación por el administrador',
          REJECTED: 'Tu solicitud de tutor fue rechazada',
          DISABLED: 'Tu cuenta de tutor ha sido dada de baja por el administrador',
        };
        return res.status(403).json({
          message: messages[tutor.status] || 'Tu cuenta no está habilitada',
        });
      }

      if (!tutor.email_verified) {
        await pool.execute(
          `UPDATE users SET email_verified = TRUE WHERE id = ?`,
          [tutor.user_id]
        );
      }
    }

    const token = jwt.sign(
      {
        id: tutor.user_id,
        tutorId: tutor.tutor_id,
        role: 'tutor',
        email: tutor.email,
        status: tutor.status,
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      tutor: {
        id: tutor.tutor_id,
        userId: tutor.user_id,
        nombre: tutor.nombre,
        apellido: tutor.apellido,
        email: tutor.email,
      },
    });
  } catch (error) {
    console.error('Error en inicio de sesión de tutor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = { normalizeEmail, loginTutor };