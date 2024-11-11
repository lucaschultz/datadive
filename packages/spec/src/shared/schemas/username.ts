import { z } from '../utilities/z'

export const Username = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9_]*$/, {
    message: 'Must contain only lowercase letters, numbers, and underscores',
  })
  .openapi({
    example: 'jane_doe',
  })
