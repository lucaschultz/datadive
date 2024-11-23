import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { CellTemplateReadable } from '../../schemas/cell-template-readable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams({
  cellTemplateId: Id,
})

const RouteParamsErrorMessages = toValidationMessages(RouteParams)

export const RetrieveCellTemplateEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantCellTemplate],
  method: 'get',
  summary: 'Retrieve Cell Template',
  path: ApiPath.Tenant.CellTemplates.Retrieve,
  request: {
    params: RouteParams,
  },
  responses: {
    200: createDataResponse('Cell template', CellTemplateReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(RouteParamsErrorMessages),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('route_param', RouteParamsErrorMessages),
    ),
  },
})
