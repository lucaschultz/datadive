import { z } from '../utilities/z'

export const Password = z.string().min(8).max(255).min(8).max(255).openapi({
  example: 'my-super-secret-password',
})
