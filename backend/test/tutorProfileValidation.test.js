const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTutorProfilePayload } = require('../src/utils/tutorProfile');

const validProfile = {
  nombre: 'Ana',
  apellido: 'López',
  carnet: '202600001',
  identificacion: '1234567890101',
  fecha_nacimiento: '1998-05-10',
  genero: 'F',
  especialidad: 'Matemática',
  direccion_tutoria: 'Campus central',
  anio_inicio_experiencia: 2020,
  universidad: 'Universidad de San Carlos',
};

test('HU-023: acepta la actualización del perfil sin cambiar el correo', () => {
  const result = validateTutorProfilePayload({ ...validProfile, password: 'NuevaClave123' });
  assert.equal(result.valid, true);
  assert.equal(result.values.length, 10);
});

test('HU-023: rechaza cualquier intento de modificar el correo', () => {
  const result = validateTutorProfilePayload({ ...validProfile, email: 'otro@example.com' });
  assert.equal(result.valid, false);
  assert.match(result.message, /correo/i);
});

test('HU-023: exige los campos profesionales obligatorios', () => {
  const result = validateTutorProfilePayload({ ...validProfile, universidad: '' });
  assert.equal(result.valid, false);
  assert.match(result.message, /obligatorios/i);
});

test('HU-023: valida la complejidad de la nueva contraseña', () => {
  const result = validateTutorProfilePayload({ ...validProfile, password: 'debil' });
  assert.equal(result.valid, false);
  assert.match(result.message, /8 caracteres/i);
});
