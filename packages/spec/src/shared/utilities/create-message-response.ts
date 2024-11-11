import { createJsonBody } from './create-json-body'
import { z } from './z'

export function createMessageResponse<TSchema extends z.ZodTypeAny>(
  description: string,
  options?: Partial<{ example: z.output<TSchema> }>,
) {
  return createJsonBody(
    description,
    z.object({
      success: z.literal(true),
      message: z.string(),
    }),
    {
      example: {
        success: true,
        message: '…',
      },
      ...options,
    },
  )
}

export type MessageResponse<TData> = ReturnType<
  typeof createMessageResponse<z.ZodType<TData>>
>['content']['application/json']['schema']
