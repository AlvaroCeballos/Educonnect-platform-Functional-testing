const test = require('node:test');
const assert = require('node:assert/strict');
const { validateTutorPayload } = require('../src/controllers/tutorAuthController');

const validTutor = {
  nombre: 'Ana',
  apellido: 'López',
  carnet: '202600001',
  identificacion: '1234567890101',
  fecha_nacimiento: '1998-05-10',
  genero: 'F',
  email: 'ANA.TUTOR@EXAMPLE.COM',
  password: 'Segura123',
  especialidad: 'Matemática',
  direccion_tutoria: 'Campus central',
  anio_inicio_experiencia: '2020',
  universidad: 'Universidad de San Carlos',
};

test('acepta y normaliza los datos completos de un tutor', () => {
  const result = validateTutorPayload(validTutor);
  assert.equal(result.valid, true);
  assert.equal(result.tutor.email, 'ana.tutor@example.com');
  assert.equal(result.tutor.anio_inicio_experiencia, 2020);
});

test('rechaza campos profesionales faltantes', () => {
  const result = validateTutorPayload({ ...validTutor, especialidad: '' });
  assert.equal(result.valid, false);
  assert.match(result.message, /especialidad/);
});

test('rechaza contraseñas sin la complejidad requerida', () => {
  const result = validateTutorPayload({ ...validTutor, password: 'debil' });
  assert.equal(result.valid, false);
  assert.match(result.message, /8 caracteres/);
});

test('rechaza años de experiencia futuros', () => {
  const result = validateTutorPayload({
    ...validTutor,
    anio_inicio_experiencia: String(new Date().getUTCFullYear() + 1),
  });
  assert.equal(result.valid, false);
  assert.match(result.message, /año de inicio/);
});

test('rechaza fechas de nacimiento imposibles', () => {
  const result = validateTutorPayload({ ...validTutor, fecha_nacimiento: '2020-02-31' });
  assert.equal(result.valid, false);
  assert.match(result.message, /fecha de nacimiento/);
});
