import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

export const TenantSignOutEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Sign-out',
  request: {
    params: DefaultTenantRouteParams,
  },
  path: ApiPath.Tenant.Auth.SignOut,
  responses: {
    200: createDataResponse('Signed out', TenantUserReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError(
        'route_param',
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
  },
})
