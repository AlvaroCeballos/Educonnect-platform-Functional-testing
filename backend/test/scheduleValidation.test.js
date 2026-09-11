const test = require('node:test');
const assert = require('node:assert/strict');
const { validateSchedulePayload } = require('../src/utils/schedule');

test('acepta varios días con un rango común', () => {
  const result = validateSchedulePayload({ days: [1, 3, 5], startTime: '08:00', endTime: '17:00' });
  assert.equal(result.valid, true);
  assert.deepEqual(result.schedule.days, [1, 3, 5]);
});

test('rechaza horario sin días o con rango invertido', () => {
  assert.equal(validateSchedulePayload({ startTime: '08:00', endTime: '17:00' }).valid, false);
  assert.equal(validateSchedulePayload({ days: [1], startTime: '18:00', endTime: '17:00' }).valid, false);
});
