/**
 * Check if a string is in kebab-case
 * @param str - The string to check
 * @returns True if the string is in kebab-case, false otherwise
 * @example
 * isKebabCase('kebab-case') // true
 * isKebabCase('camelCase') // false
 */
export function isKebabCase(str: string) {
  if (str.includes('_')) {
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
