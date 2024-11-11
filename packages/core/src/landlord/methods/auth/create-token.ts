import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

type TokenCredentials = { password: string; validFor?: number | undefined } & (
  | { email: string }
  | { username: string }
)

export function createToken(
  injection: LandlordCoreInjection,
  credentials: TokenCredentials,
) {
  const { auth } = injection

  return safeTry(async function* () {
    const token = yield* (
      await auth.createToken({
        ...credentials,
        validFor: credentials.validFor ?? 365,
      })
    ).safeUnwrap()

    return ok(token)
  })
}
