const test = require('node:test');
const assert = require('node:assert/strict');

/**
 * Lógica pura de validación de edición de tutor por el Administrador (HU-042)
 */
function validateTutorEditPayload(currentTutor, updatePayload) {
  if (!updatePayload || typeof updatePayload !== 'object') {
    return { valid: false, statusCode: 400, message: 'Payload requerido' };
  }

  const {
    nombre,
    apellido,
    carnet,
    especialidad,
    email,
    anio_inicio_experiencia,
    genero,
  } = updatePayload;

  if (!nombre || !apellido || !carnet || !especialidad) {
    return {
      valid: false,
      statusCode: 400,
      message: 'Nombre, apellido, carnet y especialidad son obligatorios',
    };
  }

  // Regla de inmutabilidad estricta del correo electrónico (HU-042 / seguridad)
  if (
    email !== undefined &&
    email !== null &&
    String(email).trim().toLowerCase() !== String(currentTutor.email).trim().toLowerCase()
  ) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El correo electrónico no puede ser modificado por políticas de seguridad e inmutabilidad',
    };
  }

  const currentYear = new Date().getFullYear();
  if (anio_inicio_experiencia && Number(anio_inicio_experiencia) > currentYear) {
    return {
      valid: false,
      statusCode: 400,
      message: 'El año de inicio de experiencia no puede ser en el futuro',
    };
  }

  const validGenders = new Set(['M', 'F', 'OTHER', 'UNSPECIFIED']);
  const normalizedGender = validGenders.has(String(genero || '').toUpperCase())
    ? String(genero).toUpperCase()
    : 'UNSPECIFIED';

  return {
    valid: true,
    data: {
      userId: currentTutor.id,
      email: currentTutor.email,
      nombre: String(nombre).trim(),
      apellido: String(apellido).trim(),
      carnet: String(carnet).trim(),
      especialidad: String(especialidad).trim(),
      genero: normalizedGender,
      anio_inicio_experiencia: anio_inicio_experiencia ? Number(anio_inicio_experiencia) : null,
    },
  };
}

// ----------------------------------------------------
// Pruebas Unitarias HU-042: Edición de Tutores Aprobados
// ----------------------------------------------------

test('HU-042: rechaza el intento de modificar el correo electrónico del tutor por el administrador', () => {
  const currentTutor = { id: 4, email: 'mario.tutor@example.com', carnet: '0000000001' };
  const maliciousPayload = {
    nombre: 'Mario',
    apellido: 'Gómez',
    carnet: '0000000001',
    especialidad: 'Física Fundamental',
    email: 'mario.nuevo@hack.com', // Intento de cambio
  };

  const result = validateTutorEditPayload(currentTutor, maliciousPayload);
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /correo electrónico no puede ser modificado/i);
});

test('HU-042: permite actualizar especialidad y datos personales del tutor manteniendo el correo inmutable', () => {
  const currentTutor = { id: 4, email: 'mario.tutor@example.com', carnet: '0000000001' };
  const validPayload = {
    nombre: 'Mario Roberto',
    apellido: 'Gómez Calificación',
    carnet: '0000000001',
    especialidad: 'Cálculo Avanzado y Física',
    universidad: 'Universidad de San Carlos de Guatemala',
    direccion_tutoria: 'Presencial y Virtual',
    anio_inicio_experiencia: 2018,
    genero: 'M',
    email: 'mario.tutor@example.com', // Mismo correo
  };

  const result = validateTutorEditPayload(currentTutor, validPayload);
  assert.equal(result.valid, true);
  assert.equal(result.data.email, 'mario.tutor@example.com');
  assert.equal(result.data.nombre, 'Mario Roberto');
  assert.equal(result.data.especialidad, 'Cálculo Avanzado y Física');
  assert.equal(result.data.anio_inicio_experiencia, 2018);
});

test('HU-042: rechaza la edición del tutor si falta algún campo obligatorio (nombre, apellido, carnet, especialidad)', () => {
  const currentTutor = { id: 4, email: 'mario.tutor@example.com', carnet: '0000000001' };
  const incompletePayload = {
    nombre: 'Mario',
    apellido: 'Gómez',
    carnet: '0000000001',
    // Falta especialidad
  };

  const result = validateTutorEditPayload(currentTutor, incompletePayload);
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /obligatorios/i);
});

test('HU-042: rechaza año de inicio de experiencia futuro en la edición del tutor', () => {
  const currentTutor = { id: 4, email: 'mario.tutor@example.com', carnet: '0000000001' };
  const futureYear = new Date().getFullYear() + 2;
  const invalidPayload = {
    nombre: 'Mario',
    apellido: 'Gómez',
    carnet: '0000000001',
    especialidad: 'Matemática',
    anio_inicio_experiencia: futureYear,
  };

  const result = validateTutorEditPayload(currentTutor, invalidPayload);
  assert.equal(result.valid, false);
  assert.equal(result.statusCode, 400);
  assert.match(result.message, /año de inicio de experiencia no puede ser en el futuro/i);
});
