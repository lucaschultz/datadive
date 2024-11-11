import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { PaginationQueryParams } from '../../../shared/schemas/pagination-query-params'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createListResponse } from '../../../shared/utilities/create-list-response'
import { createSortQueryParams } from '../../../shared/utilities/create-sort-query-params'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { LandlordUserReadable } from '../../schemas/landlord-user-readable'

const QueryParams = z.object({
  ...PaginationQueryParams,
  ...createSortQueryParams(
    LandlordUserReadable,
    z
      .enum([
        'username',
        'firstName',
        'lastName',
        'email',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ])
      .optional()
      .default('username'),
  ),
})

const QueryParameterValidationErrors = toValidationMessages(QueryParams)

export const LandlordListUsersEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordUser],
  method: 'get',
  summary: 'List Users',
  path: ApiPath.Landlord.Users.List,
  request: {
    query: QueryParams,
  },
  responses: {
    200: createListResponse('User list', LandlordUserReadable),
    422: createJsonBody(
      'Validation error',
      createValidationError('query_param', QueryParameterValidationErrors),
    ),
  },
})
