import type { LandlordAuthErrorCode } from '../constant/landlord-auth-error-code'

import { ErrorWithCode } from '@datadive/utils/common'

export abstract class AuthError extends ErrorWithCode<LandlordAuthErrorCode> {}
