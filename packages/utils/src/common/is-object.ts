import { isFunction } from './is-function'
import { isNull } from './is-null'

/**
 * Check if value is an object
 * @param value - The value to check
 * @returns `true` if value is an object, `false` otherwise
 */
export function isObject(value: unknown): value is object {
  return !isNull(value) && (typeof value === 'object' || isFunction(value))
}
