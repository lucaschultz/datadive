import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
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
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

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

export const TenantTokenEndpoint = createPublicEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Long lived token',
  path: ApiPath.Tenant.Auth.Token,
  request: {
    body: createJsonBody(
      'Credentials',
      z.union([TokenEmailCredentials, TokenUsernameCredentials]),
    ),
    params: DefaultTenantRouteParams,
  },
  responses: {
    201: createDataResponse(
      'Token created',
      z.object({ token: z.string(), user: TenantUserReadable }),
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
          z.union([
            toValidationMessages(TokenEmailCredentials),
            toValidationMessages(TokenUsernameCredentials),
          ]),
        ),
        createValidationError(
          'body',
          z.union([
            toValidationMessages(TokenEmailCredentials),
            toValidationMessages(TokenUsernameCredentials),
          ]),
        ),
      ]),
    ),
  },
})
