import type { Tail } from '@datadive/utils/type'
import type { AnyKysely } from './type/any-kysely'
import type { QueryFunction } from './type/query-function'

/**
 * Provide a kysely instance to a query function
 * @param kysely - The kysely instance
 * @param queryFunction - The query function
 * @see {@link QueryFunction}
 * @returns The query function with the kysely instance provided
 */
export function provideKysely<
  TKysely extends AnyKysely,
  TQueryFunction extends QueryFunction<
    TKysely,
    Tail<Parameters<TQueryFunction>>,
    Awaited<ReturnType<TQueryFunction>>
  >,
>(kysely: TKysely, queryFunction: TQueryFunction) {
  return (...args: Tail<Parameters<TQueryFunction>>) => {
    return queryFunction(kysely, ...args)
  }
}
