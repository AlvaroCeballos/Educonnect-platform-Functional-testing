const test = require('node:test');
const assert = require('node:assert/strict');
const { canRateSession, canRateStudentSession, validateRatingPayload } = require('../src/utils/rating');

test('acepta calificaciones enteras desde 0 hasta 5', () => {
  assert.equal(validateRatingPayload({ rating: 0 }).valid, true);
  assert.equal(validateRatingPayload({ rating: 5 }).valid, true);
  assert.equal(validateRatingPayload({ rating: '3', comment: 'Buena sesión' }).rating, 3);
});

test('rechaza calificaciones fuera del rango o no enteras', () => {
  assert.equal(validateRatingPayload({ rating: -1 }).valid, false);
  assert.equal(validateRatingPayload({ rating: 6 }).valid, false);
  assert.equal(validateRatingPayload({ rating: 2.5 }).valid, false);
  assert.equal(validateRatingPayload({}).valid, false);
});

test('solo permite calificar sesiones atendidas del estudiante autenticado', () => {
  assert.equal(canRateSession({ studentId: 7, status: 'ATTENDED' }, 7), true);
  assert.equal(canRateSession({ studentId: 7, status: 'PENDING' }, 7), false);
  assert.equal(canRateSession({ studentId: 8, status: 'ATTENDED' }, 7), false);
});

test('solo permite al tutor calificar al estudiante de una sesión atendida propia', () => {
  const attendedSession = { tutorId: 20, status: 'ATTENDED' };
  assert.equal(canRateStudentSession(attendedSession, 20), true);
  assert.equal(canRateStudentSession(attendedSession, 99), false);
  assert.equal(canRateStudentSession({ ...attendedSession, status: 'PENDING' }, 20), false);
});
