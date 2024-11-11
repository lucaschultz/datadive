import type { ProtectedLandlordRouteEnv } from '../../middleware/protected-landlord-route-middleware'

import { OpenAPIHono } from '@hono/zod-openapi'

import { ValidationException } from '../../../shared/exceptions/validation-exception'
import { createRouteRegisterHelper } from '../../../shared/utils/create-route-register-helper'
import { ProtectedLandlordRouteMiddleware } from '../../middleware/protected-landlord-route-middleware'

const protectedLandlordRoutesApp = new OpenAPIHono<ProtectedLandlordRouteEnv>({
  defaultHook: (result) => {
    if (!result.success) {
      throw ValidationException.fromZodError(result.target, result.error)
    }

    return
  },
})

/**
 * Register a protected route for the landlord API
 */
export const ProtectedLandlordRegister = createRouteRegisterHelper(
  protectedLandlordRoutesApp,
  ProtectedLandlordRouteMiddleware,
)
