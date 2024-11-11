import { z } from 'zod'

import { EndpointByMethod as GeneratedEndpointByMethod } from '../typed-open-api.generated'
import { BASE_URL } from './create-turso-api-client'

interface EndpointDefinition {
  response: z.ZodUnknown
}

const EndpointByMethod = GeneratedEndpointByMethod as {
  [key: string]: { [key: string]: unknown }
}

/**
 * Check if a value is a response schema
 * @param value - The value to check
 * @returns True if the value is a response schema
 */
function isEndpointDefinition(value: unknown): value is EndpointDefinition {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('response' in value)) {
    return false
  }

  if (!(value.response instanceof z.ZodType)) {
    return false
  }

  return true
}

/**
 * Get the response schema for an endpoint
 * @param method - The HTTP method
 * @param url - The URL of the endpoint
 * @returns The response schema of the endpoint or undefined if the endpoint has no response schema
 */
export function getResponseSchema(method: string, url: string): z.ZodUnknown {
  if (url.startsWith(BASE_URL)) {
    url = url.replace(BASE_URL, '')
  }

  // eslint-disable-next-line security/detect-object-injection
  const endpointDefinition = EndpointByMethod[method]?.[url]

  if (!isEndpointDefinition(endpointDefinition)) {
    throw new Error(`Unexpected endpoint definition for ${method} ${url}`)
  }

  return endpointDefinition.response
}
