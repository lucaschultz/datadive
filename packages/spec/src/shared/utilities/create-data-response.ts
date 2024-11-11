import { createJsonBody } from './create-json-body'
import { z } from './z'

export function createDataResponse<TSchema extends z.ZodTypeAny>(
  description: string,
  schema: TSchema,
  options?: Partial<{ example: z.output<TSchema> }>,
) {
  return createJsonBody(
    description,
    z.object({
      success: z.literal(true),
      message: z.string(),
      data: schema,
    }),
    options,
  )
}

export type DataResponse<TData> = ReturnType<
  typeof createDataResponse<z.ZodType<TData>>
>['content']['application/json']['schema']
