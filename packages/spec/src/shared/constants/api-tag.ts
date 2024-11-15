import { constEnum } from '@datadive/utils/common'

export const ApiTag = constEnum({
  LandlordUser: 'Landlord User',
  LandlordTenant: 'Landlord Tenant',
  LandlordAuth: 'Landlord Auth',
  TenantUser: 'Tenant User',
})

export type ApiTag = constEnum<typeof ApiTag>
