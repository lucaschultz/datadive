import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { TenantReadable } from '../../schemas/tenant-readable'

const RouteParams = z.object({
  tenantId: Id,
})

const RouteParamErrors = toValidationMessages(RouteParams)

export const RetrieveTenantEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordTenant],
  method: 'get',
  summary: 'Retrieve Tenant',
  path: ApiPath.Landlord.Tenants.Retrieve,
  request: {
    params: RouteParams,
  },
  responses: {
    200: createDataResponse('Tenant', TenantReadable),
    404: createJsonBody(
      'Tenant not found',
      createRouteParamNotFoundError(RouteParamErrors),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('route_param', RouteParamErrors),
    ),
  },
})
