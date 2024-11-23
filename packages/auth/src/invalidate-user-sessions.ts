import { ok } from 'neverthrow'

import { resultFromSafeAsyncFn } from '@datadive/utils/common'

import { defineAuthFunction } from './utility/define-auth-function'

export const invalidateUserSessions = defineAuthFunction(
  (injected, user: { id: string }) => {
    return resultFromSafeAsyncFn(async () => {
      const { lucia } = injected
      await lucia.invalidateUserSessions(user.id)

      return ok({ sessionCookie: lucia.createBlankSessionCookie() })
    })
  },
)
