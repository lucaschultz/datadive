import { err, ok } from 'neverthrow'
import { isWithinExpirationDate } from 'oslo'

import { LandlordTable } from '@datadive/db'

import { ExpiredEmailValidationCodeError } from './error/expired-email-validation-code-error'
import { IncorrectEmailValidationCodeError } from './error/incorrect-email-validation-code-error'
import { defineAuthFunction } from './utility/define-auth-function'

export const validateEmailVerificationCode = defineAuthFunction(
  async (injection, user: { id: string; email: string }, code: string) => {
    const { db, lucia } = injection

    const databaseCode = await db
      .selectFrom(LandlordTable.EmailVerificationCode)
      .selectAll()
      .where('userId', '=', user.id)
      .executeTakeFirst()

    if (databaseCode?.code !== code) {
      return err(new IncorrectEmailValidationCodeError())
    }

    await db
      .deleteFrom(LandlordTable.EmailVerificationCode)
      .where('userId', '=', user.id)
      .execute()

    if (!isWithinExpirationDate(new Date(databaseCode.expiresAt))) {
      return err(new ExpiredEmailValidationCodeError())
    }

    if (databaseCode.email !== user.email) {
      return err(new IncorrectEmailValidationCodeError())
    }

    await lucia.invalidateUserSessions(user.id)

    await db
      .updateTable(LandlordTable.User)
      .where('id', '=', user.id)
      .set({ emailVerified: 1 })
      .execute()

    const session = await lucia.createSession(user.id, {})

    const sessionCookie = lucia.createSessionCookie(session.id)

    return ok({ session, sessionCookie })
  },
)
