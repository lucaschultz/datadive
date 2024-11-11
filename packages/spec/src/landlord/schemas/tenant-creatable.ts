import { Id } from '../../shared/schemas/id'
import { Deletable } from '../../shared/schemas/timestamp'
import { z } from '../../shared/utilities/z'

export const TenantNameSchema = z.string().min(3).max(50).openapi({
  example: 'Berkeley University',
  description: 'Human readable name of the tenant',
})

export const TenantDomainSchema = z
  .string()
  .min(3)
  .max(50)
  .regex(/^[a-z0-9-]+$/, {
    message: 'Must be lowercase alphanumeric characters and dashes',
  })
  .openapi({
    example: 'berkeley',
    description: 'Used to identify the tenant in the URL',
  })

export const TenantCreatable = z
  .object({
    id: Id.optional(),
    name: TenantNameSchema,
    domain: TenantDomainSchema,

    ...Deletable,
  })
  .openapi('TenantCreatable')
