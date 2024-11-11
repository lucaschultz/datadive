import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

export const signOut = (
  injection: LandlordCoreInjection,
  user: { id: string },
) => {
  const { auth } = injection
  return auth.signOut(user)
}
