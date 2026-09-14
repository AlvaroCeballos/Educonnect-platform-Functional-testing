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

// Validaciones de baja lógica de usuarios aprobados (HU-024 / HU-025)
const validateDisableUser = (userId, currentStatus, role) => {
  const numericId = Number(userId);
  if (!Number.isInteger(numericId) || numericId < 1) {
    return { valid: false, message: 'El identificador de usuario no es válido' };
  }

  const normalizedRole = String(role || '').toLowerCase();
  if (!['student', 'tutor'].includes(normalizedRole)) {
    return { valid: false, message: 'Rol de usuario no válido' };
  }

  if (currentStatus === 'DISABLED') {
    return { valid: false, statusCode: 409, message: 'El usuario ya se encuentra dado de baja' };
  }

  if (currentStatus !== 'APPROVED') {
    return { valid: false, statusCode: 400, message: 'Solo es posible dar de baja a usuarios aprobados' };
  }

  return { valid: true, userId: numericId, status: 'DISABLED', role: normalizedRole };
};

test('HU-024: da de baja exitosamente a un estudiante aprobado', () => {
  const result = validateDisableUser(10, 'APPROVED', 'student');
  assert.equal(result.valid, true);
  assert.equal(result.status, 'DISABLED');
  assert.equal(result.role, 'student');
});

test('HU-024: rechaza dar de baja a un estudiante que ya está DISABLED (409)', () => {
  const result = validateDisableUser(10, 'DISABLED', 'student');
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 409);
  assert.match(result.message, /ya se encuentra dado de baja/);
});

test('HU-024: rechaza dar de baja a un estudiante con estado PENDING (400)', () => {
  const result = validateDisableUser(10, 'PENDING', 'student');
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /usuarios aprobados/);
});

test('HU-024: rechaza ID inválido al dar de baja a un estudiante', () => {
  const result = validateDisableUser('invalido', 'APPROVED', 'student');
  assert.equal(result.valid, false);
  assert.match(result.message, /identificador/);
});

test('HU-025: da de baja exitosamente a un tutor aprobado', () => {
  const result = validateDisableUser(4, 'APPROVED', 'tutor');
  assert.equal(result.valid, true);
  assert.equal(result.status, 'DISABLED');
  assert.equal(result.role, 'tutor');
});

test('HU-025: rechaza dar de baja a un tutor que ya está DISABLED (409)', () => {
  const result = validateDisableUser(4, 'DISABLED', 'tutor');
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 409);
  assert.match(result.message, /ya se encuentra dado de baja/);
});

test('HU-025: rechaza dar de baja a un tutor con estado PENDING (400)', () => {
  const result = validateDisableUser(4, 'PENDING', 'tutor');
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /usuarios aprobados/);
});

test('HU-025: rechaza ID inválido al dar de baja a un tutor', () => {
  const result = validateDisableUser('tutor-invalido', 'APPROVED', 'tutor');
  assert.equal(result.valid, false);
  assert.match(result.message, /identificador/);
});


