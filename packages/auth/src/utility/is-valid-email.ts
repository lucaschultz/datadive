/**
 * Naive email validation
 * Check if a value is a string that contains exactly one `@` character, and the
 * characters before and after the `@` are not empty.
 * @param value The value to check
 * @returns `true` if the value is a valid email, `false` otherwise
 */
export function isValidEmail(value: unknown): value is `${string}@${string}` {
  if (typeof value !== 'string') {
    return false
  }

  const splitted = value.split('')

  if (splitted.length !== 2) {
    return false
  }

  return splitted.every((i) => i.length !== 0)
}
