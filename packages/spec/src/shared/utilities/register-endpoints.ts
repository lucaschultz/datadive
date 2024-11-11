import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import type { EndpointMap } from '../types/endpoint-map'

export function registerEndpoints(
  registry: OpenAPIRegistry,
  endpoints: EndpointMap,
) {
  const allEndpoints = Object.values(endpoints)
    .map((e) => Object.values(e))
    .flat()

  allEndpoints.forEach((endpoint) => {
    registry.registerPath(endpoint)
  })
}
