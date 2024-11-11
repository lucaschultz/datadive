import type { Head } from '@datadive/utils/type'
import type { LandlordAuthInjection } from './utility/define-auth-function'

import { ok, safeTry } from 'neverthrow'

import { createLandlordKysely } from '@datadive/db'

import { createLandlordLucia } from './create-landlord-lucia'
import { createToken } from './create-token'
import { extractSessionIdFromBearerToken } from './extract-session-id-from-bearer-token'
import { extractSessionIdFromCookie } from './extract-session-id-from-cookie'
import { generateEmailVerificationCode } from './generate-email-verification-code'
import { generatePasswordResetToken } from './generate-password-reset-token'
import { invalidateUserSessions } from './invalidate-user-sessions'
import { signIn } from './sign-in'
import { signOut } from './sign-out'
import { signUp } from './sign-up'
import { injectAuthFunction } from './utility/define-auth-function'
import { hashPassword } from './utility/hash-password'
import { verifyPassword } from './utility/verify-password'
import { validateEmailVerificationCode } from './validate-email-verification-code'
import { validatePasswordResetToken } from './validate-password-reset-token'
import { validateSession } from './validate-session'

/**
 * Creates the landlord auth using the given database client
 * @param databaseClient - The database client
 * @returns The landlord auth functions
 */
export function createLandlordAuth(
  databaseClient: Head<Parameters<typeof createLandlordLucia>>,
) {
  return safeTry(async function* () {
    const landlordDatabase =
      yield* createLandlordKysely(databaseClient).safeUnwrap()
    const landlordLucia =
      yield* createLandlordLucia(databaseClient).safeUnwrap()

    const injection: LandlordAuthInjection = {
      db: landlordDatabase,
      lucia: landlordLucia,
    }

    return ok({
      closeConnection: async () => {
        await landlordDatabase.destroy()
        databaseClient.close()
      },
      createToken: injectAuthFunction(injection, createToken),
      extractSessionIdFromBearerToken: injectAuthFunction(
        injection,
        extractSessionIdFromBearerToken,
      ),
      extractSessionIdFromCookie: injectAuthFunction(
        injection,
        extractSessionIdFromCookie,
      ),
      invalidateUserSessions: injectAuthFunction(
        injection,
        invalidateUserSessions,
      ),
      signUp: injectAuthFunction(injection, signUp),
      signIn: injectAuthFunction(injection, signIn),
      signOut: injectAuthFunction(injection, signOut),
      generateEmailVerificationCode: injectAuthFunction(
        injection,
        generateEmailVerificationCode,
      ),
      validateEmailVerificationCode: injectAuthFunction(
        injection,
        validateEmailVerificationCode,
      ),
      generatePasswordResetToken: injectAuthFunction(
        injection,
        generatePasswordResetToken,
      ),
      validatePasswordResetToken: injectAuthFunction(
        injection,
        validatePasswordResetToken,
      ),
      validateSession: injectAuthFunction(injection, validateSession),
      hashPassword: hashPassword,
      verifyPassword: verifyPassword,
    })
  })
}
