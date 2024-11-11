import type { InferResultValue } from '@datadive/utils/common'
import type { ResultAsync } from 'neverthrow'
import type { createDatabaseClient } from '../create-database-client'
import type { InputType } from './constants/input-type'
import type { NotebookStatus } from './constants/notebook-status'
import type {
  DB as GeneratedTenantDatabase,
  Input,
  Notebook,
} from './tenant-database-types.generated'

import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely } from 'kysely'
import { err, ok } from 'neverthrow'

import { resultFromSafeFn } from '@datadive/utils/common'

import { DbError } from '../errors/db-error'
import { setForeignKeysPragma } from '../utilities/set-foreign-keys-pragma'

export interface TenantDatabaseSchema extends GeneratedTenantDatabase {
  notebooks: Omit<Notebook, 'status'> & { status: NotebookStatus }
  inputs: Omit<Input, 'type'> & { type: InputType }
}

export type TenantKysely = Kysely<TenantDatabaseSchema>

/**
 * Create a kysely instance for a tenant database
 * @param client - The client used for the connection, see {@link createDatabaseClient}
 * @returns The kysely instance
 */
export function createTenantKysely(
  client: InferResultValue<ReturnType<typeof createDatabaseClient>>,
): ResultAsync<
  Kysely<TenantDatabaseSchema>,
  DbError.KyselyInitializationFailed | DbError.QueryFailed
> {
  return resultFromSafeFn(() => {
    try {
      const kysely = new Kysely<TenantDatabaseSchema>({
        dialect: new LibsqlDialect({
          client,
        }),
        plugins: [new CamelCasePlugin()],
      })

      return ok(kysely)
    } catch (error) {
      return err(new DbError.KyselyInitializationFailed(error, 'tenant'))
    }
  }).asyncAndThrough((kysely) => setForeignKeysPragma(kysely))
}
