import type { InferResultValue } from '@datadive/utils/common'
import type { SessionData } from './protected-landlord-route-middleware'

import { createMiddleware } from 'hono/factory'

import { createLandlordCore } from '@datadive/core'
import { raise } from '@datadive/utils/common'

import { apiEnv } from '../../api-env'

export interface LandlordRouteEnv {
  Variables: {
    landlordCore: InferResultValue<ReturnType<typeof createLandlordCore>>
    sessionCookie: SessionData['sessionCookie'] | undefined
  }
}

export const LandlordRouteMiddleware = createMiddleware<LandlordRouteEnv>(
  async (c, next) => {
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

    c.set('landlordCore', landlordCore)

    await next()

    const sessionCookieFromContext = c.get('sessionCookie')

    if (sessionCookieFromContext) {
      c.header('Set-Cookie', sessionCookieFromContext.serialize())
    }

    landlordCore.destroy()
  },
)
