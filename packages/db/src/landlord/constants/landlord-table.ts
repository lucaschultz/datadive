import type { UppercaseFirst } from '@datadive/utils/type'
import type { DB as GeneratedLandlordDatabaseSchema } from '../landlord-database-types.generated'

export type LandlordTable = {
  [Key in keyof GeneratedLandlordDatabaseSchema as UppercaseFirst<Key>]: Key &
    string
}

export const LandlordTable: LandlordTable = {
  EmailVerificationCode: 'emailVerificationCode',
  TenantDatabase: 'tenantDatabase',
  User: 'user',
  PasswordResetToken: 'passwordResetToken',
  Session: 'session',
  Tenant: 'tenant',
}
