import { constEnum } from '@datadive/utils/common'

export const ApiErrorName = constEnum({
  NotAcceptable: 'ErrorNotAcceptable',
  Unauthorized: 'ErrorUnauthorized',
  EndpointNotFound: 'ErrorEndpointNotFound',
  Internal: 'ErrorInternal',
  RouteParamNotFound: 'ErrorRouteParameterNotFound',
  Conflict: 'ErrorConflict',
  BodyValidation: 'ErrorBodyValidation',
  CookieValidation: 'ErrorCookieValidation',
  HeaderValidation: 'ErrorHeaderValidation',
  QueryParamValidation: 'ErrorQueryParamValidation',
  RouteParamValidation: 'ErrorRouteParamValidation',
  InvalidCredentials: 'ErrorInvalidCredentials',
})

export type ApiErrorName = constEnum<typeof ApiErrorName>
