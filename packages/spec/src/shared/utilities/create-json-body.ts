import type { z } from './z'

export function createJsonBody<TSchema extends z.ZodTypeAny>(
  description: string,
  schema: TSchema,
  options?: Partial<{ example: z.output<TSchema> }>,
) {
  return {
    description: description,
    content: {
      'application/json': {
        schema: schema,
        example: options?.example,
      },
    },
  }
}
