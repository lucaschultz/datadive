import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class UpdateSessionError extends AuthError {
  public readonly code = LandlordAuthErrorCode.UpdateSession
}
