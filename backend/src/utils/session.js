const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SESSION_DURATION_MINUTES = 60;

const normalizeTime = (value) => {
  const trimmed = String(value || '').trim();
  return trimmed.length === 5 ? `${trimmed}:00` : trimmed;
};

const addMinutes = (time, minutes) => {
  const [hours, mins, secs = 0] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}:${String(secs).padStart(2, '0')}`;
};

// ISO-8601: 1 = lunes ... 7 = domingo, igual que `schedules.day_of_week`.
const getIsoDayOfWeek = (dateString) => {
  const day = new Date(`${dateString}T00:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
};

const isWithinTutorSchedule = ({ startTime, endTime, scheduleStartTime, scheduleEndTime }) =>
  startTime >= scheduleStartTime && endTime <= scheduleEndTime;

// Regla del contrato: nuevo_inicio < existente_fin && nuevo_fin > existente_inicio
const sessionsOverlap = (a, b) => a.startTime < b.endTime && a.endTime > b.startTime;

// SESSION_CONTRACT.md: el servicio deriva end_time con la duración estándar
// (60 min); no se confía en un end_time enviado por el cliente.
const validateSessionPayload = (payload = {}) => {
  const tutorId = Number(payload.tutor_id);
  const subjectId = Number(payload.subject_id);
  const sessionDate = String(payload.session_date || '').trim();
  const startTime = normalizeTime(payload.start_time);
  const reason = String(payload.reason || '').trim();

  if (!Number.isInteger(tutorId) || tutorId < 1) return { valid: false, message: 'El tutor es obligatorio' };
  if (!Number.isInteger(subjectId) || subjectId < 1) return { valid: false, message: 'La materia es obligatoria' };
  if (!DATE_PATTERN.test(sessionDate)) return { valid: false, message: 'La fecha de la sesión no es válida' };
  if (!TIME_PATTERN.test(startTime)) return { valid: false, message: 'La hora de inicio no tiene un formato válido' };
  if (!reason) return { valid: false, message: 'El motivo de la sesión es obligatorio' };

  const endTime = addMinutes(startTime, SESSION_DURATION_MINUTES);
  return { valid: true, session: { tutorId, subjectId, sessionDate, startTime, endTime, reason } };
};

module.exports = {
  SESSION_DURATION_MINUTES,
  getIsoDayOfWeek,
  isWithinTutorSchedule,
  sessionsOverlap,
  validateSessionPayload,
};
