import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { TenantUserCreatable } from '../../schemas/tenant-user-creatable'
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams()

export const TenantCreateUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantUser],
  method: 'post',
  summary: 'Create User',
  path: ApiPath.Tenant.Users.Create,
  request: {
    body: createJsonBody('Create user data', TenantUserCreatable),
    params: RouteParams,
  },
  responses: {
    201: createDataResponse('Created user', TenantUserReadable),
    404: createJsonBody(
      'Tenant or user not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('body', toValidationMessages(TenantUserCreatable)),
    ),
  },
})
