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
import { CellTemplateReadable } from '../../schemas/cell-template-readable'
import { CellTemplateUpdatable } from '../../schemas/cell-template-updateable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams({
  cellTemplateId: Id,
})

export const UpdateCellTemplateEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantCellTemplate],
  method: 'put',
  summary: 'Update Cell Template',
  path: ApiPath.Tenant.CellTemplates.Update,
  request: {
    params: RouteParams,
    body: createJsonBody('Cell template update', CellTemplateUpdatable),
  },
  responses: {
    201: createDataResponse('Updated cell template', CellTemplateReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(
          CellTemplateUpdatable.pick({
            title: true,
          }),
        ),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError(
          'body',
          toValidationMessages(CellTemplateUpdatable),
        ),
        createValidationError('route_param', toValidationMessages(RouteParams)),
      ]),
    ),
  },
})
