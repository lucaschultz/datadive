import type { OpenAPIHono } from '@hono/zod-openapi'
import type { Env, MiddlewareHandler, Schema } from 'hono'

function joinMiddleware(
  ...middleware: Array<MiddlewareHandler | Array<MiddlewareHandler> | undefined>
) {
  return middleware.flat().filter((m) => m !== undefined)
}

/**
 * Create a function that registers routes on the app.
 * @param app The app to register the routes on.
 * @param routeMiddleware Middleware to apply to all routes.
 * @returns A helper to register routes on the app.
 */
export function createRouteRegisterHelper<
  E extends Env = Env,
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  S extends Schema = {},
  BasePath extends string = '/',
>(
  app: OpenAPIHono<E, S, BasePath>,
  ...routeMiddleware: Array<MiddlewareHandler<E>>
) {
  type RouteRegister = typeof app.openapi

  const register: RouteRegister = (route, handler) => {
    return app.openapi(
      {
        ...route,
        middleware: joinMiddleware(route.middleware, routeMiddleware),
      },
      handler,
    )
  }

  return { register, app }
}
