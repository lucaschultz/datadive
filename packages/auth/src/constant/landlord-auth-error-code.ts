import { constEnum } from '@datadive/utils/common'

export const LandlordAuthErrorCode = constEnum({
  LuciaInitialization: 'lucia_initialization',
  EmailConflict: 'email_conflict',
  InvalidSession: 'invalid_session',
  StoreUser: 'storing_user_failed',
  UsernameConflict: 'username_conflict',
  UserNotFound: 'user_not_found',
  StorePasswordResetToken: 'storing_password_reset_token_failed',
  IncorrectPassword: 'incorrect_password',
  IncorrectEmailValidationCode: 'incorrect_email_validation_code',
  ExpiredEmailValidationCode: 'expired_email_validation_code',
  IncorrectPasswordResetToken: 'incorrect_password_reset_token',
  ExpiredPasswordResetToken: 'expired_password_reset_token',
  UpdateUser: 'updating_user_failed',
  UpdateSession: 'updating_session_failed',
})

export type LandlordAuthErrorCode = constEnum<typeof LandlordAuthErrorCode>
