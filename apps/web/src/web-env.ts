import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const webEnv = createEnv({
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    PORT: z.coerce.number().optional().default(3001),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
