import { Deletable } from '../../shared/schemas/timestamp'
import { z } from '../../shared/utilities/z'
import { TenantDomainSchema, TenantNameSchema } from './tenant-creatable'

export const TenantUpdateable = z
  .object({
    name: TenantNameSchema,
    domain: TenantDomainSchema,

    ...Deletable,
  })
  .openapi('TenantUpdateable')
