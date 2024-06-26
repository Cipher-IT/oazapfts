type Encoders = Array<(s: string) => string>;
export declare const encodeReserved: (typeof encodeURIComponent)[];
export declare const allowReserved: (typeof encodeURI)[];
/**
 * Creates a tag-function to encode template strings with the given encoders.
 */
export declare function encode(
  encoders: Encoders,
  delimiter?: string,
): (strings: TemplateStringsArray, ...values: any[]) => string;
/**
 * Separate array values by the given delimiter.
 */
export declare function delimited(
  delimiter?: string,
): (
  params: Record<string, any>,
  encoders?: (typeof encodeURIComponent)[],
) => string;
/**
 * Deeply remove all properties with undefined values.
 */
export declare function stripUndefined<T>(obj: T): any;
export declare function joinUrl(...parts: Array<string | undefined>): string;
export {};
