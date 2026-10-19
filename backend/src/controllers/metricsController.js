const pool = require('../config/db');
const { groupSessionsByPeriod } = require('../utils/metrics');

// HU-045: promedio de calificaciones de tutores activos (APPROVED)
const getTutorRatingsReport = async (req, res, next) => {
  try {
    const [rows] = await pool.execute(
      `SELECT tp.id, tp.nombre, tp.apellido, tp.especialidad,
              COALESCE(AVG(r.rating), 0) AS promedio, COUNT(r.id) AS total
         FROM tutor_profiles tp
         JOIN users u ON u.id = tp.user_id AND u.status = 'APPROVED'
         LEFT JOIN reviews r ON r.tutor_id = tp.id
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

module.exports = { getTutorRatingsReport, getSessionsEvolutionReport };