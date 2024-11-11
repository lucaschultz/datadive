import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableTenant } from './types/selectable-tenant'

import { executeTakeFirst, LandlordTable } from '@datadive/db'

export function getTenantById(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    tenantId: string
  },
): ResultAsync<
  SelectableTenant & { databaseUrl: string },
  DbError.QueryFailed | DbError.NoQueryResult
> {
  const { db } = injection

  const tenantsQuery = db
    .selectFrom(LandlordTable.Tenant)
    .innerJoin(
      LandlordTable.TenantDatabase,
      'tenant.id',
      'tenantDatabase.tenantId',
    )
    .selectAll('tenant')
    .select('tenantDatabase.url as databaseUrl')
    .where('tenant.id', '=', params.tenantId)

  return executeTakeFirst(tenantsQuery)
}
