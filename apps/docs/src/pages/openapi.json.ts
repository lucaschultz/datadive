import type { APIRoute } from 'astro'

import { DatadiveApiSpec } from '@datadive/spec'

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(DatadiveApiSpec, null, 2))
}
