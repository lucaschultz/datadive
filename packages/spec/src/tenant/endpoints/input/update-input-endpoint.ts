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
import { InputReadable } from '../../schemas/input-readable'
import { InputUpdateable } from '../../schemas/input-updateable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams({
  inputId: Id,
})

export const UpdateInputEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantInput],
  method: 'put',
  summary: 'Update Input',
  path: ApiPath.Tenant.Inputs.Update,
  request: {
    params: RouteParams,
    body: createJsonBody('Input update', InputUpdateable),
  },
  responses: {
    201: createDataResponse('Updated input', InputReadable),
    404: createJsonBody(
      'Not found',
      createRouteParamNotFoundError(toValidationMessages(RouteParams)),
    ),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(
          InputUpdateable.pick({
            title: true,
          }),
        ),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      z.union([
        createValidationError('body', toValidationMessages(InputUpdateable)),
        createValidationError('route_param', toValidationMessages(RouteParams)),
      ]),
    ),
  },
})
