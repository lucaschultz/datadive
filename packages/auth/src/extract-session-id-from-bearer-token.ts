import { ok } from 'neverthrow'

import { resultFromSafeFn } from '@datadive/utils/common'

import { defineAuthFunction } from './utility/define-auth-function'

export const extractSessionIdFromBearerToken = defineAuthFunction(
  (injected, params: { bearerToken: string }) => {
    return resultFromSafeFn(() => {
      return ok(injected.lucia.readBearerToken(params.bearerToken))
    })
  },
)
