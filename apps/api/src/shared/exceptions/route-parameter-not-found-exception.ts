import type { ApiError, EndpointResponseSchema } from '@datadive/spec'
import type { RouteConfig } from '@hono/zod-openapi'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { getErrorType } from '../utils/get-error-type'

type RouteParamNotFoundBody = z.output<typeof ApiError.RouteParamNotFound>

interface RouteParamNotFoundExceptionOptions {
  cause?: unknown
}

export class RouteParamNotFoundException extends HTTPException {
  constructor(
    data: Pick<RouteParamNotFoundBody, 'errorMessages' | 'detail'>,
    options?: RouteParamNotFoundExceptionOptions,
  ) {
    super(404, {
      res: Response.json({
        success: false,
        status: 404,
        code: 'route_parameter_not_found',
        type: getErrorType('route_parameter_not_found'),
        title: 'No match for route parameters',
        ...data,
      } satisfies RouteParamNotFoundBody),
      ...options,
    })
  }

  public static forRoute<TRouteConfig extends RouteConfig>(
    _route: TRouteConfig,
    data: Pick<
      z.output<EndpointResponseSchema<TRouteConfig, 404>>,
      'errorMessages' | 'detail'
    >,
  ) {
    return new RouteParamNotFoundException(data)
  }
}
