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

// Lógica de cálculo y ordenamiento del reporte de demanda de tutores (HU-026)
const processTutorDemandReport = (tutors = [], sessions = []) => {
  const attendedByTutor = new Map();
  const studentsByTutor = new Map();

  sessions.forEach((s) => {
    if (s.status === 'ATTENDED') {
      attendedByTutor.set(s.tutorId, (attendedByTutor.get(s.tutorId) || 0) + 1);
      const studentSet = studentsByTutor.get(s.tutorId) || new Set();
      studentSet.add(s.studentId);
      studentsByTutor.set(s.tutorId, studentSet);
    }
  });

  const ranked = tutors.map((t) => {
    const totalAtendidos = attendedByTutor.get(t.id) || 0;
    const estudiantesDistintos = (studentsByTutor.get(t.id) || new Set()).size;
    return {
      tutorId: t.id,
      nombre: t.nombre,
      totalAtendidos,
      estudiantesDistintos,
    };
  });

  ranked.sort((a, b) => b.totalAtendidos - a.totalAtendidos || b.estudiantesDistintos - a.estudiantesDistintos);

  const maxAttended = ranked.length > 0 ? ranked[0].totalAtendidos : 0;

  return ranked.map((r, index) => ({
    ranking: index + 1,
    ...r,
    demandPercentage: maxAttended > 0 ? Math.round((r.totalAtendidos / maxAttended) * 100) : 0,
  }));
};

test('HU-026: calcula ranking de tutores ordenado por sesiones ATTENDED descendente', () => {
  const tutors = [
    { id: 1, nombre: 'Mario Gómez' },
    { id: 2, nombre: 'Jose Perez' },
    { id: 3, nombre: 'Ana Diaz' },
  ];
  const sessions = [
    { tutorId: 2, studentId: 10, status: 'ATTENDED' },
    { tutorId: 2, studentId: 11, status: 'ATTENDED' },
    { tutorId: 2, studentId: 12, status: 'ATTENDED' },
    { tutorId: 1, studentId: 10, status: 'ATTENDED' },
    { tutorId: 3, studentId: 10, status: 'PENDING' }, // No cuenta
    { tutorId: 3, studentId: 11, status: 'CANCELLED_BY_STUDENT' }, // No cuenta
  ];

  const report = processTutorDemandReport(tutors, sessions);
  assert.equal(report[0].tutorId, 2);
  assert.equal(report[0].totalAtendidos, 3);
  assert.equal(report[0].ranking, 1);
  assert.equal(report[0].demandPercentage, 100);

  assert.equal(report[1].tutorId, 1);
  assert.equal(report[1].totalAtendidos, 1);
  assert.equal(report[1].ranking, 2);
  assert.equal(report[1].demandPercentage, 33);

  assert.equal(report[2].tutorId, 3);
  assert.equal(report[2].totalAtendidos, 0); // PENDING y CANCELLED no se cuentan
  assert.equal(report[2].ranking, 3);
});

test('HU-026: excluye sesiones PENDING o CANCELLED del conteo de atendidos', () => {
  const tutors = [{ id: 1, nombre: 'Mario' }];
  const sessions = [
    { tutorId: 1, studentId: 10, status: 'PENDING' },
    { tutorId: 1, studentId: 11, status: 'CANCELLED_BY_TUTOR' },
  ];
  const report = processTutorDemandReport(tutors, sessions);
  assert.equal(report[0].totalAtendidos, 0);
  assert.equal(report[0].estudiantesDistintos, 0);
});

test('HU-026: desempata por cantidad de estudiantes distintos atendidos', () => {
  const tutors = [
    { id: 1, nombre: 'Tutor 1' },
    { id: 2, nombre: 'Tutor 2' },
  ];
  const sessions = [
    { tutorId: 1, studentId: 10, status: 'ATTENDED' },
    { tutorId: 1, studentId: 11, status: 'ATTENDED' },
    { tutorId: 2, studentId: 20, status: 'ATTENDED' },
    { tutorId: 2, studentId: 20, status: 'ATTENDED' },
  ];
  const report = processTutorDemandReport(tutors, sessions);
  assert.equal(report[0].tutorId, 1);
  assert.equal(report[0].estudiantesDistintos, 2);
  assert.equal(report[1].tutorId, 2);
  assert.equal(report[1].estudiantesDistintos, 1);
});



