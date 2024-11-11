import type { ApiError, EndpointResponseSchema } from '@datadive/spec'
import type { RouteConfig } from '@hono/zod-openapi'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { getErrorType } from '../utils/get-error-type'

type InvalidCredentialsBody = z.output<typeof ApiError.InvalidCredentials>

interface InvalidCredentialsExceptionOptions {
  cause?: unknown
}

export class InvalidCredentialsException extends HTTPException {
  constructor(
    data: Pick<InvalidCredentialsBody, 'errorMessages' | 'detail'>,
    options?: InvalidCredentialsExceptionOptions,
  ) {
    super(401, {
      res: Response.json({
        success: false,
        status: 401,
        code: 'invalid_credentials',
        type: getErrorType('invalid_credentials'),
        title: 'Invalid credentials provided.',
        ...data,
      } satisfies InvalidCredentialsBody),
      ...options,
    })
  }

  public static forRoute<TRouteConfig extends RouteConfig>(
    _route: TRouteConfig,
    data: Pick<
      z.output<EndpointResponseSchema<TRouteConfig, 401>>,
      'errorMessages' | 'detail'
    >,
  ) {
    return new InvalidCredentialsException(data)
  }
}
