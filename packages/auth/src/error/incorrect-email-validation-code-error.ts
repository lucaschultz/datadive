import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class IncorrectEmailValidationCodeError extends AuthError {
  public readonly code = LandlordAuthErrorCode.IncorrectEmailValidationCode

  constructor() {
    super('the email validation code is incorrect')
  }
}
