const test = require('node:test');
const assert = require('node:assert/strict');
const {
  CAMPOS_REQUERIDOS_PLAN,
  validateCertificatePayload,
} = require('../src/utils/certificatePdf');

const planValido = () => ({
  id: 17,
  session_id: 42,
  session_date: '2026-10-18',
  tutor_name: 'Laura Gomez',
  tutor_specialty: 'Fisica',
  tutor_identification: '999999998',
  dificultades_detectadas: 'Dudas con planos inclinados',
  recursos: [
    { nombre_recurso: 'Libro', tipo_recurso: 'Texto', descripcion_uso: 'Leer cap 5' },
  ],
  created_at: '2026-10-18T10:00:00Z',
});

test('acepta un plan completo y valido', () => {
  const result = validateCertificatePayload(planValido());
  assert.equal(result.valid, true);
});

test('PU-25: rechaza payload nulo o no objeto', () => {
  assert.equal(validateCertificatePayload(null).valid, false);
  assert.equal(validateCertificatePayload(undefined).valid, false);
  assert.equal(validateCertificatePayload('no soy objeto').valid, false);
  assert.equal(validateCertificatePayload(42).valid, false);
});

test('PU-25: rechaza si falta cualquiera de los campos requeridos del tutor', () => {
  for (const campo of ['tutor_name', 'tutor_specialty', 'tutor_identification']) {
    const plan = planValido();
    delete plan[campo];
    const result = validateCertificatePayload(plan);
    assert.equal(result.valid, false, `debería rechazar sin "${campo}"`);
    assert.match(result.message, new RegExp(campo));
  }
});

test('PU-25: rechaza si falta dificultades_detectadas o session_date', () => {
  const sinDificultades = planValido();
  delete sinDificultades.dificultades_detectadas;
  assert.equal(validateCertificatePayload(sinDificultades).valid, false);

  const sinFecha = planValido();
  delete sinFecha.session_date;
  assert.equal(validateCertificatePayload(sinFecha).valid, false);
});

test('PU-25: rechaza campos vacíos ("") o null, no solo ausentes', () => {
  const vacio = planValido();
  vacio.tutor_name = '';
  assert.equal(validateCertificatePayload(vacio).valid, false);

  const nulo = planValido();
  nulo.tutor_identification = null;
  assert.equal(validateCertificatePayload(nulo).valid, false);
});

test('PU-25: rechaza si "recursos" no es array (aunque los otros campos esten)', () => {
  const plan = planValido();
  plan.recursos = 'no soy array';
  const result = validateCertificatePayload(plan);
  assert.equal(result.valid, false);
  assert.match(result.message, /recursos/);
});

test('la lista oficial de campos requeridos cubre tutor + plan + sesion', () => {
  assert.deepEqual(
    [...CAMPOS_REQUERIDOS_PLAN].sort(),
    ['dificultades_detectadas', 'id', 'recursos', 'session_date', 'tutor_identification', 'tutor_name', 'tutor_specialty'].sort(),
  );
});
