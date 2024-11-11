import type { OpenAPIObject } from 'openapi3-ts/oas31'

import { rm, writeFile } from 'fs/promises'

import SwaggerParser from '@apidevtools/swagger-parser'
import { generateFile, mapOpenApiEndpoints } from 'typed-openapi'

const OUTPUT_FILE = './src/typed-open-api.generated.ts'

/**
 * Main function
 */
async function main() {
  const start = Date.now()
  const tursoOpenApiResponse = await fetch(
    'https://raw.githubusercontent.com/tursodatabase/turso-docs/main/api-reference/openapi.json',
    { method: 'GET' },
  )

  if (!tursoOpenApiResponse.ok) {
    throw new Error(
      `Can't fetch Turso OpenAPI: Unexpected response from the Turso API "${tursoOpenApiResponse.statusText}"`,
    )
  }

  const tursoOpenApiJson = await tursoOpenApiResponse.text()

  await writeFile('./tmp', tursoOpenApiJson)

  const openApiDoc = (await SwaggerParser.validate('./tmp')) as OpenAPIObject

  await rm('./tmp', { force: true })

  const ctx = mapOpenApiEndpoints(openApiDoc)

  const content = generateFile({ ...ctx, runtime: 'zod' })

  await writeFile(OUTPUT_FILE, content)

  console.log(
    `✅ Generated Typed OpenAPI at "${OUTPUT_FILE}" (took ${(Date.now() - start).toString()}ms)`,
  )
}

await main()
