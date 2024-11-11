import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createPublicEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { LandlordUserCreatable } from '../../schemas/landlord-user-creatable'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

export const LandlordSignUpEndpoint = createPublicEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Sign up',
  path: ApiPath.Landlord.Auth.SignUp,
  request: {
    body: createJsonBody('User data', LandlordUserCreatable),
  },
  responses: {
    201: createDataResponse('Signed up', LandlordUserReadable),
    409: createJsonBody(
      'User conflict',
      createConflictError(
        toValidationMessages(
          LandlordUserCreatable.pick({ email: true, username: true, id: true }),
        ),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError(
        'body',
        toValidationMessages(LandlordUserCreatable),
      ),
    ),
  },
})
