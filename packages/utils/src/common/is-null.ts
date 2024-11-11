/**
 * Check if the value is null
 * @param value - The value to check
 * @returns `true` if the value is null, `false` otherwise
 */
export function isNull(value: unknown): value is null {
  return value === null
}
