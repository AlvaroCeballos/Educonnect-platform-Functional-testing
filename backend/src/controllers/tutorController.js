const pool = require('../config/db');

const getTutorId = (value) => {
  const tutorId = Number(value);
  return Number.isInteger(tutorId) && tutorId > 0 ? tutorId : null;
};

const getTutors = async (_req, res, next) => {
  try {
    const [tutors] = await pool.execute(
      `SELECT tp.id, tp.user_id, tp.nombre, tp.apellido, tp.especialidad,
              tp.universidad, tp.fotografia_url
         FROM tutor_profiles tp
         JOIN users u ON u.id = tp.user_id
        WHERE u.role = 'tutor' AND u.status = 'APPROVED'
        ORDER BY tp.apellido, tp.nombre`,
    );

    if (tutors.length === 0) return res.json([]);

    const ids = tutors.map(({ id }) => id);
    const placeholders = ids.map(() => '?').join(', ');
    const [subjects] = await pool.execute(
      `SELECT ts.tutor_id, s.id, s.nombre
         FROM tutor_subjects ts
         JOIN subjects s ON s.id = ts.subject_id
        WHERE ts.tutor_id IN (${placeholders}) AND s.is_active = TRUE
        ORDER BY s.nombre`,
      ids,
    );

    const subjectsByTutor = new Map();
    subjects.forEach((subject) => {
      const list = subjectsByTutor.get(subject.tutor_id) || [];
      list.push({ id: subject.id, nombre: subject.nombre });
      subjectsByTutor.set(subject.tutor_id, list);
    });

    return res.json(tutors.map((tutor) => ({
      ...tutor,
      materias: subjectsByTutor.get(tutor.id) || [],
    })));
  } catch (error) {
    return next(error);
  }
};

const getTutorSchedules = async (req, res, next) => {
  const tutorId = getTutorId(req.params.id);
  if (!tutorId) return res.status(400).json({ message: 'El identificador del tutor no es válido' });

  try {
    const [schedules] = await pool.execute(
      `SELECT id, day_of_week, start_time, end_time, is_active
         FROM schedules
        WHERE tutor_id = ? AND is_active = TRUE
        ORDER BY day_of_week, start_time`,
      [tutorId],
    );
    return res.json({ tutorId, horarios: schedules });
  } catch (error) {
    return next(error);
  }
};

const getTutorSubjects = async (req, res, next) => {
  const tutorId = getTutorId(req.params.id);
  if (!tutorId) return res.status(400).json({ message: 'El identificador del tutor no es válido' });

  try {
    const [subjects] = await pool.execute(
      `SELECT s.id, s.nombre
         FROM tutor_subjects ts
         JOIN subjects s ON s.id = ts.subject_id
        WHERE ts.tutor_id = ? AND s.is_active = TRUE
        ORDER BY s.nombre`,
      [tutorId],
    );
    return res.json({ tutorId, materias: subjects });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getTutors, getTutorSchedules, getTutorSubjects };
