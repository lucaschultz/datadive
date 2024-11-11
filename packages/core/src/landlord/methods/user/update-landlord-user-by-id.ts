import type {
  DbError,
  LandlordDatabaseSchema,
  Selectable,
  Updateable,
} from '@datadive/db'
import type { Prettify } from '@datadive/utils/type'
import type { WithoutTimestamps } from '../../shared/types/without-timestamps'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { UpdateableLandlordUser } from './types/updateable-landlord-user'

import { ResultAsync } from 'neverthrow'

import { executeTakeFirst, LandlordTable } from '@datadive/db'
import { omit, toPromise } from '@datadive/utils/common'

import { noLandlordUserEmailConflict } from './no-landlord-user-email-conflict'
import { noLandlordUserUsernameConflict } from './no-landlord-user-username-conflict'

type UpdateUserData = Prettify<
  Omit<
    WithoutTimestamps<
      Updateable<LandlordDatabaseSchema, typeof LandlordTable.User>
    >,
    'passwordHash' | 'id'
  > & {
    password?: string | undefined
  }
>

function buildUpdateableLandlordUser(
  injection: {
    auth: {
      hashPassword: LandlordCoreInjection['auth']['hashPassword']
    }
  },
  user: UpdateUserData,
): ResultAsync<UpdateableLandlordUser, never> {
  return ResultAsync.fromSafePromise(
    toPromise(async () => {
      return {
        ...omit(user, ['password']),
        ...(user.password
          ? { passwordHash: await injection.auth.hashPassword(user.password) }
          : {}),
      }
    }),
  )
}

export function updateLandlordUserInDb(
  injection: { db: LandlordCoreInjection['db'] },
  params: { userId: string; user: UpdateableLandlordUser },
): ResultAsync<
  Selectable<LandlordDatabaseSchema, typeof LandlordTable.User>,
  DbError.QueryFailed | DbError.NoQueryResult
> {
  const { db } = injection

  const updateUserQuery = db
    .updateTable(LandlordTable.User)
    .where('user.id', '=', params.userId)
    .set(params.user)
    .returningAll()

  return executeTakeFirst(updateUserQuery)
}

export const updateLandlordUserById = (
  injection: {
    db: LandlordCoreInjection['db']
    auth: LandlordCoreInjection['auth']
  },
  params: { userId: string; user: UpdateUserData },
) => {
  return buildUpdateableLandlordUser(injection, params.user)
    .andThrough((userUpdate) =>
      noLandlordUserEmailConflict(injection, userUpdate),
    )
    .andThrough((userUpdate) =>
      noLandlordUserUsernameConflict(injection, userUpdate),
    )
    .andThen((userUpdate) =>
      updateLandlordUserInDb(injection, {
        userId: params.userId,
        user: userUpdate,
      }),
    )
}
