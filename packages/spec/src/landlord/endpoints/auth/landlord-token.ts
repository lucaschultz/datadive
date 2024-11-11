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

const DaysValidSchema = z
  .number()
  .min(1)
  .max(10 * 365)
  .optional()
  .default(365)
  .openapi({
    description: 'Number of days the token is valid',
  })

const TokenEmailCredentials = z.object({
  daysValid: DaysValidSchema,
  email: Email,
  password: Password,
})

const TokenUsernameCredentials = z.object({
  daysValid: DaysValidSchema,
  username: Username,
  password: Password,
})

export const LandlordTokenEndpoint = createPublicEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Long lived token',
  path: ApiPath.Landlord.Auth.Token,
  request: {
    body: createJsonBody(
      'Credentials',
      z.union([TokenEmailCredentials, TokenUsernameCredentials]),
    ),
  },
  responses: {
    201: createDataResponse(
      'Token created',
      z.object({ token: z.string(), user: LandlordUserReadable }),
    ),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(
        z.union([
          toValidationMessages(
            TokenEmailCredentials.pick({ email: true, password: true }),
          ),
          toValidationMessages(
            TokenUsernameCredentials.pick({
              username: true,
              password: true,
            }),
          ),
        ]),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError(
        'body',
        z.union([
          toValidationMessages(TokenEmailCredentials),
          toValidationMessages(TokenUsernameCredentials),
        ]),
      ),
    ),
  },
})
