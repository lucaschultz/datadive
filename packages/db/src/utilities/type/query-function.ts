import type { AnyKysely } from './any-kysely'

/**
 * A function that queries a database using a kysely instance
 * @template TKysely - The kysely instance
 * @template TQueryArgs - The query arguments
 * @template TQueryResult - The query result
 */
export type QueryFunction<
  TKysely extends AnyKysely = AnyKysely,
  TQueryArgs extends Array<unknown> = Array<unknown>,
  TQueryResult = unknown,
> = (kysely: TKysely, ...args: TQueryArgs) => Promise<TQueryResult>
