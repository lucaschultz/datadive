import type { DatabaseConnection, QueryResult } from 'kysely'
import type { AnyKysely } from './type/any-kysely'
import type { AnyTransaction } from './type/any-transaction'

import { CompiledQuery } from 'kysely'
import { ResultAsync } from 'neverthrow'

import { DbError } from '../errors/db-error'

type Executor = DatabaseConnection | AnyKysely | AnyTransaction

/**
 * control whether to enable foreign keys, **no param check**
 * @param db - The executor
 * @param enable - Whether to enable foreign keys
 */
export async function foreignKeys(
  db: Executor,
  enable: boolean,
): Promise<void> {
  await db.executeQuery(
    CompiledQuery.raw(`PRAGMA foreign_keys = ${enable.toString()}`),
  )
}

const getForeignKeysPragmaQuery = (enabled: boolean) => {
  return CompiledQuery.raw(`PRAGMA foreign_keys = ${enabled.toString()}`)
}

export function setForeignKeysPragma(
  db: AnyKysely,
  enabled = true,
): ResultAsync<QueryResult<undefined>, DbError.QueryFailed> {
  return ResultAsync.fromPromise(
    db.executeQuery<undefined>(getForeignKeysPragmaQuery(enabled)),
    (err) => new DbError.QueryFailed(getForeignKeysPragmaQuery(enabled), err),
  )
}
