import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { EmailVerificationCode } from '../../../shared/schemas/email-verification-code'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createMessageResponse } from '../../../shared/utilities/create-message-response'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'

const VerifyEmailData = z.object({
  code: EmailVerificationCode,
})

export const LandlordVerifyEmailEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Verify email',
  path: ApiPath.Landlord.Auth.VerifyEmail,
  request: {
    body: createJsonBody('Verify email data', VerifyEmailData),
  },
  responses: {
    200: createMessageResponse('Verification successful'),
    422: createJsonBody(
      'Validation error',
      createValidationError('body', toValidationMessages(VerifyEmailData)),
    ),
  },
})
