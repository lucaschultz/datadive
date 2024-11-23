import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createInvalidCredentialsError } from '../../../shared/errors/create-wrong-credentials-error'
import { Password } from '../../../shared/schemas/password'
import { PasswordResetToken } from '../../../shared/schemas/password-reset-token'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

const ResetPasswordCredentials = z.object({
  token: PasswordResetToken,
  password: Password,
})

export const TenantResetPasswordEndpoint = createPublicEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Forgot password',
  path: ApiPath.Tenant.Auth.ForgotPassword,
  request: {
    body: createJsonBody(
      'Reset password credentials',
      ResetPasswordCredentials,
    ),
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createMessageResponse('Reset successful'),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(
        toValidationMessages(ResetPasswordCredentials.pick({ token: true })),
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
        createInvalidCredentialsError(
          toValidationMessages(ResetPasswordCredentials),
        ),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
