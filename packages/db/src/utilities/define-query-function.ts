import type { Tail } from '@datadive/utils/type'
import type { AnyKysely } from './type/any-kysely'
import type { QueryFunction } from './type/query-function'

/**
 * A type helper to define a query function
 * @param queryFn - The query function
 * @see {@link QueryFunction}
 * @returns The query function
 */
export function defineQueryFunction<
  TKysely extends AnyKysely,
  TQueryFunction extends QueryFunction<
    TKysely,
    Tail<Parameters<TQueryFunction>>,
    Awaited<ReturnType<TQueryFunction>>
  >,
>(queryFn: TQueryFunction): TQueryFunction {
  return queryFn
}
