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


 //HU-003 Fase 2: Validación del archivo 2FA

const loginAdmin2FA = async (req, res) => {
  const { adminId } = req.body;
  
  if (!adminId)
    return res.status(400).json({ message: 'adminId requerido' });
  
  if (!req.file)
    return res.status(400).json({ message: 'Archivo auth2-ayd1.txt requerido' });

  // Validar nombre de archivo
  if (req.file.originalname !== 'auth2-ayd1.txt')
    return res.status(400).json({ message: 'El archivo debe llamarse auth2-ayd1.txt' });

  // Validar contenido: debe coincidir con el hash 2FA esperado
  const expected2FAHash = '$2b$10$GVlO95gxMuYE0pf1eVLDbO4tHQzoj.vJyLKuNyzDj0M2.q0NewzEm';
  const fileContent = req.file.buffer.toString('utf-8').trim();

  if (fileContent !== expected2FAHash)
    return res.status(401).json({ message: 'Archivo 2FA inválido' });

  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.execute(
      'SELECT id, email FROM users WHERE id = ? AND role = "admin"',
      [adminId]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: 'Usuario admin no encontrado' });

    const user = rows[0];

    const token = jwt.sign(
      { id: user.id, email: user.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.status(200).json({
      message: 'Autenticación 2FA completada',
      token,
      phase: 2,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error('Error en login admin fase 2:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};


 // HU-006: Login de estudiante
 // POST /api/auth/login/student

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email y contraseña requeridos' });

  const conn = await pool.getConnection();
  try {
    // Query que trae tanto users como student_profiles
    const [rows] = await conn.execute(`
      SELECT u.id, u.email, u.password_hash, u.status, sp.id as student_id, sp.nombre, sp.apellido, sp.carnet
      FROM users u
      LEFT JOIN student_profiles sp ON u.id = sp.user_id
      WHERE u.email = ? AND u.role = 'student'
    `, [email]);

    if (rows.length === 0)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    const student = rows[0];

    // Solo estudiantes aprobados
    if (student.status !== 'APPROVED') {
      const statusMessages = {
        PENDING: 'Tu cuenta aún no ha sido aprobada por el administrador',
        REJECTED: 'Tu solicitud de estudiante fue rechazada',
        DISABLED: 'Tu cuenta ha sido dada de baja por el administrador',
      };
      return res.status(403).json({
        message: statusMessages[student.status] || 'Tu cuenta no está habilitada',
      });
    }

    const passwordMatch = await comparePassword(password, student.password_hash);
    if (!passwordMatch)
      return res.status(401).json({ message: 'Credenciales inválidas' });

    // JWT con studentId (igual que tutorId en tutorLoginController)
    const token = jwt.sign(
      { id: student.id, studentId: student.student_id, role: 'student', email: student.email, status: student.status },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      student: { id: student.student_id, userId: student.id, nombre: student.nombre, apellido: student.apellido, email: student.email },
    });
  } catch (err) {
    console.error('Error en login estudiante:', err);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    conn.release();
  }
};

module.exports = { registerStudent, loginAdmin, loginAdmin2FA, loginStudent };
