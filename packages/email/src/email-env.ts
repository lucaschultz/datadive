import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const emailEnv = createEnv({
  server: {
    RESEND_API_KEY: z.string().min(1),
    EMAIL_DUMMY: z.string().email(),
    EMAIL_FROM: z.string().email(),

    NODE_ENV: z.union([z.literal('development'), z.literal('production')]),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
