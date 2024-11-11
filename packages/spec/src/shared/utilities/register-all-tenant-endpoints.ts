import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { TenantEndpoints } from '../../tenant/endpoints/tenant-endpoints'
import { registerEndpoints } from './register-endpoints'

export function registerAllTenantEndpoints(registry: OpenAPIRegistry) {
  registerEndpoints(registry, TenantEndpoints)
}
