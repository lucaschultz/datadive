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

export const TenantSignInEndpoint = createPublicEndpoint({
  tags: [ApiTag.TenantAuth],
  method: 'post',
  summary: 'Sign-in',
  path: ApiPath.Tenant.Auth.SignIn,
  request: {
    body: createJsonBody('User credentials', Credentials),
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createDataResponse('Signed in', TenantUserReadable),
    401: createJsonBody(
      'Invalid credentials',
      createInvalidCredentialsError(CredentialsValidationMessages),
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
        createValidationError('body', CredentialsValidationMessages),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
