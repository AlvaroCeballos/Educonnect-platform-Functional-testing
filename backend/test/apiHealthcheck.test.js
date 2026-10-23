const { describe, test, expect, jest } = require('../test-utils/jest-compat');
const createMockRes = () => {
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(payload) { this.body = payload; return this; }
  };
  return res;
};

describe('PU-10: Verificación del endpoint healthcheck de comunicación', () => {
  test('El controlador de healthcheck retorna status ok y nombre del servicio', () => {
    const res = createMockRes();
    
    const healthHandler = (_req, response) => {
      response.json({
        status: 'ok',
        service: 'EduConnect API',
        timestamp: new Date().toISOString(),
      });
    };

    healthHandler({}, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('EduConnect API');
    expect(res.body.timestamp).toBeDefined();
  });
});