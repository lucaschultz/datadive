import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class ExpiredPasswordResetTokenError extends AuthError {
  public readonly code = LandlordAuthErrorCode.ExpiredPasswordResetToken

  constructor() {
    super('the password reset token is expired')
  }
}
