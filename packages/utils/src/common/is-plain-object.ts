/**
 * Check if a value is a plain object.
 * @param value - The value to check
 * @returns `true` if the value is a plain object, `false` otherwise
 */
export function isPlainObject<Value = unknown>(
  value: unknown,
): value is { [key: PropertyKey]: Value } {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prototype = Object.getPrototypeOf(value)

  return (
    (prototype === null ||
      prototype === Object.prototype ||
      Object.getPrototypeOf(prototype) === null) &&
    !(Symbol.toStringTag in value) &&
    !(Symbol.iterator in value)
  )
}
