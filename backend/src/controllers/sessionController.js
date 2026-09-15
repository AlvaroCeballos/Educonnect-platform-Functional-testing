const pool = require('../config/db');
const {
  getIsoDayOfWeek,
  isWithinTutorSchedule,
  sessionsOverlap,
  validateSessionPayload,
} = require('../utils/session');

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

    const [duplicateTutorSessions] = await connection.execute(
      `SELECT id FROM sessions WHERE student_id = ? AND tutor_id = ? AND status = 'PENDING' FOR UPDATE`,
      [studentId, tutorId],
    );
    if (duplicateTutorSessions.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Ya tienes una sesión pendiente con este tutor' });
    }

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

    const [studentSessions] = await connection.execute(
      `SELECT start_time AS startTime, end_time AS endTime
         FROM sessions
        WHERE student_id = ? AND session_date = ? AND status = 'PENDING'
        FOR UPDATE`,
      [studentId, sessionDate],
    );
    const hasStudentConflict = studentSessions.some((existing) => sessionsOverlap(
      { startTime, endTime },
      { startTime: asTime(existing.startTime), endTime: asTime(existing.endTime) },
    ));
    if (hasStudentConflict) {
      await connection.rollback();
      return res.status(409).json({ message: 'Ya tienes otra sesión programada en ese horario' });
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

const VALID_SESSION_STATUSES = new Set(['PENDING', 'ATTENDED', 'CANCELLED_BY_STUDENT', 'CANCELLED_BY_TUTOR']);

const getMySessions = async (req, res, next) => {
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    // HU-013: ?status=PENDING filtra a las sesiones activas del estudiante.
    const { status } = req.query;
    const params = [studentId];
    let statusFilter = '';
    if (status) {
      if (!VALID_SESSION_STATUSES.has(status)) {
        return res.status(400).json({ message: 'El estado solicitado no es válido' });
      }
      statusFilter = 'AND s.status = ?';
      params.push(status);
    }

    const [rows] = await pool.execute(
      `SELECT s.id, s.tutor_id AS tutorId, tp.nombre AS tutorNombre, tp.apellido AS tutorApellido,
              s.session_date AS sessionDate, s.start_time AS startTime, s.end_time AS endTime,
              s.subject_id AS subjectId, sub.nombre AS materia, s.reason, s.status
         FROM sessions s
         JOIN tutor_profiles tp ON tp.id = s.tutor_id
         JOIN subjects sub ON sub.id = s.subject_id
        WHERE s.student_id = ? ${statusFilter}
        ORDER BY s.session_date, s.start_time`,
      params,
    );
    return res.json({ sessions: rows });
  } catch (error) {
    return next(error);
  }
};

const cancelSession = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: 'El identificador de la sesión no es válido' });
  }

  let connection;
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT id, student_id AS studentId, status FROM sessions WHERE id = ? FOR UPDATE',
      [sessionId],
    );
    const session = rows[0];
    if (!session || session.studentId !== studentId) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    if (session.status !== 'PENDING') {
      await connection.rollback();
      return res.status(409).json({ message: 'Solo se pueden cancelar sesiones pendientes' });
    }

    await connection.execute(
      "UPDATE sessions SET status = 'CANCELLED_BY_STUDENT' WHERE id = ?",
      [sessionId],
    );

    await connection.commit();
    return res.json({ message: 'Sesión cancelada correctamente', session: { id: sessionId, status: 'CANCELLED_BY_STUDENT' } });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

const resolveTutorProfileId = async (req) => {
  if (req.user?.tutorId) return Number(req.user.tutorId);
  const [rows] = await pool.execute('SELECT id FROM tutor_profiles WHERE user_id = ?', [req.user.id]);
  return rows[0]?.id ?? null;
};

const cancelSessionByTutor = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: 'El identificador de la sesión no es válido' });
  }

  let connection;
  try {
    const tutorId = await resolveTutorProfileId(req);
    if (!tutorId) return res.status(401).json({ message: 'La sesión no identifica al tutor' });

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT id, tutor_id AS tutorId, status FROM sessions WHERE id = ? FOR UPDATE',
      [sessionId],
    );
    const session = rows[0];
    
    if (!session || session.tutorId !== tutorId) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    if (session.status !== 'PENDING') {
      await connection.rollback();
      return res.status(409).json({ message: 'Solo se pueden cancelar sesiones pendientes' });
    }

    await connection.execute(
      "UPDATE sessions SET status = 'CANCELLED_BY_TUTOR' WHERE id = ?",
      [sessionId],
    );

    await connection.commit();
    return res.json({ 
      message: 'Sesión cancelada correctamente', 
      session: { id: sessionId, status: 'CANCELLED_BY_TUTOR' } 
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

// ==========================================
// T-015.3: Funciones nuevas para el tutor
// ==========================================

const getTutorSessions = async (req, res, next) => {
  try {
    const tutorId = await resolveTutorProfileId(req);
    if (!tutorId) return res.status(401).json({ message: 'La sesión no identifica al tutor' });

    const [rows] = await pool.execute(
      `SELECT s.id, s.student_id AS studentId, sp.nombre AS studentNombre, sp.apellido AS studentApellido,
              s.session_date AS sessionDate, s.start_time AS startTime, s.end_time AS endTime,
              s.subject_id AS subjectId, sub.nombre AS materia, s.reason, s.status, s.summary, s.recommendations
         FROM sessions s
         JOIN student_profiles sp ON sp.id = s.student_id
         JOIN subjects sub ON sub.id = s.subject_id
        WHERE s.tutor_id = ?
        ORDER BY s.session_date DESC, s.start_time DESC`,
      [tutorId]
    );
    return res.json({ sessions: rows });
  } catch (error) {
    return next(error);
  }
};

const attendSession = async (req, res, next) => {
  const sessionId = Number(req.params.id);
  const { summary, recommendations } = req.body;

  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: 'El identificador de la sesión no es válido' });
  }
  if (!summary || summary.trim() === '') {
    return res.status(400).json({ message: 'El resumen de la sesión es obligatorio' });
  }

  let connection;
  try {
    const tutorId = await resolveTutorProfileId(req);
    if (!tutorId) return res.status(401).json({ message: 'La sesión no identifica al tutor' });

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [rows] = await connection.execute(
      'SELECT id, tutor_id AS tutorId, status FROM sessions WHERE id = ? FOR UPDATE',
      [sessionId]
    );
    const session = rows[0];

    if (!session || session.tutorId !== tutorId) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    if (session.status !== 'PENDING') {
      await connection.rollback();
      return res.status(409).json({ message: 'Solo se pueden atender sesiones pendientes' });
    }

    await connection.execute(
      "UPDATE sessions SET status = 'ATTENDED', summary = ?, recommendations = ? WHERE id = ?",
      [summary.trim(), recommendations ? recommendations.trim() : null, sessionId]
    );

    await connection.commit();
    return res.json({
      message: 'Sesión marcada como atendida correctamente',
      session: { id: sessionId, status: 'ATTENDED', summary, recommendations }
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { 
  createSession, 
  getMySessions, 
  cancelSession, 
  resolveStudentProfileId,
  resolveTutorProfileId,
  cancelSessionByTutor,
  getTutorSessions,
  attendSession
};