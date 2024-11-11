/**
 * Check if a string is in snake_case
 * @param str - The string to check
 * @returns True if the string is in snake_case, false otherwise
 * @example
 * isKebabCase('snake_case') // true
 * isKebabCase('camelCase') // false
 */
export function isSnakeCase(str: string) {
  if (str.includes('-')) {
    return false
  }

  if (str.includes(' ')) {
    return false
  }

  if (str !== str.toLowerCase()) {
    return false
  }

  return true
}
