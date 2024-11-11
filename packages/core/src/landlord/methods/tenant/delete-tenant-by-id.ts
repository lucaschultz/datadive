import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableTenant } from './types/selectable-tenant'

import { executeTakeFirst, LandlordTable } from '@datadive/db'

export function deleteTenantById(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    tenantId: string
    deletePermanently: boolean
  },
): ResultAsync<
  SelectableTenant & { databaseUrl: string },
  DbError.QueryFailed | DbError.NoQueryResult
> {
  const { db } = injection

  const tenantsQuery = db
    .with('database', (db) => {
      return db
        .selectFrom(LandlordTable.TenantDatabase)
        .selectAll()
        .where('tenantDatabase.tenantId', '=', params.tenantId)
        .select('tenantDatabase.url as databaseUrl')
    })
    .with('tenant', (db) => {
      if (params.deletePermanently) {
        db.deleteFrom(LandlordTable.Tenant)
          .where('tenant.id', '=', params.tenantId)
          .returningAll()
      }

      return db
        .updateTable(LandlordTable.Tenant)
        .where('tenant.id', '=', params.tenantId)
        .set({
          deletedAt: new Date().toISOString(),
        })
        .returningAll()
    })
    .selectFrom(['tenant', 'database'])
    .selectAll('tenant')
    .select('database.databaseUrl as databaseUrl')

  return executeTakeFirst(tenantsQuery)
}
