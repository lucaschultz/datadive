import { z } from './z'

export function createSortQueryParams<
  TSchema extends z.AnyZodObject,
  TSortableBy extends z.ZodType<keyof z.output<TSchema> | undefined>,
>(_schema: TSchema, sortableBy: TSortableBy) {
  return {
    sortBy: sortableBy,
    sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  }
}
