import { ApiPath } from '../../../shared/constants/api-path'
import { ApiTag } from '../../../shared/constants/api-tag'
import { createConflictError } from '../../../shared/errors/create-conflict-error'
import { createValidationError } from '../../../shared/errors/create-validation-error'
import { createDataResponse } from '../../../shared/utilities/create-data-response'
import { createProtectedEndpoint } from '../../../shared/utilities/create-endpoint'
import { createJsonBody } from '../../../shared/utilities/create-json-body'
import { toValidationMessages } from '../../../shared/utilities/to-validation-messages'
import { TenantCreatable } from '../../schemas/tenant-creatable'
import { TenantReadable } from '../../schemas/tenant-readable'

export const CreateTenantEndpoint = createProtectedEndpoint({
  tags: [ApiTag.LandlordTenant],
  method: 'post',
  summary: 'Create Tenant',
  path: ApiPath.Landlord.Tenants.Create,
  request: {
    body: createJsonBody('Create tenant data', TenantCreatable),
  },
  responses: {
    201: createDataResponse('Created tenant', TenantReadable),
    409: createJsonBody(
      'Conflict error',
      createConflictError(
        toValidationMessages(TenantCreatable.pick({ id: true })),
      ),
    ),
    422: createJsonBody(
      'Validation error',
      createValidationError('body', toValidationMessages(TenantCreatable)),
    ),
  },
})
