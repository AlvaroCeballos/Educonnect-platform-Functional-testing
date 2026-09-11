const test = require('node:test');
const assert = require('node:assert/strict');
const {
  getIsoDayOfWeek,
  isWithinTutorSchedule,
  sessionsOverlap,
  validateSessionPayload,
} = require('../src/utils/session');

test('deriva el día ISO (1=lunes...7=domingo) a partir de la fecha', () => {
  assert.equal(getIsoDayOfWeek('2026-09-14'), 1); // lunes
  assert.equal(getIsoDayOfWeek('2026-09-20'), 7); // domingo
});

test('valida que el intervalo quede dentro del horario del tutor', () => {
  const schedule = { scheduleStartTime: '09:00:00', scheduleEndTime: '17:00:00' };
  assert.equal(isWithinTutorSchedule({ startTime: '10:00:00', endTime: '11:00:00', ...schedule }), true);
  assert.equal(isWithinTutorSchedule({ startTime: '08:00:00', endTime: '09:00:00', ...schedule }), false);
  assert.equal(isWithinTutorSchedule({ startTime: '16:30:00', endTime: '17:30:00', ...schedule }), false);
});

test('detecta traslape cuando los intervalos se cruzan', () => {
  const existing = { startTime: '10:00:00', endTime: '11:00:00' };
  assert.equal(sessionsOverlap({ startTime: '10:30:00', endTime: '11:30:00' }, existing), true);
  assert.equal(sessionsOverlap({ startTime: '09:00:00', endTime: '10:00:00' }, existing), false);
  assert.equal(sessionsOverlap({ startTime: '11:00:00', endTime: '12:00:00' }, existing), false);
});

test('valida el payload y deriva end_time con la duración estándar de 60 minutos', () => {
  const result = validateSessionPayload({
    tutor_id: 1, subject_id: 2, session_date: '2026-09-14', start_time: '10:00', reason: 'Repaso de examen',
  });
  assert.equal(result.valid, true);
  assert.equal(result.session.endTime, '11:00:00');
});

test('rechaza payload incompleto o con formato inválido', () => {
  assert.equal(validateSessionPayload({}).valid, false);
  assert.equal(validateSessionPayload({
    tutor_id: 1, subject_id: 1, session_date: '2026-09-14', start_time: '25:00', reason: 'x',
  }).valid, false);
});
