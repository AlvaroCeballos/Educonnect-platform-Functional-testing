const TIPOS_RECURSO_VALIDOS = ['Texto', 'Video', 'PDF', 'Enlace'];

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const validateResource = (recurso, index) => {
  if (recurso === null || typeof recurso !== 'object') {
    return `El recurso en la posición ${index} no es un objeto válido`;
  }
  if (!isNonEmptyString(recurso.nombre_recurso)) {
    return `El recurso en la posición ${index} debe incluir nombre_recurso`;
  }
  if (!TIPOS_RECURSO_VALIDOS.includes(recurso.tipo_recurso)) {
    return `El recurso en la posición ${index} tiene un tipo_recurso inválido (admitidos: Texto, Video, PDF, Enlace)`;
  }
  if (!isNonEmptyString(recurso.descripcion_uso)) {
    return `El recurso en la posición ${index} debe incluir descripcion_uso`;
  }
  return null;
};

const validateStudyPlanPayload = (body) => {
  if (body === null || typeof body !== 'object') {
    return { valid: false, message: 'El cuerpo de la petición es inválido' };
  }

  const sessionId = Number(body.session_id);
  if (!Number.isInteger(sessionId) || sessionId < 1) {
    return { valid: false, message: 'session_id debe ser un entero positivo' };
  }

  if (!isNonEmptyString(body.dificultades_detectadas)) {
    return { valid: false, message: 'dificultades_detectadas es obligatorio' };
  }

  if (!Array.isArray(body.recursos) || body.recursos.length === 0) {
    return { valid: false, message: 'recursos debe ser un array con al menos un elemento' };
  }

  for (let i = 0; i < body.recursos.length; i += 1) {
    const error = validateResource(body.recursos[i], i);
    if (error) return { valid: false, message: error };
  }

  return {
    valid: true,
    plan: {
      sessionId,
      dificultadesDetectadas: body.dificultades_detectadas.trim(),
      recursos: body.recursos.map((r) => ({
        nombreRecurso: r.nombre_recurso.trim(),
        tipoRecurso: r.tipo_recurso,
        descripcionUso: r.descripcion_uso.trim(),
      })),
    },
  };
};

module.exports = {
  TIPOS_RECURSO_VALIDOS,
  validateStudyPlanPayload,
};
