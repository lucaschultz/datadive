/**
 * Raise an error
 * @param err - The error to be raised. Can be either an Error object or a string
 */
export function raise(err?: Error | string): never {
  if (err instanceof Error) {
    throw err
  }

  if (typeof err === 'string') {
    throw new Error(err)
  }

  throw new Error()
}
