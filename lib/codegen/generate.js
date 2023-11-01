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
exports.supportDeepObjects =
  exports.callOazapftsFunction =
  exports.callQsFunction =
  exports.createUrlExpression =
  exports.getReferenceName =
  exports.getReference =
  exports.isReference =
  exports.isNullable =
  exports.getOperationName =
  exports.getOperationIdentifier =
  exports.getFormatter =
  exports.contentTypes =
  exports.verbs =
    void 0;
const lodash_1 = __importDefault(require('lodash'));
const typescript_1 = __importStar(require('typescript'));
const path_1 = __importDefault(require('path'));
const cg = __importStar(require('./tscodegen'));
const generateServers_1 = __importStar(require('./generateServers'));
exports.verbs = [
  'GET',
  'PUT',
  'POST',
  'DELETE',
  'OPTIONS',
  'HEAD',
  'PATCH',
  'TRACE',
];
exports.contentTypes = {
  '*/*': 'json',
  'application/json': 'json',
  'application/hal+json': 'json',
  'application/x-www-form-urlencoded': 'form',
  'multipart/form-data': 'multipart',
};
/**
 * Get the name of a formatter function for a given parameter.
 */
function getFormatter({ style, explode }) {
  if (style === 'spaceDelimited') return 'space';
  if (style === 'pipeDelimited') return 'pipe';
  if (style === 'deepObject') return 'deep';
  return explode ? 'explode' : 'form';
}
exports.getFormatter = getFormatter;
function getOperationIdentifier(id) {
  if (!id) return;
  if (id.match(/[^\w\s]/)) return;
  id = lodash_1.default.camelCase(id);
  if (cg.isValidIdentifier(id)) return id;
}
exports.getOperationIdentifier = getOperationIdentifier;
/**
 * Create a method name for a given operation, either from its operationId or
 * the HTTP verb and path.
 */
function getOperationName(verb, path, operationId) {
  const id = getOperationIdentifier(operationId);
  if (id) return id;
  path = path.replace(/\{(.+?)\}/, 'by $1').replace(/\{(.+?)\}/, 'and $1');
  return lodash_1.default.camelCase(`${verb} ${path}`);
}
exports.getOperationName = getOperationName;
function isNullable(schema) {
  return !!(schema && schema.nullable);
}
exports.isNullable = isNullable;
function isReference(obj) {
  return obj && '$ref' in obj;
}
exports.isReference = isReference;
//See https://swagger.io/docs/specification/using-ref/
function getReference(spec, ref) {
  const path = ref
    .slice(2)
    .split('/')
    .map((s) => unescape(s.replace(/~1/g, '/').replace(/~0/g, '~')));
  const ret = lodash_1.default.get(spec, path);
  if (typeof ret === 'undefined') {
    throw new Error(`Can't find ${path}`);
  }
  return ret;
}
exports.getReference = getReference;
/**
 * If the given object is a ReferenceObject, return the last part of its path.
 */
function getReferenceName(obj) {
  if (isReference(obj)) {
    return lodash_1.default.camelCase(obj.$ref.split('/').slice(-1)[0]);
  }
}
exports.getReferenceName = getReferenceName;
/**
 * Create a template string literal from the given OpenAPI urlTemplate.
 * Curly braces in the path are turned into identifier expressions,
 * which are read from the local scope during runtime.
 */
