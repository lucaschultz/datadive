import type {
  DeleteQueryBuilder,
  InsertQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'kysely'

import { ResultAsync } from 'neverthrow'

import { DbError } from '../errors/db-error'

/**
 * Executes the given, query and returns the results.
 * @param queryBuilder The query to execute.
 * @returns An {@link ResultAsync} of the query
 */
export function execute<TDatabase, TTable extends keyof TDatabase, TOutput>(
  queryBuilder:
    | SelectQueryBuilder<TDatabase, TTable, TOutput>
    | InsertQueryBuilder<TDatabase, TTable, TOutput>
    | UpdateQueryBuilder<TDatabase, TTable, TTable, TOutput>
    | DeleteQueryBuilder<TDatabase, TTable, TOutput>,
): ResultAsync<Array<TOutput>, DbError.QueryFailed> {
  return ResultAsync.fromPromise(
    queryBuilder.execute(),
    (error) => new DbError.QueryFailed(queryBuilder.compile(), error),
  )
}
