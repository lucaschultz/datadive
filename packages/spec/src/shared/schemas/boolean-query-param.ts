import { z } from '../utilities/z'

export const BooleanQueryParam = z
  .enum(['true', 'false'])
  .optional()
  .default('false')
  .transform((value) => {
    return value === 'true' ? true : false
  })
