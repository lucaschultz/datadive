import { generateIdFromEntropySize } from 'lucia'
import { err, ok } from 'neverthrow'
import { createDate, TimeSpan } from 'oslo'

import { LandlordTable } from '@datadive/db'
import {
  generateDatadiveId,
  resultFromSafeAsyncFn,
} from '@datadive/utils/common'

import { StorePasswordResetTokenError } from './error/store-password-reset-token-error'
import { UserNotFoundError } from './error/user-not-found-error'
import { defineAuthFunction } from './utility/define-auth-function'
import { hashToken } from './utility/hash-token'

export const generatePasswordResetToken = defineAuthFunction(
  (injection, userInfo: { email: string } | { username: string }) => {
    return resultFromSafeAsyncFn(async () => {
      const { db } = injection

      const user =
        'email' in userInfo
          ? await db
              .selectFrom(LandlordTable.User)
              .selectAll()
              .where('email', '=', userInfo.email)
              .executeTakeFirst()
          : await db
              .selectFrom(LandlordTable.User)
              .selectAll()
              .where('username', '=', userInfo.username)
              .executeTakeFirst()

      if (!user) {
        return err(
          new UserNotFoundError(
            'email' in userInfo
              ? `user with email "${userInfo.email}" does not exist`
              : `user with username "${userInfo.username}" does not exist`,
          ),
        )
      }

      await db
        .deleteFrom(LandlordTable.PasswordResetToken)
        .where('userId', '=', user.id)
        .execute()

      const plainTextToken = generateIdFromEntropySize(25)
      const tokenHash = await hashToken(plainTextToken)

      const token = await db
        .insertInto(LandlordTable.PasswordResetToken)
        .values({
          id: generateDatadiveId(),
          tokenHash: tokenHash,
          userId: user.id,
          expiresAt: createDate(new TimeSpan(2, 'h')).toISOString(),
        })
        .returningAll()
        .executeTakeFirst()

      if (!token) {
        return err(
          new StorePasswordResetTokenError(
            `failed to store password reset token for user "${user.id}"`,
          ),
        )
      }

      return ok({ token: { ...token, plainText: plainTextToken }, user })
    })
  },
)
