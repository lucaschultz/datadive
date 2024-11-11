import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { SelectableLandlordUser } from './types/selectable-landlord-user'

import { executeTakeFirst } from '@datadive/db'

export function getLandlordUserById(
  injection: { db: LandlordCoreInjection['db'] },
  params: { userId: string },
): ResultAsync<
  SelectableLandlordUser,
  DbError.NoQueryResult | DbError.QueryFailed
> {
  const { db } = injection

  const getUserByIdQuery = db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', params.userId)

  return executeTakeFirst(getUserByIdQuery)
}
