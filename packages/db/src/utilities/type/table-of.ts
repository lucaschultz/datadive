import type { AnyKysely } from './any-kysely'
import type { DatabaseOf } from './database-of'

/**
 * Extracts the table type from a Kysely instance.
 */
export type TableOf<
  TKysely extends AnyKysely,
  TTableName extends keyof DatabaseOf<TKysely>,
> = DatabaseOf<TKysely>[TTableName]
