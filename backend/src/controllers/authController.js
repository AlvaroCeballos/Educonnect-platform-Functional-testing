const pool    = require('../config/db');
const jwt     = require('jsonwebtoken');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password');

/**
 * HU-001: Registro de estudiante
 * POST /api/auth/register/student
 */
const registerStudent = async (req, res) => {
  const { nombre, apellido, carnet, email, password } = req.body;

  if (!nombre || !apellido || !carnet || !email || !password)
    return res.status(400).json({ message: 'Todos los campos son requeridos' });

  const check = validatePasswordStrength(password);
  if (!check.valid)
    return res.status(400).json({ message: check.message });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.execute(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (existing.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }

    const [existingCarnet] = await conn.execute(
      'SELECT id FROM student_profiles WHERE carnet = ?', [carnet]
    );
    if (existingCarnet.length > 0) {
      await conn.rollback();
      return res.status(409).json({ message: 'El carnet ya está registrado' });
    }

    const password_hash = await hashPassword(password);
    const [userResult] = await conn.execute(
      'INSERT INTO users (email, password_hash, role, status) VALUES (?, ?, "student", "PENDING")',
      [email, password_hash]
    );
    const userId = userResult.insertId;

    await conn.execute(
      'INSERT INTO student_profiles (user_id, nombre, apellido, carnet) VALUES (?, ?, ?, ?)',
      [userId, nombre, apellido, carnet]
    );

    await conn.commit();
    return res.status(201).json({
      message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.',
    });
  } catch (err) {
    await conn.rollback();
    console.error('Error en registro de estudiante:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

/**
 * HU-003 Fase 1: Login de administrador
 * POST /api/auth/login/admin
 * Retorna: "Ingrese archivo 2FA" si credenciales son correctas
 */
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos' });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, email, password_hash, status FROM users WHERE email = ? AND role = "admin"',
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const user = rows[0];

    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    return res.status(200).json({
      message: 'Fase 1 completada. Ingrese el archivo auth2-ayd1.txt',
      phase: 1,
      adminId: user.id,
      email: user.email,
    });
  } catch (err) {
    console.error('Error en login admin fase 1:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

module.exports = { registerStudent, loginAdmin };
