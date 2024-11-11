import { ok, safeTry } from 'neverthrow'

import { CoreError } from '@datadive/core'
import { DbError } from '@datadive/db'
import { LandlordEndpoints } from '@datadive/spec'
import { exhaustive } from '@datadive/utils/common'

import { ConflictException } from '../../shared/exceptions/conflict-exception'
import { InternalException } from '../../shared/exceptions/internal-exception'
import { RouteParamNotFoundException } from '../../shared/exceptions/route-parameter-not-found-exception'
import { getErrorType } from '../../shared/utils/get-error-type'
import {
  handleInternalError,
  isInternalError,
} from '../../shared/utils/is-internal-error'
import {
  handlePaginationError,
  isPaginationError,
} from '../../shared/utils/is-pagination-error'
import { useResponseHelper } from '../../shared/utils/use-response-helper'
import { ProtectedLandlordRegister } from '../shared/utils/protected-landlord-register'

ProtectedLandlordRegister.register(
  LandlordEndpoints.User.Retrieve,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.User.Retrieve)

    const core = c.get('landlordCore')
    const { userId } = c.req.valid('param')

    const userResult = await core.user.getById({ userId })

    if (userResult.isErr()) {
      if (userResult.error instanceof DbError.NoQueryResult) {
        return c.json(
          ...r(404, {
            success: false,
            title: 'Route parameter not found',
            code: 'route_parameter_not_found',
            type: getErrorType('route_parameter_not_found'),
            status: 404,
            detail: `No user was found with the id ${userId}.`,
            errorMessages: {
              routeParameters: {
                userId: ['Unknown user id'],
              },
            },
          }),
        )
      } else if (userResult.error instanceof DbError.QueryFailed) {
        throw InternalException.fromError(userResult.error)
      } else {
        return exhaustive(userResult.error)
      }
    }

    const user = userResult.value

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully retrieved user.',
        data: user,
      }),
    )
  },
)

ProtectedLandlordRegister.register(LandlordEndpoints.User.List, async (c) => {
  const core = c.get('landlordCore')
  const { page, perPage, sortBy, sortOrder } = c.req.valid('query')

  const result = await safeTry(async function* () {
    const r = useResponseHelper(LandlordEndpoints.User.List)
    const users = yield* core.user
      .list({
        pagination: {
          page,
          perPage,
        },
        orderBy: [sortBy, sortOrder],
      })
      .safeUnwrap()

    return ok(
      r(200, {
        success: true,
        message: 'Successfully retrieved user list.',
        data: users,
      }),
    )
  })

  if (result.isErr()) {
    if (isPaginationError(result.error)) {
      handlePaginationError(result.error)
    } else if (isInternalError(result.error)) {
      handleInternalError(result.error)
    } else {
      exhaustive(result.error)
    }
  }

  return c.json(...result.value)
})

ProtectedLandlordRegister.register(LandlordEndpoints.User.Delete, async (c) => {
  const core = c.get('landlordCore')
  const { userId } = c.req.valid('param')
  const { deletePermanently } = c.req.valid('query')

  const result = await safeTry(async function* () {
    const r = useResponseHelper(LandlordEndpoints.User.Delete)

    const user = yield* core.user
      .delete({
        userId: userId,
        permanently: deletePermanently,
      })
      .safeUnwrap()

    return ok(
      r(200, {
        success: true,
        message: 'Successfully deleted user.',
        data: user,
      }),
    )
  })

  if (result.isErr()) {
    if (result.error instanceof DbError.NoQueryResult) {
      throw RouteParamNotFoundException.forRoute(
        LandlordEndpoints.User.Delete,
        {
          detail: 'User id matches no user',
          errorMessages: {
            routeParameters: {
              userId: ['User not found'],
            },
          },
        },
      )
    } else if (isInternalError(result.error)) {
      handleInternalError(result.error)
    } else {
      exhaustive(result.error)
    }
  }

  return c.json(...result.value)
})

ProtectedLandlordRegister.register(LandlordEndpoints.User.Update, async (c) => {
  const core = c.get('landlordCore')
  const { userId } = c.req.valid('param')
  const user = c.req.valid('json')

  const result = await safeTry(async function* () {
    const r = useResponseHelper(LandlordEndpoints.User.Update)

    const updatedUser = yield* core.user
      .updateById({
        userId,
        user,
      })
      .safeUnwrap()

    return ok(
      r(201, {
        success: true,
        message: 'Successfully updated user.',
        data: updatedUser,
      }),
    )
  })

  if (result.isErr()) {
    if (result.error instanceof CoreError.DuplicateEmail) {
      throw ConflictException.forRoute(LandlordEndpoints.User.Update, {
        detail: 'Email already exists',
        errorMessages: {
          body: {
            email: ['Email already exists'],
          },
        },
      })
    } else if (result.error instanceof CoreError.DuplicateUsername) {
      throw ConflictException.forRoute(LandlordEndpoints.User.Update, {
        detail: 'Username already exists',
        errorMessages: {
          body: {
            username: ['Username already exists'],
          },
        },
      })
    } else if (result.error instanceof DbError.NoQueryResult) {
      throw RouteParamNotFoundException.forRoute(
        LandlordEndpoints.User.Update,
        {
          detail: 'User id matches no user',
          errorMessages: {
            routeParameters: {
              userId: ['User not found'],
            },
          },
        },
      )
    } else if (isInternalError(result.error)) {
      handleInternalError(result.error)
    } else {
      exhaustive(result.error)
    }
  }

  return c.json(...result.value)
})

export const landlordUserApp = ProtectedLandlordRegister.app
