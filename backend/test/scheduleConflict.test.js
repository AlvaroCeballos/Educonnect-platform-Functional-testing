const test = require('node:test');
const assert = require('node:assert/strict');

test('la regla de conflicto exige día incluido y sesión dentro del rango', () => {
  const proposedDays = new Set([1, 3]);
  const range = { start: '09:00:00', end: '17:00:00' };
  const isConflict = (day, start, end) => !proposedDays.has(day) || start < range.start || end > range.end;
  assert.equal(isConflict(1, '10:00:00', '11:00:00'), false);
  assert.equal(isConflict(2, '10:00:00', '11:00:00'), true);
  assert.equal(isConflict(3, '08:00:00', '09:30:00'), true);
});
