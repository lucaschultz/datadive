import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { errAsync, okAsync } from 'neverthrow'

import { execute, LandlordTable } from '@datadive/db'

import { CoreError } from '../../../errors/core-error'

export function noLandlordUserUsernameConflict<
  TUser extends { username?: string | undefined },
>(
  injection: { db: LandlordCoreInjection['db'] },
  user: TUser,
): ResultAsync<TUser, CoreError.DuplicateUsername | DbError.QueryFailed> {
  const { db } = injection

  if (user.username === undefined) {
    return okAsync(user)
  }

  const checkUsernameQuery = db
    .selectFrom(LandlordTable.User)
    .selectAll()
    .where('user.username', '=', user.username)

  return execute(checkUsernameQuery).andThen((existingUsers) => {
    const existingUser = existingUsers[0]
    if (existingUser) {
      return errAsync(new CoreError.DuplicateUsername(existingUser.username))
    }

    return okAsync(user)
  })
}
