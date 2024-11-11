import { err, ok } from 'neverthrow'

import { InvalidSessionError } from './error/invalid-session-error'
import { defineAuthFunction } from './utility/define-auth-function'

export const validateSession = defineAuthFunction(
  async (injection, sessionId: string) => {
    const { lucia } = injection
    const { session, user } = await lucia.validateSession(sessionId)

    if (!session) {
      return err(new InvalidSessionError(lucia.createBlankSessionCookie()))
    }

    return ok({
      user,
      session,
      sessionCookie: session.fresh
        ? lucia.createSessionCookie(session.id)
        : undefined,
    })
  },
)
