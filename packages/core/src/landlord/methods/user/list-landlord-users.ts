import type {
  DbError,
  LandlordDatabaseSchema,
  Paginated,
  PaginationOptions,
} from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { OrderOption } from '../../shared/types/order-option'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableLandlordUser } from './types/selectable-landlord-user'

import { executePaginated } from '@datadive/db'

export function listLandlordUsers(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    pagination?: PaginationOptions | undefined
    orderBy?: OrderOption<LandlordDatabaseSchema, 'user'> | undefined
  },
): ResultAsync<
  Paginated<SelectableLandlordUser>,
  | DbError.QueryFailed
  | DbError.InvalidCount
  | DbError.InvalidPage
  | DbError.InvalidPageSize
  | DbError.NoQueryResult
> {
  const { db } = injection

  const listUsersQuery = db
    .selectFrom('user')
    .selectAll()
    .orderBy(...(params.orderBy ?? ['createdAt', 'asc']))

  return executePaginated(listUsersQuery, 'id', params.pagination)
}
