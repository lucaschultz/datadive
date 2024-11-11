import type { SelectQueryBuilder, StringReference } from 'kysely'
import type { Result, ResultAsync } from 'neverthrow'

import { err, ok, safeTry } from 'neverthrow'

import { DbError } from '../errors/db-error'
import { execute } from './execute'
import { executeCount } from './execute-count'

export interface Paginated<TItem> {
  hasNextPage: boolean
  hasPrevPage: boolean
  totalItems: number
  totalPages: number
  perPage: number
  page: number
  items: Array<TItem>
}

export interface PaginationOptions {
  perPage?: number | undefined
  page?: number | undefined
}

const MAX_PER_PAGE = 1000
const MIN_PER_PAGE = 1
const MIN_PAGE = 1

function validatePaginationOptions(
  options?: PaginationOptions | undefined,
): Result<
  { perPage: number; page: number },
  DbError.InvalidPageSize | DbError.InvalidPage
> {
  const { perPage = 20, page = 1 } = options ?? {}

  if (perPage < MIN_PER_PAGE) {
    return err(
      new DbError.InvalidPageSize(
        `Page size must be greater than or equal to ${MIN_PER_PAGE.toString()}`,
      ),
    )
  }

  if (perPage > MAX_PER_PAGE) {
    return err(
      new DbError.InvalidPageSize(
        `Page size must be less than or equal to ${MAX_PER_PAGE.toString()}`,
      ),
    )
  }

  if (page < 1) {
    return err(
      new DbError.InvalidPage(
        `Page must be greater than or equal to ${MIN_PAGE.toString()}`,
      ),
    )
  }

  return ok({ perPage, page })
}

/**
 * Paginates a select query and executes it
 * @param queryBuilder - The query builder
 * @param countBy - The column to count by
 * @param options - The pagination options
 * @returns The paginated results
 */
export function executePaginated<
  TDatabase,
  TTable extends keyof TDatabase,
  TOutput,
>(
  queryBuilder: SelectQueryBuilder<TDatabase, TTable, TOutput>,
  countBy: StringReference<TDatabase, TTable>,
  options?: Partial<PaginationOptions>,
): ResultAsync<
  Paginated<TOutput>,
  | DbError.InvalidPageSize
  | DbError.InvalidPage
  | DbError.NoQueryResult
  | DbError.QueryFailed
  | DbError.InvalidCount
> {
  return safeTry(async function* () {
    const { perPage, page } =
      yield* validatePaginationOptions(options).safeUnwrap()

    const totalItems = yield* executeCount(queryBuilder, countBy).safeUnwrap()

    queryBuilder = queryBuilder.limit(perPage + 1).offset((page - 1) * perPage)

    const rows = yield* execute(queryBuilder).safeUnwrap()

    const hasNextPage = rows.length > 0 ? rows.length > perPage : false
    const hasPrevPage = rows.length > 0 ? page > 1 : false

    // If we fetched an extra row to determine if we have a next page, that
    // shouldn't be in the returned results
    if (rows.length > perPage) {
      rows.pop()
    }

    const totalPages = Math.ceil(totalItems / perPage)

    const paginatedItems: Paginated<TOutput> = {
      page,
      perPage,
      hasNextPage,
      hasPrevPage,
      totalItems,
      totalPages,
      items: rows,
    }

    return ok(paginatedItems)
  })
}
