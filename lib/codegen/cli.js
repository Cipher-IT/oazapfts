#!/usr/bin/env node
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
const fs_1 = __importDefault(require('fs'));
const minimist_1 = __importDefault(require('minimist'));
const _1 = require('./');
const argv = (0, minimist_1.default)(process.argv.slice(2), {
  alias: {
    i: 'include',
    e: 'exclude',
  },
  boolean: ['optimistic'],
});
function generate(spec, dest, opts) {
  return __awaiter(this, void 0, void 0, function* () {
    const code = yield (0, _1.generateSource)(spec, opts);
    if (dest) fs_1.default.writeFileSync(dest, code);
    else console.log(code);
  });
}
const { include, exclude, optimistic } = argv;
const [spec, dest] = argv._;
if (!spec) {
  console.error(`
    Usage:
    oazapfts <spec> [filename]

    Options:
    --exclude, -e <tag to exclude>
    --include, -i <tag to include>
    --optimistic
`);
  process.exit(1);
}
generate(spec, dest, {
  include,
  exclude,
  optimistic,
});
//# sourceMappingURL=cli.js.map
