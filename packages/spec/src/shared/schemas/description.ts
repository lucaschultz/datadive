import { z } from '../utilities/z'

export const Description = z
  .string()
  .min(1)
  .max(255)
  .regex(/^[^\r\n]*$/, { message: 'Must not contain line breaks' })
