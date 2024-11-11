import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

export function resetPassword(
  injection: LandlordCoreInjection,
  credentials: { token: string; password: string },
) {
  const { auth } = injection

  return safeTry(async function* () {
    const result = yield* (
      await auth.validatePasswordResetToken(credentials)
    ).safeUnwrap()

    return ok(result)
  })
}
