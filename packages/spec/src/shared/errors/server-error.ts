import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { createJsonBody } from '../utilities/create-json-body'
import { z } from '../utilities/z'

export const InternalError = z
  .object({
    success: z.literal(false),
    title: z.string(),
    detail: z.string().optional(),
    status: z.number().int(),
    type: z.string(),
    code: z.literal(ApiErrorCode.Internal),
  })
  .openapi(ApiErrorName.Internal, {
    description: 'An unexpected error occurred on the server.',
  })

export type InternalError = z.infer<typeof InternalError>

export const InternalErrorResponse = createJsonBody(
  'Internal server error',
  InternalError,
)
