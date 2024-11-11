import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

export function signIn(
  injection: LandlordCoreInjection,
  credentials:
    | { username: string; password: string }
    | { email: string; password: string },
) {
  const { auth } = injection

  return safeTry(async function* () {
    const result = yield* (await auth.signIn(credentials)).safeUnwrap()

    return ok(result)
  })
}
