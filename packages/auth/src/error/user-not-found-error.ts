import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class UserNotFoundError extends AuthError {
  public readonly code = LandlordAuthErrorCode.UserNotFound
}
