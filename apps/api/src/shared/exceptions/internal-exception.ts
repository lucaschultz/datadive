import type { ApiError } from '@datadive/spec'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { getErrorType } from '../utils/get-error-type'

type ServerExceptionBody = z.output<typeof ApiError.Internal>

interface InternalExceptionOptions {
  message?: string
  cause?: unknown
  /** A detailed description of the error that gets included in the response */
  detail?: string
}

export class InternalException extends HTTPException {
  constructor(options?: InternalExceptionOptions) {
    super(500, {
      res: Response.json({
        success: false,
        status: 500,
        code: 'internal_error',
        type: getErrorType('internal_error'),
        title: 'An unexpected error occurred on the server.',
        detail: options?.detail,
      } satisfies ServerExceptionBody),
      ...options,
    })
  }

  static fromError(
    error: unknown,
    options?: Omit<InternalExceptionOptions, 'cause'>,
  ) {
    return new InternalException({
      cause: error,
      ...options,
    })
  }
}
