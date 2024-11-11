import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class UsernameConflictError extends AuthError {
  public readonly code = LandlordAuthErrorCode.UsernameConflict
  constructor(public readonly username: string) {
    super(`A user with the username "${username}" already exists`)
  }
}
