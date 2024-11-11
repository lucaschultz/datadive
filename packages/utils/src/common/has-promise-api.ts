import { isFunction } from './is-function'

/**
 * Check if a value has a Promise API
 * @param value - The value to check
 * @returns `true` if value has the Promise API, `false` otherwise
 */
export function hasPromiseApi<T = unknown>(
  value: unknown,
): value is Promise<T> {
  return (
    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction((value as Promise<T>).then) &&
    // eslint-disable-next-line @typescript-eslint/unbound-method
    isFunction((value as Promise<T>).catch)
  )
}
