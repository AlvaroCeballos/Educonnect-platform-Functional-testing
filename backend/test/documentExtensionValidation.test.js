const { describe, test, expect, jest } = require('../test-utils/jest-compat');
const { streamTutorCvPdf } = require('../src/controllers/documentController');

const createMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
  return res;
};

describe('PU-08: Validación de rechazo de archivos inválidos', () => {
  test('Rechaza streaming de archivos que no tengan extensión .pdf válida', () => {
    const req = { params: { filename: 'archivo_malicioso.exe' } };
    const res = createMockRes();
    const next = jest.fn();

    streamTutorCvPdf(req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/PDF no válido/i);
  });
});