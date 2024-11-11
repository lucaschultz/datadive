/**
 * Check if the code is running in the browser
 *
 * Checks if both `window` and `document` are defined.
 * @returns `true` if the code is running in the browser, `false` otherwise
 */
export function runningInBrowser() {
  if (![typeof window, typeof document].includes('undefined')) {
    return true
  }

  return false
}
