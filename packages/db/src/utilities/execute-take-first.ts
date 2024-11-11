import type { Prettify } from '@datadive/utils/type'
import type {
  DeleteQueryBuilder,
  InsertQueryBuilder,
  SelectQueryBuilder,
  UpdateQueryBuilder,
} from 'kysely'
import type { ResultAsync } from 'neverthrow'

import { err, ok } from 'neverthrow'

import { DbError } from '../errors/db-error'
import { execute } from './execute'

/**
 * Executes the given, query and returns the first result.
 * @param queryBuilder The query to execute.
 * @returns An {@link ResultAsync} of the query
 */
export function executeTakeFirst<
  TDatabase,
  TTable extends keyof TDatabase,
  TOutput,
>(
  queryBuilder:
    | SelectQueryBuilder<TDatabase, TTable, TOutput>
    | InsertQueryBuilder<TDatabase, TTable, TOutput>
    | UpdateQueryBuilder<TDatabase, TTable, TTable, TOutput>
    | DeleteQueryBuilder<TDatabase, TTable, TOutput>,
): ResultAsync<Prettify<TOutput>, DbError.NoQueryResult | DbError.QueryFailed> {
  return execute(queryBuilder).andThen((results) => {
    const firstResult = results[0]

    if (firstResult === undefined) {
      const compiledQuery = queryBuilder.compile()
      return err(new DbError.NoQueryResult(compiledQuery))
    }

    return ok(firstResult)
  })
}
