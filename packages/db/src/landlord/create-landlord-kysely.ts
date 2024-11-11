import type { InferResultValue } from '@datadive/utils/common'
import type { ResultAsync } from 'neverthrow'
import type { createDatabaseClient } from '../create-database-client'
import type { DB as LandlordDatabaseSchema } from './landlord-database-types.generated'

import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely } from 'kysely'
import { err, ok } from 'neverthrow'

import { resultFromSafeFn } from '@datadive/utils/common'

import { DbError } from '../errors/db-error'
import { setForeignKeysPragma } from '../utilities/set-foreign-keys-pragma'

export type LandlordKysely = Kysely<LandlordDatabaseSchema>
export type { LandlordDatabaseSchema }

/**
 * Connect a kysely instance to a landlord database
 * @param client - The client used for the connection, see {@link createDatabaseClient}
 * @returns The kysely instance
 */
export function createLandlordKysely(
  client: InferResultValue<ReturnType<typeof createDatabaseClient>>,
): ResultAsync<
  Kysely<LandlordDatabaseSchema>,
  DbError.QueryFailed | DbError.KyselyInitializationFailed
> {
  return resultFromSafeFn(() => {
    try {
      const kysely = new Kysely<LandlordDatabaseSchema>({
        dialect: new LibsqlDialect({
          client,
        }),
        plugins: [new CamelCasePlugin()],
      })

      return ok(kysely)
    } catch (error) {
      return err(new DbError.KyselyInitializationFailed(error, 'landlord'))
    }
  }).asyncAndThrough((kysely) => setForeignKeysPragma(kysely))
}
