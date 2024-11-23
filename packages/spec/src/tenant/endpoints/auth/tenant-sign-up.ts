import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { TenantUserCreatable } from '../../schemas/tenant-user-creatable'
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

export const TenantSignUpEndpoint = createPublicEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Sign up',
  path: ApiPath.Tenant.Auth.SignUp,
  request: {
    body: createJsonBody('User data', TenantUserCreatable),
    params: DefaultTenantRouteParams,
  },
  responses: {
    201: createDataResponse('Signed up', TenantUserReadable),
    409: createJsonBody(
      'User conflict',
      createConflictError(
        toValidationMessages(
          TenantUserCreatable.pick({ email: true, username: true, id: true }),
        ),
      ),
    ),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError(
          'body',
          toValidationMessages(TenantUserCreatable),
        ),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
