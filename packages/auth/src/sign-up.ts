import { err, ok } from 'neverthrow'

import { LandlordTable } from '@datadive/db'
import {
  generateDatadiveId,
  resultFromSafeAsyncFn,
} from '@datadive/utils/common'

import { EmailConflictError } from './error/email-conflict-error'
import { StoreUserError } from './error/store-user-error'
import { UsernameConflictError } from './error/username-conflict-error'
import { defineAuthFunction } from './utility/define-auth-function'
import { hashPassword } from './utility/hash-password'

export const signUp = defineAuthFunction(
  (
    injection,
    credentials: {
      email: string
      password: string
      firstName: string
      lastName: string
      username: string
    },
  ) => {
    return resultFromSafeAsyncFn(async () => {
      const { db, lucia } = injection

      const existingUser = await db
        .selectFrom('user')
        .selectAll()
        .where((eb) =>
          eb('email', '=', credentials.email).or(
            'username',
            '=',
            credentials.username,
          ),
        )
        .executeTakeFirst()

      if (existingUser) {
        if (existingUser.email === credentials.email) {
          return err(new EmailConflictError(credentials.email))
        }

        if (existingUser.username === credentials.username) {
          return err(new UsernameConflictError(credentials.username))
        }
      }

      const userId = generateDatadiveId()
      const passwordHash = await hashPassword(credentials.password)

      const user = await db
        .insertInto(LandlordTable.User)
        .returningAll()
        .values({
          id: userId,
          email: credentials.email,
          passwordHash: passwordHash,
          lastName: credentials.lastName,
          firstName: credentials.firstName,
          username: credentials.username,
        })
        .executeTakeFirst()

      if (!user) {
        return err(
          new StoreUserError(
            `Failed to store the new user with email "${credentials.email}" in the database`,
          ),
        )
      }

      const session = await lucia.createSession(userId, {})

      const sessionCookie = lucia.createSessionCookie(session.id)

      return ok({
        user: user,
        session: session,
        sessionCookie: sessionCookie,
      })
    })
  },
)
