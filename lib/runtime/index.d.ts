import { ok } from '../';
export type RequestOpts = {
  baseUrl?: string;
  fetch?: typeof fetch;
  formDataConstructor?: new () => FormData;
  headers?: Record<string, string | undefined>;
} & Omit<RequestInit, 'body' | 'headers'>;
type FetchRequestOpts = RequestOpts & {
  body?: string | FormData;
};
type JsonRequestOpts = RequestOpts & {
  body?: object;
};
export type ApiResponse = {
  status: number;
  data?: any;
};
type MultipartRequestOpts = RequestOpts & {
  body?: Record<string, string | Blob | undefined | any>;
};
export declare function runtime(defaults: RequestOpts): {
  ok: typeof ok;
  fetchText: (
    url: string,
    req?: FetchRequestOpts,
  ) => Promise<{
    status: number;
    contentType: string | null;
    data: string | undefined;
  }>;
  fetchJson: <T extends ApiResponse>(
    url: string,
    req?: FetchRequestOpts,
  ) => Promise<T>;
  fetchBlob: <T_1 extends ApiResponse>(
    url: string,
    req?: FetchRequestOpts,
  ) => Promise<T_1>;
  json({ body, headers, ...req }: JsonRequestOpts): {
    headers: {
      'Content-Type': string;
    };
    body?: string | undefined;
    baseUrl?: string | undefined;
    fetch?: typeof fetch | undefined;
    formDataConstructor?: (new () => FormData) | undefined;
    cache?: RequestCache | undefined;
    credentials?: RequestCredentials | undefined;
    integrity?: string | undefined;
    keepalive?: boolean | undefined;
    method?: string | undefined;
    mode?: RequestMode | undefined;
    redirect?: RequestRedirect | undefined;
    referrer?: string | undefined;
    referrerPolicy?: ReferrerPolicy | undefined;
    signal?: AbortSignal | null | undefined;
    window?: null | undefined;
  };
  form({ body, headers, ...req }: JsonRequestOpts): {
    headers: {
      'Content-Type': string;
    };
    body?: string | undefined;
    baseUrl?: string | undefined;
    fetch?: typeof fetch | undefined;
    formDataConstructor?: (new () => FormData) | undefined;
    cache?: RequestCache | undefined;
    credentials?: RequestCredentials | undefined;
    integrity?: string | undefined;
    keepalive?: boolean | undefined;
    method?: string | undefined;
    mode?: RequestMode | undefined;
    redirect?: RequestRedirect | undefined;
    referrer?: string | undefined;
    referrerPolicy?: ReferrerPolicy | undefined;
    signal?: AbortSignal | null | undefined;
    window?: null | undefined;
  };
  multipart({ body, ...req }: MultipartRequestOpts):
    | {
        baseUrl?: string | undefined;
        fetch?: typeof fetch | undefined;
        formDataConstructor?: (new () => FormData) | undefined;
        headers?: Record<string, string | undefined> | undefined;
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: AbortSignal | null | undefined;
        window?: null | undefined;
      }
    | {
        body: FormData;
        baseUrl?: string | undefined;
        fetch?: typeof fetch | undefined;
        formDataConstructor?: (new () => FormData) | undefined;
        headers?: Record<string, string | undefined> | undefined;
        cache?: RequestCache | undefined;
        credentials?: RequestCredentials | undefined;
        integrity?: string | undefined;
        keepalive?: boolean | undefined;
        method?: string | undefined;
        mode?: RequestMode | undefined;
        redirect?: RequestRedirect | undefined;
        referrer?: string | undefined;
        referrerPolicy?: ReferrerPolicy | undefined;
        signal?: AbortSignal | null | undefined;
        window?: null | undefined;
      };
};
export {};
