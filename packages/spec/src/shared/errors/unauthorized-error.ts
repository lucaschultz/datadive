import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { createJsonBody } from '../utilities/create-json-body'
import { z } from '../utilities/z'

export const UnauthorizedError = z
  .object({
    success: z.literal(false),
    title: z.string(),
    detail: z.string().optional(),
    status: z.number().int(),
    type: z.string(),
    code: z.literal(ApiErrorCode.Unauthorized),
    errorMessages: z.union([
      z.object({
        headers: z.object({
          'x-session': z.array(z.string()),
        }),
      }),
      z.object({
        cookies: z.object({
          session: z.array(z.string()),
        }),
      }),
      z.object({
        headers: z.object({
          'x-session': z.array(z.string()),
        }),
        cookies: z.object({
          session: z.array(z.string()),
        }),
      }),
    ]),
  })
  .openapi(ApiErrorName.Unauthorized, {
    description:
      'The request is unauthorized. Either the `x-session` header or the `session` cookie must be set and match an active session.',
  })

export type UnauthorizedError = z.infer<typeof UnauthorizedError>

export const UnauthorizedResponse = createJsonBody(
  'Unauthorized',
  UnauthorizedError,
)
