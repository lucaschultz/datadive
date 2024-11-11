import type { Transaction } from 'kysely'

/**
 * A Transaction with any database type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyTransaction = Transaction<any>
