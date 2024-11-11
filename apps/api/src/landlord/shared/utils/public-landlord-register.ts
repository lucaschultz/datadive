import type { LandlordRouteEnv } from '../../middleware/landlord-route-middleware'

import { OpenAPIHono } from '@hono/zod-openapi'

import { ValidationException } from '../../../shared/exceptions/validation-exception'
import { createRouteRegisterHelper } from '../../../shared/utils/create-route-register-helper'
import { LandlordRouteMiddleware } from '../../middleware/landlord-route-middleware'

export const publicLandlordRoutesApp = new OpenAPIHono<LandlordRouteEnv>({
  defaultHook: (result) => {
    if (!result.success) {
      throw ValidationException.fromZodError(result.target, result.error)
    }

    return
  },
})

/**
 * Register a **public** route for the landlord API
 */
export const PublicLandlordRegister = createRouteRegisterHelper(
  publicLandlordRoutesApp,
  LandlordRouteMiddleware,
)
