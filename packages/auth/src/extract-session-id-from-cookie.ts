import { defineAuthFunction } from './utility/define-auth-function'

export const extractSessionIdFromCookie = defineAuthFunction(
  (injected, params: { cookie: string }): string | null => {
    return injected.lucia.readSessionCookie(params.cookie)
  },
)
