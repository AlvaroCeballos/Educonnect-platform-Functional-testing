// Compatibilidad mínima con la API de Jest sobre el runner nativo de Node
// (node --test). Permite ejecutar pruebas escritas con describe/test/expect
// sin agregar Jest como dependencia ni cambiar el script `npm test`.
const { describe, test } = require('node:test');
const assert = require('node:assert/strict');

const matchers = (actual, negate) => {
  const check = (pass, message) => {
    if (negate ? pass : !pass) assert.fail(negate ? `No se esperaba: ${message}` : message);
  };
  return {
    toBe: (expected) => check(Object.is(actual, expected),
      `${JSON.stringify(actual)} debía ser ${JSON.stringify(expected)}`),
    toEqual: (expected) => {
      let pass = true;
      try { assert.deepStrictEqual(actual, expected); } catch { pass = false; }
      check(pass, `${JSON.stringify(actual)} debía ser igual a ${JSON.stringify(expected)}`);
    },
    toBeDefined: () => check(actual !== undefined, 'el valor debía estar definido'),
    toContain: (item) => check(actual != null && actual.includes(item),
      `${JSON.stringify(actual)} debía contener ${JSON.stringify(item)}`),
    toMatch: (pattern) => check(
      typeof pattern === 'string' ? String(actual).includes(pattern) : pattern.test(String(actual)),
      `${JSON.stringify(actual)} debía coincidir con ${pattern}`),
  };
};

const expect = (actual) => ({ ...matchers(actual, false), not: matchers(actual, true) });

const jest = {
  fn: (impl = () => undefined) => {
    const mock = (...args) => { mock.mock.calls.push(args); return impl(...args); };
    mock.mock = { calls: [] };
    return mock;
  },
};

module.exports = { describe, test, expect, jest };
