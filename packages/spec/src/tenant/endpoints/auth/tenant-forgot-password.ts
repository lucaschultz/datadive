import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createInvalidCredentialsError } from '../../../shared/errors/create-wrong-credentials-error'
import { Email } from '../../../shared/schemas/email'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

const Body = z.object({
  email: Email,
})

export const TenantForgotPasswordEndpoint = createPublicEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Forgot password',
  path: ApiPath.Tenant.Auth.ForgotPassword,
  request: {
    body: createJsonBody('Forgot password data', Body),
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createMessageResponse('Password reset email sent'),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(toValidationMessages(Body)),
    ),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Body validation error',
      z.union([
        createValidationError('body', toValidationMessages(Body)),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
