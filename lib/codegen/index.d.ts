import * as cg from './tscodegen';
import ts from 'typescript';
import { OpenAPIV3 } from 'openapi-types';
export { cg };
export type Opts = {
  include?: string[];
  exclude?: string[];
  optimistic?: boolean;
  unionUndefined?: boolean;
};
export declare function generateAst(
  spec: OpenAPIV3.Document,
  opts: Opts,
  isConverted: boolean,
): ts.SourceFile;
export declare function printAst(ast: ts.SourceFile): string;
export declare function generateSource(
  spec: string,
  opts: Opts,
): Promise<string>;
