import type { SelectQueryBuilder, StringReference } from 'kysely'

import { err, ok } from 'neverthrow'

import { DbError } from '../errors/db-error'
import { execute } from './execute'

function getCount(result: unknown): number | undefined {
  if (result === null || typeof result !== 'object') {
    return undefined
  }

  if (Array.isArray(result)) {
    return getCount(result[0])
  }

  if (!('count' in result)) {
    return undefined
  }

  if (typeof result.count !== 'number') {
    return undefined
  }

  return result.count
}

/**
 * Get the count of a query
 * @param qb - The query builder
 * @param countBy - The column to count by
 * @returns The count of the query
 */
export function executeCount<DB, TB extends keyof DB>(
  qb: SelectQueryBuilder<DB, TB, unknown>,
  countBy: StringReference<DB, TB>,
) {
  const countQuery = qb
    .clearSelect()
    .select((eb) => eb.fn.count<number>(countBy).as('count'))

  return execute(countQuery).andThen((result) => {
    const count = getCount(result)

    if (count === undefined) {
      return err(new DbError.InvalidCount())
    }

    return ok(count)
  })
}
