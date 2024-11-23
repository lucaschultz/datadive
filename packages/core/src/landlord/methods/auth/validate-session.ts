import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { err, ok, safeTry } from 'neverthrow'

import { CoreError } from '../../../errors/core-error'

export function validateSession(
  injection: LandlordCoreInjection,
  headers: { cookie: string; bearerToken: string },
) {
  return safeTry(async function* () {
    const { auth } = injection

    let extractedSession: {
      id: string
      from: 'cookie' | 'bearer_token'
    } | null = null

    const sessionIdFromCookie = yield* auth
      .extractSessionIdFromCookie(headers)
      .safeUnwrap()

    if (sessionIdFromCookie) {
      extractedSession = { id: sessionIdFromCookie, from: 'cookie' }
    }

    if (!extractedSession) {
      const sessionIdFromHeader = yield* auth
        .extractSessionIdFromBearerToken(headers)
        .safeUnwrap()

      if (sessionIdFromHeader) {
        extractedSession = { id: sessionIdFromHeader, from: 'bearer_token' }
      }
    }

    if (!extractedSession) {
      return err(new CoreError.SessionIdNotFound())
    }

    const validateSessionResult = yield* auth
      .validateSession(extractedSession.id)
      .mapErr(() => {
        return new CoreError.InvalidSessionId(extractedSession.from)
      })
      .safeUnwrap()

    return ok(validateSessionResult)
  })
}
