import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class ExpiredEmailValidationCodeError extends AuthError {
  public readonly code = LandlordAuthErrorCode.ExpiredEmailValidationCode

  constructor() {
    super('the email validation code is expired')
  }
}
