import type { Kysely } from 'kysely'

/**
 * A Kysely instance with any database type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyKysely = Kysely<any>
