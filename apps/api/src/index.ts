import type { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'

import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { showRoutes } from 'hono/dev'
import { HTTPException } from 'hono/http-exception'

import { ApiError, ApiErrorName, SecuritySchemas } from '@datadive/spec'

import {
  protectedLandlordRoutesApp,
  publicLandlordAuthApp,
} from './landlord/routes/landlord-auth'
import { landlordTenantApp } from './landlord/routes/landlord-tenant'
import { landlordUserApp } from './landlord/routes/landlord-user'
import { InternalException } from './shared/exceptions/internal-exception'
import { ValidationException } from './shared/exceptions/validation-exception'

const app = new OpenAPIHono({
  strict: false,
  defaultHook: (result) => {
    if (!result.success) {
      throw ValidationException.fromZodError(result.target, result.error)
    }

    return
  },
})

showRoutes(app, {
  verbose: true,
})

app.route('/', landlordUserApp)
app.route('/', landlordTenantApp)
app.route('/', protectedLandlordRoutesApp)
app.route('/', publicLandlordAuthApp)

app.onError((e) => {
  console.error(e)

  if (e instanceof HTTPException) {
    return e.getResponse()
  } else {
    return InternalException.fromError(e).getResponse()
  }
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '0.0.1',
    title: 'Datadive API',
    description: `
This is the OpenAPI definition of the Datadive API.

Most endpoints are protected by authentication. To authenticate, you need to provide a valid session cookie or a session header.


    `,
  },
})

function registerAllErrors(registry: OpenAPIRegistry) {
  const apiErrors = new Map(Object.entries(ApiError))
  const apiErrorNames = new Map(Object.entries(ApiErrorName))

  for (const [key, name] of apiErrorNames.entries()) {
    const error = apiErrors.get(key)
    if (error) {
      registry.register(name, error)
    }
  }
}

function registerAllSecuritySchemas(registry: OpenAPIRegistry) {
  SecuritySchemas.forEach((schema) => {
    registry.registerComponent(schema[0], schema[1], schema[2])
  })
}

registerAllErrors(app.openAPIRegistry)
registerAllSecuritySchemas(app.openAPIRegistry)

app.get(
  '/reference',
  apiReference({
    spec: {
      url: '/doc',
    },
  }),
)

export default {
  fetch: app.fetch,
  listen: 121212,
}
