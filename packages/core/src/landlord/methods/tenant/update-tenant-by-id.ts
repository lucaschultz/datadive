import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableTenant } from './types/selectable-tenant'
import type { UpdateableTenant } from './types/updateable-tenant'

import { err, ok, okAsync } from 'neverthrow'

import { execute, executeTakeFirst, LandlordTable } from '@datadive/db'

import { CoreError } from '../../../errors/core-error'

export interface UpdateTenantData {
  domain: string
  name: string
}

function noTenantDomainConflict<
  TTenant extends { domain?: string | undefined },
>(
  injection: { db: LandlordCoreInjection['db'] },
  tenant: TTenant,
): ResultAsync<TTenant, DbError.QueryFailed | CoreError.DuplicateDomain> {
  const { db } = injection

  if (tenant.domain === undefined) {
    return okAsync(tenant)
  }

  const checkDomainQuery = db
    .selectFrom('tenant')
    .selectAll()
    .where('tenant.domain', '=', tenant.domain)

  return execute(checkDomainQuery).andThen((existingTenants) => {
    const existingTenant = existingTenants[0]
    if (existingTenant) {
      return err(new CoreError.DuplicateDomain(existingTenant.domain))
    }

    return ok(tenant)
  })
}

function updateTenantInDb(
  injection: { db: LandlordCoreInjection['db'] },
  params: { tenantId: string; tenantUpdate: UpdateableTenant },
): ResultAsync<
  SelectableTenant & { databaseUrl: string },
  DbError.QueryFailed | DbError.NoQueryResult
> {
  const { db } = injection

  const updateTenantQuery = db
    .with('database', (db) => {
      return db
        .selectFrom(LandlordTable.TenantDatabase)
        .selectAll()
        .where('tenantDatabase.tenantId', '=', params.tenantId)
        .select('tenantDatabase.url as databaseUrl')
    })
    .with('tenant', (db) => {
      return db
        .updateTable(LandlordTable.Tenant)
        .where('tenant.id', '=', params.tenantId)
        .set({
          domain: params.tenantUpdate.domain,
          name: params.tenantUpdate.name,
        })
        .returningAll('tenant')
    })
    .selectFrom(['tenant', 'database'])
    .selectAll('tenant')
    .select('database.databaseUrl as databaseUrl')

  return executeTakeFirst(updateTenantQuery)
}

export function updateTenantById(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    tenantId: string
    tenantUpdate: {
      domain: string
      name: string
    }
  },
): ResultAsync<
  SelectableTenant & { databaseUrl: string },
  DbError.QueryFailed | DbError.NoQueryResult | CoreError.DuplicateDomain
> {
  return noTenantDomainConflict(injection, params.tenantUpdate).andThen(
    (tenantUpdate) =>
      updateTenantInDb(injection, { tenantId: params.tenantId, tenantUpdate }),
  )
}
