import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { ApiErrorName } from '../constants/api-error-name'
import { ApiError } from '../errors/api-error'

export function registerAllErrors(registry: OpenAPIRegistry) {
  const apiErrors = new Map(Object.entries(ApiError))
  const apiErrorNames = new Map(Object.entries(ApiErrorName))

  for (const [key, name] of apiErrorNames.entries()) {
    const error = apiErrors.get(key)
    if (error) {
      registry.register(name, error)
    }
  }
}
