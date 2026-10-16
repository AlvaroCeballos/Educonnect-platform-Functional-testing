const test = require('node:test');
const assert = require('node:assert/strict');
const {
  average, weightedAverage, groupSessionsByPeriod, cancellationRateBySubject,
} = require('../src/utils/metrics');

test('PU-16: promedio exacto de varias calificaciones 0-5', () => {
  assert.equal(average([5, 4, 3, 4]), 4);
  assert.equal(average([5, 4, 4]), 4.33);
});

test('PU-17: sin evaluaciones retorna 0 sin error', () => {
  assert.equal(average([]), 0);
  assert.equal(average([null, undefined]), 0);
});

test('PU-18: promedio ponderado de un estudiante calificado por varios tutores', () => {
  assert.equal(weightedAverage([{ rating: 5, weight: 1 }, { rating: 2, weight: 3 }]), 2.75);
  assert.equal(weightedAverage([]), 0);
});

const sessions = [
  { session_date: '2026-10-05', status: 'ATTENDED' },
  { session_date: '2026-09-15', status: 'ATTENDED' },
  { session_date: '2026-10-03', status: 'ATTENDED' },
  { session_date: '2026-09-28', status: 'ATTENDED' },
  { session_date: '2026-10-06', status: 'PENDING' },
];

test('PU-19: agrupa y ordena sesiones completadas por mes y por semana', () => {
  assert.deepEqual(groupSessionsByPeriod(sessions, 'month'), [
    { periodo: '2026-09', total: 2 }, { periodo: '2026-10', total: 2 },
  ]);
  assert.deepEqual(groupSessionsByPeriod(sessions, 'week'), [
    { periodo: '2026-W38', total: 1 },
    { periodo: '2026-W40', total: 2 },
    { periodo: '2026-W41', total: 1 },
  ]);
});

test('PU-20: tasa de cancelación por materia, ignorando pendientes', () => {
  const rows = cancellationRateBySubject([
    { subject: 'Matemática', status: 'ATTENDED' },
    { subject: 'Matemática', status: 'CANCELLED_BY_STUDENT' },
    { subject: 'Matemática', status: 'CANCELLED_BY_TUTOR' },
    { subject: 'Matemática', status: 'PENDING' },
    { subject: 'Física', status: 'ATTENDED' },
    { subject: 'Física', status: 'ATTENDED' },
  ]);
  assert.deepEqual(rows[0], { materia: 'Matemática', canceladas: 2, total: 3, tasa: 66.7 });
  assert.equal(rows[1].tasa, 0);
});