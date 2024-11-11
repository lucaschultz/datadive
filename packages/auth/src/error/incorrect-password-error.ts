import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class IncorrectPasswordError extends AuthError {
  public readonly code = LandlordAuthErrorCode.IncorrectPassword

  constructor() {
    super('the password is incorrect')
  }
}
