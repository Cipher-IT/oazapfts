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
exports.isValidIdentifier =
  exports.printFile =
  exports.printNodes =
  exports.printNode =
  exports.parseFile =
  exports.addComment =
  exports.appendNodes =
  exports.changePropertyValue =
  exports.findFirstVariableDeclaration =
  exports.getFirstDeclarationName =
  exports.getName =
  exports.findNode =
  exports.createTemplateString =
  exports.createObjectBinding =
  exports.createIndexSignature =
  exports.createPropertySignature =
  exports.createParameter =
  exports.createMethod =
  exports.createConstructor =
  exports.createClassDeclaration =
  exports.createFunctionDeclaration =
  exports.createArrowFunction =
  exports.block =
  exports.createPropertyAssignment =
  exports.createObjectLiteral =
  exports.createMethodCall =
  exports.createCall =
  exports.toExpression =
  exports.createTypeAliasDeclaration =
  exports.modifier =
  exports.keywordType =
  exports.createKeywordType =
  exports.createQuestionToken =
  exports.questionToken =
    void 0;
const fs_1 = __importDefault(require('fs'));
const typescript_1 = __importStar(require('typescript'));
typescript_1.default.parseIsolatedEntityName;
exports.questionToken = typescript_1.factory.createToken(
  typescript_1.default.SyntaxKind.QuestionToken,
);
function createQuestionToken(token) {
  if (!token) return undefined;
  if (token === true) return exports.questionToken;
  return token;
}
exports.createQuestionToken = createQuestionToken;
function createKeywordType(type) {
  switch (type) {
    case 'any':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.AnyKeyword,
      );
    case 'number':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.NumberKeyword,
      );
    case 'object':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.ObjectKeyword,
      );
    case 'string':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.StringKeyword,
      );
    case 'boolean':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.BooleanKeyword,
      );
    case 'undefined':
      return typescript_1.factory.createKeywordTypeNode(
        typescript_1.default.SyntaxKind.UndefinedKeyword,
      );
    case 'null':
      return typescript_1.factory.createLiteralTypeNode(
        typescript_1.default.factory.createToken(
          typescript_1.default.SyntaxKind.NullKeyword,
        ),
      );
  }
}
exports.createKeywordType = createKeywordType;
exports.keywordType = {
  any: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.AnyKeyword,
  ),
  number: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.NumberKeyword,
  ),
  object: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.ObjectKeyword,
  ),
  string: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.StringKeyword,
  ),
  boolean: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.BooleanKeyword,
  ),
  undefined: typescript_1.factory.createKeywordTypeNode(
    typescript_1.default.SyntaxKind.UndefinedKeyword,
  ),
  null: typescript_1.factory.createLiteralTypeNode(
    typescript_1.default.factory.createToken(
      typescript_1.default.SyntaxKind.NullKeyword,
    ),
  ),
};
exports.modifier = {
  async: typescript_1.factory.createModifier(
    typescript_1.default.SyntaxKind.AsyncKeyword,
  ),
  export: typescript_1.factory.createModifier(
    typescript_1.default.SyntaxKind.ExportKeyword,
  ),
};
function createTypeAliasDeclaration({
  decorators,
  modifiers,
  name,
  typeParameters,
  type,
}) {
  return typescript_1.factory.createTypeAliasDeclaration(
    decorators,
    modifiers,
    name,
    typeParameters,
    type,
  );
}
exports.createTypeAliasDeclaration = createTypeAliasDeclaration;
function toExpression(ex) {
  if (typeof ex === 'string') return typescript_1.factory.createIdentifier(ex);
  return ex;
}
exports.toExpression = toExpression;
function createCall(expression, { typeArgs, args } = {}) {
  return typescript_1.factory.createCallExpression(
    toExpression(expression),
    typeArgs,
    args,
  );
}
exports.createCall = createCall;
function createMethodCall(method, opts) {
  return createCall(
    typescript_1.factory.createPropertyAccessExpression(
      typescript_1.factory.createThis(),
      method,
    ),
    opts,
  );
}
exports.createMethodCall = createMethodCall;
function createObjectLiteral(props) {
  return typescript_1.factory.createObjectLiteralExpression(
    props.map(([name, identifier]) =>
      createPropertyAssignment(name, toExpression(identifier)),
    ),
    true,
  );
}
exports.createObjectLiteral = createObjectLiteral;
function createPropertyAssignment(name, expression) {
  if (typescript_1.default.isIdentifier(expression)) {
    if (expression.text === name) {
      return typescript_1.factory.createShorthandPropertyAssignment(name);
    }
  }
  return typescript_1.factory.createPropertyAssignment(
    propertyName(name),
    expression,
  );
}
exports.createPropertyAssignment = createPropertyAssignment;
function block(...statements) {
  return typescript_1.factory.createBlock(statements, true);
}
exports.block = block;
function createArrowFunction(
  parameters,
  body,
  { modifiers, typeParameters, type, equalsGreaterThanToken } = {},
) {
  return typescript_1.factory.createArrowFunction(
    modifiers,
    typeParameters,
    parameters,
    type,
    equalsGreaterThanToken,
    body,
  );
}
exports.createArrowFunction = createArrowFunction;
function createFunctionDeclaration(
  name,
  { decorators, modifiers, asteriskToken, typeParameters, type },
  parameters,
  body,
) {
  return typescript_1.factory.createFunctionDeclaration(
    decorators,
    modifiers,
    asteriskToken,
    name,
    typeParameters,
    parameters,
    type,
    body,
  );
}
exports.createFunctionDeclaration = createFunctionDeclaration;
function createClassDeclaration({
  decorators,
  modifiers,
  name,
  typeParameters,
  heritageClauses,
  members,
}) {
  return typescript_1.factory.createClassDeclaration(
    decorators,
    modifiers,
    name,
    typeParameters,
    heritageClauses,
    members,
  );
}
exports.createClassDeclaration = createClassDeclaration;
function createConstructor({ decorators, modifiers, parameters, body }) {
  return typescript_1.factory.createConstructorDeclaration(
    decorators,
    modifiers,
    parameters,
    body,
  );
}
exports.createConstructor = createConstructor;
function createMethod(
  name,
  {
    decorators,
    modifiers,
    asteriskToken,
    questionToken,
    typeParameters,
    type,
  } = {},
  parameters = [],
  body,
) {
  return typescript_1.factory.createMethodDeclaration(
    decorators,
    modifiers,
    asteriskToken,
    name,
    createQuestionToken(questionToken),
    typeParameters,
    parameters,
    type,
    body,
  );
}
exports.createMethod = createMethod;
function createParameter(
  name,
  { decorators, modifiers, dotDotDotToken, questionToken, type, initializer },
) {
  return typescript_1.factory.createParameterDeclaration(
    decorators,
    modifiers,
    dotDotDotToken,
    name,
    createQuestionToken(questionToken),
    type,
    initializer,
  );
}
exports.createParameter = createParameter;
function propertyName(name) {
  if (typeof name === 'string') {
    return isValidIdentifier(name)
      ? typescript_1.factory.createIdentifier(name)
      : typescript_1.factory.createStringLiteral(name);
  }
  return name;
}
function createPropertySignature({ modifiers, name, questionToken, type }) {
  return typescript_1.factory.createPropertySignature(
    modifiers,
    propertyName(name),
    createQuestionToken(questionToken),
    type,
  );
}
exports.createPropertySignature = createPropertySignature;
function createIndexSignature(
  type,
  {
    decorators,
    modifiers,
    indexName = 'key',
    indexType = exports.keywordType.string,
  } = {},
) {
  return typescript_1.factory.createIndexSignature(
    decorators,
    modifiers,
    [createParameter(indexName, { type: indexType })],
    type,
  );
}
exports.createIndexSignature = createIndexSignature;
function createObjectBinding(elements) {
  return typescript_1.factory.createObjectBindingPattern(
    elements.map(({ dotDotDotToken, propertyName, name, initializer }) =>
      typescript_1.factory.createBindingElement(
        dotDotDotToken,
        propertyName,
        name,
        initializer,
      ),
    ),
  );
}
exports.createObjectBinding = createObjectBinding;
function createTemplateString(head, spans) {
  if (!spans.length) return typescript_1.factory.createStringLiteral(head);
  return typescript_1.factory.createTemplateExpression(
    typescript_1.factory.createTemplateHead(head),
    spans.map(({ expression, literal }, i) =>
      typescript_1.factory.createTemplateSpan(
        expression,
        i === spans.length - 1
          ? typescript_1.factory.createTemplateTail(literal)
          : typescript_1.factory.createTemplateMiddle(literal),
      ),
    ),
  );
}
exports.createTemplateString = createTemplateString;
function findNode(nodes, kind, test) {
  const node = nodes.find((s) => s.kind === kind && (!test || test(s)));
  if (!node) throw new Error(`Node not found: ${kind}`);
  return node;
}
exports.findNode = findNode;
function getName(name) {
  if (typescript_1.default.isIdentifier(name)) {
    return name.escapedText;
  }
  if (typescript_1.default.isLiteralExpression(name)) {
    return name.text;
  }
  return '';
}
exports.getName = getName;
function getFirstDeclarationName(n) {
  const name = typescript_1.default.getNameOfDeclaration(
    n.declarationList.declarations[0],
  );
  return name ? getName(name) : '';
}
exports.getFirstDeclarationName = getFirstDeclarationName;
function findFirstVariableDeclaration(nodes, name) {
  const statement = findNode(
    nodes,
    typescript_1.default.SyntaxKind.VariableStatement,
    (n) => getFirstDeclarationName(n) === name,
  );
  const [first] = statement.declarationList.declarations;
  if (!first) throw new Error('Missing declaration');
  return first;
}
exports.findFirstVariableDeclaration = findFirstVariableDeclaration;
function changePropertyValue(o, property, value) {
  const p = o.properties.find(
    (p) =>
      typescript_1.default.isPropertyAssignment(p) &&
      getName(p.name) === property,
  );
  if (p && typescript_1.default.isPropertyAssignment(p)) {
    // p.initializer is readonly, this might break in a future TS version, but works fine for now.
    Object.assign(p, { initializer: value });
  } else {
    throw new Error(`No such property: ${property}`);
  }
}
exports.changePropertyValue = changePropertyValue;
function appendNodes(array, ...nodes) {
  return typescript_1.factory.createNodeArray([...array, ...nodes]);
}
exports.appendNodes = appendNodes;
function addComment(node, comment) {
  if (!comment) return node;
  return typescript_1.default.addSyntheticLeadingComment(
    node,
    typescript_1.default.SyntaxKind.MultiLineCommentTrivia,
    `*\n * ${comment.replace(/\n/g, '\n * ')}\n `,
    true,
  );
}
exports.addComment = addComment;
function parseFile(file) {
  return typescript_1.default.createSourceFile(
    file,
    fs_1.default.readFileSync(file, 'utf8'),
    typescript_1.default.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    typescript_1.default.ScriptKind.TS,
  );
}
exports.parseFile = parseFile;
const printer = typescript_1.default.createPrinter({
  newLine: typescript_1.default.NewLineKind.LineFeed,
});
function printNode(node) {
  const file = typescript_1.default.createSourceFile(
    'someFileName.ts',
    '',
    typescript_1.default.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    typescript_1.default.ScriptKind.TS,
  );
  return printer.printNode(
    typescript_1.default.EmitHint.Unspecified,
    node,
    file,
  );
}
exports.printNode = printNode;
function printNodes(nodes) {
  const file = typescript_1.default.createSourceFile(
    'someFileName.ts',
    '',
    typescript_1.default.ScriptTarget.Latest,
    /*setParentNodes*/ false,
    typescript_1.default.ScriptKind.TS,
  );
  return nodes
    .map((node) =>
      printer.printNode(typescript_1.default.EmitHint.Unspecified, node, file),
    )
    .join('\n');
}
exports.printNodes = printNodes;
function printFile(sourceFile) {
  return printer.printFile(sourceFile);
}
exports.printFile = printFile;
function isValidIdentifier(str) {
  if (!str.length || str.trim() !== str) return false;
  const node = typescript_1.default.parseIsolatedEntityName(
    str,
    typescript_1.default.ScriptTarget.Latest,
  );
  return (
    !!node &&
    node.kind === typescript_1.default.SyntaxKind.Identifier &&
    node.originalKeywordKind === undefined
  );
}
exports.isValidIdentifier = isValidIdentifier;
//# sourceMappingURL=tscodegen.js.map
