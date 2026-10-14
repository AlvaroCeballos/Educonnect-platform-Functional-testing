const fs = require('fs/promises');
const pool = require('../config/db');
const { hashPassword, validatePasswordStrength } = require('../utils/password');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_GENDERS = new Set(['M', 'F', 'OTHER', 'UNSPECIFIED']);

const requiredTextFields = [
  'nombre',
  'apellido',
  'carnet',
  'identificacion',
  'fecha_nacimiento',
  'email',
  'password',
  'especialidad',
  'direccion_tutoria',
  'anio_inicio_experiencia',
  'universidad',
];

const normalizeTutorPayload = (payload = {}) => ({
  nombre: String(payload.nombre || '').trim(),
  apellido: String(payload.apellido || '').trim(),
  carnet: String(payload.carnet || '').trim(),
  identificacion: String(payload.identificacion || '').trim(),
  fecha_nacimiento: String(payload.fecha_nacimiento || '').trim(),
  genero: String(payload.genero || 'UNSPECIFIED').trim().toUpperCase(),
  email: String(payload.email || '').trim().toLowerCase(),
  password: String(payload.password || ''),
  especialidad: String(payload.especialidad || '').trim(),
  direccion_tutoria: String(payload.direccion_tutoria || '').trim(),
  anio_inicio_experiencia: Number(payload.anio_inicio_experiencia),
  universidad: String(payload.universidad || '').trim(),
});

const validateTutorPayload = (payload) => {
  const tutor = normalizeTutorPayload(payload);
  const missingField = requiredTextFields.find((field) => !tutor[field]);
  if (missingField) {
    return { valid: false, message: `El campo ${missingField} es obligatorio` };
  }

  if (!EMAIL_PATTERN.test(tutor.email)) {
    return { valid: false, message: 'El correo electrónico no tiene un formato válido' };
  }

  const passwordCheck = validatePasswordStrength(tutor.password);
  if (!passwordCheck.valid) return passwordCheck;

  if (!ALLOWED_GENDERS.has(tutor.genero)) {
    return { valid: false, message: 'El género seleccionado no es válido' };
  }

  const birthDate = new Date(`${tutor.fecha_nacimiento}T00:00:00Z`);
  const hasValidDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(tutor.fecha_nacimiento);
  const isExactDate = !Number.isNaN(birthDate.getTime())
    && birthDate.toISOString().slice(0, 10) === tutor.fecha_nacimiento;
  if (!hasValidDateFormat || !isExactDate || birthDate >= new Date()) {
    return { valid: false, message: 'La fecha de nacimiento no es válida' };
  }

  const currentYear = new Date().getUTCFullYear();
  if (!Number.isInteger(tutor.anio_inicio_experiencia)
      || tutor.anio_inicio_experiencia < 1901
      || tutor.anio_inicio_experiencia > currentYear) {
    return { valid: false, message: 'El año de inicio de experiencia no es válido' };
  }

  return { valid: true, tutor };
};

const removeUploadedFile = async (file) => {
  if (!file?.path) return;
  try {
    await fs.unlink(file.path);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('No se pudo eliminar un archivo de registro:', error);
    }
  }
};

const removeTutorUploads = async (req) => {
  await Promise.all([
    removeUploadedFile(req.file),
    removeUploadedFile(req.tutorPhoto),
  ]);
};

const registerTutor = async (req, res) => {
  if (!req.file) {
    await removeUploadedFile(req.tutorPhoto);
    return res.status(400).json({ message: 'El CV en formato PDF es obligatorio' });
  }

  if (!req.tutorPhoto) {
    await removeUploadedFile(req.file);
    return res.status(400).json({ message: 'La fotografía del tutor es obligatoria' });
  }

  const validation = validateTutorPayload(req.body);
  if (!validation.valid) {
    await removeTutorUploads(req);
    return res.status(400).json({ message: validation.message });
  }

  const tutor = validation.tutor;
  const fotografiaUrl = `/uploads/tutors/${req.tutorPhoto.filename}`;
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [duplicates] = await connection.execute(
      `SELECT
         EXISTS(SELECT 1 FROM users WHERE email = ?) AS email_exists,
         EXISTS(SELECT 1 FROM tutor_profiles WHERE carnet = ?) AS carnet_exists,
         EXISTS(SELECT 1 FROM tutor_profiles WHERE identificacion = ?) AS identification_exists`,
      [tutor.email, tutor.carnet, tutor.identificacion],
    );

    if (duplicates[0].email_exists) {
      await connection.rollback();
      await removeTutorUploads(req);
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    if (duplicates[0].carnet_exists) {
      await connection.rollback();
      await removeTutorUploads(req);
      return res.status(409).json({ message: 'El carnet ya está registrado' });
    }
    if (duplicates[0].identification_exists) {
      await connection.rollback();
      await removeTutorUploads(req);
      return res.status(409).json({ message: 'La identificación ya está registrada' });
    }

    const passwordHash = await hashPassword(tutor.password);
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password_hash, role, status, cv_pdf_url) VALUES (?, ?, ?, ?, ?)',
      [tutor.email, passwordHash, 'tutor', 'PENDING', req.file.filename],
    );

    const [tutorProfileResult] = await connection.execute(
      `INSERT INTO tutor_profiles (
         user_id, nombre, apellido, carnet, identificacion, fecha_nacimiento,
         genero, fotografia_url, especialidad, direccion_tutoria,
         anio_inicio_experiencia, universidad
       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userResult.insertId,
        tutor.nombre,
        tutor.apellido,
        tutor.carnet,
        tutor.identificacion,
        tutor.fecha_nacimiento,
        tutor.genero,
        fotografiaUrl,
        tutor.especialidad,
        tutor.direccion_tutoria,
        tutor.anio_inicio_experiencia,
        tutor.universidad,
      ],
    );

    const [subjectResult] = await connection.execute(
      `INSERT INTO subjects (nombre) VALUES (?)
       ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)`,
      [tutor.especialidad],
    );

    await connection.execute(
      'INSERT INTO tutor_subjects (tutor_id, subject_id) VALUES (?, ?)',
      [tutorProfileResult.insertId, subjectResult.insertId],
    );

    await connection.commit();
    return res.status(201).json({
      message: 'Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.',
      tutor: { id: userResult.insertId, email: tutor.email, status: 'PENDING' },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    await removeTutorUploads(req);
    console.error('Error en registro de tutor:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { normalizeTutorPayload, validateTutorPayload, registerTutor };
