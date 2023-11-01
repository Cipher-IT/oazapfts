import ts from 'typescript';
type KeywordTypeName =
  | 'any'
  | 'number'
  | 'object'
  | 'string'
  | 'boolean'
  | 'undefined'
  | 'null';
export declare const questionToken: ts.PunctuationToken<ts.SyntaxKind.QuestionToken>;
export declare function createQuestionToken(
  token?: boolean | ts.QuestionToken,
): ts.PunctuationToken<ts.SyntaxKind.QuestionToken> | undefined;
export declare function createKeywordType(
  type: KeywordTypeName,
):
  | ts.KeywordTypeNode<ts.SyntaxKind.AnyKeyword>
  | ts.KeywordTypeNode<ts.SyntaxKind.NumberKeyword>
  | ts.KeywordTypeNode<ts.SyntaxKind.ObjectKeyword>
  | ts.KeywordTypeNode<ts.SyntaxKind.StringKeyword>
  | ts.KeywordTypeNode<ts.SyntaxKind.BooleanKeyword>
  | ts.KeywordTypeNode<ts.SyntaxKind.UndefinedKeyword>
  | ts.LiteralTypeNode;
export declare const keywordType: {
  [type: string]: ts.KeywordTypeNode | ts.LiteralTypeNode;
};
export declare const modifier: {
  async: ts.ModifierToken<ts.SyntaxKind.AsyncKeyword>;
  export: ts.ModifierToken<ts.SyntaxKind.ExportKeyword>;
};
export declare function createTypeAliasDeclaration({
  decorators,
  modifiers,
  name,
  typeParameters,
  type,
}: {
  decorators?: Array<ts.Decorator>;
  modifiers?: Array<ts.Modifier>;
  name: string | ts.Identifier;
  typeParameters?: Array<ts.TypeParameterDeclaration>;
  type: ts.TypeNode;
}): ts.TypeAliasDeclaration;
export declare function toExpression(ex: ts.Expression | string): ts.Expression;
export declare function createCall(
  expression: ts.Expression | string,
  {
    typeArgs,
    args,
  }?: {
    typeArgs?: Array<ts.TypeNode>;
    args?: Array<ts.Expression>;
  },
): ts.CallExpression;
export declare function createMethodCall(
  method: string,
  opts: {
    typeArgs?: Array<ts.TypeNode>;
    args?: Array<ts.Expression>;
  },
): ts.CallExpression;
export declare function createObjectLiteral(
  props: [string, string | ts.Expression][],
): ts.ObjectLiteralExpression;
export declare function createPropertyAssignment(
  name: string,
  expression: ts.Expression,
): ts.PropertyAssignment | ts.ShorthandPropertyAssignment;
export declare function block(...statements: ts.Statement[]): ts.Block;
export declare function createArrowFunction(
  parameters: ts.ParameterDeclaration[],
  body: ts.ConciseBody,
  {
    modifiers,
    typeParameters,
    type,
    equalsGreaterThanToken,
  }?: {
    modifiers?: ts.Modifier[];
    typeParameters?: ts.TypeParameterDeclaration[];
    type?: ts.TypeNode;
    equalsGreaterThanToken?: ts.EqualsGreaterThanToken;
  },
): ts.ArrowFunction;
export declare function createFunctionDeclaration(
  name: string | ts.Identifier | undefined,
  {
    decorators,
    modifiers,
    asteriskToken,
    typeParameters,
    type,
  }: {
    decorators?: ts.Decorator[];
    modifiers?: ts.Modifier[];
    asteriskToken?: ts.AsteriskToken;
    typeParameters?: ts.TypeParameterDeclaration[];
    type?: ts.TypeNode;
  },
  parameters: ts.ParameterDeclaration[],
  body?: ts.Block,
): ts.FunctionDeclaration;
export declare function createClassDeclaration({
  decorators,
  modifiers,
  name,
  typeParameters,
  heritageClauses,
  members,
}: {
  decorators?: Array<ts.Decorator>;
  modifiers?: Array<ts.Modifier>;
  name?: string | ts.Identifier;
  typeParameters?: Array<ts.TypeParameterDeclaration>;
  heritageClauses?: Array<ts.HeritageClause>;
  members: Array<ts.ClassElement>;
}): ts.ClassDeclaration;
export declare function createConstructor({
  decorators,
  modifiers,
  parameters,
  body,
}: {
  decorators?: Array<ts.Decorator>;
  modifiers?: Array<ts.Modifier>;
  parameters: Array<ts.ParameterDeclaration>;
  body?: ts.Block;
}): ts.ConstructorDeclaration;
export declare function createMethod(
  name:
    | string
    | ts.Identifier
    | ts.StringLiteral
    | ts.NumericLiteral
    | ts.ComputedPropertyName,
  {
    decorators,
    modifiers,
    asteriskToken,
    questionToken,
    typeParameters,
    type,
  }?: {
    decorators?: ts.Decorator[];
    modifiers?: ts.Modifier[];
    asteriskToken?: ts.AsteriskToken;
    questionToken?: ts.QuestionToken | boolean;
    typeParameters?: ts.TypeParameterDeclaration[];
    type?: ts.TypeNode;
  },
  parameters?: ts.ParameterDeclaration[],
  body?: ts.Block,
): ts.MethodDeclaration;
export declare function createParameter(
  name: string | ts.BindingName,
  {
    decorators,
    modifiers,
    dotDotDotToken,
    questionToken,
    type,
    initializer,
  }: {
    decorators?: Array<ts.Decorator>;
    modifiers?: Array<ts.Modifier>;
    dotDotDotToken?: ts.DotDotDotToken;
    questionToken?: ts.QuestionToken | boolean;
    type?: ts.TypeNode;
    initializer?: ts.Expression;
  },
): ts.ParameterDeclaration;
export declare function createPropertySignature({
  modifiers,
  name,
  questionToken,
  type,
}: {
  modifiers?: Array<ts.Modifier>;
  name: ts.PropertyName | string;
  questionToken?: ts.QuestionToken | boolean;
  type?: ts.TypeNode;
}): ts.PropertySignature;
export declare function createIndexSignature(
  type: ts.TypeNode,
  {
    decorators,
    modifiers,
    indexName,
    indexType,
  }?: {
    indexName?: string;
    indexType?: ts.TypeNode;
    decorators?: Array<ts.Decorator>;
    modifiers?: Array<ts.Modifier>;
  },
): ts.IndexSignatureDeclaration;
export declare function createObjectBinding(
  elements: Array<{
    name: string | ts.BindingName;
    dotDotDotToken?: ts.DotDotDotToken;
    propertyName?: string | ts.PropertyName;
    initializer?: ts.Expression;
  }>,
): ts.ObjectBindingPattern;
export declare function createTemplateString(
  head: string,
  spans: Array<{
    literal: string;
    expression: ts.Expression;
  }>,
): ts.StringLiteral | ts.TemplateExpression;
export declare function findNode<T extends ts.Node>(
  nodes: ts.NodeArray<ts.Node>,
  kind: T extends {
    kind: infer K;
  }
    ? K
    : never,
  test?: (node: T) => boolean | undefined,
): T;
export declare function getName(name: ts.Node):
  | string
  | (void & {
      __escapedIdentifier: void;
    });
export declare function getFirstDeclarationName(n: ts.VariableStatement):
  | string
  | (void & {
      __escapedIdentifier: void;
    });
export declare function findFirstVariableDeclaration(
  nodes: ts.NodeArray<ts.Node>,
  name: string,
): ts.VariableDeclaration;
export declare function changePropertyValue(
  o: ts.ObjectLiteralExpression,
  property: string,
  value: ts.Expression,
): void;
export declare function appendNodes<T extends ts.Node>(
  array: ts.NodeArray<T>,
  ...nodes: T[]
): ts.NodeArray<T>;
export declare function addComment<T extends ts.Node>(
  node: T,
  comment?: string,
): T;
export declare function parseFile(file: string): ts.SourceFile;
export declare function printNode(node: ts.Node): string;
export declare function printNodes(nodes: ts.Node[]): string;
export declare function printFile(sourceFile: ts.SourceFile): string;
export declare function isValidIdentifier(str: string): boolean;
export {};
