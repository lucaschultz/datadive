import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createInvalidCredentialsError } from '../../../shared/errors/create-wrong-credentials-error'
import { Email } from '../../../shared/schemas/email'
import { Password } from '../../../shared/schemas/password'
import { Username } from '../../../shared/schemas/username'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

export const UsernameCredentials = z.object({
  username: Username,
  password: Password,
})

export const EmailCredentials = z.object({
  email: Email,
  password: Password,
})

const Credentials = z.union([UsernameCredentials, EmailCredentials])

const CredentialsValidationMessages = z.union([
  toValidationMessages(UsernameCredentials),
  toValidationMessages(EmailCredentials),
])

export const LandlordSignInEndpoint = createPublicEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Sign-in',
  path: ApiPath.Landlord.Auth.SignIn,
  request: {
    body: createJsonBody('User credentials', Credentials),
  },
  responses: {
    200: createDataResponse('Signed in', LandlordUserReadable),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(CredentialsValidationMessages),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('body', CredentialsValidationMessages),
    ),
  },
})
