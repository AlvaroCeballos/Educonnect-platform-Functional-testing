const { describe, test, expect, jest } = require('../test-utils/jest-compat');
const { registerTutor } = require('../src/controllers/tutorAuthController');

const createMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
  return res;
};

describe('PU-06: Validación de obligatoriedad del CV en el registro de tutores', () => {
  test('Rechaza el registro con 400 si no se adjunta el CV en PDF', async () => {
    const req = {
      file: undefined,
      tutorPhoto: null,
      body: { nombre: 'Xavi', apellido: 'De Leon' },
    };
    const res = createMockRes();

    await registerTutor(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      message: 'El CV en formato PDF es obligatorio',
    });
  });
});