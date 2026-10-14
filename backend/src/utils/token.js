const crypto = require('crypto');

const ALPHANUMERIC_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * HU-030: Genera un token criptográfico alfanumérico de 6 caracteres
 */
const generateVerificationToken = (length = 6) => {
  const bytes = crypto.randomBytes(length);
  let token = '';
  for (let i = 0; i < length; i += 1) {
    token += ALPHANUMERIC_CHARS[bytes[i] % ALPHANUMERIC_CHARS.length];
  }
  return token;
};

/**
 * Calcula la fecha de expiración del token (24 horas por defecto)
 */
const getTokenExpirationDate = (hours = 24) => {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
};

/**
 * Valida si un token ha expirado (para pruebas unitarias PU-02)
 */
const isTokenExpired = (expirationDate) => {
  if (!expirationDate) return true;
  return new Date() > new Date(expirationDate);
};

module.exports = {
  generateVerificationToken,
  getTokenExpirationDate,
  isTokenExpired,
};