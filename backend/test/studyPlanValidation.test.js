const test = require('node:test');
const assert = require('node:assert/strict');
const {
  TIPOS_RECURSO_VALIDOS,
  canAttendSession,
  validateStudyPlanPayload,
} = require('../src/utils/studyPlan');

const payloadValido = () => ({
  session_id: 42,
  dificultades_detectadas: 'Derivadas parciales y regla de la cadena',
  recursos: [
    { nombre_recurso: 'Cálculo de Stewart', tipo_recurso: 'Texto', descripcion_uso: 'Leer cap. 14' },
  ],
});

test('acepta un payload mínimo válido y normaliza strings', () => {
  const payload = payloadValido();
  payload.dificultades_detectadas = '  Derivadas parciales  ';
  payload.recursos[0].nombre_recurso = '  Cálculo  ';
  payload.recursos[0].descripcion_uso = '  Leer  ';

  const result = validateStudyPlanPayload(payload);
  assert.equal(result.valid, true);
  assert.equal(result.plan.dificultadesDetectadas, 'Derivadas parciales');
  assert.equal(result.plan.recursos[0].nombreRecurso, 'Cálculo');
  assert.equal(result.plan.recursos[0].descripcionUso, 'Leer');
});

test('PU-21: rechaza si "dificultades_detectadas" falta o está vacío', () => {
  const sinCampo = payloadValido();
  delete sinCampo.dificultades_detectadas;
  assert.equal(validateStudyPlanPayload(sinCampo).valid, false);

  const soloEspacios = payloadValido();
  soloEspacios.dificultades_detectadas = '   ';
  assert.equal(validateStudyPlanPayload(soloEspacios).valid, false);

  const noString = payloadValido();
  noString.dificultades_detectadas = 42;
  assert.equal(validateStudyPlanPayload(noString).valid, false);
});

test('PU-22: cada recurso debe traer nombre_recurso, tipo_recurso y descripcion_uso', () => {
  const sinNombre = payloadValido();
  sinNombre.recursos[0] = { tipo_recurso: 'Texto', descripcion_uso: 'leer' };
  assert.equal(validateStudyPlanPayload(sinNombre).valid, false);

  const sinTipo = payloadValido();
  sinTipo.recursos[0] = { nombre_recurso: 'Libro', descripcion_uso: 'leer' };
  assert.equal(validateStudyPlanPayload(sinTipo).valid, false);

  const sinDescripcion = payloadValido();
  sinDescripcion.recursos[0] = { nombre_recurso: 'Libro', tipo_recurso: 'Texto' };
  assert.equal(validateStudyPlanPayload(sinDescripcion).valid, false);

  const recursosVacios = payloadValido();
  recursosVacios.recursos = [];
  assert.equal(validateStudyPlanPayload(recursosVacios).valid, false);

  const noArray = payloadValido();
  noArray.recursos = 'no soy array';
  assert.equal(validateStudyPlanPayload(noArray).valid, false);
});

test('PU-23: tipo_recurso sólo admite Texto, Video, PDF o Enlace (case-sensitive)', () => {
  assert.deepEqual(TIPOS_RECURSO_VALIDOS, ['Texto', 'Video', 'PDF', 'Enlace']);

  for (const tipo of TIPOS_RECURSO_VALIDOS) {
    const ok = payloadValido();
    ok.recursos[0].tipo_recurso = tipo;
    assert.equal(validateStudyPlanPayload(ok).valid, true, `debería aceptar "${tipo}"`);
  }

  const casing = payloadValido();
  casing.recursos[0].tipo_recurso = 'TEXTO';
  assert.equal(validateStudyPlanPayload(casing).valid, false, 'debería rechazar TEXTO en mayúsculas');

  const inventado = payloadValido();
  inventado.recursos[0].tipo_recurso = 'Audio';
  assert.equal(validateStudyPlanPayload(inventado).valid, false, 'debería rechazar tipos fuera del ENUM');
});

test('PU-24: la sesión sólo transiciona a ATTENDED si estaba en PENDING', () => {
  assert.equal(canAttendSession('PENDING'), true);
  assert.equal(canAttendSession('ATTENDED'), false);
  assert.equal(canAttendSession('CANCELLED_BY_STUDENT'), false);
  assert.equal(canAttendSession('CANCELLED_BY_TUTOR'), false);
  assert.equal(canAttendSession(undefined), false);
});

test('rechaza session_id ausente, negativo o no entero', () => {
  const noId = payloadValido();
  delete noId.session_id;
  assert.equal(validateStudyPlanPayload(noId).valid, false);

  const negativo = payloadValido();
  negativo.session_id = -3;
  assert.equal(validateStudyPlanPayload(negativo).valid, false);

  const decimal = payloadValido();
  decimal.session_id = 3.5;
  assert.equal(validateStudyPlanPayload(decimal).valid, false);
});
