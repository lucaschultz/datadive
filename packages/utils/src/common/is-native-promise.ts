import { getObjectType } from './get-object-type'

/**
 * Check if the value is a native promise
 * @param value - The value to check
 * @returns `true` if the value is a native promise, `false` otherwise
 */
export function isNativePromise<T = unknown>(
  value: unknown,
): value is Promise<T> {
  return getObjectType(value) === 'Promise'
}
