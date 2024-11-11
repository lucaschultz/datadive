/**
 * Exit the process with an error
 * @param error - The error to exit with
 */
export function exitWithError(error: unknown): never {
  if (typeof error === 'string') {
    throw new Error(error)
  }

  throw error
}
