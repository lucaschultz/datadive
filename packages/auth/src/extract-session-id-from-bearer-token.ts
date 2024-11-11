import { defineAuthFunction } from './utility/define-auth-function'

export const extractSessionIdFromBearerToken = defineAuthFunction(
  (injected, params: { bearerToken: string }): string | null => {
    return injected.lucia.readBearerToken(params.bearerToken)
  },
)
