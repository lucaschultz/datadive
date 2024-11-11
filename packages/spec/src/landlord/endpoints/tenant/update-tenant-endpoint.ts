import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { TenantReadable } from '../../schemas/tenant-readable'
import { TenantUpdateable } from '../../schemas/tenant-updateable'

const RouteParams = z.object({
  tenantId: Id,
})

export const UpdateTenantEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordTenant],
  method: 'put',
  summary: 'Update Tenant',
  path: ApiPath.Landlord.Tenants.Update,
  request: {
    params: RouteParams,
    body: createJsonBody('Tenant update', TenantUpdateable),
  },
  responses: {
    200: createDataResponse('Updated tenant', TenantReadable),
    404: createJsonBody(
      'Tenant not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    409: createJsonBody(
      'Tenant domain conflict',
      createConflictError(
        toValidationMessages(TenantUpdateable.pick({ domain: true })),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError('body', toValidationMessages(TenantUpdateable)),
        createValidationError('route_param', toValidationMessages(RouteParams)),
      ]),
    ),
  },
})
