import { z } from '../utilities/z'

export const Title = z
  .string()
  .min(1)
  .max(50)
  .regex(/^[^\r\n]*$/, { message: 'Must not contain line breaks' })
