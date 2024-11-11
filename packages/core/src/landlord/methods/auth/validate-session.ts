import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { err } from 'neverthrow'

import { exhaustive } from '@datadive/utils/common'

import { CoreError } from '../../../errors/core-error'

export async function validateSession(
  injection: LandlordCoreInjection,
  headers: { cookie: string; bearerToken: string },
) {
  const { auth } = injection

  let extractedSession: {
    id: string
    from: 'cookie' | 'bearer_token'
  } | null = null

  const sessionIdFromCookie = auth.extractSessionIdFromCookie(headers)

  if (sessionIdFromCookie) {
    extractedSession = { id: sessionIdFromCookie, from: 'cookie' }
  }

  if (!extractedSession) {
    const sessionIdFromHeader = auth.extractSessionIdFromBearerToken(headers)

    if (sessionIdFromHeader) {
      extractedSession = { id: sessionIdFromHeader, from: 'bearer_token' }
    }
  }

  if (!extractedSession) {
    return err(new CoreError.SessionIdNotFound())
  }

  const validateSessionResult = await auth.validateSession(extractedSession.id)

  if (validateSessionResult.isErr()) {
    switch (validateSessionResult.error.code) {
      case 'invalid_session':
        return err(new CoreError.InvalidSessionId(extractedSession.from))
      default:
        return exhaustive(validateSessionResult.error.code)
    }
  }

  return validateSessionResult
}
