const TUTOR_INCIDENT_CATEGORIES = Object.freeze([
  'Ética y profesionalismo',
  'Negligencia académica',
  'Abuso y conducta inapropiada',
  'Falsificación de información',
  'Inasistencia o abandono de sesión',
]);

const STUDENT_INCIDENT_CATEGORIES = Object.freeze([
  'Conducta inapropiada',
  'Falsificación de documentos',
  'Agresión verbal o física',
  'Robo o daño a las instalaciones',
  'Falta de respeto o indisciplina',
]);

const VALID_RESOLUTION_ACTIONS = Object.freeze(['BAN', 'DISMISS']);

/**
 * Valida si una sesión es candidata a ser reportada.
 * Regla de negocio: Solo sesiones con estado 'ATTENDED' pueden ser reportadas.
 * No se permite reportar sesiones PENDING o CANCELLED.
 */
function canReportSession(session, userId) {
  if (!session || typeof session !== 'object') return false;
  if (session.status !== 'ATTENDED') return false;

  const studentId = Number(session.studentId ?? session.student_id);
  const tutorId = Number(session.tutorId ?? session.tutor_id);
  const currentUserId = Number(userId);

  return currentUserId === studentId || currentUserId === tutorId;
}

/**
 * Valida el cuerpo de la solicitud de reporte disciplinario.
 */
function validateIncidentPayload(payload, reporterRole) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'El payload del reporte es requerido' };
  }

  const category = String(payload.category || '').trim();
  const reason = String(payload.reason || '').trim();

  const allowedCategories =
    reporterRole === 'student'
      ? TUTOR_INCIDENT_CATEGORIES
      : STUDENT_INCIDENT_CATEGORIES;

  if (!category) {
    return { valid: false, message: 'La categoría del reporte es obligatoria' };
  }

  if (!allowedCategories.includes(category)) {
    return {
      valid: false,
      message: `Categoría inválida. Debe ser una de las siguientes: ${allowedCategories.join(', ')}`,
    };
  }

  if (!reason || reason.length < 10) {
    return {
      valid: false,
      message: 'El motivo debe contener al menos 10 caracteres explicando los hechos',
    };
  }

  return {
    valid: true,
    category,
    reason,
  };
}

/**
 * Valida la acción administrativa para resolver un reporte.
 */
function validateResolutionPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, message: 'El payload de resolución es requerido' };
  }

  const action = String(payload.action || '').toUpperCase().trim();
  const notes = String(payload.notes || '').trim();

  if (!VALID_RESOLUTION_ACTIONS.includes(action)) {
    return {
      valid: false,
      message: 'Acción no válida. Se requiere "BAN" (dar de baja) o "DISMISS" (desestimar)',
    };
  }

  return {
    valid: true,
    action,
    notes: notes || null,
  };
}

module.exports = {
  TUTOR_INCIDENT_CATEGORIES,
  STUDENT_INCIDENT_CATEGORIES,
  VALID_RESOLUTION_ACTIONS,
  canReportSession,
  validateIncidentPayload,
  validateResolutionPayload,
};
