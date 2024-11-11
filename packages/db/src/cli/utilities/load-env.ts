import type { ArgDef } from 'citty'

import { config } from 'dotenv'
import { z } from 'zod'
import { fromError } from 'zod-validation-error'

import { exitWithError } from '../arguments/exit-with-error'

export function loadEnv<TSchema extends z.ZodType<{ [key: string]: string }>>(
  schema: TSchema,
  options: Partial<{ path: string }> = {},
): z.infer<TSchema> {
  const data = config(options)

  if (data.error) {
    return exitWithError(`Error loading env file "${options.path ?? '.env'}"`)
  }

  const parsed = schema.safeParse(data.parsed)

  if (parsed.error) {
    return exitWithError(
      fromError(parsed.error, {
        prefix: 'Error validating env file',
      }).toString(),
    )
  }

  return parsed.data
}

export const envArg = {
  type: 'string',
  description: 'Use the .env file',
  required: false,
  alias: 'e',
  valueHint: 'path',
} satisfies ArgDef

const nonEmptyString = z.string().refine((value) => value.length > 0, {
  message: 'Must be a non-empty string',
})

export const TursoEnvSchema = z.object({
  TURSO_API_TOKEN: nonEmptyString,
  TURSO_ORG: nonEmptyString,
})

export const LandlordDatabaseEnvSchema = z.object({
  LANDLORD_DATABASE_AUTH_TOKEN: nonEmptyString,
  LANDLORD_DATABASE_URL: nonEmptyString,
})

export const AppKeyEnvSchema = z.object({
  APP_KEY: nonEmptyString,
})
