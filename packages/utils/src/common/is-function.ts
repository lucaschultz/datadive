/**
 * Check if value is a function
 * @param value - The value to check
 * @returns `true` if value is a function, `false` otherwise
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function isFunction(value: unknown): value is Function {
  return typeof value === 'function'
}
