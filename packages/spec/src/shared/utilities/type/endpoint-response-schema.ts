import type { RouteConfig } from '@asteasolutions/zod-to-openapi'
import type { z } from '../z'

/**
 * Extracts the response schema from an endpoint.
 */
export type EndpointResponseSchema<
  TEndpoint extends RouteConfig,
  TCode extends keyof TEndpoint['responses'],
> = TEndpoint['responses'][TCode]['content'] extends {
  'application/json': { schema: infer TSchema }
}
  ? TSchema extends z.ZodTypeAny
    ? TSchema
    : never
  : never
