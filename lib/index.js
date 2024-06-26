'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.HttpError =
  exports.optimistic =
  exports.okify =
  exports.ok =
  exports.handle =
    void 0;
/**
 * Utility function to handle different status codes.
 *
 * Example:
 *
 * const userId = await handle(api.register({ email, password }), {
 *   200: (user: User) => user.id,
 *   400: (err: string) => console.log(err),
 * })
 **/
function handle(promise, handler) {
  return __awaiter(this, void 0, void 0, function* () {
    const { status, data } = yield promise;
    const statusHandler = handler[status];
    if (statusHandler) return statusHandler(data);
    if (handler.default) return handler.default(status, data);
    throw new HttpError(status, data);
  });
}
exports.handle = handle;
const SUCCESS_CODES = [200, 201, 202, 204];
/**
 * Utility function to directly return any successful response
 * and throw a HttpError otherwise.
 *
 * Example:
 *
 * try {
 *   const userId = await ok(api.register({ email, password }));
 * }
 * catch (err) {
 *   console.log(err.status)
 * }
 */
function ok(promise) {
  return __awaiter(this, void 0, void 0, function* () {
    const res = yield promise;
    if (SUCCESS_CODES.some((s) => s == res.status)) return res.data;
    throw new HttpError(res.status, res.data);
  });
}
exports.ok = ok;
/**
 * Utility function to wrap an API function with `ok(...)`.
 */
function okify(fn) {
  return (...args) => ok(fn(...args));
}
exports.okify = okify;
/**
 * Utility to `okify` each function of an API.
 */
function optimistic(api) {
  const okApi = {};
  Object.entries(api).forEach(([key, value]) => {
    okApi[key] = typeof value === 'function' ? okify(value) : value;
  });
  return okApi;
}
exports.optimistic = optimistic;
class HttpError extends Error {
  constructor(status, data) {
    super(`Error: ${status}`);
    this.status = status;
    this.data = data;
  }
}
exports.HttpError = HttpError;
//# sourceMappingURL=index.js.map
