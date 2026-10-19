const round = (n, d = 2) => Number(n.toFixed(d));

// PU-16 / PU-17: promedio; sin datos devuelve 0 (sin dividir entre cero)
const average = (values = []) => {
  const nums = values.filter((v) => v !== null && v !== undefined && v !== '')
    .map(Number).filter(Number.isFinite);
  if (nums.length === 0) return 0;
  return round(nums.reduce((a, b) => a + b, 0) / nums.length);
};

// PU-18: promedio ponderado [{ rating, weight }] (weight por defecto 1)
const weightedAverage = (items = []) => {
  let sum = 0;
  let total = 0;
  for (const { rating, weight = 1 } of items) {
    const r = Number(rating);
    const w = Number(weight);
    if (!Number.isFinite(r) || !Number.isFinite(w) || w <= 0) continue;
    sum += r * w;
    total += w;
  }
  return total === 0 ? 0 : round(sum / total);
};

const toYMD = (d) => {
  if (d instanceof Date) return [d.getFullYear(), d.getMonth() + 1, d.getDate()];
  const [y, m, day] = String(d).slice(0, 10).split('-').map(Number);
  return [y, m, day];
};

const isoWeekKey = (y, m, d) => {
  const date = new Date(Date.UTC(y, m - 1, d));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
};

// PU-19: sesiones ATTENDED agrupadas por semana ISO o mes, ordenadas
const groupSessionsByPeriod = (sessions = [], granularity = 'month') => {
  const counts = new Map();
  for (const s of sessions) {
    if (s.status !== 'ATTENDED') continue;
    const [y, m, d] = toYMD(s.session_date);
    const key = granularity === 'week'
      ? isoWeekKey(y, m, d)
      : `${y}-${String(m).padStart(2, '0')}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
    .map(([periodo, total]) => ({ periodo, total }));
};

// PU-20: tasa de cancelación por materia (ignora PENDING), mayor tasa primero
const cancellationRateBySubject = (sessions = []) => {
  const map = new Map();
  for (const s of sessions) {
    if (s.status === 'PENDING') continue;
    const row = map.get(s.subject) || { materia: s.subject, canceladas: 0, total: 0 };
    row.total += 1;
    if (String(s.status).startsWith('CANCELLED')) row.canceladas += 1;
    map.set(s.subject, row);
  }
  return [...map.values()]
    .map((r) => ({ ...r, tasa: round((100 * r.canceladas) / r.total, 1) }))
    .sort((a, b) => b.tasa - a.tasa || b.total - a.total);
};

module.exports = { average, weightedAverage, groupSessionsByPeriod, cancellationRateBySubject };