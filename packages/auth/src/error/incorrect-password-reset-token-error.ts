import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class IncorrectPasswordResetTokenError extends AuthError {
  public readonly code = LandlordAuthErrorCode.IncorrectPasswordResetToken

  constructor() {
    super('the password reset token is incorrect')
  }
}
