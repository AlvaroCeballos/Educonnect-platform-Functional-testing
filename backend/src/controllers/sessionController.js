const pool = require('../config/db');
const {
  getIsoDayOfWeek,
  isWithinTutorSchedule,
  sessionsOverlap,
  validateSessionPayload,
} = require('../utils/session');

// Hasta que exista HU-006, `req.user` viene de `mockStudent` y solo trae el
// users.id. Cuando el login real de estudiante exista y agregue `studentId`
// al JWT (igual que `loginTutor` hace con `tutorId`), este lookup deja de
// usarse sin tocar el resto del controlador.
const resolveStudentProfileId = async (req) => {
  if (req.user?.studentId) return Number(req.user.studentId);
  const [rows] = await pool.execute('SELECT id FROM student_profiles WHERE user_id = ?', [req.user.id]);
  return rows[0]?.id ?? null;
};

const asTime = (value) => String(value).slice(0, 8);

const createSession = async (req, res, next) => {
  const validation = validateSessionPayload(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });
  const { tutorId, subjectId, sessionDate, startTime, endTime, reason } = validation.session;

  let connection;
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    const [subjectRows] = await pool.execute(
      'SELECT 1 FROM tutor_subjects WHERE tutor_id = ? AND subject_id = ?',
      [tutorId, subjectId],
    );
    if (subjectRows.length === 0) {
      return res.status(400).json({ message: 'La materia seleccionada no pertenece a este tutor' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Bloquea la fila de horario del tutor: además de validar el rango,
    // sirve para serializar reservas concurrentes del mismo tutor/día
    // (una sesión nueva no tiene fila propia que bloquear con FOR UPDATE).
    const dayOfWeek = getIsoDayOfWeek(sessionDate);
    const [scheduleRows] = await connection.execute(
      `SELECT start_time AS startTime, end_time AS endTime
         FROM schedules
        WHERE tutor_id = ? AND day_of_week = ? AND is_active = TRUE
        FOR UPDATE`,
      [tutorId, dayOfWeek],
    );
    const schedule = scheduleRows[0];
    const withinSchedule = schedule && isWithinTutorSchedule({
      startTime,
      endTime,
      scheduleStartTime: asTime(schedule.startTime),
      scheduleEndTime: asTime(schedule.endTime),
    });
    if (!withinSchedule) {
      await connection.rollback();
      return res.status(409).json({ message: 'El horario solicitado está fuera de la disponibilidad del tutor' });
    }

    const [existingSessions] = await connection.execute(
      `SELECT start_time AS startTime, end_time AS endTime
         FROM sessions
        WHERE tutor_id = ? AND session_date = ? AND status = 'PENDING'
        FOR UPDATE`,
      [tutorId, sessionDate],
    );
    const hasConflict = existingSessions.some((existing) => sessionsOverlap(
      { startTime, endTime },
      { startTime: asTime(existing.startTime), endTime: asTime(existing.endTime) },
    ));
    if (hasConflict) {
      await connection.rollback();
      return res.status(409).json({ message: 'El tutor ya tiene una sesión programada en ese horario' });
    }

    const [result] = await connection.execute(
      `INSERT INTO sessions (student_id, tutor_id, session_date, start_time, end_time, subject_id, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [studentId, tutorId, sessionDate, startTime, endTime, subjectId, reason],
    );

    await connection.commit();
    return res.status(201).json({
      message: 'Sesión programada correctamente. Queda pendiente de confirmación.',
      session: {
        id: result.insertId, tutorId, subjectId, sessionDate, startTime, endTime, status: 'PENDING',
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const getMySessions = async (req, res, next) => {
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    const [rows] = await pool.execute(
      `SELECT s.id, s.tutor_id AS tutorId, tp.nombre AS tutorNombre, tp.apellido AS tutorApellido,
              s.session_date AS sessionDate, s.start_time AS startTime, s.end_time AS endTime,
              s.subject_id AS subjectId, sub.nombre AS materia, s.reason, s.status
         FROM sessions s
         JOIN tutor_profiles tp ON tp.id = s.tutor_id
         JOIN subjects sub ON sub.id = s.subject_id
        WHERE s.student_id = ?
        ORDER BY s.session_date, s.start_time`,
      [studentId],
    );
    return res.json({ sessions: rows });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createSession, getMySessions, resolveStudentProfileId };
