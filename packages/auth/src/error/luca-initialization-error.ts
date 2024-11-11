import { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'
import { AuthError } from './auth-error'

export class LuciaInitializationError extends AuthError {
  public readonly code = LandlordAuthErrorCode.LuciaInitialization

  constructor(
    public override readonly cause: unknown,
    message?: string,
  ) {
    super(message, { cause })
  }
}
