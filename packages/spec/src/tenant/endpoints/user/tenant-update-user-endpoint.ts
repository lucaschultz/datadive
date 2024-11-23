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
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { TenantUserUpdateable } from '../../schemas/tenant-user-updateable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams({
  userId: Id,
})

export const TenantUpdateUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantUser],
  method: 'put',
  summary: 'Update User',
  path: ApiPath.Tenant.Users.Update,
  request: {
    params: RouteParams,
    body: createJsonBody('User update', TenantUserUpdateable),
  },
  responses: {
    201: createDataResponse('Updated user', TenantUserReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(
          TenantUserUpdateable.pick({ email: true, username: true }),
        ),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError(
          'body',
          toValidationMessages(TenantUserUpdateable),
        ),
        createValidationError('route_param', toValidationMessages(RouteParams)),
      ]),
    ),
  },
})
