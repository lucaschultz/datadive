import type { EndpointResponseSchema } from '@datadive/spec'
import type { RouteConfig } from '@hono/zod-openapi'

import { z } from '@hono/zod-openapi'

import { ApiError } from '../errors'

function isSchema(value: unknown): value is z.ZodSchema {
  return value instanceof z.ZodSchema
}

export function useResponseHelper<TRouteConfig extends RouteConfig>(
  route: TRouteConfig,
) {
  return <
    const TCode extends keyof TRouteConfig['responses'],
    TSchema extends EndpointResponseSchema<
      TRouteConfig,
      TCode
    > = EndpointResponseSchema<TRouteConfig, TCode>,
  >(
    code: TCode,
    body: z.input<TSchema>,
  ): [z.output<TSchema>, TCode] => {
    // eslint-disable-next-line security/detect-object-injection
    const schema = route.responses[code]?.content?.['application/json']?.schema

    if (!isSchema(schema)) {
      throw new ApiError.ResponseCreationFailed(
        'Attempting to generate a JSON response for an endpoint that lacks a defined JSON response schema.',
      )
    }

    const parseResult = schema.safeParse(body)

    if (!parseResult.success) {
      throw new ApiError.ResponseCreationFailed(
        'Attempting to generate a JSON response with a body that does not match the defined schema.',
        { cause: parseResult.error },
      )
    }

    const verifiedBody = parseResult.data as z.output<TSchema>

    return [verifiedBody, code]
  }
}
