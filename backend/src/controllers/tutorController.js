const pool = require('../config/db');

const getTutorId = (value) => {
  const tutorId = Number(value);
  return Number.isInteger(tutorId) && tutorId > 0 ? tutorId : null;
};

const getTutors = async (_req, res, next) => {
  try {
    const [tutors] = await pool.execute(
      `SELECT tp.id, tp.user_id, tp.nombre, tp.apellido, tp.especialidad,
              tp.universidad, tp.fotografia_url, tp.direccion_tutoria
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

const getTutorAvailability = async (req, res, next) => {
  const tutorId = getTutorId(req.params.id);
  const { date } = req.query; // Formato esperado: YYYY-MM-DD

  if (!tutorId) {
    return res.status(400).json({ message: 'El identificador del tutor no es válido' });
  }
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ message: 'La fecha es obligatoria en formato YYYY-MM-DD' });
  }

  try {
    // 1. Obtener los horarios de atención activos del tutor
    const [schedules] = await pool.execute(
      `SELECT day_of_week, start_time, end_time
         FROM schedules
        WHERE tutor_id = ? AND is_active = TRUE`,
      [tutorId],
    );

    // Calcular día de la semana ISO (1 = Lunes, ..., 7 = Domingo) sin desfase horario
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();
    const isoDay = dayOfWeek === 0 ? 7 : dayOfWeek;

    const daySchedule = schedules.find((s) => s.day_of_week === isoDay);

    // Si el tutor no labora ese día
    if (!daySchedule) {
      return res.json({
        tutorId,
        date,
        isWorkingDay: false,
        message: 'El tutor no atiende en este día de la semana.',
        slots: [],
      });
    }

    // 2. Obtener sesiones activas (PENDING) del tutor para esa fecha
    const [busySessions] = await pool.execute(
      `SELECT start_time, end_time
         FROM sessions
        WHERE tutor_id = ? AND session_date = ? AND status = 'PENDING'`,
      [tutorId, date],
    );

    // 3. Generar bloques de 60 minutos dentro de la jornada
    const toMinutes = (timeStr) => {
      const [h, m] = String(timeStr).slice(0, 5).split(':').map(Number);
      return h * 60 + m;
    };

    const toTimeString = (minutes) => {
      const h = Math.floor(minutes / 60).toString().padStart(2, '0');
      const m = (minutes % 60).toString().padStart(2, '0');
      return `${h}:${m}`;
    };

    const startMin = toMinutes(daySchedule.start_time);
    const endMin = toMinutes(daySchedule.end_time);
    const slots = [];

    for (let current = startMin; current + 60 <= endMin; current += 60) {
      const slotStart = current;
      const slotEnd = current + 60;

      // Un bloque colisiona si: slotStart < busyEnd && slotEnd > busyStart
      const isOccupied = busySessions.some((session) => {
        const busyStart = toMinutes(session.start_time);
        const busyEnd = toMinutes(session.end_time);
        return slotStart < busyEnd && slotEnd > busyStart;
      });

      slots.push({
        startTime: toTimeString(slotStart),
        endTime: toTimeString(slotEnd),
        available: !isOccupied,
      });
    }

    return res.json({
      tutorId,
      date,
      isWorkingDay: true,
      scheduleRange: {
        startTime: String(daySchedule.start_time).slice(0, 5),
        endTime: String(daySchedule.end_time).slice(0, 5),
      },
      slots,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getTutors, getTutorSchedules, getTutorSubjects, getTutorAvailability };
