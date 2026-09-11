const pool = require('../config/db');
const { validateSchedulePayload } = require('../utils/schedule');

const tutorProfileId = (req) => Number(req.user?.tutorId || req.user?.id);

const getMySchedules = async (req, res, next) => {
  const tutorId = tutorProfileId(req);
  if (!Number.isInteger(tutorId) || tutorId < 1) return res.status(401).json({ message: 'La sesión no identifica al tutor' });
  try {
    const [rows] = await pool.execute(
      `SELECT id, day_of_week AS dayOfWeek, start_time AS startTime, end_time AS endTime
         FROM schedules WHERE tutor_id = ? AND is_active = TRUE ORDER BY day_of_week`, [tutorId],
    );
    return res.json({ tutorId, horarios: rows });
  } catch (error) { return next(error); }
};

const saveMySchedules = async (req, res, next) => {
  const tutorId = tutorProfileId(req);
  const validation = validateSchedulePayload(req.body);
  if (!validation.valid) return res.status(400).json({ message: validation.message });
  if (!Number.isInteger(tutorId) || tutorId < 1) return res.status(401).json({ message: 'La sesión no identifica al tutor' });
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    await connection.execute('UPDATE schedules SET is_active = FALSE WHERE tutor_id = ?', [tutorId]);
    for (const day of validation.schedule.days) {
      await connection.execute(
        `INSERT INTO schedules (tutor_id, day_of_week, start_time, end_time, is_active)
         VALUES (?, ?, ?, ?, TRUE)
         ON DUPLICATE KEY UPDATE start_time = VALUES(start_time), end_time = VALUES(end_time), is_active = TRUE`,
        [tutorId, day, validation.schedule.startTime, validation.schedule.endTime],
      );
    }
    await connection.commit();
    return res.status(201).json({ message: 'Disponibilidad guardada correctamente', tutorId, horarios: validation.schedule.days.map((day) => ({ dayOfWeek: day, startTime: validation.schedule.startTime, endTime: validation.schedule.endTime })) });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally { if (connection) connection.release(); }
};

module.exports = { getMySchedules, saveMySchedules };
