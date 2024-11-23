import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { LandlordUserCreatable } from '../../schemas/landlord-user-creatable'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

export const LandlordCreateUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordUser],
  method: 'post',
  summary: 'Create User',
  path: ApiPath.Landlord.Users.Create,
  request: {
    body: createJsonBody('Create user data', LandlordUserCreatable),
  },
  responses: {
    201: createDataResponse('Created user', LandlordUserReadable),
    409: createJsonBody(
      'Conflict error',
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
