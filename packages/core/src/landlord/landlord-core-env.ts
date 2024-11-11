import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const landlordCoreEnv = createEnv({
  server: {
    EMAIL_VERIFICATION_URL: z.string().url(),
    EMAIL_RESET_PASSWORD_URL: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
