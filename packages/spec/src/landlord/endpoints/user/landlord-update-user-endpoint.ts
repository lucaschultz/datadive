import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'
import { LandlordUserUpdateable } from '../../schemas/landlord-user-updateable'

const RouteParams = z.object({
  userId: Id,
})

export const LandlordUpdateUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordUser],
  method: 'put',
  summary: 'Update User',
  path: ApiPath.Landlord.Users.Update,
  request: {
    params: RouteParams,
    body: createJsonBody('User update', LandlordUserUpdateable),
  },
  responses: {
    201: createDataResponse('Updated user', LandlordUserReadable),
    404: createJsonBody(
      'User not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(
          LandlordUserUpdateable.pick({ email: true, username: true }),
        ),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError(
          'body',
          toValidationMessages(LandlordUserUpdateable),
        ),
        createValidationError('route_param', toValidationMessages(RouteParams)),
      ]),
    ),
  },
})
