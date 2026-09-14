export const WEEK_DAYS = [
  ['1', 'Lunes'], ['2', 'Martes'], ['3', 'Miércoles'], ['4', 'Jueves'],
  ['5', 'Viernes'], ['6', 'Sábado'], ['7', 'Domingo'],
];

export function validateSchedule({ days, startTime, endTime }) {
  if (!days?.length) return 'Selecciona al menos un día de atención.';
  if (!startTime || !endTime) return 'Define la hora de inicio y la hora de fin.';
  if (startTime >= endTime) return 'La hora de inicio debe ser menor que la hora de fin.';
  return '';
}
