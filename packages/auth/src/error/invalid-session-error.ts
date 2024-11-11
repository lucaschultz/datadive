import type { SessionCookie } from '../create-landlord-lucia'

import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class InvalidSessionError extends AuthError {
  public readonly code = LandlordAuthErrorCode.InvalidSession

  constructor(public readonly sessionCookie: SessionCookie) {
    super('the session is invalid')
  }
}
