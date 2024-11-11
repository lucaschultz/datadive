import type { RouteConfig } from '@hono/zod-openapi'

import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { createRoute } from '@hono/zod-openapi'

import { NotAcceptableResponse } from '../errors/not-acceptable-error'
import { InternalErrorResponse } from '../errors/server-error'
import { UnauthorizedResponse } from '../errors/unauthorized-error'
import {
  SessionCookieSecurityScheme,
  SessionHeaderSecurityScheme,
} from './security-schemas'

export const Registry = new OpenAPIRegistry()

const sessionHeader = Registry.registerComponent(...SessionHeaderSecurityScheme)
const sessionCookie = Registry.registerComponent(...SessionCookieSecurityScheme)

function addSecurity<T extends RouteConfig>(route: T): T {
  return {
    ...route,

    security: [
      {
        [sessionCookie.name]: [],
        [sessionHeader.name]: [],
        ...route.security,
      },
    ],
  }
}

function addCommonErrorResponses<T extends RouteConfig>(route: T) {
  if (406 in route.responses) {
    throw new Error("Can't add 406 response to route that already has it")
  }

  if (500 in route.responses) {
    throw new Error("Can't add 500 response to route that already has it")
  }

  return {
    ...route,
    responses: {
      ...route.responses,
      406: NotAcceptableResponse,
      500: InternalErrorResponse,
    },
  }
}

function addUnauthorizedErrorResponse<T extends RouteConfig>(route: T) {
  if (401 in route.responses) {
    throw new Error(
      `Can't add 401 response to route that already has it: ${route.path}`,
    )
  }

  return {
    ...route,
    responses: {
      ...route.responses,
      401: UnauthorizedResponse,
    },
  }
}

function modify<T extends RouteConfig>(
  routeConfig: T,
  modifiers: Array<(route: T) => T>,
): T {
  return modifiers.reduce((acc, modifier) => modifier(acc), routeConfig)
}

const createEndpoint: typeof createRoute = (endpointConfig) => {
  Registry.registerPath(endpointConfig)
  return createRoute(endpointConfig)
}

export const createProtectedEndpoint: typeof createEndpoint = (...params) => {
  const endpoint = createEndpoint(...params)

  const modifiedEndpoint = modify(endpoint, [
    addSecurity,
    addCommonErrorResponses,
    addUnauthorizedErrorResponse,
  ])

  return modifiedEndpoint
}

export const createPublicEndpoint: typeof createEndpoint = (...params) => {
  const endpoint = createEndpoint(...params)

  const modifiedEndpoint = modify(endpoint, [addCommonErrorResponses])

  return modifiedEndpoint
}
