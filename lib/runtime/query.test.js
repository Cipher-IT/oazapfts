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
Object.defineProperty(exports, '__esModule', { value: true });
const qs = __importStar(require('./query'));
describe('delimited', () => {
  it('should use commas', () => {
    expect(qs.form({ id: [3, 4, 5] })).toEqual('id=3,4,5');
  });
  it('should use pipes', () => {
    expect(qs.pipe({ id: [3, 4, 5] })).toEqual('id=3|4|5');
  });
  it('should use spaces', () => {
    expect(qs.space({ id: [3, 4, 5] })).toEqual('id=3%204%205');
  });
  it('should enumerate entries', () => {
    expect(qs.form({ author: { firstName: 'Felix', role: 'admin' } })).toEqual(
      'author=firstName,Felix,role,admin',
    );
  });
  it('should omit undefined values', () => {
    expect(qs.form({ id: 23, foo: undefined })).toEqual('id=23');
  });
  it('should keep zeros', () => {
    expect(qs.form({ id: 0 })).toEqual('id=0');
  });
});
describe('explode', () => {
  it('should explode arrays', () => {
    expect(qs.explode({ id: [3, 4, 5] })).toEqual('id=3&id=4&id=5');
  });
  it('should explode objects', () => {
    expect(
      qs.explode({ author: { firstName: 'Felix', role: 'admin' } }),
    ).toEqual('firstName=Felix&role=admin');
  });
  it('should omit undefined values', () => {
    expect(qs.explode({ id: 23, foo: undefined })).toEqual('id=23');
  });
});
describe('deep', () => {
  it('should serialize objects', () => {
    expect(qs.deep({ author: { firstName: 'Felix', role: 'admin' } })).toEqual(
      'author[firstName]=Felix&author[role]=admin',
    );
  });
  it('should serialize nested objects', () => {
    expect(
      qs.deep({ author: { name: { first: 'Felix', last: 'Gnass' } } }),
    ).toEqual('author[name][first]=Felix&author[name][last]=Gnass');
  });
  it('should omit undefined values', () => {
    expect(qs.deep({ author: { name: 'Felix', role: undefined } })).toEqual(
      'author[name]=Felix',
    );
  });
  it('should serialize nested arrays', () => {
    expect(qs.deep({ names: ['Felix', 'Dario'] })).toEqual(
      'names[]=Felix&names[]=Dario',
    );
  });
});
describe('query', () => {
  it('should return an empty string', () => {
    expect(qs.query()).toEqual('');
  });
  it('should add a leading questionmark', () => {
    expect(qs.query('foo=bar')).toEqual('?foo=bar');
  });
  it('should join multiple params', () => {
    expect(qs.query('foo=bar', 'boo=baz')).toEqual('?foo=bar&boo=baz');
  });
});
//# sourceMappingURL=query.test.js.map
