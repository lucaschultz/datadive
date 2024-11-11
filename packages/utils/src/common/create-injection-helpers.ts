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
    ) => ReturnType<F>,
  >(
    injectee: F,
  ) => {
    return injectee
  }

  const inject = <
    F extends (
      injection: TInjection,
      ...params: Tail<Parameters<F>>
    ) => ReturnType<F>,
  >(
    injection: TInjection,
    injectee: F,
  ) => {
    return (...args: Tail<Parameters<F>>) => {
      return injectee(injection, ...args)
    }
  }

  return [define, inject] as const
}
