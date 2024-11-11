import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createInvalidCredentialsError } from '../../../shared/errors/create-wrong-credentials-error'
import { Password } from '../../../shared/schemas/password'
import { PasswordResetToken } from '../../../shared/schemas/password-reset-token'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'

const ResetPasswordCredentials = z.object({
  token: PasswordResetToken,
  password: Password,
})

export const LandlordResetPasswordEndpoint = createPublicEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Forgot password',
  path: ApiPath.Landlord.Auth.ForgotPassword,
  request: {
    body: createJsonBody(
      'Reset password credentials',
      ResetPasswordCredentials,
    ),
  },
  responses: {
    200: createMessageResponse('Reset successful'),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(
        toValidationMessages(ResetPasswordCredentials.pick({ token: true })),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      createInvalidCredentialsError(
        toValidationMessages(ResetPasswordCredentials),
      ),
    ),
  },
})
