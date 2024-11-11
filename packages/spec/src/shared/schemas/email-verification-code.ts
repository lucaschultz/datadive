import { z } from '../utilities/z'

export const EmailVerificationCode = z
  .string()
  .length(6)
  .regex(/^\d+$/, {
    message: 'Must be numeric characters',
  })
  .openapi({
    description: 'A string of 6 numeric characters',
    example: '424242',
  })
