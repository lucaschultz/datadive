import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { LandlordEndpoints } from '../../landlord/endpoints/landlord-endpoints'
import { registerEndpoints } from './register-endpoints'

export function registerAllLandlordEndpoints(registry: OpenAPIRegistry) {
  registerEndpoints(registry, LandlordEndpoints)
}
