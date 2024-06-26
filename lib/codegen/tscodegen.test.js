'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const tscodegen_1 = require('./tscodegen');
describe('isValidIdentifier', () => {
  it('should return true for valid identifiers', () => {
    expect((0, tscodegen_1.isValidIdentifier)('foo42')).toBe(true);
    expect((0, tscodegen_1.isValidIdentifier)('_Foo')).toBe(true);
  });
  it('should return false for invalid identifiers', () => {
    expect((0, tscodegen_1.isValidIdentifier)('')).toBe(false);
    expect((0, tscodegen_1.isValidIdentifier)('42foo')).toBe(false);
    expect((0, tscodegen_1.isValidIdentifier)('foo bar')).toBe(false);
    expect((0, tscodegen_1.isValidIdentifier)('foo bar')).toBe(false);
  });
});
describe('createMethod', () => {
  it('should generate a method', () => {
    (0, tscodegen_1.printNode)((0, tscodegen_1.createMethod)('foo'));
  });
});
//# sourceMappingURL=tscodegen.test.js.map
