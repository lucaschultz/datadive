import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

export const LandlordCurrentUserEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'get',
  summary: 'Current user',
  path: ApiPath.Landlord.Auth.CurrentUser,
  responses: {
    200: createDataResponse('Current user', LandlordUserReadable),
  },
})
