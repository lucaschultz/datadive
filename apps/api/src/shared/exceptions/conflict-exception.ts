import type { ApiError, EndpointResponseSchema } from '@datadive/spec'
import type { RouteConfig } from '@hono/zod-openapi'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { getErrorType } from '../utils/get-error-type'

type ConflictBody = z.output<typeof ApiError.Conflict>

interface ConflictExceptionOptions {
  cause?: unknown
}

export class ConflictException extends HTTPException {
  constructor(
    data: Pick<ConflictBody, 'errorMessages' | 'detail'>,
    options?: ConflictExceptionOptions,
  ) {
    super(409, {
      res: Response.json({
        success: false,
        status: 409,
        code: 'conflict',
        type: getErrorType('conflict'),
        title: 'A conflict occurred while processing the request.',
        ...data,
      } satisfies ConflictBody),
      ...options,
    })
  }

  public static forRoute<TRouteConfig extends RouteConfig>(
    _route: TRouteConfig,
    data: Pick<
      z.output<EndpointResponseSchema<TRouteConfig, 409>>,
      'errorMessages' | 'detail'
    >,
  ) {
    return new ConflictException(data)
  }
}
