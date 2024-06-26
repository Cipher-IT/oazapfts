'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.space =
  exports.pipe =
  exports.form =
  exports.explode =
  exports.deep =
  exports.query =
    void 0;
const util_1 = require('./util');
/**
 * Join params using an ampersand and prepends a questionmark if not empty.
 */
function query(...params) {
  const s = params.join('&');
  return s && `?${s}`;
}
exports.query = query;
/**
 * Serializes nested objects according to the `deepObject` style specified in
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#style-values
 */
function deep(params, [k, v] = util_1.encodeReserved) {
  const qk = (0, util_1.encode)([(s) => s, k]);
  const qv = (0, util_1.encode)([(s) => s, v]);
  // don't add index to arrays
  // https://github.com/expressjs/body-parser/issues/289
  const visit = (obj, prefix = '') =>
    Object.entries(obj)
      .filter(([, v]) => v !== undefined)
      .map(([prop, v]) => {
        const index = Array.isArray(obj) ? '' : prop;
        const key = prefix ? qk`${prefix}[${index}]` : prop;
        if (typeof v === 'object') {
          return visit(v, key);
        }
        return qv`${key}=${v}`;
      })
      .join('&');
  return visit(params);
}
exports.deep = deep;
/**
 * Property values of type array or object generate separate parameters
 * for each value of the array, or key-value-pair of the map.
 * For other types of properties this property has no effect.
 * See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#encoding-object
 */
function explode(params, encoders = util_1.encodeReserved) {
  const q = (0, util_1.encode)(encoders);
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([name, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => q`${name}=${v}`).join('&');
      }
      if (typeof value === 'object') {
        return explode(value, encoders);
      }
      return q`${name}=${value}`;
    })
    .join('&');
}
exports.explode = explode;
exports.form = (0, util_1.delimited)();
exports.pipe = (0, util_1.delimited)('|');
exports.space = (0, util_1.delimited)('%20');
//# sourceMappingURL=query.js.map
