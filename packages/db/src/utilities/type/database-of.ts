import type { Kysely } from 'kysely'
import type { AnyKysely } from './any-kysely'

/**
 * Extracts the database type from a Kysely instance.
 */
export type DatabaseOf<TKysely extends AnyKysely> =
  TKysely extends Kysely<infer TDatabase> ? TDatabase : never
