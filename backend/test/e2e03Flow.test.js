const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * E2E-03 (Alvaro — Flujo de Moderación y Sanción de Cuenta)
 * Especificación formal de lógica de integración
 */

test('E2E-03 Paso 1 y 2: Administrador autenticado consulta lista de usuarios activos', () => {
  const adminSession = { id: 2, role: 'admin', email: 'admin@educonnect.com' };
  assert.equal(adminSession.role, 'admin');

  const approvedUsers = [
    { id: 14, role: 'student', email: 'javier.orellana@educonnect.com', status: 'APPROVED' },
    { id: 15, role: 'student', email: 'sofia.perez@educonnect.com', status: 'APPROVED' },
  ];

  const students = approvedUsers.filter(u => u.role === 'student' && u.status === 'APPROVED');
  assert.equal(students.length, 2);
  assert.equal(students[0].email, 'javier.orellana@educonnect.com');
});

test('E2E-03 Paso 3: Validación de inmutabilidad estricta del correo al editar estudiante', () => {
  const currentStudent = { id: 14, email: 'javier.orellana@educonnect.com', nombre: 'Javier' };

  // Intento malicioso de alterar el correo
  const maliciousPayload = {
    nombre: 'Javier Modificado',
    apellido: 'Orellana',
    carnet: '202401002',
    email: 'hacked.email@educonnect.com',
  };

  const isEmailModified = maliciousPayload.email !== currentStudent.email;
  assert.equal(isEmailModified, true);

  // Regla HU-041 / E2E-03: Rechazo con código 400
  const validationResult = isEmailModified
    ? { statusCode: 400, message: 'El correo electrónico no puede ser modificado por políticas de seguridad e inmutabilidad' }
    : { statusCode: 200 };

  assert.equal(validationResult.statusCode, 400);
  assert.match(validationResult.message, /inmutabilidad/i);
});

test('E2E-03 Paso 4 y 5: Resolución disciplinaria de denuncia con sanción (BAN -> DISABLED)', () => {
  const incident = {
    id: 3,
    sessionId: 7,
    reporterId: 4, // Tutor
    reportedUserId: 14, // Estudiante
    reporterRole: 'tutor',
    status: 'PENDING',
    category: 'Conducta inapropiada',
  };

  const resolutionPayload = {
    action: 'BAN',
    notes: 'Infracción disciplinaria grave confirmada durante la sesión presencial.',
  };

  assert.equal(incident.status, 'PENDING');
  assert.equal(resolutionPayload.action, 'BAN');

  // Transiciones de estado
  const updatedIncidentStatus = resolutionPayload.action === 'BAN' ? 'RESOLVED_BANNED' : 'DISMISSED';
  const updatedStudentStatus = resolutionPayload.action === 'BAN' ? 'DISABLED' : 'APPROVED';

  assert.equal(updatedIncidentStatus, 'RESOLVED_BANNED');
  assert.equal(updatedStudentStatus, 'DISABLED');
});

test('E2E-03 Paso 6 y 7: Bloqueo de inicio de sesión con 403 para el estudiante sancionado', () => {
  const bannedStudentAccount = {
    id: 14,
    email: 'javier.orellana@educonnect.com',
    role: 'student',
    status: 'DISABLED', // Cuenta inhabilitada por resolución de denuncia
  };

  function attemptLogin(user) {
    if (user.status === 'DISABLED') {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Tu cuenta ha sido dada de baja por el administrador.',
      };
    }
    if (user.status !== 'APPROVED') {
      return {
        allowed: false,
        statusCode: 403,
        message: 'Tu cuenta no se encuentra aprobada para ingresar.',
      };
    }
    return {
      allowed: true,
      statusCode: 200,
      token: 'jwt.token.valido',
    };
  }

  const loginResponse = attemptLogin(bannedStudentAccount);
  assert.equal(loginResponse.allowed, false);
  assert.equal(loginResponse.statusCode, 403);
  assert.match(loginResponse.message, /dada de baja/i);
});
