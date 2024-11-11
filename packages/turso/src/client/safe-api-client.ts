import type { ResultAsync } from 'neverthrow'
import type { z } from 'zod'
import type { TursoFetchError } from '../errors/turso-fetch-error'
import type { TursoHttpError } from '../errors/turso-http-error'
import type { TursoValidationError } from '../errors/turso-validation-error'
import type {
  DeleteEndpoints,
  EndpointParameters,
  GetEndpoints,
  Method,
  PatchEndpoints,
  PostEndpoints,
} from '../typed-open-api.generated'

export type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined,
) => ResultAsync<
  z.infer<z.ZodUnknown>,
  TursoHttpError | TursoValidationError<z.ZodUnknown> | TursoFetchError
>

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P
}[keyof T]

type MaybeOptionalArg<T> =
  RequiredKeys<T> extends never ? [config?: T] : [config: T]

export class SafeApiClient {
  baseUrl = ''

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl
    return this
  }

  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): ResultAsync<
    z.infer<TEndpoint['response']>,
    | TursoHttpError
    | TursoValidationError<TEndpoint['response']>
    | TursoFetchError
  > {
    return this.fetcher('get', this.baseUrl + path, params[0]) as ResultAsync<
      z.infer<TEndpoint['response']>,
      | TursoHttpError
      | TursoValidationError<TEndpoint['response']>
      | TursoFetchError
    >
  }

  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): ResultAsync<
    z.infer<TEndpoint['response']>,
    | TursoHttpError
    | TursoValidationError<TEndpoint['response']>
    | TursoFetchError
  > {
    return this.fetcher('post', this.baseUrl + path, params[0]) as ResultAsync<
      z.infer<TEndpoint['response']>,
      | TursoHttpError
      | TursoValidationError<TEndpoint['response']>
      | TursoFetchError
    >
  }

  delete<
    Path extends keyof DeleteEndpoints,
    TEndpoint extends DeleteEndpoints[Path],
  >(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): ResultAsync<
    z.infer<TEndpoint['response']>,
    | TursoHttpError
    | TursoValidationError<TEndpoint['response']>
    | TursoFetchError
  > {
    return this.fetcher(
      'delete',
      this.baseUrl + path,
      params[0],
    ) as ResultAsync<
      z.infer<TEndpoint['response']>,
      | TursoHttpError
      | TursoValidationError<TEndpoint['response']>
      | TursoFetchError
    >
  }

  patch<
    Path extends keyof PatchEndpoints,
    TEndpoint extends PatchEndpoints[Path],
  >(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): ResultAsync<
    z.infer<TEndpoint['response']>,
    | TursoHttpError
    | TursoValidationError<TEndpoint['response']>
    | TursoFetchError
  > {
    return this.fetcher('patch', this.baseUrl + path, params[0]) as ResultAsync<
      z.infer<TEndpoint['response']>,
      | TursoHttpError
      | TursoValidationError<TEndpoint['response']>
      | TursoFetchError
    >
  }
}

export const createSafeApiClient = (fetcher: Fetcher, baseUrl?: string) => {
  return new SafeApiClient(fetcher).setBaseUrl(baseUrl ?? '')
}
