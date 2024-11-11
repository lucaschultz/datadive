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
import { TenantReadable } from '../../schemas/tenant-readable'

const QueryParams = z.object({
  ...PaginationQueryParams,
  ...createSortQueryParams(
    TenantReadable,
    z
      .enum(['name', 'domain', 'createdAt', 'updatedAt', 'deletedAt'])
      .optional()
      .default('name'),
  ),
})

const QueryParamErrors = toValidationMessages(QueryParams)

export const ListTenantsEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordTenant],
  method: 'get',
  summary: 'List Tenants',
  path: ApiPath.Landlord.Tenants.List,
  request: {
    query: QueryParams,
  },
  responses: {
    200: createListResponse('Tenant list', TenantReadable),
    422: createJsonBody(
      'Validation error',
      createValidationError('query_param', QueryParamErrors),
    ),
  },
})
