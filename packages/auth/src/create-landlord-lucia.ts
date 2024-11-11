import type { createDatabaseClient } from '@datadive/db'
import type { InferResultValue } from '@datadive/utils/common'
import type { Prettify } from '@datadive/utils/type'

import { LibSQLAdapter } from '@lucia-auth/adapter-sqlite'
import { Lucia } from 'lucia'
import { err, ok } from 'neverthrow'

import { LuciaInitializationError } from './error/luca-initialization-error'

interface DatabaseUserAttributes {
  created_at: string
  deleted_at: string | null
  email: string
  email_verified: number
  first_name: string
  last_name: string
  password_hash: string
  updated_at: string
  username: string
}

interface UserAttributes {
  createdAt: string
  deletedAt: string | null
  email: string
  emailVerified: number
  firstName: string
  lastName: string
  passwordHash: string
  updatedAt: string
  username: string
}

declare module 'lucia' {
  interface Register {
    Lucia: Lucia<{ [key: string]: never }, UserAttributes>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

export type { Lucia }
export type Session = Prettify<Awaited<ReturnType<Lucia['createSession']>>>
export type SessionCookie = ReturnType<Lucia['createSessionCookie']>

export function createLandlordLucia(
  databaseClient: InferResultValue<ReturnType<typeof createDatabaseClient>>,
) {
  try {
    const adapter = new LibSQLAdapter(databaseClient, {
      user: 'user',
      session: 'session',
    })

    const lucia = new Lucia(adapter, {
      getUserAttributes: (attributes) => {
        return {
          username: attributes.username,
          email: attributes.email,
          emailVerified: attributes.email_verified,
          passwordHash: attributes.password_hash,
          firstName: attributes.first_name,
          lastName: attributes.last_name,
          createdAt: attributes.created_at,
          updatedAt: attributes.updated_at,
          deletedAt: attributes.deleted_at,
        }
      },
      sessionCookie: {
        attributes: {
          secure: process.env.NODE_ENV === 'production',
        },
      },
    })

    return ok(lucia)
  } catch (error) {
    return err(new LuciaInitializationError(error))
  }
}
