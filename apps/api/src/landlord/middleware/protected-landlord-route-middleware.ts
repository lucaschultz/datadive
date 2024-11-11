import type { createLandlordAuth } from '@datadive/auth'
import type { InferResultValue } from '@datadive/utils/common'

import { createMiddleware } from 'hono/factory'

import { CoreError, createLandlordCore } from '@datadive/core'
import { exhaustive, raise } from '@datadive/utils/common'

import { apiEnv } from '../../api-env'
import { UnauthorizedException } from '../../shared/exceptions/unauthorized-exception'

export type SessionData = InferResultValue<
  Awaited<
    ReturnType<
      InferResultValue<ReturnType<typeof createLandlordAuth>>['validateSession']
    >
  >
>

export interface ProtectedLandlordRouteEnv {
  Variables: {
    landlordCore: InferResultValue<ReturnType<typeof createLandlordCore>>
    user: SessionData['user']
    session: SessionData['session']
    sessionCookie: SessionData['sessionCookie']
  }
}

export const ProtectedLandlordRouteMiddleware =
  createMiddleware<ProtectedLandlordRouteEnv>(async (c, next) => {
    const landlordCore = await createLandlordCore({
      resend: {
        apiKey: apiEnv.RESEND_API_KEY,
      },
      database: {
        url: apiEnv.LANDLORD_DATABASE_URL,
        authToken: apiEnv.LANDLORD_DATABASE_AUTH_TOKEN,
      },
      turso: {
        authToken: apiEnv.TURSO_API_TOKEN,
        organization: apiEnv.TURSO_ORG,
      },
    }).match(
      (core) => core,
      (error) => raise(error),
    )

    const result = await landlordCore.auth.validateSession({
      bearerToken: c.req.header('X-Session') ?? '',
      cookie: c.req.header('Cookie') ?? '',
    })

    if (result.isErr()) {
      if (result.error instanceof CoreError.InvalidSessionId) {
        if (result.error.foundIn === 'cookie') {
          throw UnauthorizedException.fromInvalidSession('cookie')
        } else {
          throw UnauthorizedException.fromInvalidSession('header')
        }
      } else if (result.error instanceof CoreError.SessionIdNotFound) {
        throw UnauthorizedException.fromMissingSession()
      } else {
        return exhaustive(result.error)
      }
    }

    const { user, session, sessionCookie } = result.value

    c.set('user', user)
    c.set('session', session)
    c.set('sessionCookie', sessionCookie)
    c.set('landlordCore', landlordCore)

    await next()

    const sessionCookieFromContext = c.get('sessionCookie')

    if (sessionCookieFromContext) {
      c.header('Set-Cookie', sessionCookieFromContext.serialize())
    }

    landlordCore.destroy()
  })
