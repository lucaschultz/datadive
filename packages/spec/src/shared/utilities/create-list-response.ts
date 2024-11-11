import { createDataResponse } from './create-data-response'
import { z } from './z'

export function createListResponse<TSchema extends z.ZodTypeAny>(
  description: string,
  schema: TSchema,
  options?: Partial<{ example: Array<z.output<TSchema>> }>,
) {
  return createDataResponse(
    description,
    z.object({
      items: z
        .array(schema)
        .openapi({ description: 'Items of the current page' }),
      totalItems: z.number().openapi({ description: 'Total amount of items' }),
      totalPages: z.number().openapi({ description: 'Total amount of pages' }),
      hasNextPage: z
        .boolean()
        .openapi({ description: 'Indicates if there is a next page' }),
      hasPrevPage: z
        .boolean()
        .openapi({ description: 'Indicates if there is a previous page' }),
      perPage: z.number().openapi({ description: 'Amount of items per page' }),
      page: z.number().openapi({ description: 'Current page' }),
    }),
    {
      example: {
        items: options?.example ?? [],
        hasNextPage: true,
        hasPrevPage: false,
        page: 1,
        perPage: 10,
        totalPages: 4,
        totalItems: 42,
      },
    },
  )
}

export type ListResponseBodySchema<TSchema extends z.ZodTypeAny> = ReturnType<
  typeof createListResponse<TSchema>
>['content']['application/json']['schema']
