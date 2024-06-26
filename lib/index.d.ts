import { ApiResponse } from './runtime';
/**
 * Type to access a response's data property for a given status.
 */
type DataType<T extends ApiResponse, S extends number> = T extends {
  status: S;
}
  ? T['data']
  : never;
/**
 * Object with methods to handle possible status codes of an ApiResponse.
 */
type ResponseHandler<T extends ApiResponse> = {
  [P in T['status']]: (res: DataType<T, P>) => any;
} & {
  default?: (status: number, data: any) => any;
};
/**
 * Utility function to handle different status codes.
 *
 * Example:
 *
 * const userId = await handle(api.register({ email, password }), {
 *   200: (user: User) => user.id,
 *   400: (err: string) => console.log(err),
 * })
 **/
export declare function handle<
  T extends ApiResponse,
  H extends ResponseHandler<T>,
>(promise: Promise<T>, handler: H): Promise<ReturnType<H[keyof H]>>;
declare const SUCCESS_CODES: readonly [200, 201, 202, 204];
type SuccessCodes = (typeof SUCCESS_CODES)[number];
type SuccessResponse<T extends ApiResponse> = DataType<T, SuccessCodes>;
/**
 * Utility function to directly return any successful response
 * and throw a HttpError otherwise.
 *
 * Example:
 *
 * try {
 *   const userId = await ok(api.register({ email, password }));
 * }
 * catch (err) {
 *   console.log(err.status)
 * }
 */
export declare function ok<T extends ApiResponse>(
  promise: Promise<T>,
): Promise<SuccessResponse<T>>;
export type Args<T> = T extends (...args: infer U) => any ? U : any;
export type ApiFunction = (...args: any[]) => Promise<ApiResponse>;
export type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer V>
  ? V
  : never;
export type OkResponse<T extends ApiFunction> = SuccessResponse<
  AsyncReturnType<T>
>;
export type Okify<T extends ApiFunction> = (
  ...args: Args<T>
) => Promise<OkResponse<T>>;
/**
 * Utility function to wrap an API function with `ok(...)`.
 */
export declare function okify<T extends ApiFunction>(fn: T): Okify<T>;
type OptimisticApi<T> = {
  [K in keyof T]: T[K] extends ApiFunction ? Okify<T[K]> : T[K];
};
/**
 * Utility to `okify` each function of an API.
 */
export declare function optimistic<
  T extends Record<string, ApiFunction | unknown>,
>(api: T): OptimisticApi<T>;
export declare class HttpError extends Error {
  status: number;
  data?: any;
  constructor(status: number, data: any);
}
export {};
