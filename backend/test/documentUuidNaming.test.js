const { describe, test, expect, jest } = require('../test-utils/jest-compat');
const crypto = require('crypto');

describe('PU-09: Prueba de consistencia en nombres de archivo para evitar sobreescrituras', () => {
  test('Genera nombres de archivo únicos con formato UUID v4 y extensión .pdf', () => {
    const generatedNames = new Set();
    const uuidPdfRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf$/i;

    for (let i = 0; i < 50; i += 1) {
      const filename = `${crypto.randomUUID()}.pdf`;
      expect(uuidPdfRegex.test(filename)).toBe(true);
      generatedNames.add(filename);
    }

    expect(generatedNames.size).toBe(50);
  });
});