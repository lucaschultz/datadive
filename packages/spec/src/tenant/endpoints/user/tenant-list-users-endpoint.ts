import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { PaginationQueryParams } from '../../../shared/schemas/pagination-query-params'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { createListResponse } from '../../../shared/utilities/create-list-response'
import { createSortQueryParams } from '../../../shared/utilities/create-sort-query-params'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { TenantUserReadable } from '../../schemas/tenant-user-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

const QueryParams = z.object({
  ...PaginationQueryParams,
  ...createSortQueryParams(
    TenantUserReadable,
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

export const TenantListUsersEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantUser],
  method: 'get',
  summary: 'List Users',
  path: ApiPath.Tenant.Users.List,
  request: {
    query: QueryParams,
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createListResponse('User list', TenantUserReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError('query_param', QueryParameterValidationErrors),
        createValidationError('route_param', DefaultTenantRouteParams),
      ]),
    ),
  },
})
