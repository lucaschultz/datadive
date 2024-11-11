import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

export function validateEmailVerificationCode(
  injection: LandlordCoreInjection,
  code: string,
  user: { id: string; email: string },
) {
  const { auth } = injection

  return safeTry(async function* () {
    const result = yield* (
      await auth.validateEmailVerificationCode(user, code)
    ).safeUnwrap()

    return ok(result)
  })
}
