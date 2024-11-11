/**
 * Converts the first character of a string to uppercase.
 * @param str - The string to convert
 * @returns The string with the first character in uppercase
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`
}
