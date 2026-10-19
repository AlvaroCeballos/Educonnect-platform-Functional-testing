const test = require('node:test');
const assert = require('node:assert/strict');
const { validateResolutionPayload } = require('../src/utils/incidentReport');

/**
 * Lógica pura de transición de estados en moderación de denuncias (HU-043 / PU-14 y PU-15)
 */
function processIncidentResolution(incident, payload) {
  const validation = validateResolutionPayload(payload);
  if (!validation.valid) {
    return { success: false, statusCode: 400, message: validation.message };
  }

  if (!incident || typeof incident !== 'object') {
    return { success: false, statusCode: 404, message: 'Denuncia no encontrada' };
  }

  if (incident.status !== 'PENDING') {
    return {
      success: false,
      statusCode: 409,
      message: 'Esta denuncia ya ha sido resuelta previamente',
    };
  }

  const { action, notes } = validation;
  const newIncidentStatus = action === 'BAN' ? 'RESOLVED_BANNED' : 'DISMISSED';
  const newTutorStatus = action === 'BAN' ? 'DISABLED' : incident.reportedUserStatus;

  return {
    success: true,
    statusCode: 200,
    incident: {
      id: incident.id,
      status: newIncidentStatus,
      adminNotes: notes,
    },
    reportedUser: {
      userId: incident.reportedUserId,
      status: newTutorStatus,
    },
  };
}

// ----------------------------------------------------
// PU-14: Desestimación de denuncia (DISMISSED)
// ----------------------------------------------------
test('PU-14: verifica transición de estado a DISMISSED al desestimar una denuncia contra tutor', () => {
  const pendingIncident = {
    id: 101,
    reportedUserId: 45,
    reportedUserStatus: 'APPROVED',
    status: 'PENDING',
    category: 'Ética y profesionalismo',
  };

  const resolution = processIncidentResolution(pendingIncident, {
    action: 'DISMISS',
    notes: 'No se encontraron evidencias suficientes que ameriten sanción.',
  });

  assert.equal(resolution.success, true);
  assert.equal(resolution.statusCode, 200);
  assert.equal(resolution.incident.status, 'DISMISSED');
  assert.equal(resolution.reportedUser.status, 'APPROVED'); // El tutor NO es dado de baja
  assert.equal(resolution.incident.adminNotes, 'No se encontraron evidencias suficientes que ameriten sanción.');
});

// ----------------------------------------------------
// PU-15: Resolución con sanción de baja (RESOLVED_BANNED y users.status = DISABLED)
// ----------------------------------------------------
test('PU-15: verifica transición a RESOLVED_BANNED y baja automática del tutor infractor (DISABLED)', () => {
  const pendingIncident = {
    id: 102,
    reportedUserId: 45,
    reportedUserStatus: 'APPROVED',
    status: 'PENDING',
    category: 'Abuso y conducta inapropiada',
  };

  const resolution = processIncidentResolution(pendingIncident, {
    action: 'BAN',
    notes: 'Infracción grave confirmada por bitácora de sesión.',
  });

  assert.equal(resolution.success, true);
  assert.equal(resolution.statusCode, 200);
  assert.equal(resolution.incident.status, 'RESOLVED_BANNED');
  assert.equal(resolution.reportedUser.status, 'DISABLED'); // El tutor pasa automáticamente a DISABLED
});

// Casos de borde y validaciones de robustez
test('PU-14/15: rechaza resolver una denuncia que ya se encuentra resuelta previamente (409)', () => {
  const alreadyResolvedIncident = {
    id: 103,
    reportedUserId: 45,
    reportedUserStatus: 'DISABLED',
    status: 'RESOLVED_BANNED',
  };

  const attempt = processIncidentResolution(alreadyResolvedIncident, {
    action: 'DISMISS',
  });

  assert.equal(attempt.success, false);
  assert.equal(attempt.statusCode, 409);
  assert.match(attempt.message, /ya ha sido resuelta previamente/i);
});

test('PU-14/15: rechaza acciones de resolución no permitidas en el payload (400)', () => {
  const pendingIncident = {
    id: 104,
    reportedUserId: 45,
    reportedUserStatus: 'APPROVED',
    status: 'PENDING',
  };

  const invalidAction = processIncidentResolution(pendingIncident, {
    action: 'IGNORE',
  });

  assert.equal(invalidAction.success, false);
  assert.equal(invalidAction.statusCode, 400);
  assert.match(invalidAction.message, /Acción no válida/i);
});

// ----------------------------------------------------
// HU-044: Denuncias contra estudiantes por tutores
// ----------------------------------------------------
test('HU-044: verifica transición a DISMISSED al desestimar una denuncia contra estudiante', () => {
  const pendingStudentIncident = {
    id: 201,
    reportedUserId: 88,
    reportedUserStatus: 'APPROVED',
    status: 'PENDING',
    category: 'Falta de respeto o indisciplina',
    reporterRole: 'tutor',
  };

  const resolution = processIncidentResolution(pendingStudentIncident, {
    action: 'DISMISS',
    notes: 'Aclaración dialogada entre las partes; no amerita sanción administrativa.',
  });

  assert.equal(resolution.success, true);
  assert.equal(resolution.statusCode, 200);
  assert.equal(resolution.incident.status, 'DISMISSED');
  assert.equal(resolution.reportedUser.status, 'APPROVED'); // El estudiante NO es sancionado
  assert.equal(resolution.incident.adminNotes, 'Aclaración dialogada entre las partes; no amerita sanción administrativa.');
});

test('HU-044: verifica transición a RESOLVED_BANNED y baja automática del estudiante infractor (DISABLED)', () => {
  const pendingStudentIncident = {
    id: 202,
    reportedUserId: 88,
    reportedUserStatus: 'APPROVED',
    status: 'PENDING',
    category: 'Agresión verbal o física',
    reporterRole: 'tutor',
  };

  const resolution = processIncidentResolution(pendingStudentIncident, {
    action: 'BAN',
    notes: 'Conducta grave constatada en la sesión presencial.',
  });

  assert.equal(resolution.success, true);
  assert.equal(resolution.statusCode, 200);
  assert.equal(resolution.incident.status, 'RESOLVED_BANNED');
  assert.equal(resolution.reportedUser.status, 'DISABLED'); // El estudiante pasa automáticamente a DISABLED
});

