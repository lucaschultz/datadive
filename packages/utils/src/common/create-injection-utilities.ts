import type { Result, ResultAsync } from 'neverthrow'
import type { Tail } from '../type/tail'

/**
 * Create injection helpers
 * @template TInjection - The injection type
 * @returns Injection helpers
 * ```ts
 * interface EmailInjection {
 *  resend: Resend
 * }
 *
 * const [defineEmailFunction, injectEmailFunction] = createInjectionUtilities<EmailInjection>()
 * ```
 */
export function createInjectionUtilities<TInjection>() {
  const define = <
    F extends (
      injection: TInjection,
      ...params: Tail<Parameters<F>>
    ) => Result<unknown, unknown> | ResultAsync<unknown, unknown>,
  >(
    injectee: F,
  ) => {
    return injectee
  }

  const inject = <
    F extends (
      injection: TInjection,
      ...params: Tail<Parameters<F>>
    ) => Result<unknown, unknown> | ResultAsync<unknown, unknown>,
  >(
    injection: TInjection,
    injectee: F,
  ) => {
    return (...args: Tail<Parameters<F>>) => {
      return injectee(injection, ...args) as ReturnType<F>
    }
  }

  return [define, inject] as const
}
