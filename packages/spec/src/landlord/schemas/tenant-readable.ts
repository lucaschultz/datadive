import { Id } from '../../shared/schemas/id'
import { Deletable, Timestamps } from '../../shared/schemas/timestamp'
import { z } from '../../shared/utilities/z'
import { TenantDomainSchema, TenantNameSchema } from './tenant-creatable'

const DatabaseUrlSchema = z.string().url().openapi({
  example: 'https://berkeley.datadive-db.com',
  description: 'URL to access the tenant database',
})

export const TenantReadable = z
  .object({
    id: Id,
    name: TenantNameSchema,
    domain: TenantDomainSchema,

    databaseUrl: DatabaseUrlSchema,

    ...Timestamps,
    ...Deletable,
  })
  .openapi('TenantReadable')
