import type { LandlordCore } from '@datadive/core'
import type { InferResultError } from '@datadive/utils/common'

import { ok, safeTry } from 'neverthrow'

import { CoreError } from '@datadive/core'
import { CreateDatabase } from '@datadive/core/error'
import { DbError } from '@datadive/db'
import { LandlordEndpoints } from '@datadive/spec'
import { exhaustive, isInstanceOf } from '@datadive/utils/common'

import { apiEnv } from '../../api-env'
import { ConflictException } from '../../shared/exceptions/conflict-exception'
import { InternalException } from '../../shared/exceptions/internal-exception'
import { RouteParamNotFoundException } from '../../shared/exceptions/route-parameter-not-found-exception'
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
  LandlordEndpoints.Tenant.Create,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Tenant.Create)
    const core = c.get('landlordCore')
    const tenantData = c.req.valid('json')

    const result = await safeTry(async function* () {
      const tenant = yield* core.tenant
        .create({ tenant: tenantData, encryptionKey: apiEnv.APP_KEY })
        .safeUnwrap()

      return ok(tenant)
    })

    if (result.isErr()) {
      if (
        isInstanceOf(result.error, [
          DbError.ClientInitializationFailed,
          DbError.QueryFailed,
          DbError.KyselyInitializationFailed,
          DbError.NoQueryResult,
          DbError.MigrationFailed,
          DbError.DatabaseExists,
          CreateDatabase,
        ])
      ) {
        throw InternalException.fromError(result.error)
      } else {
        return exhaustive(result.error)
      }
    }

    const tenant = result.value

    return c.json(
      ...r(201, {
        success: true,
        message: 'Successfully created tenant',
        data: tenant,
      }),
    )
  },
)

ProtectedLandlordRegister.register(
  LandlordEndpoints.Tenant.Retrieve,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Tenant.Retrieve)
    const core = c.get('landlordCore')
    const { tenantId } = c.req.valid('param')

    const result = await safeTry(async function* () {
      const tenant = yield* core.tenant.getById({ tenantId }).safeUnwrap()

      return ok(tenant)
    })

    if (result.isErr()) {
      if (isInstanceOf(result.error, [DbError.QueryFailed])) {
        throw InternalException.fromError(result.error)
      } else if (isInstanceOf(result.error, [DbError.NoQueryResult])) {
        throw RouteParamNotFoundException.forRoute(
          LandlordEndpoints.Tenant.Retrieve,
          {
            detail: 'Tenant id matches no tenant',
            errorMessages: {
              routeParameters: {
                tenantId: ['Tenant not found'],
              },
            },
          },
        )
      } else {
        return exhaustive(result.error)
      }
    }

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully created tenant',
        data: result.value,
      }),
    )
  },
)

ProtectedLandlordRegister.register(LandlordEndpoints.Tenant.List, async (c) => {
  const r = useResponseHelper(LandlordEndpoints.Tenant.List)
  const core = c.get('landlordCore')
  const { perPage, page, sortBy, sortOrder } = c.req.valid('query')

  const result = await safeTry(async function* () {
    const tenant = yield* core.tenant
      .list({ pagination: { page, perPage }, orderBy: [sortBy, sortOrder] })
      .safeUnwrap()

    return ok(tenant)
  })

  if (result.isErr()) {
    if (isPaginationError(result.error)) {
      handlePaginationError(result.error)
    } else if (isInternalError(result.error)) {
      handleInternalError(result.error)
    } else {
      return exhaustive(result.error)
    }
  }

  return c.json(
    ...r(200, {
      success: true,
      message: 'Successfully created tenant',
      data: result.value,
    }),
  )
})

function handleTenantUpdateError(
  error: InferResultError<ReturnType<LandlordCore['tenant']['updateById']>>,
): never {
  if (isInstanceOf(error, [DbError.NoQueryResult])) {
    throw RouteParamNotFoundException.forRoute(
      LandlordEndpoints.Tenant.Update,
      {
        detail: 'Tenant id matches no tenant',
        errorMessages: {
          routeParameters: {
            tenantId: ['Tenant not found'],
          },
        },
      },
    )
  } else if (isInstanceOf(error, [CoreError.DuplicateDomain])) {
    throw ConflictException.forRoute(LandlordEndpoints.Tenant.Update, {
      detail: 'Tenant domain already exists',
      errorMessages: {
        body: {
          domain: ['Domain already exists'],
        },
      },
    })
  } else if (isInternalError(error)) {
    handleInternalError(error)
  } else {
    return exhaustive(error)
  }
}

ProtectedLandlordRegister.register(
  LandlordEndpoints.Tenant.Update,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Tenant.Update)
    const core = c.get('landlordCore')
    const tenantUpdate = c.req.valid('json')
    const { tenantId } = c.req.valid('param')

    const tenant = await core.tenant
      .updateById({ tenantId, tenantUpdate })
      .match(
        (tenant) => tenant,
        (error) => handleTenantUpdateError(error),
      )

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully updated tenant',
        data: tenant,
      }),
    )
  },
)

ProtectedLandlordRegister.register(
  LandlordEndpoints.Tenant.Delete,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Tenant.Delete)
    const core = c.get('landlordCore')
    const { tenantId } = c.req.valid('param')
    const { deletePermanently } = c.req.valid('query')

    const deletedTenant = await core.tenant
      .deleteById({ tenantId, deletePermanently })
      .match(
        (tenant) => tenant,
        (error): never => {
          if (error instanceof DbError.NoQueryResult) {
            throw RouteParamNotFoundException.forRoute(
              LandlordEndpoints.Tenant.Delete,
              {
                detail: 'Tenant id matches no tenant',
                errorMessages: {
                  routeParameters: {
                    tenantId: ['Tenant not found'],
                  },
                },
              },
            )
          } else if (isInternalError(error)) {
            handleInternalError(error)
          } else {
            return exhaustive(error)
          }
        },
      )

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully deleted tenant',
        data: deletedTenant,
      }),
    )
  },
)

export const landlordTenantApp = ProtectedLandlordRegister.app
