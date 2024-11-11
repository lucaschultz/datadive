interface ErrorWithMessage {
  message: string
}

/**
 * Check if the error has a message
 * @param error - The error to check
 * @returns True if the error has a message, false otherwise
 */
export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { [key: string]: unknown })['message'] === 'string'
  )
}

/**
 * Convert an unknown to an error with a message
 * @param maybeError - The unknown to convert
 * @returns An error with a message
 */
function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

/**
 * Get an error message from an unknown
 * @param error - The unknown to get the message from
 * @returns The error message
 */
export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message
}
