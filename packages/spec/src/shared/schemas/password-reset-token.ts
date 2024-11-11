import { z } from '../utilities/z'

export const PasswordResetToken = z
  .string()
  .length(96)
  .regex(/^[0-9a-f]+$/, { message: 'Must be hexadecimal characters' })
  .openapi({
    description: 'A string of 96 lowercase hexadecimal characters',
    example:
      'f0e9c8d1f8a5e5e7c8b629bfe32dd582763b343c131d8be74c8457cd77b9b080d56cd818d2d00992870555e7b9bd3337',
  })
