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
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParameters = createTenantRouteParams({
  userId: Id,
})

const QueryParameters = z.object({
  ...DeleteQueryParams,
})

const RouteParamErrors = toValidationMessages(RouteParameters)
const QueryParamErrors = toValidationMessages(QueryParameters)

export const TenantDeleteUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantUser],
  method: 'delete',
  summary: 'Delete User',
  path: ApiPath.Tenant.Users.Delete,
  request: {
    params: RouteParameters,
    query: QueryParameters,
  },
  responses: {
    200: createDataResponse('Deleted user', TenantUserReadable),
    404: createJsonBody(
      'Parameter not found',
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
