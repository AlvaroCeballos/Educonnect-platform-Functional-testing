const { describe, test, expect, jest } = require('../test-utils/jest-compat');
const path = require('path');
const { streamStaticPdf } = require('../src/controllers/documentController');

const createMockRes = () => {
  const res = {
    headers: {},
    sentFile: null,
    setHeader(key, value) { this.headers[key] = value; },
    sendFile(filePath, cb) { this.sentFile = filePath; if (cb) cb(null); return this; }
  };
  return res;
};

describe('PU-07: Verificación de cabeceras HTTP de streaming seguro', () => {
  test('Configura cabeceras Content-Type application/pdf y Content-Disposition inline', () => {
    const req = {};
    const res = createMockRes();
    const next = jest.fn();

    streamStaticPdf(req, res, next);

    expect(res.headers['Content-Type']).toBe('application/pdf');
    expect(res.headers['Content-Disposition']).toContain('inline');
    expect(res.sentFile).toContain(path.join('static', 'dummy.pdf'));
  });
});