function createUrlExpression(path, qs) {
  const spans = [];
  // Use a replacer function to collect spans as a side effect:
  const head = path.replace(
    /(.*?)\{(.+?)\}(.*?)(?=\{|$)/g,
    (_substr, head, name, literal) => {
      const expression = lodash_1.default.camelCase(name);
      spans.push({
        expression: typescript_1.factory.createIdentifier(expression),
        literal,
      });
      return head;
    },
  );
  if (qs) {
    // add the query string as last span
    spans.push({ expression: qs, literal: '' });
  }
  return cg.createTemplateString(head, spans);
}
exports.createUrlExpression = createUrlExpression;
/**
 * Create a call expression for one of the QS runtime functions.
 */
function callQsFunction(name, args) {
  return cg.createCall(
    typescript_1.factory.createPropertyAccessExpression(
      typescript_1.factory.createIdentifier('QS'),
      name,
    ),
    { args },
  );
}
exports.callQsFunction = callQsFunction;
/**
 * Create a call expression for one of the oazapfts runtime functions.
 */
function callOazapftsFunction(name, args, typeArgs) {
  return cg.createCall(
    typescript_1.factory.createPropertyAccessExpression(
      typescript_1.factory.createIdentifier('oazapfts'),
      name,
    ),
    { args, typeArgs },
  );
}
exports.callOazapftsFunction = callOazapftsFunction;
/**
 * Despite its name, OpenApi's `deepObject` serialization does not support
 * deeply nested objects. As a workaround we detect parameters that contain
 * square brackets and merge them into a single object.
 */
function supportDeepObjects(params) {
  const res = [];
  const merged = {};
  params.forEach((p) => {
    const m = /^(.+?)\[(.*?)\]/.exec(p.name);
    if (!m) {
      res.push(p);
      return;
    }
    const [, name, prop] = m;
    let obj = merged[name];
    if (!obj) {
      obj = merged[name] = {
        name,
        in: p.in,
        style: 'deepObject',
        schema: {
          type: 'object',
          properties: {},
        },
      };
      res.push(obj);
    }
    obj.schema.properties[prop] = p.schema;
  });
  return res;
}
exports.supportDeepObjects = supportDeepObjects;
/**
 * Main entry point that generates TypeScript code from a given API spec.
 */
class ApiGenerator {
  constructor(
    spec,
    opts = {},
    /** Indicates if the document was converted from an older version of the OpenAPI specification. */
    isConverted = false,
  ) {
    this.spec = spec;
    this.opts = opts;
    this.isConverted = isConverted;
    this.aliases = [];
    // Collect the types of all referenced schemas so we can export them later
    this.refs = {};
    // Keep track of already used type aliases
    this.typeAliases = {};
  }
  reset() {
    this.aliases = [];
    this.refs = {};
    this.typeAliases = {};
  }
  resolve(obj) {
    if (!isReference(obj)) return obj;
    const ref = obj.$ref;
    if (!ref.startsWith('#/')) {
      throw new Error(
        `External refs are not supported (${ref}). Make sure to call SwaggerParser.bundle() first.`,
      );
    }
    return getReference(this.spec, ref);
  }
  resolveArray(array) {
    return array ? array.map((el) => this.resolve(el)) : [];
  }
  skip(tags) {
    var _a;
    const excluded =
      tags &&
      tags.some((t) => {
        var _a, _b;
        return (_b =
          (_a = this.opts) === null || _a === void 0 ? void 0 : _a.exclude) ===
          null || _b === void 0
          ? void 0
          : _b.includes(t);
      });
    if (excluded) {
      return true;
    }
    if ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.include) {
      const included =
        tags &&
        tags.some((t) => {
          var _a;
          return (_a = this.opts.include) === null || _a === void 0
            ? void 0
            : _a.includes(t);
        });
      return !included;
    }
    return false;
  }
  getUniqueAlias(name) {
    let used = this.typeAliases[name] || 0;
    if (used) {
      this.typeAliases[name] = ++used;
      name += used;
    }
    this.typeAliases[name] = 1;
    return name;
  }
  getRefBasename(ref) {
    return ref.replace(/.+\//, '');
  }
  /**
   * Create a type alias for the schema referenced by the given ReferenceObject
   */
  getRefAlias(obj) {
    const { $ref } = obj;
    let ref = this.refs[$ref];
    if (!ref) {
      const schema = this.resolve(obj);
      const name = this.getUniqueAlias(
        lodash_1.default.upperFirst(
          lodash_1.default.camelCase(schema.title || this.getRefBasename($ref)),
        ),
      );
      ref = this.refs[$ref] = typescript_1.factory.createTypeReferenceNode(
        name,
        undefined,
      );
      const type = this.getTypeFromSchema(schema);
      this.aliases.push(
        cg.createTypeAliasDeclaration({
          modifiers: [cg.modifier.export],
          name,
          type,
        }),
      );
    }
    return ref;
  }
  getUnionType(variants, discriminator) {
    if (discriminator) {
      // oneOf + discriminator -> tagged union (polymorphism)
      if (discriminator.propertyName === undefined) {
        throw new Error('Discriminators require a propertyName');
      }
      // By default, the last component of the ref name (i.e., after the last trailing slash) is
      // used as the discriminator value for each variant. This can be overridden using the
      // discriminator.mapping property.
      const mappedValues = new Set(
        Object.values(discriminator.mapping || {}).map((ref) =>
          this.getRefBasename(ref),
        ),
      );
      return typescript_1.factory.createUnionTypeNode(
        [
          ...Object.entries(discriminator.mapping || {}).map(
            ([discriminatorValue, variantRef]) => [
              discriminatorValue,
              { $ref: variantRef },
            ],
          ),
          ...variants
            .filter((variant) => {
              if (!isReference(variant)) {
                // From the Swagger spec: "When using the discriminator, inline schemas will not be
                // considered."
                throw new Error(
                  'Discriminators require references, not inline schemas',
                );
              }
              return !mappedValues.has(this.getRefBasename(variant.$ref));
            })
            .map((schema) => [this.getRefBasename(schema.$ref), schema]),
        ].map(([discriminatorValue, variant]) =>
          // Yields: { [discriminator.propertyName]: discriminatorValue } & variant
          typescript_1.factory.createIntersectionTypeNode([
            typescript_1.factory.createTypeLiteralNode([
              cg.createPropertySignature({
                name: discriminator.propertyName,
                type: typescript_1.factory.createLiteralTypeNode(
                  typescript_1.factory.createStringLiteral(discriminatorValue),
                ),
              }),
            ]),
            this.getTypeFromSchema(variant),
          ]),
        ),
      );
    } else {
      // oneOf -> untagged union
      return typescript_1.factory.createUnionTypeNode(
        variants.map((schema) => this.getTypeFromSchema(schema)),
      );
    }
  }
  /**
   * Creates a type node from a given schema.
   * Delegates to getBaseTypeFromSchema internally and
   * optionally adds a union with null.
   */
  getTypeFromSchema(schema) {
    const type = this.getBaseTypeFromSchema(schema);
    return isNullable(schema)
      ? typescript_1.factory.createUnionTypeNode([type, cg.keywordType.null])
      : type;
  }
  /**
   * This is the very core of the OpenAPI to TS conversion - it takes a
   * schema and returns the appropriate type.
   */
  getBaseTypeFromSchema(schema) {
    if (!schema) return cg.keywordType.any;
    if (isReference(schema)) {
      return this.getRefAlias(schema);
    }
    if (schema.oneOf) {
      // oneOf -> union
      return this.getUnionType(schema.oneOf, schema.discriminator);
    }
    if (schema.anyOf) {
      // anyOf -> union
      return typescript_1.factory.createUnionTypeNode(
        schema.anyOf.map((schema) => this.getTypeFromSchema(schema)),
      );
    }
    if (schema.allOf) {
      // allOf -> intersection
      let result = schema.allOf.map((schema) => this.getTypeFromSchema(schema));
      if (schema.properties || schema.additionalProperties) {
        result.push(
          this.getTypeFromProperties(
            schema.properties || {},
            schema.required,
            schema.additionalProperties,
          ),
        );
      }
      return typescript_1.factory.createIntersectionTypeNode(result);
    }
    if ('items' in schema) {
      // items -> array
      return typescript_1.factory.createArrayTypeNode(
        this.getTypeFromSchema(schema.items),
      );
    }
    if (schema.properties || schema.additionalProperties) {
      // properties -> literal type
      return this.getTypeFromProperties(
        schema.properties || {},
        schema.required,
        schema.additionalProperties,
      );
    }
    if (schema.enum) {
      // enum -> union of literal types
      const types = schema.enum.map((s) => {
        if (s === null) return cg.keywordType.null;
        if (typeof s === 'boolean')
          return s
            ? typescript_1.factory.createLiteralTypeNode(
                typescript_1.default.factory.createToken(
                  typescript_1.default.SyntaxKind.TrueKeyword,
                ),
              )
            : typescript_1.factory.createLiteralTypeNode(
                typescript_1.default.factory.createToken(
                  typescript_1.default.SyntaxKind.FalseKeyword,
                ),
              );
        if (typeof s === 'number')
          return typescript_1.factory.createLiteralTypeNode(
            typescript_1.factory.createNumericLiteral(s),
          );
        return typescript_1.factory.createLiteralTypeNode(
          typescript_1.factory.createStringLiteral(s),
        );
      });
      return types.length > 1
        ? typescript_1.factory.createUnionTypeNode(types)
        : types[0];
    }
    if (schema.format == 'binary') {
      return typescript_1.factory.createTypeReferenceNode('Blob', []);
    }
    if (schema.type) {
      // string, boolean, null, number
      if (schema.type in cg.keywordType) return cg.keywordType[schema.type];
      if (schema.type === 'integer') return cg.keywordType.number;
    }
    return cg.keywordType.any;
  }
  /**
   * Recursively creates a type literal with the given props.
   */
  getTypeFromProperties(props, required, additionalProperties) {
    const members = Object.keys(props).map((name) => {
      const schema = props[name];
      const isRequired = required && required.includes(name);
      let type = this.getTypeFromSchema(schema);
      if (!isRequired && this.opts.unionUndefined) {
        type = typescript_1.factory.createUnionTypeNode([
          type,
          cg.keywordType.undefined,
        ]);
      }
      const nullable = isNullable(schema);
      return cg.createPropertySignature({
        questionToken: !isRequired && nullable,
        name,
        type,
      });
    });
    if (additionalProperties) {
      const type =
        additionalProperties === true
          ? cg.keywordType.any
          : this.getTypeFromSchema(additionalProperties);
      members.push(cg.createIndexSignature(type));
    }
    return typescript_1.factory.createTypeLiteralNode(members);
  }
  getTypeFromResponses(responses) {
    return typescript_1.factory.createUnionTypeNode(
      Object.entries(responses).map(([code, res]) => {
        const statusType =
          code === 'default'
            ? cg.keywordType.number
            : typescript_1.factory.createLiteralTypeNode(
                typescript_1.factory.createNumericLiteral(code),
              );
        const props = [
          cg.createPropertySignature({
            name: 'status',
            type: statusType,
          }),
        ];
        const dataType = this.getTypeFromResponse(res);
        if (dataType !== cg.keywordType.void) {
          props.push(
            cg.createPropertySignature({
              name: 'data',
              type: dataType,
            }),
          );
        }
        return typescript_1.factory.createTypeLiteralNode(props);
      }),
    );
  }
  getTypeFromResponse(resOrRef) {
    const res = this.resolve(resOrRef);
    if (!res || !res.content) return cg.keywordType.void;
    return this.getTypeFromSchema(this.getSchemaFromContent(res.content));
  }
  getResponseType(responses) {
    // backwards-compatibility
    if (!responses) return 'text';
    const resolvedResponses = Object.values(responses).map((response) =>
      this.resolve(response),
    );
    // if no content is specified, assume `text` (backwards-compatibility)
    if (
      !resolvedResponses.some((res) => {
        var _a;
        return (
          Object.keys((_a = res.content) !== null && _a !== void 0 ? _a : [])
            .length > 0
        );
      })
    ) {
      return 'text';
    }
    const isJson = resolvedResponses.some((response) => {
      var _a;
      const responseMimeTypes = Object.keys(
        (_a = response.content) !== null && _a !== void 0 ? _a : {},
      );
      return responseMimeTypes.some(
        (mimeType) => exports.contentTypes[mimeType] === 'json',
      );
    });
    // if there’s `application/json` or `*/*`, assume `json`
    if (isJson) {
      return 'json';
    }
    // if there’s `text/*`, assume `text`
    if (
      resolvedResponses.some((res) => {
        var _a;
        return Object.keys(
          (_a = res.content) !== null && _a !== void 0 ? _a : [],
        ).some((type) => type.startsWith('text/'));
      })
    ) {
      return 'text';
    }
    // for the rest, assume `blob`
    return 'blob';
  }
  getSchemaFromContent(content) {
    const contentType = Object.keys(exports.contentTypes).find(
      (t) => t in content,
    );
    let schema;
    if (contentType) {
      schema = lodash_1.default.get(content, [contentType, 'schema']);
    }
    if (schema) {
      return schema;
    }
    // if no content is specified -> string
    // `text/*` -> string
    if (
      Object.keys(content).length === 0 ||
      Object.keys(content).some((type) => type.startsWith('text/'))
    ) {
      return { type: 'string' };
    }
    // rest (e.g. `application/octet-stream`, `application/gzip`, …) -> binary
    return { type: 'string', format: 'binary' };
  }
  wrapResult(ex) {
    var _a;
    return ((_a = this.opts) === null || _a === void 0 ? void 0 : _a.optimistic)
      ? callOazapftsFunction('ok', [ex])
      : ex;
  }
  generateApi() {
    this.reset();
    // Parse ApiStub.ts so that we don't have to generate everything manually
    const stub = cg.parseFile(
      path_1.default.resolve(__dirname, '../../src/codegen/ApiStub.ts'),
    );
    // ApiStub contains `const servers = {}`, find it ...
    const servers = cg.findFirstVariableDeclaration(stub.statements, 'servers');
    // servers.initializer is readonly, this might break in a future TS version, but works fine for now.
    Object.assign(servers, {
      initializer: (0, generateServers_1.default)(this.spec.servers || []),
    });
    const { initializer } = cg.findFirstVariableDeclaration(
      stub.statements,
      'defaults',
    );
    if (
      !initializer ||
      !typescript_1.default.isObjectLiteralExpression(initializer)
    ) {
      throw new Error('No object literal: defaults');
    }
    cg.changePropertyValue(
      initializer,
      'baseUrl',
      (0, generateServers_1.defaultBaseUrl)(this.spec.servers || []),
    );
    // Collect class functions to be added...
    const functions = [];
    // Keep track of names to detect duplicates
    const names = {};
    Object.keys(this.spec.paths).forEach((path) => {
      const item = this.spec.paths[path];
      if (!item) {
        return;
      }
      Object.keys(this.resolve(item)).forEach((verb) => {
        const method = verb.toUpperCase();
        // skip summary/description/parameters etc...
        if (!exports.verbs.includes(method)) return;
        const op = item[verb];
        const {
          operationId,
          requestBody,
          responses,
          summary,
          description,
          tags,
        } = op;
        if (this.skip(tags)) {
          return;
        }
        let name = getOperationName(verb, path, operationId);
        const count = (names[name] = (names[name] || 0) + 1);
        if (count > 1) {
          // The name is already taken, which means that the spec is probably
          // invalid as operationIds must be unique. Since this is quite common
          // nevertheless we append a counter:
          name += count;
        }
        // merge item and op parameters
        const resolvedParameters = [
          ...this.resolveArray(item.parameters),
          ...this.resolveArray(op.parameters),
        ];
        // expand older OpenAPI parameters into deepObject style where needed
        const parameters = this.isConverted
          ? supportDeepObjects(resolvedParameters)
          : resolvedParameters;
        // split into required/optional
        const [required, optional] = lodash_1.default.partition(
          parameters,
          'required',
        );
        // convert parameter names to argument names ...
        const argNames = {};
        parameters
          .map((p) => p.name)
          .sort((a, b) => a.length - b.length)
          .forEach((name) => {
            argNames[name] = lodash_1.default.camelCase(name);
          });
        // build the method signature - first all the required parameters
        const methodParams = required.map((p) =>
          cg.createParameter(argNames[this.resolve(p).name], {
            type: this.getTypeFromSchema(isReference(p) ? p : p.schema),
          }),
        );
        let body;
        let bodyVar;
        // add body if present
        if (requestBody) {
          body = this.resolve(requestBody);
          const schema = this.getSchemaFromContent(body.content);
          const type = this.getTypeFromSchema(schema);
          bodyVar = lodash_1.default.camelCase(
            type.name || getReferenceName(schema) || 'body',
          );
          methodParams.push(
            cg.createParameter(bodyVar, {
              type,
              questionToken: !body.required,
            }),
          );
        }
        // add an object with all optional parameters
        if (optional.length) {
          methodParams.push(
            cg.createParameter(
              cg.createObjectBinding(
                optional
                  .map((param) => this.resolve(param))
                  .map(({ name }) => ({ name: argNames[name] })),
              ),
              {
                initializer:
                  typescript_1.factory.createObjectLiteralExpression(),
                type: typescript_1.factory.createTypeLiteralNode(
                  optional.map((p) =>
                    cg.createPropertySignature({
                      name: argNames[this.resolve(p).name],
                      questionToken: true,
                      type: this.getTypeFromSchema(
                        isReference(p) ? p : p.schema,
                      ),
                    }),
                  ),
                ),
              },
            ),
          );
        }
        methodParams.push(
          cg.createParameter('opts', {
            type: typescript_1.factory.createTypeReferenceNode(
              'Oazapfts.RequestOpts',
              undefined,
            ),
            questionToken: true,
          }),
        );
        // Next, build the method body...
        const returnType = this.getResponseType(responses);
        const query = parameters.filter((p) => p.in === 'query');
        const header = parameters
          .filter((p) => p.in === 'header')
          .map((p) => p.name);
        let qs;
        if (query.length) {
          const paramsByFormatter = lodash_1.default.groupBy(
            query,
            getFormatter,
          );
          qs = callQsFunction(
            'query',
            Object.entries(paramsByFormatter).map(([format, params]) => {
              //const [allowReserved, encodeReserved] = _.partition(params, "allowReserved");
              return callQsFunction(format, [
                cg.createObjectLiteral(
                  params.map((p) => [p.name, argNames[p.name]]),
                ),
              ]);
            }),
          );
        }
        const url = createUrlExpression(path, qs);
        const init = [
          typescript_1.factory.createSpreadAssignment(
            typescript_1.factory.createIdentifier('opts'),
          ),
        ];
        if (method !== 'GET') {
          init.push(
            typescript_1.factory.createPropertyAssignment(
              'method',
              typescript_1.factory.createStringLiteral(method),
            ),
          );
        }
        if (bodyVar) {
          init.push(
            cg.createPropertyAssignment(
              'data',
              typescript_1.factory.createIdentifier(bodyVar),
            ),
          );
        }
        if (header.length) {
          init.push(
            typescript_1.factory.createPropertyAssignment(
              'headers',
              typescript_1.factory.createObjectLiteralExpression(
                [
                  typescript_1.factory.createSpreadAssignment(
                    typescript_1.factory.createLogicalAnd(
                      typescript_1.factory.createIdentifier('opts'),
                      typescript_1.factory.createPropertyAccessExpression(
                        typescript_1.factory.createIdentifier('opts'),
                        'headers',
                      ),
                    ),
                  ),
                  ...header.map((name) =>
                    cg.createPropertyAssignment(
                      name,
                      typescript_1.factory.createIdentifier(argNames[name]),
                    ),
                  ),
                ],
                true,
              ),
            ),
          );
        }
        const args = [url];
        if (init.length) {
          const m = Object.entries(exports.contentTypes).find(([type]) => {
            return !!lodash_1.default.get(body, ['content', type]);
          });
          const initObj = typescript_1.factory.createObjectLiteralExpression(
            init,
            true,
          );
          args.push(m ? callOazapftsFunction(m[1], [initObj]) : initObj); // json, form, multipart
        }
        functions.push(
          cg.addComment(
            cg.createFunctionDeclaration(
              name,
              {
                modifiers: [cg.modifier.export],
              },
              methodParams,
              cg.block(
                typescript_1.factory.createReturnStatement(
                  this.wrapResult(
                    callOazapftsFunction(
                      {
                        json: 'fetchJson',
                        text: 'fetchText',
                        blob: 'fetchBlob',
                      }[returnType],
                      args,
                      returnType === 'json' || returnType === 'blob'
                        ? [
                            this.getTypeFromResponses(responses) ||
                              typescript_1.default.SyntaxKind.AnyKeyword,
                          ]
                        : undefined,
                    ),
                  ),
                ),
              ),
            ),
            summary || description,
          ),
        );
      });
    });
    Object.assign(stub, {
      statements: cg.appendNodes(
        stub.statements,
        ...[...this.aliases, ...functions],
      ),
    });
    return stub;
  }
}
exports.default = ApiGenerator;
//# sourceMappingURL=generate.js.map
