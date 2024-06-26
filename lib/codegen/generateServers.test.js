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
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const generateServers_1 = __importDefault(require('./generateServers'));
const cg = __importStar(require('./tscodegen'));
describe('generateServer', () => {
  it('creates an object with servers', () => {
    const servers = (0, generateServers_1.default)([
      { url: 'http://example.org' },
    ]);
    expect(cg.printNode(servers)).toMatchInlineSnapshot(`
      "{
          server1: \\"http://example.org\\"
      }"
    `);
  });
  it('uses the description as name', () => {
    const servers = (0, generateServers_1.default)([
      { url: 'http://example.org', description: 'Super API' },
      { url: 'http://example.org/2' },
    ]);
    expect(cg.printNode(servers)).toMatchInlineSnapshot(`
      "{
          superApi: \\"http://example.org\\",
          server2: \\"http://example.org/2\\"
      }"
    `);
  });
  it('supports variables', () => {
    const servers = (0, generateServers_1.default)([
      {
        variables: {
          tld: {
            enum: ['org', 'com'],
            default: 'org',
          },
          path: {
            default: '',
          },
        },
        url: 'http://example.{tld}/{path}',
      },
    ]);
    expect(cg.printNode(servers)).toMatchInlineSnapshot(`
      "{
          server1: ({ tld = \\"org\\", path = \\"\\" }: {
              tld: \\"org\\" | \\"com\\";
              path: string | number | boolean;
          }) => \`http://example.\${tld}/\${path}\`
      }"
    `);
  });
});
//# sourceMappingURL=generateServers.test.js.map
