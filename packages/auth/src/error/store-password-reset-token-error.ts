import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class StorePasswordResetTokenError extends AuthError {
  public readonly code = LandlordAuthErrorCode.StorePasswordResetToken
}
