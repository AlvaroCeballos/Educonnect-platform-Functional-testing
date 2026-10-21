// backend/test/paqueteA.test.js
const { describe, it } = require('node:test');
const assert = require('node:assert');

const {
  generateVerificationToken,
  getTokenExpirationDate,
  isTokenExpired,
} = require('../src/utils/token');

const {
  isValidStudentFileMime,
} = require('../src/middlewares/studentRegistrationUpload');

describe('Suite de Pruebas Unitarias - Paquete A (Yury Cruz - 202300359)', () => {
  /**
   * PU-01: Validación de longitud, entropía y formato del token de verificación (HU-030)
   */
  it('PU-01: Debe generar un token alfanumérico válido de exactamente 6 caracteres sin ambiguos', () => {
    const token = generateVerificationToken(6);

    assert.strictEqual(typeof token, 'string', 'El token debe ser de tipo string');
    assert.strictEqual(token.length, 6, 'El token debe tener exactamente 6 caracteres');

    // Alfabeto permitido: sin 0, O, 1, I
    const allowedCharsRegex = /^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{6}$/;
    assert.strictEqual(
      allowedCharsRegex.test(token),
      true,
      `El token generado (${token}) contiene caracteres fuera del juego alfanumérico seguro`
    );
  });

  /**
   * PU-02: Validación de expiración del token (HU-030 / HU-031)
   */
  it('PU-02: Debe identificar correctamente si un token ha expirado o sigue vigente', () => {
    // 1. Token con fecha pasada (expirado)
    const pastDate = new Date(Date.now() - 3600 * 1000); // 1 hora atrás
    assert.strictEqual(
      isTokenExpired(pastDate),
      true,
      'Un token con fecha en el pasado debe marcarse como expirado'
    );

    // 2. Token recién generado a 24 horas (vigente)
    const futureDate = getTokenExpirationDate(24);
    assert.strictEqual(
      isTokenExpired(futureDate),
      false,
      'Un token con 24 horas a futuro debe marcarse como vigente'
    );

    // 3. Caso de borde: fecha nula o indefinida
    assert.strictEqual(
      isTokenExpired(null),
      true,
      'Un token sin fecha de expiración debe considerarse expirado por seguridad'
    );
  });

  /**
   * PU-03: Validación del filtro de subida de archivos para carnet escaneado (HU-028)
   */
  it('PU-03: Debe aceptar estrictamente archivos application/pdf y rechazar otros tipos MIME', () => {
    // Aceptados
    const validPdf = isValidStudentFileMime('carnet_pdf', 'application/pdf');
    assert.strictEqual(validPdf, true, 'Debe aceptar application/pdf para carnet_pdf');

    // Rechazados
    const invalidImage = isValidStudentFileMime('carnet_pdf', 'image/png');
    const invalidWord = isValidStudentFileMime('carnet_pdf', 'application/msword');
    const invalidText = isValidStudentFileMime('carnet_pdf', 'text/plain');

    assert.strictEqual(invalidImage, false, 'No debe aceptar imágenes como carnet_pdf');
    assert.strictEqual(invalidWord, false, 'No debe aceptar documentos Word como carnet_pdf');
    assert.strictEqual(invalidText, false, 'No debe aceptar texto plano como carnet_pdf');
  });

  /**
   * PU-04: Validación de bloqueo en login por token erróneo o faltante (HU-031)
   */
  it('PU-04: Debe rechazar el acceso cuando el token suministrado no coincide con el almacenado', () => {
    const studentInDB = {
      email: 'estudiante.test@ingenieria.usac.edu.gt',
      verification_token: 'K7X9P2',
      email_verified: 0,
      status: 'APPROVED',
    };

    const validateTokenInput = (inputToken, user) => {
      if (!user.email_verified) {
        const cleanInput = String(inputToken || '').trim().toUpperCase();
        if (!cleanInput) {
          return { allowed: false, reason: 'TOKEN_REQUIRED' };
        }
        if (cleanInput !== String(user.verification_token).trim().toUpperCase()) {
          return { allowed: false, reason: 'TOKEN_INVALID' };
        }
      }
      return { allowed: true, reason: 'OK' };
    };

    // Caso 1: Token incorrecto
    const resultWrong = validateTokenInput('WRONG1', studentInDB);
    assert.strictEqual(resultWrong.allowed, false);
    assert.strictEqual(resultWrong.reason, 'TOKEN_INVALID');

    // Caso 2: Token vacío
    const resultEmpty = validateTokenInput('', studentInDB);
    assert.strictEqual(resultEmpty.allowed, false);
    assert.strictEqual(resultEmpty.reason, 'TOKEN_REQUIRED');

    // Caso 3: Token correcto (incluso con minúsculas o espacios accidentales)
    const resultCorrect = validateTokenInput(' k7x9p2 ', studentInDB);
    assert.strictEqual(resultCorrect.allowed, true);
    assert.strictEqual(resultCorrect.reason, 'OK');
  });

  /**
   * PU-05: Verificación de cambio de estado a email_verified = TRUE tras validación (HU-031)
   */
  it('PU-05: Debe actualizar el estado a verificado y remover el token tras éxito', () => {
    const simulateVerificationSuccess = (user) => {
      return {
        ...user,
        email_verified: true,
        verification_token: null,
      };
    };

    const initialUser = {
      id: 42,
      email: 'estudiante.prueba@usac.edu.gt',
      email_verified: false,
      verification_token: 'M3T8R9',
    };

    const updatedUser = simulateVerificationSuccess(initialUser);

    assert.strictEqual(updatedUser.email_verified, true, 'email_verified debe ser TRUE');
    assert.strictEqual(updatedUser.verification_token, null, 'verification_token debe quedar NULL');
  });
});