import type { ApiErrorName } from './api-error-name'

import { constEnum } from '@datadive/utils/common'

export const ApiErrorCode = constEnum({
  NotAcceptable: 'not_acceptable',
  Unauthorized: 'unauthorized',
  EndpointNotFound: 'endpoint_not_found',
  Internal: 'internal_error',
  RouteParamNotFound: 'route_parameter_not_found',
  Conflict: 'conflict',
  BodyValidation: 'body_validation',
  CookieValidation: 'cookie_validation',
  HeaderValidation: 'header_validation',
  QueryParamValidation: 'query_param_validation',
  RouteParamValidation: 'route_param_validation',
  InvalidCredentials: 'invalid_credentials',
} as const satisfies { [Key in keyof typeof ApiErrorName]: string })

export type ApiErrorCode = constEnum<typeof ApiErrorCode>
