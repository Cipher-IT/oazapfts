/**
 * Join params using an ampersand and prepends a questionmark if not empty.
 */
export declare function query(...params: string[]): string;
/**
 * Serializes nested objects according to the `deepObject` style specified in
 * https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#style-values
 */
export declare function deep(
  params: Record<string, any>,
  [k, v]?: (typeof encodeURIComponent)[],
): string;
/**
 * Property values of type array or object generate separate parameters
 * for each value of the array, or key-value-pair of the map.
 * For other types of properties this property has no effect.
 * See https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.0.md#encoding-object
 */
export declare function explode(
  params: Record<string, any>,
  encoders?: (typeof encodeURIComponent)[],
): string;
export declare const form: (
  params: Record<string, any>,
  encoders?: (typeof encodeURIComponent)[],
) => string;
export declare const pipe: (
  params: Record<string, any>,
  encoders?: (typeof encodeURIComponent)[],
) => string;
export declare const space: (
  params: Record<string, any>,
  encoders?: (typeof encodeURIComponent)[],
) => string;
