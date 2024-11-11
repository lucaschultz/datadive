import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { createJsonBody } from '../utilities/create-json-body'
import { z } from '../utilities/z'

export const NotAcceptableError = z
  .object({
    success: z.literal(false),
    title: z.string(),
    detail: z.string().optional(),
    status: z.number().int(),
    type: z.string(),
    code: z.literal(ApiErrorCode.NotAcceptable),
    errorMessages: z.object({
      headers: z.object({
        accept: z.array(z.string()),
      }),
    }),
  })
  .openapi(ApiErrorName.NotAcceptable, {
    description:
      'The server cannot produce a response matching the accept header. Please note that except for the endpoints that are used for file downloads, the server only supports JSON responses, so the accept header must be set to `application/json`.',
  })

export type NotAcceptableError = z.infer<typeof NotAcceptableError>

export const NotAcceptableResponse = createJsonBody(
  'Invalid accept header',
  NotAcceptableError,
)
