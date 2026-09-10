const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

/** Hashea contraseña en texto plano */
const hashPassword = async (plain) => bcrypt.hash(plain, SALT_ROUNDS);

/** Compara texto plano con hash almacenado en BD */
const comparePassword = async (plain, hash) => bcrypt.compare(plain, hash);


const validatePasswordStrength = (password) => {
  if (!password || password.length < 8)
    return { valid: false, message: 'La contraseña debe tener al menos 8 caracteres' };
  if (!/[A-Z]/.test(password))
    return { valid: false, message: 'La contraseña debe contener al menos una mayúscula' };
  if (!/[a-z]/.test(password))
    return { valid: false, message: 'La contraseña debe contener al menos una minúscula' };
  if (!/[0-9]/.test(password))
    return { valid: false, message: 'La contraseña debe contener al menos un número' };
  return { valid: true };
};

module.exports = { hashPassword, comparePassword, validatePasswordStrength };