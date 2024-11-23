import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { EmailVerificationCode } from '../../../shared/schemas/email-verification-code'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

const VerifyEmailData = z.object({
  code: EmailVerificationCode,
})

export const TenantVerifyEmailEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Verify email',
  path: ApiPath.Tenant.Auth.VerifyEmail,
  request: {
    body: createJsonBody('Verify email data', VerifyEmailData),
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createMessageResponse('Verification successful'),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError('body', toValidationMessages(VerifyEmailData)),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
