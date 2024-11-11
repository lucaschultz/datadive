import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParameters = createTenantRouteParams({
  userId: Id,
})

const RouteParamErrors = toValidationMessages(RouteParameters)

export const TenantRetrieveUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantUser],
  method: 'get',
  summary: 'Retrieve User',
  path: ApiPath.Tenant.Users.Retrieve,
  request: {
    params: RouteParameters,
  },
  responses: {
    200: createDataResponse('User', TenantUserReadable),
    404: createJsonBody(
      'Parameter not found',
      createRouteParamNotFoundError(RouteParamErrors),
    ),
    422: createJsonBody(
      'Validation Error',
      createValidationError('route_param', RouteParamErrors),
    ),
  },
})
