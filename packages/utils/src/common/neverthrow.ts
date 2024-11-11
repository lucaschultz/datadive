import type { Result } from 'neverthrow'

import { ResultAsync } from 'neverthrow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyArray = Array<any>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyResult = Result<any, any>

/**
 * Extracts the error type from a `Result` or `ResultAsync`
 * @example
 * ```ts
 * type MyResult = Result<string, { code: 'sql_error' }>
 * type MyError = InferResultError<MyResult> // { code: 'sql_error' }
 *
 * type MyResultAsync = ResultAsync<string, { code: 'sql_error' }>
 * type MyErrorAsync = InferResultError<MyResultAsync> // { code: 'sql_error' }
 * ```
 */
export type InferResultError<T> =
  T extends Result<infer _, infer E>
    ? E
    : T extends ResultAsync<infer _, infer E>
      ? E
      : never

/**
 * Extracts the value type from a `Result` or `ResultAsync`
 * @example
 * ```ts
 * type MyResult = Result<'hello world', Error>
 * type Value = InferResultValue<MyResult> // 'hello world'
 *
 * type MyResultAsync = ResultAsync<'hello world', Error>
 * type ValueAsync = InferResultValue<MyResultAsync> // 'hello world'
 * ```
 */
export type InferResultValue<T> =
  T extends Result<infer V, infer _>
    ? V
    : T extends ResultAsync<infer V, infer _>
      ? V
      : never

/**
 * Helper to create a `Result<...>`
 * @param result - A function that returns a union of `Ok<...>` and `Err<...>`
 * @returns - A function that returns a `Result<...>`
 */
export function resultFromSafeFn<T extends AnyResult>(result: () => T) {
  return result() as Result<InferResultValue<T>, InferResultError<T>>
}

/**
 * Create a `ResultAsync<...>` from a function that returns a `Promise<Result<...>>`
 *
 * **Note**: Make sure that the function you pass in **never rejects or
 * throws**, see the docs for [`ResultAsync.fromSafePromise`](https://github.com/supermacro/neverthrow#resultasyncfromsafepromise-static-class-method)
 * for more info.
 * @param fn A function that returns a `Promise<Result<...>>`
 * @returns A `ResultAsync<...>`
 */
export function resultFromSafeAsyncFn<T extends AnyResult>(
  fn: () => Promise<T>,
) {
  return new ResultAsync(fn()) as ResultAsync<
    InferResultValue<T>,
    InferResultError<T>
  >
}

/**
 * Helper to produce a prettier type signature for functions that return [`Result`](https://github.com/supermacro/neverthrow?tab=readme-ov-file#synchronous-api-result)s
 * @param result - A function that returns a union of `Ok<...>` and `Err<...>`
 * @returns - A function that returns a `Result<...>`
 */
export function fromSafeFn<P extends AnyArray, T extends AnyResult>(
  result: (...params: P) => T,
) {
  return result as (
    ...params: P
  ) => Result<InferResultValue<T>, InferResultError<T>>
}

/**
 * Converts a function that returns a `Promise<Result<...>>` to a function that
 * returns a `ResultAsync<...>`
 *
 * **Note**: Make sure that the function you pass in **never rejects or
 * throws**, see the docs for [`ResultAsync.fromSafePromise`](https://github.com/supermacro/neverthrow#resultasyncfromsafepromise-static-class-method)
 * for more info.
 * @param fn - A function that returns a `Promise<Result<...>>`
 * @returns - A function that returns a `ResultAsync<...>`
 */
export function fromSafeAsyncFn<P extends AnyArray, T extends AnyResult>(
  fn: (...params: P) => Promise<T>,
) {
  return (...params: P) => {
    return new ResultAsync(fn(...params)) as ResultAsync<
      InferResultValue<T>,
      InferResultError<T>
    >
  }
}
