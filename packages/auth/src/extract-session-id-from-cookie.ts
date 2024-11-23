import { ok } from 'neverthrow'

import { resultFromSafeFn } from '@datadive/utils/common'

import { defineAuthFunction } from './utility/define-auth-function'

export const extractSessionIdFromCookie = defineAuthFunction(
  (injected, params: { cookie: string }) => {
    return resultFromSafeFn(() => {
      return ok(injected.lucia.readSessionCookie(params.cookie))
    })
  },
)
