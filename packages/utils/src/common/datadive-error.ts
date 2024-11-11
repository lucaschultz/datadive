import type { Equals } from '../type'
import type { JsonObject } from '../type/json'

type DatadiveErrorOptions = ErrorOptions

type DatadiveErrorBaseParams = [
  message?: string | undefined,
  options?: Partial<DatadiveErrorOptions> | undefined,
]

type DatadiveErrorParams<TData extends JsonObject> =
  Equals<TData, NonNullable<unknown>> extends true
    ? DatadiveErrorBaseParams
    : [data: TData, ...DatadiveErrorBaseParams]

type DatadiveErrorData<TData extends JsonObject> =
  Equals<TData, NonNullable<unknown>> extends true ? never : TData

type DatadiveErrorJson<TCode extends string, TData extends JsonObject> =
  Equals<TData, NonNullable<unknown>> extends true
    ? {
        code: TCode
        message: string
      }
    : {
        code: TCode
        message: string
        data: TData
      }

/**
 * Base class for all Datadive errors
 * @example
 * ```ts
 * class MyError extends DatadiveError<'my_error_code', { foo: string }> {
 *  public readonly code = 'my_error_code'
 * }
 *
 * throw new MyError({ foo: 'bar' }, 'Something went wrong')
 *```
 */
export abstract class DatadiveError<
  TCode extends Lowercase<string>,
  TData extends JsonObject = NonNullable<unknown>,
> extends Error {
  public abstract readonly code: TCode
  public readonly data: DatadiveErrorData<TData>

  constructor(...params: DatadiveErrorParams<TData>) {
    if (params.length === 2) {
      const [message, options] = params as [string, { cause?: unknown }]
      super(message, options)
      this.data = undefined as never
    } else {
      const [data, message, options] = params as [
        TData,
        string,
        { cause?: unknown },
      ]
      super(message, options)
      this.data = data as DatadiveErrorData<TData>
    }
  }

  public toJson(): DatadiveErrorJson<TCode, TData> {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    } as DatadiveErrorJson<TCode, TData>
  }
}
