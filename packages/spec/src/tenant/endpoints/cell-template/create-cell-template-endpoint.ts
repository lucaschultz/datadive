import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { z } from '../../../shared/utilities/z'
import { CellTemplateCreatable } from '../../schemas/cell-template-creatable'
import { CellTemplateReadable } from '../../schemas/cell-template-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

export const CreateCellTemplateEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantCellTemplate],
  method: 'post',
  summary: 'Create Cell Template',
  path: ApiPath.Tenant.CellTemplates.Create,
  request: {
    body: createJsonBody('Create cell template data', CellTemplateCreatable),
    params: DefaultTenantRouteParams,
  },
  responses: {
    201: createDataResponse('Created cell template', CellTemplateReadable),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(
          CellTemplateCreatable.pick({ id: true, title: true }),
        ),
      ),
    ),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(
        toValidationMessages(DefaultTenantRouteParams),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError(
          'body',
          toValidationMessages(CellTemplateCreatable),
        ),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
