import type {
  DbError,
  LandlordDatabaseSchema,
  LandlordTable,
  Selectable,
} from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { executeTakeFirst } from '@datadive/db'

import { updateLandlordUserInDb } from './update-landlord-user-by-id'

type SelectableUser = Selectable<
  LandlordDatabaseSchema,
  typeof LandlordTable.User
>

export function deleteLandlordUserById(
  injection: { db: LandlordCoreInjection['db'] },
  params: { userId: string; permanently?: boolean | undefined },
): ResultAsync<SelectableUser, DbError.QueryFailed | DbError.NoQueryResult> {
  const { db } = injection

  const { userId, permanently } = params

  if (permanently) {
    const deleteUserQuery = db
      .deleteFrom('user')
      .where('id', '=', params.userId)
      .returningAll()

    return executeTakeFirst(deleteUserQuery)
  }

  return updateLandlordUserInDb(injection, {
    userId,
    user: { deletedAt: new Date().toISOString() },
  })
}
