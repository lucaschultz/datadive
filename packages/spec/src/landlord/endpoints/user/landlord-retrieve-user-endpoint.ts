import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

const RouteParams = z.object({
  userId: Id,
})

const RouteParamsErrorMessages = toValidationMessages(RouteParams)

export const LandlordRetrieveUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordUser],
  method: 'get',
  summary: 'Retrieve User',
  path: ApiPath.Landlord.Users.Retrieve,
  request: {
    params: RouteParams,
  },
  responses: {
    200: createDataResponse('User', LandlordUserReadable),
    404: createJsonBody(
      'User not found',
      createRouteParamNotFoundError(RouteParamsErrorMessages),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('route_param', RouteParamsErrorMessages),
    ),
  },
})
