/**
 * Check if the code is running in bun
 *
 * Uses {@link https://bun.sh/guides/util/detect-bun| `process.versions`}
 * to check if the code is running in Bon.
 * @returns `true` if the code is running in bun, `false` otherwise
 */
export function runningInBun() {
  if (
    typeof process !== 'undefined' &&
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    !!process.versions &&
    !!process.versions.bun
  ) {
    return true
  }

  return false
}
