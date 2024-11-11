import type { z } from 'zod'

interface ValidationErrors {
  [key: string]: Array<string>
}

/**
 * Convert a Zod error to a map of validation errors
 * @param errors - The Zod error to convert
 * @returns A map of validation errors
 */
export function toValidationErrors(errors: z.ZodError): ValidationErrors {
  const fieldErrors = errors.flatten().fieldErrors

  const validationErrorMap = Object.entries(fieldErrors).reduce<
    Map<string, Array<string>>
  >((acc, [key, value]) => {
    acc.set(key, value ?? [])
    return acc
  }, new Map())

  return Object.fromEntries(validationErrorMap)
}
