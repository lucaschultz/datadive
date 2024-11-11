import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

export const LandlordSignOutEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordAuth],
  method: 'post',
  summary: 'Sign-out',
  path: ApiPath.Landlord.Auth.SignOut,
  responses: {
    200: createDataResponse('Signed out', LandlordUserReadable),
  },
})
