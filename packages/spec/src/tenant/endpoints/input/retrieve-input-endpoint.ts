import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createRouteParamNotFoundError } from '../../../shared/errors/create-route-param-not-found-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { Id } from '../../../shared/schemas/id'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { InputReadable } from '../../schemas/input-readable'
import { createTenantRouteParams } from '../../utilities/create-tenant-route-params'

const RouteParams = createTenantRouteParams({
  inputId: Id,
})

const RouteParamsErrorMessages = toValidationMessages(RouteParams)

export const RetrieveInputEndpoint = createProtectedEndpoint({
  tags: [ApiTag.TenantInput],
  method: 'get',
  summary: 'Retrieve Input',
  path: ApiPath.Tenant.Inputs.Retrieve,
  request: {
    params: RouteParams,
  },
  responses: {
    200: createDataResponse('Input', InputReadable),
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
