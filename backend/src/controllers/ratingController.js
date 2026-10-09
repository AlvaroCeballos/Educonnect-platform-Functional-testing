const pool = require('../config/db');
const { resolveStudentProfileId } = require('./sessionController');
const { canRateSession, validateRatingPayload } = require('../utils/rating');

const getMyRatings = async (req, res, next) => {
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    const [rows] = await pool.execute(
      `SELECT r.id, r.session_id AS sessionId, r.rating, r.comment,
              r.created_at AS createdAt, r.updated_at AS updatedAt,
              s.session_date AS sessionDate, s.start_time AS startTime,
              s.end_time AS endTime, tp.nombre AS tutorNombre,
              tp.apellido AS tutorApellido, sub.nombre AS materia
         FROM reviews r
         JOIN sessions s ON s.id = r.session_id
         JOIN tutor_profiles tp ON tp.id = r.tutor_id
         JOIN subjects sub ON sub.id = s.subject_id
        WHERE r.student_id = ?
        ORDER BY s.session_date DESC, s.start_time DESC`,
      [studentId],
    );

    return res.json({ ratings: rows });
  } catch (error) {
    return next(error);
  }
};

const createRating = async (req, res, next) => {
  const sessionId = Number(req.params.sessionId);
  const validation = validateRatingPayload(req.body);

  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return res.status(400).json({ message: 'El identificador de la sesión no es válido' });
  }
  if (!validation.valid) return res.status(400).json({ message: validation.message });

  let connection;
  try {
    const studentId = await resolveStudentProfileId(req);
    if (!studentId) return res.status(401).json({ message: 'La sesión no identifica al estudiante' });

    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [sessionRows] = await connection.execute(
      `SELECT id, student_id AS studentId, tutor_id AS tutorId, status
         FROM sessions
        WHERE id = ?
        FOR UPDATE`,
      [sessionId],
    );
    const session = sessionRows[0];

    if (!session || Number(session.studentId) !== Number(studentId)) {
      await connection.rollback();
      return res.status(404).json({ message: 'Sesión no encontrada' });
    }
    if (!canRateSession(session, studentId)) {
      await connection.rollback();
      return res.status(409).json({ message: 'Solo puedes calificar sesiones atendidas' });
    }

    const [existingRows] = await connection.execute(
      'SELECT id FROM reviews WHERE session_id = ? FOR UPDATE',
      [sessionId],
    );
    if (existingRows.length > 0) {
      await connection.rollback();
      return res.status(409).json({ message: 'Esta sesión ya tiene una calificación registrada' });
    }

    const [result] = await connection.execute(
      `INSERT INTO reviews (session_id, student_id, tutor_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [sessionId, studentId, session.tutorId, validation.rating, validation.comment],
    );

    await connection.commit();
    return res.status(201).json({
      message: 'Calificación registrada correctamente',
      rating: {
        id: result.insertId,
        sessionId,
        rating: validation.rating,
        comment: validation.comment,
      },
    });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { getMyRatings, createRating };
