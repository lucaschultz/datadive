import { DbError } from '@datadive/db'
import { exhaustive, isInstanceOf } from '@datadive/utils/common'

import { InternalException } from '../exceptions/internal-exception'
import { ValidationException } from '../exceptions/validation-exception'
import { getErrorType } from './get-error-type'

const PaginationErrors = [
  DbError.InvalidCount,
  DbError.InvalidPage,
  DbError.InvalidPageSize,
  DbError.NoQueryResult,
] as const

type PaginationError = InstanceType<(typeof PaginationErrors)[number]>

/**
 * Check if the error is an error that is considered internal to pagination logic
 * @param error - The error to check
 * @returns `true` if the error is an internal pagination error, `false` otherwise
 */
export function isPaginationError(error: unknown): error is PaginationError {
  return isInstanceOf(error, PaginationErrors)
}

/**
 * Handle errors that are considered internal to pagination logic
 * @param error - The error to handle
 * @returns never, instead throws the appropriate exception
 */
export function handlePaginationError(error: PaginationError): never {
  if (error instanceof DbError.InvalidPage) {
    throw new ValidationException({
      code: 'query_param_validation',
      type: getErrorType('query_param_validation'),
      errorMessages: {
        queryParam: {
          page: [error.message],
        },
      },
    })
  } else if (error instanceof DbError.InvalidPageSize) {
    throw new ValidationException({
      code: 'query_param_validation',
      type: getErrorType('query_param_validation'),
      errorMessages: {
        queryParam: {
          perPage: [error.message],
        },
      },
    })
  } else if (
    isInstanceOf(error, [
      DbError.NoQueryResult,
      DbError.InvalidCount,
      DbError.QueryFailed,
    ])
  ) {
    throw InternalException.fromError(error)
  } else {
    return exhaustive(error)
  }
}
