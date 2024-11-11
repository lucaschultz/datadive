import { hasPromiseApi } from './has-promise-api'
import { isNativePromise } from './is-native-promise'

/**
 * Check if a value is a promise
 * @param value - The value to check
 * @returns `true` if the value is a promise, `false` otherwise
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return isNativePromise(value) || hasPromiseApi(value)
}
