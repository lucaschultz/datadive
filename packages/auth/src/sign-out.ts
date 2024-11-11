import type { Cookie } from 'lucia'
import type { ResultAsync } from 'neverthrow'

import { ok } from 'neverthrow'

import { resultFromSafeAsyncFn } from '@datadive/utils/common'

import { defineAuthFunction } from './utility/define-auth-function'

export const signOut = defineAuthFunction(
  (
    injection,
    user: { id: string },
  ): ResultAsync<{ sessionCookie: Cookie }, never> => {
    const { lucia } = injection

    return resultFromSafeAsyncFn(async () => {
      await lucia.invalidateUserSessions(user.id)

      return ok({ sessionCookie: lucia.createBlankSessionCookie() })
    })
  },
)
