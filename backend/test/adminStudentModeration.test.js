const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * Lógica pura de validación de edición de estudiante por el Administrador (HU-041 / PU-11)
 */
function validateStudentEditPayload(currentUser, updatePayload) {
  if (!updatePayload || typeof updatePayload !== 'object') {
    return { valid: false, statusCode: 400, message: 'Payload requerido' };
  }

  const { nombre, apellido, carnet, email } = updatePayload;

  if (!nombre || !apellido || !carnet) {
    return { valid: false, statusCode: 400, message: 'Nombre, apellido y carnet son obligatorios' };
  }

  // PU-11: Regla de inmutabilidad estricta del correo electrónico
  if (
    email !== undefined &&
    email !== null &&
    String(email).trim().toLowerCase() !== String(currentUser.email).trim().toLowerCase()
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El correo electrónico no puede ser modificado por políticas de seguridad e inmutabilidad',
    };
  }

  return {
    valid: true,
    data: {
      userId: currentUser.id,
      email: currentUser.email, // Se preserva inmutable
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      carnet: String(carnet).trim(),
    },
  };
}

/**
 * Lógica pura de baja lógica de estudiante (HU-041 / PU-12)
 */
function executeStudentDisable(currentStatus) {
  if (currentStatus === 'DISABLED') {
    return { success: false, statusCode: 409, message: 'El estudiante ya se encuentra dado de baja' };
  }
  if (currentStatus !== 'APPROVED') {
    return { success: false, statusCode: 400, message: 'Solo es posible dar de baja a estudiantes aprobados' };
  }
  return { success: true, newStatus: 'DISABLED' };
}

/**
 * Lógica pura de verificación de login ante estado de cuenta (HU-041 / PU-13)
 */
function verifyUserLoginStatus(userStatus) {
  if (userStatus === 'APPROVED') {
    return { allowed: true, statusCode: 200 };
  }
  if (userStatus === 'DISABLED') {
    return {
      allowed: false,
      statusCode: 403,
      message: 'Tu cuenta ha sido dada de baja por el administrador',
    };
  }
  if (userStatus === 'PENDING') {
    return {
      allowed: false,
      statusCode: 403,
      message: 'Tu cuenta aún no ha sido aprobada por el administrador',
    };
  }
  return {
    allowed: false,
    statusCode: 403,
    message: 'Tu cuenta no está habilitada',
  };
}

// ----------------------------------------------------
// PU-11: Inmutabilidad del correo electrónico
// ----------------------------------------------------
test('PU-11: rechaza el intento de modificar el correo electrónico del estudiante', () => {
  const currentStudent = { id: 10, email: 'estudiante@usac.edu.gt', carnet: '202300123' };
  const maliciousPayload = {
    nombre: 'Carlos',
    apellido: 'López',
    carnet: '202300123',
    email: 'hacker@otrocorreo.com', // Intento de cambio
  };

  const result = validateStudentEditPayload(currentStudent, maliciousPayload);
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /correo electrónico no puede ser modificado/i);
});

test('PU-11: permite editar nombre y carnet manteniendo el correo original idéntico o no enviado', () => {
  const currentStudent = { id: 10, email: 'estudiante@usac.edu.gt', carnet: '202300123' };
  
  // Caso 1: Se envía el mismo correo
  const payloadSameEmail = {
    nombre: 'Carlos Alberto',
    apellido: 'López Pérez',
    carnet: '202300123',
    email: 'estudiante@usac.edu.gt',
  };
  const result1 = validateStudentEditPayload(currentStudent, payloadSameEmail);
  assert.equal(result1.valid, true);
  assert.equal(result1.data.email, 'estudiante@usac.edu.gt');
  assert.equal(result1.data.nombre, 'Carlos Alberto');

  // Caso 2: No se envía el campo email en el payload
  const payloadNoEmail = {
    nombre: 'Carlos Alberto',
    apellido: 'López Pérez',
    carnet: '202300123',
  };
  const result2 = validateStudentEditPayload(currentStudent, payloadNoEmail);
  assert.equal(result2.valid, true);
  assert.equal(result2.data.email, 'estudiante@usac.edu.gt');
});

// ----------------------------------------------------
// PU-12: Baja lógica de estudiante
// ----------------------------------------------------
test('PU-12: verifica transición de estado a DISABLED en baja lógica de estudiante', () => {
  const result = executeStudentDisable('APPROVED');
  assert.equal(result.success, true);
  assert.equal(result.newStatus, 'DISABLED');
});

test('PU-12: rechaza baja lógica si el estudiante ya está DISABLED o no está APPROVED', () => {
  const alreadyDisabled = executeStudentDisable('DISABLED');
  assert.equal(alreadyDisabled.success, false);
  assert.equal(alreadyDisabled.statusCode, 409);

  const pendingStudent = executeStudentDisable('PENDING');
  assert.equal(pendingStudent.success, false);
  assert.equal(pendingStudent.statusCode, 400);
});

// ----------------------------------------------------
// PU-13: Rechazo de login inmediato para usuario DISABLED
// ----------------------------------------------------
test('PU-13: valida rechazo de inicio de sesión con 403 para usuarios con estado DISABLED', () => {
  const loginAttempt = verifyUserLoginStatus('DISABLED');
  assert.equal(loginAttempt.allowed, false);
  assert.equal(loginAttempt.statusCode, 403);
  assert.match(loginAttempt.message, /dada de baja por el administrador/i);
});

test('PU-13: permite inicio de sesión exclusivamente a usuarios con estado APPROVED', () => {
  const approvedAttempt = verifyUserLoginStatus('APPROVED');
  assert.equal(approvedAttempt.allowed, true);
  assert.equal(approvedAttempt.statusCode, 200);
});
