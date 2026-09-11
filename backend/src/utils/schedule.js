const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/;

function validateSchedulePayload(payload = {}) {
  const days = Array.isArray(payload.days) ? [...new Set(payload.days.map(Number))] : [];
  const startTime = String(payload.startTime || '').trim();
  const endTime = String(payload.endTime || '').trim();
  if (!days.length) return { valid: false, message: 'Selecciona al menos un día de atención' };
  if (days.some((day) => !Number.isInteger(day) || day < 1 || day > 7)) return { valid: false, message: 'Los días deben estar entre lunes y domingo' };
  if (!TIME_PATTERN.test(startTime) || !TIME_PATTERN.test(endTime)) return { valid: false, message: 'Las horas no tienen un formato válido' };
  if (startTime >= endTime) return { valid: false, message: 'La hora de inicio debe ser menor que la hora de fin' };
  return { valid: true, schedule: { days, startTime: startTime.length === 5 ? `${startTime}:00` : startTime, endTime: endTime.length === 5 ? `${endTime}:00` : endTime } };
}

module.exports = { validateSchedulePayload };
