import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

import { landlordCoreEnv } from '@datadive/core'
import { emailEnv } from '@datadive/email'

export const apiEnv = createEnv({
  extends: [emailEnv, landlordCoreEnv],
  server: {
    NODE_ENV: z.enum(['development', 'production']),
    APP_KEY: z.string().min(1),

    LANDLORD_DATABASE_URL: z.string().url(),
    LANDLORD_DATABASE_AUTH_TOKEN: z.string().min(1).optional(),

    PORT: z.coerce.number().optional().default(41201),

    TURSO_API_TOKEN: z.string().min(1),
    TURSO_ORG: z.string().min(1),
    TURSO_GROUP: z.string().min(1).optional(),

    BASE_URL: z
      .string()
      .url()
      .refine((url) => !url.endsWith('/'), {
        message: 'Base URL must not end with a slash',
      }),
    SPECIFICATION_PATH: z.string().refine((path) => path.startsWith('/'), {
      message: 'Specification path must start with a slash',
    }),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
})
