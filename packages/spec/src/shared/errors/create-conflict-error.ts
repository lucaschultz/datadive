import { ApiErrorCode } from '../constants/api-error-code'
import { ApiErrorName } from '../constants/api-error-name'
import { z } from '../utilities/z'

export function createConflictError<TBodySchema extends z.ZodTypeAny>(
  errorMessagesSchema: TBodySchema,
) {
  return z
    .object({
      success: z.literal(false),
      title: z.string(),
      detail: z.string().optional(),
      status: z.number().int(),
      type: z.string(),
      code: z.literal(ApiErrorCode.Conflict),
      errorMessages: z.object({
        body: errorMessagesSchema,
      }),
    })
    .openapi(ApiErrorName.Conflict, {
      description:
        'The request conflicts with the current state of the server.',
    })
}

export type ConflictError<
  TBody extends { [key: string]: Array<string> } = {
    [key: string]: Array<string>
  },
> = z.infer<ReturnType<typeof createConflictError<z.ZodType<TBody>>>>
