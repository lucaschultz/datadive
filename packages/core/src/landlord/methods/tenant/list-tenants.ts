import type {
  DbError,
  LandlordDatabaseSchema,
  Paginated,
  PaginationOptions,
} from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { OrderOption } from '../../shared/types/order-option'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableTenant } from './types/selectable-tenant'

import { executePaginated, LandlordTable } from '@datadive/db'

export const listTenants = (
  injection: LandlordCoreInjection,
  params: {
    pagination?: PaginationOptions | undefined
    orderBy?: OrderOption<LandlordDatabaseSchema, 'tenant'> | undefined
  },
): ResultAsync<
  Paginated<SelectableTenant & { databaseUrl: string }>,
  | DbError.QueryFailed
  | DbError.InvalidCount
  | DbError.InvalidPage
  | DbError.InvalidPageSize
  | DbError.NoQueryResult
> => {
  const { db } = injection

  const { pagination, orderBy } = params

  const tenantsQuery = db
    .selectFrom(LandlordTable.Tenant)
    .innerJoin(
      LandlordTable.TenantDatabase,
      'tenant.id',
      'tenantDatabase.tenantId',
    )
    .selectAll('tenant')
    .select('tenantDatabase.url as databaseUrl')
    .orderBy(...(orderBy ?? ['id', 'asc']))

  return executePaginated(tenantsQuery, 'tenant.id', pagination)
}
