const pool = require('../config/db');

const {
  groupSessionsByPeriod, cancellationRateBySubject, demandBySchedule,
} = require('../utils/metrics');

// HU-045: promedio de calificaciones de tutores activos (APPROVED)
const getTutorRatingsReport = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT tp.id, tp.nombre, tp.apellido, tp.especialidad,
              COALESCE(AVG(r.rating), 0) AS promedio, COUNT(r.id) AS total
         FROM tutor_profiles tp
         JOIN users u ON u.id = tp.user_id AND u.status = 'APPROVED'
         LEFT JOIN reviews r ON r.tutor_id = tp.id AND r.reviewer_role = 'student'
        GROUP BY tp.id
        ORDER BY promedio DESC, total DESC`,
    );
    const tutorsRatings = rows.map((r) => ({
      ...r,
      promedio: Number(Number(r.promedio).toFixed(2)),
      total: Number(r.total),
    }));
    res.json({ tutorsRatings });
  } catch (err) { next(err); }
};

// HU-047: ?granularity=week|month&month=YYYY-MM
const getSessionsEvolutionReport = async (req, res, next) => {
  try {
    const { granularity = 'month', month } = req.query;
    if (!['week', 'month'].includes(granularity)) {
      return res.status(400).json({ message: 'granularity debe ser week o month' });
    }
    let sql = "SELECT session_date, status FROM sessions WHERE status = 'ATTENDED'";
    const params = [];
    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: 'month debe tener formato YYYY-MM' });
      }
      sql += " AND DATE_FORMAT(session_date, '%Y-%m') = ?";
      params.push(month);
    }
    const [rows] = await pool.execute(sql, params);
    res.json({ granularity, month: month || null, evolution: groupSessionsByPeriod(rows, granularity) });
  } catch (err) { next(err); }
};

// Filtro opcional ?month=YYYY-MM compartido por los reportes HU-048
const monthFilter = (month) => {
  if (!month) return { clause: '', params: [] };
  if (!/^\d{4}-\d{2}$/.test(month)) return { error: 'month debe tener formato YYYY-MM' };
  return { clause: " WHERE DATE_FORMAT(s.session_date, '%Y-%m') = ?", params: [month] };
};

// HU-048a: materias con mayor tasa de cancelación
const getCancellationsBySubjectReport = async (req, res, next) => {
  try {
    const { month } = req.query;
    const f = monthFilter(month);
    if (f.error) return res.status(400).json({ message: f.error });
    const [rows] = await pool.execute(
      `SELECT sub.nombre AS subject, s.status
         FROM sessions s
         JOIN subjects sub ON sub.id = s.subject_id${f.clause}`,
      f.params,
    );
    res.json({ month: month || null, cancellations: cancellationRateBySubject(rows) });
  } catch (err) { next(err); }
};


// HU-048b: horarios más demandados
const getDemandedSchedulesReport = async (req, res, next) => {
  try {
    const { month } = req.query;
    const f = monthFilter(month);
    if (f.error) return res.status(400).json({ message: f.error });
    const [rows] = await pool.execute(
      `SELECT s.start_time FROM sessions s${f.clause}`,
      f.params,
    );
    res.json({ month: month || null, schedules: demandBySchedule(rows) });
  } catch (err) { next(err); }
};

module.exports = {
  getTutorRatingsReport, getSessionsEvolutionReport,
  getCancellationsBySubjectReport, getDemandedSchedulesReport,
};
