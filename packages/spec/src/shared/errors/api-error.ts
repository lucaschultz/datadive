import { ApiErrorName } from '../constants/api-error-name'
import { z } from '../utilities/z'
import { createConflictError } from './create-conflict-error'
import { createRouteParamNotFoundError } from './create-route-param-not-found-error'
import { createValidationError } from './create-validation-error'
import { createInvalidCredentialsError } from './create-wrong-credentials-error'
import { EndpointNotFoundError } from './endpoint-not-found-error'
import { NotAcceptableError } from './not-acceptable-error'
import { InternalError } from './server-error'
import { UnauthorizedError } from './unauthorized-error'

export const ApiError = {
  NotAcceptable: NotAcceptableError.openapi(ApiErrorName.NotAcceptable),
  Unauthorized: UnauthorizedError.openapi(ApiErrorName.Unauthorized),
  EndpointNotFound: EndpointNotFoundError.openapi(
    ApiErrorName.EndpointNotFound,
  ),
  Internal: InternalError.openapi(ApiErrorName.Internal),
  RouteParamNotFound: createRouteParamNotFoundError(
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.RouteParamNotFound),
  Conflict: createConflictError(z.record(z.array(z.string()))).openapi(
    ApiErrorName.Conflict,
  ),
  BodyValidation: createValidationError(
    'body',
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.BodyValidation),
  QueryParamValidation: createValidationError(
    'query_param',
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.QueryParamValidation),
  RouteParamValidation: createValidationError(
    'route_param',
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.RouteParamValidation),
  HeaderValidation: createValidationError(
    'header',
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.HeaderValidation),
  CookieValidation: createValidationError(
    'cookie',
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.CookieValidation),
  InvalidCredentials: createInvalidCredentialsError(
    z.record(z.array(z.string())),
  ).openapi(ApiErrorName.InvalidCredentials),
} satisfies { [Key in keyof typeof ApiErrorName]: z.ZodTypeAny }

export type ApiError = z.infer<(typeof ApiError)[keyof typeof ApiError]>
