import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi'

import { registerAllErrors } from './shared/utilities/register-all-errors'
import { registerAllLandlordEndpoints } from './shared/utilities/register-all-landlord-endpoints'
import { registerAllSecuritySchemas } from './shared/utilities/register-all-security-schemas'
import { registerAllTenantEndpoints } from './shared/utilities/register-all-tenant-endpoints'

const registry = new OpenAPIRegistry()

registerAllErrors(registry)
registerAllSecuritySchemas(registry)
registerAllTenantEndpoints(registry)
registerAllLandlordEndpoints(registry)

const generator = new OpenApiGeneratorV3(registry.definitions)

/**
 * **OpenAPI specification of the Datadive API as JavaScript object**
 * @description This object can the serialized to JSON or YAML to be used with OpenAPI tools.
 */
export const DatadiveApiSpec = generator.generateDocument({
  info: { title: 'Datadive API', version: '0.0.1' },
  openapi: '3.0.0',
})
