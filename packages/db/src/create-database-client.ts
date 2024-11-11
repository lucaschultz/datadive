import { libsql } from '@libsql/kysely-libsql'
import { Result } from 'neverthrow'

import { DbError } from './errors/db-error'

interface DatabaseClientConfig {
  url: string
  authToken?: string | undefined
}

/**
 * Create a database client for a local or remote database
 * @param config - The configuration for the database client
 * @returns The database client
 */
export const createDatabaseClient = Result.fromThrowable(
  (config: DatabaseClientConfig): libsql.Client => {
    return libsql.createClient({
      url: config.url,
      ...(config.authToken && { authToken: config.authToken }),
    })
  },
  (error) => {
    return new DbError.ClientInitializationFailed(error)
  },
)
