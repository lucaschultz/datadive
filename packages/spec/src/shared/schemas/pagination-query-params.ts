import { z } from '../utilities/z'

export const PaginationQueryParams = {
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(1000).optional().default(20),
}
