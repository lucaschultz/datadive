import { z } from 'zod'

import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { createJsonBody } from '../utilities/create-json-body'

export const EndpointNotFoundError = z
  .object({
    success: z.literal(false),
    title: z.string(),
    detail: z.string().optional(),
    status: z.number().int(),
    type: z.string(),
    code: z.literal(ApiErrorCode.EndpointNotFound),
  })
  .openapi(ApiErrorName.EndpointNotFound, {
    description: 'The requested endpoint does not exist.',
  })

export type EndpointNotFoundError = z.infer<typeof EndpointNotFoundError>

export const EndpointNotFoundResponse = createJsonBody(
  'Endpoint not found',
  EndpointNotFoundError,
)
