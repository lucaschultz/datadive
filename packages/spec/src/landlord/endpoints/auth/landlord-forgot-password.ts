import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createInvalidCredentialsError } from '../../../shared/errors/create-wrong-credentials-error'
import { Email } from '../../../shared/schemas/email'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'

const Body = z.object({
  email: Email,
})
export const LandlordForgotPasswordEndpoint = createPublicEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Forgot password',
  path: ApiPath.Landlord.Auth.ForgotPassword,
  request: {
    body: createJsonBody('Forgot password data', Body),
  },
  responses: {
    200: createMessageResponse('Password reset email sent'),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(toValidationMessages(Body)),
    ),
    422: createJsonBody(
      'Body validation error',
      createValidationError('body', toValidationMessages(Body)),
    ),
  },
})
