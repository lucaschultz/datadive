import { constEnum } from '@datadive/utils/common'

export const ApiTag = constEnum({
  LandlordUser: 'Landlord User',
  LandlordTenant: 'Landlord Tenant',
  LandlordAuth: 'Landlord Auth',
  TenantUser: 'Tenant User',
  TenantAuth: 'Tenant Auth',
  TenantCellTemplate: 'Tenant Cell Template',
  TenantInput: 'Tenant Input',
})

export type ApiTag = constEnum<typeof ApiTag>
