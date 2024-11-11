import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class EmailConflictError extends AuthError {
  public readonly code = LandlordAuthErrorCode.EmailConflict

  constructor(public readonly email: string) {
    super(`A user with the email "${email}" already exists`)
  }
}
