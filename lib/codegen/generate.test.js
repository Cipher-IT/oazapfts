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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const generate_1 = require('./generate');
const index_1 = require('./index');
const swagger_parser_1 = __importDefault(
  require('@apidevtools/swagger-parser'),
);
const generate_2 = __importDefault(require('./generate'));
describe('getOperationName', () => {
  it('should use the id', () => {
    expect(
      (0, generate_1.getOperationName)('GET', '/pets', 'list pets'),
    ).toEqual('listPets');
  });
  it('should use the verb and path', () => {
    expect(
      (0, generate_1.getOperationName)('GET', '/pets/{color}/{status}'),
    ).toEqual('getPetsByColorAndStatus');
  });
  it('should not use ids with special chars', () => {
    expect(
      (0, generate_1.getOperationName)(
        'GET',
        '/pets',
        'API\\PetController::listPetAction',
      ),
    ).toEqual('getPets');
  });
});
describe('generate', () => {
  let artefact;
  let spec;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      spec = yield swagger_parser_1.default.bundle(
        __dirname + '/../../demo/petstore.json',
      );
    }),
  );
  it('should generate an api', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      artefact = (0, index_1.printAst)(
        new generate_2.default(spec).generateApi(),
      );
    }));
  /* https://github.com/cotype/build-client/issues/5 */
  it('should generate same api a second time', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      expect(
        (0, index_1.printAst)(new generate_2.default(spec).generateApi()),
      ).toBe(artefact);
    }));
});
describe('generate with blob download', () => {
  let spec;
  beforeAll(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      spec = yield swagger_parser_1.default.bundle(
        __dirname + '/../../demo/binary.json',
      );
    }),
  );
  it('should generate an api using fetchBlob', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const artefact = (0, index_1.printAst)(
        new generate_2.default(spec).generateApi(),
      );
      const oneLine = artefact.replace(/\s+/g, ' ');
      expect(oneLine).toContain(
        'return oazapfts.fetchBlob<{ status: 200; data: Blob; }>(`/file/${fileId}/download`, { ...opts });',
      );
    }));
});
//# sourceMappingURL=generate.test.js.map
