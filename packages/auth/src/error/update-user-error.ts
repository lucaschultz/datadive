import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class UpdateUserError extends AuthError {
  public readonly code = LandlordAuthErrorCode.UpdateUser
}
