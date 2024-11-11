import { DbError } from '@datadive/db'
import { isInstanceOf } from '@datadive/utils/common'

import { InternalException } from '../exceptions/internal-exception'

const InternalErrors = [DbError.QueryFailed] as const

type InternalError = InstanceType<(typeof InternalErrors)[number]>

/**
 * Check if the error is an error that is considered internal
 * @param error - The error to check
 * @returns `true` if the error is an internal error, `false` otherwise
 */
export function isInternalError(error: unknown): error is InternalError {
  return isInstanceOf(error, InternalErrors)
}

/**
 * Handle errors that are considered internal
 * @param error - The error to handle
 */
export function handleInternalError(error: InternalError): never {
  throw InternalException.fromError(error)
}
