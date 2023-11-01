import ts from 'typescript';
import { OpenAPIV3 } from 'openapi-types';
import { Opts } from '.';
export declare const verbs: string[];
type ContentType = 'json' | 'form' | 'multipart';
export declare const contentTypes: Record<string, ContentType>;
/**
 * Get the name of a formatter function for a given parameter.
 */
export declare function getFormatter({
  style,
  explode,
}: OpenAPIV3.ParameterObject): 'form' | 'space' | 'pipe' | 'deep' | 'explode';
export declare function getOperationIdentifier(id?: string): string | undefined;
/**
 * Create a method name for a given operation, either from its operationId or
 * the HTTP verb and path.
 */
export declare function getOperationName(
  verb: string,
  path: string,
  operationId?: string,
): string;
export declare function isNullable(schema: any): boolean;
export declare function isReference(obj: any): obj is OpenAPIV3.ReferenceObject;
export declare function getReference(spec: any, ref: string): any;
/**
 * If the given object is a ReferenceObject, return the last part of its path.
 */
export declare function getReferenceName(obj: any): string | undefined;
/**
 * Create a template string literal from the given OpenAPI urlTemplate.
 * Curly braces in the path are turned into identifier expressions,
 * which are read from the local scope during runtime.
 */
export declare function createUrlExpression(
  path: string,
  qs?: ts.Expression,
): ts.StringLiteral | ts.TemplateExpression;
/**
 * Create a call expression for one of the QS runtime functions.
 */
export declare function callQsFunction(
  name: string,
  args: ts.Expression[],
): ts.CallExpression;
/**
 * Create a call expression for one of the oazapfts runtime functions.
 */
export declare function callOazapftsFunction(
  name: string,
  args: ts.Expression[],
  typeArgs?: ts.TypeNode[],
): ts.CallExpression;
/**
 * Despite its name, OpenApi's `deepObject` serialization does not support
 * deeply nested objects. As a workaround we detect parameters that contain
 * square brackets and merge them into a single object.
 */
export declare function supportDeepObjects(
  params: OpenAPIV3.ParameterObject[],
): OpenAPIV3.ParameterObject[];
/**
 * Main entry point that generates TypeScript code from a given API spec.
 */
export default class ApiGenerator {
  readonly spec: OpenAPIV3.Document;
  readonly opts: Opts;
  /** Indicates if the document was converted from an older version of the OpenAPI specification. */
  readonly isConverted: boolean;
  constructor(
    spec: OpenAPIV3.Document,
    opts?: Opts,
    /** Indicates if the document was converted from an older version of the OpenAPI specification. */
    isConverted?: boolean,
  );
  aliases: ts.TypeAliasDeclaration[];
  refs: Record<string, ts.TypeReferenceNode>;
  typeAliases: Record<string, number>;
  reset(): void;
  resolve<T>(obj: T | OpenAPIV3.ReferenceObject): T;
  resolveArray<T>(array?: Array<T | OpenAPIV3.ReferenceObject>): T[];
  skip(tags?: string[]): boolean;
  getUniqueAlias(name: string): string;
  getRefBasename(ref: string): string;
  /**
   * Create a type alias for the schema referenced by the given ReferenceObject
   */
  getRefAlias(obj: OpenAPIV3.ReferenceObject): ts.TypeReferenceNode;
  getUnionType(
    variants: (OpenAPIV3.ReferenceObject | OpenAPIV3.SchemaObject)[],
    discriminator?: OpenAPIV3.DiscriminatorObject,
  ): ts.TypeNode;
  /**
   * Creates a type node from a given schema.
   * Delegates to getBaseTypeFromSchema internally and
   * optionally adds a union with null.
   */
  getTypeFromSchema(
    schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  ): ts.TypeNode;
  /**
   * This is the very core of the OpenAPI to TS conversion - it takes a
   * schema and returns the appropriate type.
   */
  getBaseTypeFromSchema(
    schema?: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
  ): ts.TypeNode;
  /**
   * Recursively creates a type literal with the given props.
   */
  getTypeFromProperties(
    props: {
      [prop: string]: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject;
    },
    required?: string[],
    additionalProperties?:
      | boolean
      | OpenAPIV3.SchemaObject
      | OpenAPIV3.ReferenceObject,
  ): ts.TypeLiteralNode;
  getTypeFromResponses(responses: OpenAPIV3.ResponsesObject): ts.UnionTypeNode;
  getTypeFromResponse(
    resOrRef: OpenAPIV3.ResponseObject | OpenAPIV3.ReferenceObject,
  ): ts.TypeNode;
  getResponseType(
    responses?: OpenAPIV3.ResponsesObject,
  ): 'json' | 'text' | 'blob';
  getSchemaFromContent(content: any): any;
  wrapResult(ex: ts.Expression): ts.Expression;
  generateApi(): ts.SourceFile;
}
export {};
