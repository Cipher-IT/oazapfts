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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateSource =
  exports.printAst =
  exports.generateAst =
  exports.cg =
    void 0;
const cg = __importStar(require('./tscodegen'));
exports.cg = cg;
const generate_1 = __importDefault(require('./generate'));
const swagger_parser_1 = __importDefault(
  require('@apidevtools/swagger-parser'),
);
const swagger2openapi_1 = __importDefault(require('swagger2openapi'));
function generateAst(spec, opts, isConverted) {
  return new generate_1.default(spec, opts, isConverted).generateApi();
}
exports.generateAst = generateAst;
function printAst(ast) {
  return cg.printFile(ast);
}
exports.printAst = printAst;
function generateSource(spec, opts) {
  return __awaiter(this, void 0, void 0, function* () {
    let v3Doc;
    const doc = yield swagger_parser_1.default.bundle(spec);
    const isOpenApiV3 = 'openapi' in doc && doc.openapi.startsWith('3');
    if (isOpenApiV3) {
      v3Doc = doc;
    } else {
      const result = yield swagger2openapi_1.default.convertObj(doc, {});
      v3Doc = result.openapi;
    }
    const ast = generateAst(v3Doc, opts, !isOpenApiV3);
    const { title, version } = v3Doc.info;
    const preamble = ['$&', title, version].filter(Boolean).join('\n * ');
    const src = printAst(ast);
    return src.replace(/^\/\*\*/, preamble);
  });
}
exports.generateSource = generateSource;
//# sourceMappingURL=index.js.map
