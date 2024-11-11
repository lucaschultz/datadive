import type {
  TursoDatabaseNameError,
  TursoFetchError,
  TursoHttpError,
  TursoValidationError,
} from '@datadive/turso'
import type { ResultAsync } from 'neverthrow'
import type z from 'zod'

import { err, ok } from 'neverthrow'

import { createTurso } from '@datadive/turso'
import { resultFromSafeAsyncFn } from '@datadive/utils/common'

import { DatabaseExists } from './errors/db-errors'

export interface TursoCredentials {
  authToken: string
  organization: string
  group?: string | undefined
}

/**
 * Create a database using the Turso API
 * @param databaseName - The name of the database
 * @param credentials - The credentials to authenticate with the Turso API
 * @param options - Creation options
 * @param options.duplicateHandling - How to handle duplicate databases
 * @returns The hostname and token of the tenant database
 */
export function createDatabase(
  databaseName: string,
  credentials: TursoCredentials,
  options?: { duplicateHandling?: 'override' | 'adopt' | 'abort' | undefined },
): ResultAsync<
  { url: string; authToken: string },
  | DatabaseExists
  | TursoHttpError
  | TursoFetchError
  | TursoValidationError<z.ZodUnknown>
  | TursoDatabaseNameError
> {
  return resultFromSafeAsyncFn(async () => {
    const turso = createTurso({
      authToken: credentials.authToken,
      organizationName: credentials.organization,
      group: credentials.group,
    })

    const databasesResult = await turso.listDatabases()

    if (databasesResult.isErr()) {
      return err(databasesResult.error)
    }

    const databases = databasesResult.value

    const existingDatabase = databases.find(
      (database) => database.Name === databaseName,
    )

    if (existingDatabase) {
      if (options?.duplicateHandling === 'adopt') {
        const authTokenResult = await turso.createAuthToken({
          databaseName: existingDatabase.Name,
        })

        if (authTokenResult.isErr()) {
          return err(authTokenResult.error)
        }

        return ok({
          url: `libsql://${existingDatabase.Hostname}`,
          authToken: authTokenResult.value,
        })
      } else if (options?.duplicateHandling === 'override') {
        await turso.deleteDatabase({ databaseName: existingDatabase.Name })

        const createResult = await turso.createDatabase({ databaseName })

        if (createResult.isErr()) {
          return err(createResult.error)
        }

        const authTokenResult = await turso.createAuthToken({
          databaseName: createResult.value.Name,
        })

        if (authTokenResult.isErr()) {
          return err(authTokenResult.error)
        }

        return ok({
          url: `libsql://${createResult.value.Hostname}`,
          authToken: authTokenResult.value,
        })
      } else {
        return err(
          new DatabaseExists(`Database ${databaseName} already exists`),
        )
      }
    } else {
      const createResult = await turso.createDatabase({ databaseName })

      if (createResult.isErr()) {
        return err(createResult.error)
      }

      const authTokenResult = await turso.createAuthToken({
        databaseName: createResult.value.Name,
      })

      if (authTokenResult.isErr()) {
        return err(authTokenResult.error)
      }

      return ok({
        url: `libsql://${createResult.value.Hostname}`,
        authToken: authTokenResult.value,
      })
    }
  })
}
