import type { RouteConfig } from '@asteasolutions/zod-to-openapi'

export interface EndpointMap {
  [key: string]: { [key: string]: RouteConfig }
}
