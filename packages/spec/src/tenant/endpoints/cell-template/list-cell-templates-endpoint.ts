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
import { CellTemplateReadable } from '../../schemas/cell-template-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

const QueryParams = z.object({
  ...PaginationQueryParams,
  ...createSortQueryParams(
    CellTemplateReadable,
    z
      .enum([
        'title',
        'description',
        'code',
        'createdAt',
        'updatedAt',
        'deletedAt',
      ])
      .optional()
      .default('title'),
  ),
})

const QueryParameterValidationErrors = toValidationMessages(QueryParams)

export const ListCellTemplatesEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantCellTemplate],
  method: 'get',
  summary: 'List Cell Template',
  path: ApiPath.Tenant.CellTemplates.List,
  request: {
    query: QueryParams,
    params: DefaultTenantRouteParams,
  },
  responses: {
    200: createListResponse('Cell template list', CellTemplateReadable),
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
