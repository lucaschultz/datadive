import type { APIRoute } from 'astro'

import YAML from 'yaml'

import { DatadiveApiSpec } from '@datadive/spec'

export const GET: APIRoute = () => {
  return new Response(YAML.stringify(DatadiveApiSpec))
}
