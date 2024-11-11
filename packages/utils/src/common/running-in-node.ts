/**
 * Check if the code is running in node
 *
 * Uses {@link https://nodejs.org/api/process.html#processversions| `process.versions`}
 * to check if the code is running in NodeJs.
 * @returns `true` if the code is running in node, `false` otherwise
 */
export function runningInNode() {
  if (
    typeof process !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !!process.versions &&
    !!process.versions.node
  ) {
    return true
  }

  return false
}
