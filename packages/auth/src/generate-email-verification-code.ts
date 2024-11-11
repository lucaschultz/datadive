import { ok } from 'neverthrow'
import { createDate, TimeSpan } from 'oslo'
import { alphabet, generateRandomString } from 'oslo/crypto'

import { LandlordTable } from '@datadive/db'
import { generateDatadiveId } from '@datadive/utils/common'

import { defineAuthFunction } from './utility/define-auth-function'

export const generateEmailVerificationCode = defineAuthFunction(
  async (injection, params: { userId: string; email: string }) => {
    const { db } = injection

    await db
      .deleteFrom(LandlordTable.EmailVerificationCode)
      .where('userId', '=', params.userId)
      .execute()
    const code = generateRandomString(6, alphabet('0-9'))

    await db
      .insertInto(LandlordTable.EmailVerificationCode)
      .values({
        id: generateDatadiveId(),
        userId: params.userId,
        email: params.email,
        code: code,
        expiresAt: createDate(new TimeSpan(15, 'm')).toISOString(),
      })
      .execute()

    return ok(code)
  },
)
