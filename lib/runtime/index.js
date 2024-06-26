'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
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
var __rest =
  (this && this.__rest) ||
  function (s, e) {
    var t = {};
    for (var p in s)
      if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === 'function')
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (
          e.indexOf(p[i]) < 0 &&
          Object.prototype.propertyIsEnumerable.call(s, p[i])
        )
          t[p[i]] = s[p[i]];
      }
    return t;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.runtime = void 0;
const qs = __importStar(require('./query'));
const util_1 = require('./util');
const __1 = require('../');
function runtime(defaults) {
  function fetchText(url, req) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield doFetch(url, req);
      let data;
      try {
        data = yield res.text();
      } catch (err) {}
      return {
        status: res.status,
        contentType: res.headers.get('content-type'),
        data,
      };
    });
  }
  function fetchJson(url, req = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const { status, contentType, data } = yield fetchText(
        url,
        Object.assign(Object.assign({}, req), {
          headers: Object.assign(Object.assign({}, req.headers), {
            Accept: 'application/json',
          }),
        }),
      );
      const jsonTypes = ['application/json', 'application/hal+json'];
      const isJson = contentType
        ? jsonTypes.some((mimeType) => contentType.includes(mimeType))
        : false;
      if (isJson) {
        return { status, data: data ? JSON.parse(data) : null };
      }
      return { status, data };
    });
  }
  function fetchBlob(url, req = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const res = yield doFetch(url, req);
      let data;
      try {
        data = yield res.blob();
      } catch (err) {}
      return { status: res.status, data };
    });
  }
  function doFetch(url, req = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const _a = Object.assign(Object.assign({}, defaults), req),
        { baseUrl, headers, fetch: customFetch } = _a,
        init = __rest(_a, ['baseUrl', 'headers', 'fetch']);
      const href = (0, util_1.joinUrl)(baseUrl, url);
      const res = yield (customFetch || fetch)(
        href,
        Object.assign(Object.assign({}, init), {
          headers: (0, util_1.stripUndefined)(
            Object.assign(Object.assign({}, defaults.headers), headers),
          ),
        }),
      );
      return res;
    });
  }
  return {
    ok: __1.ok,
    fetchText,
    fetchJson,
    fetchBlob,
    json(_a) {
      var { body, headers } = _a,
        req = __rest(_a, ['body', 'headers']);
      return Object.assign(
        Object.assign(
          Object.assign({}, req),
          body && { body: JSON.stringify(body) },
        ),
        {
          headers: Object.assign(Object.assign({}, headers), {
            'Content-Type': 'application/json',
          }),
        },
      );
    },
    form(_a) {
      var { body, headers } = _a,
        req = __rest(_a, ['body', 'headers']);
      return Object.assign(
        Object.assign(Object.assign({}, req), body && { body: qs.form(body) }),
        {
          headers: Object.assign(Object.assign({}, headers), {
            'Content-Type': 'application/x-www-form-urlencoded',
          }),
        },
      );
    },
    multipart(_a) {
      var { body } = _a,
        req = __rest(_a, ['body']);
      if (!body) return req;
      const data = new (defaults.formDataConstructor ||
        req.formDataConstructor ||
        FormData)();
      Object.entries(body).forEach(([name, value]) => {
        data.append(name, value);
      });
      return Object.assign(Object.assign({}, req), { body: data });
    },
  };
}
exports.runtime = runtime;
//# sourceMappingURL=index.js.map
