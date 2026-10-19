const { validatePasswordStrength } = require('./password');

const TUTOR_PROFILE_FIELDS = [
  'nombre',
  'apellido',
  'carnet',
  'identificacion',
  'fecha_nacimiento',
  'genero',
  'especialidad',
  'direccion_tutoria',
  'anio_inicio_experiencia',
  'universidad',
];

function validateTutorProfilePayload(payload = {}) {
  if (Object.prototype.hasOwnProperty.call(payload, 'email')) {
    return { valid: false, message: 'El correo electrónico no se puede modificar' };
  }

  const values = TUTOR_PROFILE_FIELDS.map((field) => payload[field]);
  if (values.some((value) => value === undefined || value === null || String(value).trim() === '')) {
    return { valid: false, message: 'Todos los datos del perfil son obligatorios' };
  }

  if (payload.password) {
    const passwordCheck = validatePasswordStrength(String(payload.password));
    if (!passwordCheck.valid) return passwordCheck;
  }

  return { valid: true, values };
}

module.exports = { TUTOR_PROFILE_FIELDS, validateTutorProfilePayload };
