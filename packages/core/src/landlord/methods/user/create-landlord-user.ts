import type {
  DbError,
  Insertable,
  LandlordDatabaseSchema,
  LandlordTable,
} from '@datadive/db'
import type { Prettify } from '@datadive/utils/type'
import type { ResultAsync } from 'neverthrow'
import type { WithoutTimestamps } from '../../shared/types/without-timestamps'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { InsertableLandlordUser } from './types/insertable-landlord-user'

import { ok } from 'neverthrow'

import { executeTakeFirst } from '@datadive/db'
import {
  fromSafeAsyncFn,
  generateDatadiveId,
  omit,
} from '@datadive/utils/common'

import { noLandlordUserEmailConflict } from './no-landlord-user-email-conflict'
import { noLandlordUserUsernameConflict } from './no-landlord-user-username-conflict'

type CreateUserData = Prettify<
  Omit<
    WithoutTimestamps<
      Insertable<LandlordDatabaseSchema, typeof LandlordTable.User>
    >,
    'id' | 'passwordHash'
  > & {
    id?: string | undefined
    password: string
  }
>

const buildInsertableLandlordUser = fromSafeAsyncFn(
  async (injection: LandlordCoreInjection, user: CreateUserData) => {
    return ok({
      ...omit(user, ['password']),
      id: user.id ?? generateDatadiveId(),
      passwordHash: await injection.auth.hashPassword(user.password),
    } satisfies InsertableLandlordUser)
  },
)

function insertLandlordUserInDb(
  injection: { db: LandlordCoreInjection['db'] },
  user: InsertableLandlordUser,
): ResultAsync<
  InsertableLandlordUser,
  DbError.NoQueryResult | DbError.QueryFailed
> {
  const { db } = injection

  const insertUserQuery = db.insertInto('user').returningAll().values(user)

  return executeTakeFirst(insertUserQuery)
}

export function createLandlordUser(
  injection: LandlordCoreInjection,
  params: {
    user: CreateUserData
  },
) {
  return buildInsertableLandlordUser(injection, params.user)
    .andThrough((newUser) => noLandlordUserEmailConflict(injection, newUser))
    .andThrough((newUser) => noLandlordUserUsernameConflict(injection, newUser))
    .andThen((newUser) => insertLandlordUserInDb(injection, newUser))
}
