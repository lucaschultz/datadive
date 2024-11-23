import { err, ok } from 'neverthrow'

import { LandlordTable } from '@datadive/db'
import { resultFromSafeAsyncFn } from '@datadive/utils/common'

import { IncorrectPasswordError } from './error/incorrect-password-error'
import { UserNotFoundError } from './error/user-not-found-error'
import { defineAuthFunction } from './utility/define-auth-function'
import { verifyPassword } from './utility/verify-password'

type Credentials =
  | {
      email: string
      password: string
    }
  | {
      username: string
      password: string
    }

export const signIn = defineAuthFunction(
  (injection, credentials: Credentials) => {
    return resultFromSafeAsyncFn(async () => {
      const { db, lucia } = injection

      const user =
        'email' in credentials
          ? await db
              .selectFrom(LandlordTable.User)
              .selectAll()
              .where('email', '=', credentials.email)
              .executeTakeFirst()
          : await db
              .selectFrom(LandlordTable.User)
              .selectAll()
              .where('username', '=', credentials.username)
              .executeTakeFirst()

      if (!user) {
        return err(
          new UserNotFoundError(
            'email' in credentials
              ? `user with email "${credentials.email}" does not exist`
              : `user with username "${credentials.username}" does not exist`,
          ),
        )
      }

      const isPasswordValid = await verifyPassword({
        password: credentials.password,
        hash: user.passwordHash,
      })

      if (!isPasswordValid) {
        return err(new IncorrectPasswordError())
      }

      const session = await lucia.createSession(user.id, {})

      const sessionCookie = lucia.createSessionCookie(session.id)

      return ok({
        user: user,
        session: session,
        sessionCookie: sessionCookie,
      })
    })
  },
)
