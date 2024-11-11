import type { DbError } from '@datadive/db'
import type { ResultAsync } from 'neverthrow'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { err, ok, okAsync } from 'neverthrow'

import { execute, LandlordTable } from '@datadive/db'

import { CoreError } from '../../../errors/core-error'

export function noLandlordUserEmailConflict<
  TUser extends { email?: string | undefined },
>(
  injection: { db: LandlordCoreInjection['db'] },
  user: TUser,
): ResultAsync<TUser, CoreError.DuplicateEmail | DbError.QueryFailed> {
  const { db } = injection

  if (user.email === undefined) {
    return okAsync(user)
  }

  const checkEmailQuery = db
    .selectFrom(LandlordTable.User)
    .selectAll()
    .where('user.email', '=', user.email)

  return execute(checkEmailQuery).andThen((existingUsers) => {
    const existingUser = existingUsers[0]
    if (existingUser) {
      return err(new CoreError.DuplicateEmail(existingUser.email))
    }

    return ok(user)
  })
}
