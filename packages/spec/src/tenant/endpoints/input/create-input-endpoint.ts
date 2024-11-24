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
import { InputCreatable } from '../../schemas/input-creatable'
import { InputReadable } from '../../schemas/input-readable'
import { DefaultTenantRouteParams } from '../../utilities/create-tenant-route-params'

export const CreateInputEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantInput],
  method: 'post',
  summary: 'Create Input',
  path: ApiPath.Tenant.Inputs.Create,
  request: {
    body: createJsonBody('Create input data', InputCreatable),
    params: DefaultTenantRouteParams,
  },
  responses: {
    201: createDataResponse('Created input', InputReadable),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(InputCreatable.pick({ id: true, title: true })),
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
        createValidationError('body', toValidationMessages(InputCreatable)),
        createValidationError(
          'route_param',
          toValidationMessages(DefaultTenantRouteParams),
        ),
      ]),
    ),
  },
})
