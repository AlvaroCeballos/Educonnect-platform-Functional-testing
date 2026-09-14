const test = require('node:test');
const assert = require('node:assert/strict');

// Validaciones del módulo de administración de usuarios (HU-004 / HU-005)
const ALLOWED_DECISION_STATUSES = new Set(['APPROVED', 'REJECTED']);

const validateAdminDecision = (userId, status, role) => {
  const numericId = Number(userId);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return { valid: false, message: 'El identificador de usuario no es válido' };
  }

  const normalizedStatus = String(status || '').toUpperCase();
  if (!ALLOWED_DECISION_STATUSES.has(normalizedStatus)) {
    return { valid: false, message: 'Solo se permite aprobar o rechazar una solicitud' };
  }

  const normalizedRole = String(role || '').toLowerCase();
  if (!['student', 'tutor'].includes(normalizedRole)) {
    return { valid: false, message: 'Rol de usuario no válido' };
  }

  return { valid: true, userId: numericId, status: normalizedStatus, role: normalizedRole };
};

test('HU-005: valida decisión exitosa de aprobación para un tutor', () => {
  const result = validateAdminDecision(5, 'APPROVED', 'tutor');
  assert.equal(result.valid, true);
  assert.equal(result.status, 'APPROVED');
  assert.equal(result.role, 'tutor');
});

test('HU-005: valida decisión exitosa de rechazo para un tutor', () => {
  const result = validateAdminDecision(5, 'REJECTED', 'tutor');
  assert.equal(result.valid, true);
  assert.equal(result.status, 'REJECTED');
  assert.equal(result.role, 'tutor');
});

test('HU-005: rechaza estados no permitidos en la decisión del admin', () => {
  const result = validateAdminDecision(5, 'PENDING', 'tutor');
  assert.equal(result.valid, false);
  assert.match(result.message, /aprobar o rechazar/);
});

test('HU-005: rechaza identificadores de usuario no numéricos o menores a 1', () => {
  const resultInvalid = validateAdminDecision('abc', 'APPROVED', 'tutor');
  assert.equal(resultInvalid.valid, false);
  assert.match(resultInvalid.message, /identificador/);

  const resultZero = validateAdminDecision(0, 'APPROVED', 'tutor');
  assert.equal(resultZero.valid, false);
});

test('HU-005: rechaza roles que no sean student o tutor', () => {
  const result = validateAdminDecision(5, 'APPROVED', 'admin');
  assert.equal(result.valid, false);
  assert.match(result.message, /Rol/);
});
