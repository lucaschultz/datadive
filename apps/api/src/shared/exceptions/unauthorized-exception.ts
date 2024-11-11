import type { ApiError } from '@datadive/spec'
import type { z } from 'zod'

import { HTTPException } from 'hono/http-exception'

import { getErrorType } from '../utils/get-error-type'

type UnauthorizedExceptionBody = z.output<typeof ApiError.Unauthorized>

interface UnauthorizedExceptionOptions {
  message?: string
  cause?: unknown
}

export class UnauthorizedException extends HTTPException {
  constructor(
    data: Pick<UnauthorizedExceptionBody, 'errorMessages' | 'detail'>,
    options?: UnauthorizedExceptionOptions,
  ) {
    super(401, {
      res: Response.json({
        success: false,
        status: 401,
        code: 'unauthorized',
        type: getErrorType('unauthorized'),
        title: 'You must be logged in to access this resource.',
        ...data,
      } satisfies UnauthorizedExceptionBody),
      ...options,
    })
  }

  static fromInvalidSession(
    authType: 'cookie' | 'header',
    options?: UnauthorizedExceptionOptions,
  ) {
    if (authType === 'cookie') {
      return new UnauthorizedException(
        {
          detail: 'The provided session cookie is invalid.',
          errorMessages: {
            cookies: {
              session: ['The session cookie is invalid.'],
            },
          },
        },
        options,
      )
    } else {
      return new UnauthorizedException(
        {
          detail: 'The provided session header is invalid.',
          errorMessages: {
            headers: {
              'x-session': ['The session header is invalid.'],
            },
          },
        },
        options,
      )
    }
  }

  static fromMissingSession(options?: UnauthorizedExceptionOptions) {
    return new UnauthorizedException(
      {
        detail: 'Provide a session cookie or header for authentication.',
        errorMessages: {
          cookies: {
            session: ['The session cookie is missing.'],
          },
          headers: {
            'x-session': ['The session header is missing.'],
          },
        },
      },
      options,
    )
  }
}
