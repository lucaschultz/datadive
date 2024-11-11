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
import { TenantReadable } from '../../schemas/tenant-readable'

const RouteParams = z.object({
  tenantId: Id,
})

const QueryParams = z.object({
  ...DeleteQueryParams,
})

const RouteParamErrors = toValidationMessages(RouteParams)
const QueryParamErrors = toValidationMessages(QueryParams)

export const DeleteTenantEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordTenant],
  method: 'delete',
  summary: 'Delete Tenant',
  path: ApiPath.Landlord.Tenants.Delete,
  request: {
    params: RouteParams,
    query: QueryParams,
  },
  responses: {
    200: createDataResponse('Deleted tenant', TenantReadable),
    404: createJsonBody(
      'Tenant not found',
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
