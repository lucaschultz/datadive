import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { DeleteQueryParams } from '../../../shared/schemas/delete-query-params'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

const RouteParams = z.object({
  userId: Id,
})

const QueryParameters = z.object({
  ...DeleteQueryParams,
})

const RouteParamErrors = toValidationMessages(RouteParams)
const QueryParamErrors = toValidationMessages(QueryParameters)

export const LandlordDeleteUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordUser],
  method: 'delete',
  summary: 'Delete User',
  path: ApiPath.Landlord.Users.Delete,
  request: {
    params: RouteParams,
    query: QueryParameters,
  },
  responses: {
    200: createDataResponse('Deleted user', LandlordUserReadable),
    404: createJsonBody(
      'User not found',
      createRouteParamNotFoundError(RouteParamErrors),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError('route_param', RouteParamErrors),
        createValidationError('query_param', QueryParamErrors),
      ]),
    ),
  },
})
