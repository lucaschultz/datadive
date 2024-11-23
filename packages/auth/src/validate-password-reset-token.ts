import { err, ok } from 'neverthrow'
import { isWithinExpirationDate } from 'oslo'

import { LandlordTable } from '@datadive/db'
import { resultFromSafeAsyncFn } from '@datadive/utils/common'

import { ExpiredPasswordResetTokenError } from './error/expired-password-reset-token-error'
import { IncorrectPasswordResetTokenError } from './error/incorrect-password-reset-token-error'
import { UpdateUserError } from './error/update-user-error'
import { defineAuthFunction } from './utility/define-auth-function'
import { hashPassword } from './utility/hash-password'
import { hashToken } from './utility/hash-token'

export const validatePasswordResetToken = defineAuthFunction(
  (injection, params: { token: string; password: string }) => {
    return resultFromSafeAsyncFn(async () => {
      const { db, lucia } = injection
      const tokenHash = await hashToken(params.token)

      const passwordResetToken = await db
        .selectFrom('passwordResetToken')
        .selectAll()
        .where('tokenHash', '=', tokenHash)
        .executeTakeFirst()

      if (!passwordResetToken) {
        return err(new IncorrectPasswordResetTokenError())
      }

      if (!isWithinExpirationDate(new Date(passwordResetToken.expiresAt))) {
        return err(new ExpiredPasswordResetTokenError())
      }

      await db
        .deleteFrom(LandlordTable.PasswordResetToken)
        .where('id', '=', passwordResetToken.id)
        .execute()

      await lucia.invalidateUserSessions(passwordResetToken.userId)

      const passwordHash = await hashPassword(params.password)

      const user = await db
        .updateTable(LandlordTable.User)
        .returningAll()
        .where('id', '=', passwordResetToken.userId)
        .set({
          passwordHash: passwordHash,
          emailVerified: 1,
        })
        .executeTakeFirst()

      if (!user) {
        return err(
          new UpdateUserError(
            `failed to update user "${passwordResetToken.userId}" after password reset`,
          ),
        )
      }

      const session = await lucia.createSession(passwordResetToken.userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      return ok({ user, session, sessionCookie })
    })
  },
)
