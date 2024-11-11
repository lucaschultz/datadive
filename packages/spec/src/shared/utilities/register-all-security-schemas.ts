import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { SecuritySchemas } from './security-schemas'

export function registerAllSecuritySchemas(registry: OpenAPIRegistry) {
  SecuritySchemas.forEach((schema) => {
    registry.registerComponent(schema[0], schema[1], schema[2])
  })
}
