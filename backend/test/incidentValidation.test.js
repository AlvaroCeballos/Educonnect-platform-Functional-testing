const test = require('node:test');
const assert = require('node:assert/strict');
const {
  TUTOR_INCIDENT_CATEGORIES,
  STUDENT_INCIDENT_CATEGORIES,
  canReportSession,
  validateIncidentPayload,
  validateResolutionPayload,
} = require('../src/utils/incidentReport');

test('solo permite reportar sesiones con estado ATTENDED del participante', () => {
  const attendedSession = {
    id: 1,
    studentId: 10,
    tutorId: 20,
    status: 'ATTENDED',
  };

  assert.equal(canReportSession(attendedSession, 10), true);
  assert.equal(canReportSession(attendedSession, 20), true);
  assert.equal(canReportSession(attendedSession, 99), false);

  assert.equal(
    canReportSession({ ...attendedSession, status: 'PENDING' }, 10),
    false,
  );
  assert.equal(
    canReportSession({ ...attendedSession, status: 'CANCELLED_BY_STUDENT' }, 10),
    false,
  );
  assert.equal(
    canReportSession({ ...attendedSession, status: 'CANCELLED_BY_TUTOR' }, 20),
    false,
  );
});

test('valida catálogo oficial de faltas para reportar a tutores', () => {
  const valid = validateIncidentPayload(
    {
      category: 'Ética y profesionalismo',
      reason: 'El tutor llegó tarde y no completó los temas acordados.',
    },
    'student',
  );
  assert.equal(valid.valid, true);
  assert.equal(valid.category, 'Ética y profesionalismo');

  const invalidCat = validateIncidentPayload(
    {
      category: 'Falta no existente',
      reason: 'Explicación de prueba suficientemente larga.',
    },
    'student',
  );
  assert.equal(invalidCat.valid, false);

  const shortReason = validateIncidentPayload(
    {
      category: 'Negligencia académica',
      reason: 'Corta',
    },
    'student',
  );
  assert.equal(shortReason.valid, false);
});

test('valida catálogo oficial de faltas para reportar a estudiantes', () => {
  const valid = validateIncidentPayload(
    {
      category: 'Agresión verbal o física',
      reason: 'El estudiante insultó de forma reiterada al tutor.',
    },
    'tutor',
  );
  assert.equal(valid.valid, true);

  const invalidForTutor = validateIncidentPayload(
    {
      category: 'Ética y profesionalismo', // Es de tutor, no de estudiante
      reason: 'Motivo con suficiente detalle para prueba.',
    },
    'tutor',
  );
  assert.equal(invalidForTutor.valid, false);
});

test('valida acciones de resolución administrativa de reportes', () => {
  const banAction = validateResolutionPayload({ action: 'BAN', notes: 'Sancionado' });
  assert.equal(banAction.valid, true);
  assert.equal(banAction.action, 'BAN');

  const dismissAction = validateResolutionPayload({ action: 'DISMISS' });
  assert.equal(dismissAction.valid, true);
  assert.equal(dismissAction.action, 'DISMISS');

  const invalidAction = validateResolutionPayload({ action: 'OTRA' });
  assert.equal(invalidAction.valid, false);
});
