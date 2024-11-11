import { z } from '../utilities/z'

export const Email = z
  .string()
  .email()
  .max(255)
  .openapi({ example: 'jane_doe@example.com' })
