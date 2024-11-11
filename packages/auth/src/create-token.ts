import { TimeSpan } from 'lucia'
import { err, ok } from 'neverthrow'
import { createDate } from 'oslo'

import { LandlordTable } from '@datadive/db'

import { UpdateSessionError } from './error/update-session-error'
import { signIn } from './sign-in'
import { defineAuthFunction } from './utility/define-auth-function'

type Credentials = {
  password: string
  validFor: number
} & ({ username: string } | { email: string })

export const createToken = defineAuthFunction(
  async (injection, credentials: Credentials) => {
    const { db } = injection
    const signInResult = await signIn(injection, credentials)

    if (signInResult.isErr()) {
      return signInResult
    }

    const session = await db
      .updateTable(LandlordTable.Session)
      .where('id', '==', signInResult.value.session.id)
      .set({
        expiresAt: Math.floor(
          createDate(new TimeSpan(credentials.validFor, 'd')).getTime() / 1000,
        ),
      })
      .returningAll()
      .executeTakeFirst()

    if (!session) {
      return err(new UpdateSessionError())
    }

    const { user, sessionCookie } = signInResult.value

    return ok({ session, user, sessionCookie })
  },
)
