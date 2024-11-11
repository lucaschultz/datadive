import type { InferResultValue } from '@datadive/utils/common'
import type { LandlordCoreInjection } from './shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

import { createLandlordAuth } from '@datadive/auth'
import { createDatabaseClient, createLandlordKysely } from '@datadive/db'
import { createEmail } from '@datadive/email'

import { createToken } from './methods/auth/create-token'
import { resetPassword } from './methods/auth/reset-password'
import { sendPasswordResetEmail } from './methods/auth/send-password-reset-email'
import { signIn } from './methods/auth/sign-in'
import { signOut } from './methods/auth/sign-out'
import { signUp } from './methods/auth/sign-up'
import { validateEmailVerificationCode } from './methods/auth/validate-email-verification-code'
import { validateSession } from './methods/auth/validate-session'
import { createTenant } from './methods/tenant/create-tenant'
import { deleteTenantById } from './methods/tenant/delete-tenant-by-id'
import { getTenantById } from './methods/tenant/get-tenant-by-id'
import { listTenants } from './methods/tenant/list-tenants'
import { updateTenantById } from './methods/tenant/update-tenant-by-id'
import { createLandlordUser } from './methods/user/create-landlord-user'
import { deleteLandlordUserById } from './methods/user/delete-landlord-user-by-id'
import { getLandlordUserById } from './methods/user/get-landlord-user-by-id'
import { listLandlordUsers } from './methods/user/list-landlord-users'
import { updateLandlordUserById } from './methods/user/update-landlord-user-by-id'
import { createTenantDatabaseCreator } from './shared/utils/create-tenant-database-creator'
import { createTenantMigrator } from './shared/utils/create-tenant-migrator'
import { injectLandlordCoreMethod } from './shared/utils/landlord-core-injection'

export function createLandlordCore(config: {
  resend: { apiKey: string }
  database: { url: string; authToken?: string | undefined }
  turso: { organization: string; authToken: string }
}) {
  return safeTry(async function* () {
    const email = createEmail(config.resend.apiKey)

    const databaseClient = yield* createDatabaseClient(
      config.database,
    ).safeUnwrap()

    const db = yield* createLandlordKysely(databaseClient).safeUnwrap()

    const auth = yield* (await createLandlordAuth(databaseClient)).safeUnwrap()

    const createTenantDatabase = createTenantDatabaseCreator({
      authToken: config.turso.authToken,
      organization: config.turso.organization,
    })

    const injection: LandlordCoreInjection = {
      email: email,
      auth: auth,
      db: db,
      createTenantMigrator: createTenantMigrator,
      createTenantDatabase: createTenantDatabase,
    }

    return ok({
      destroy: () => {
        databaseClient.close()
      },
      auth: {
        createToken: injectLandlordCoreMethod(injection, createToken),
        signUp: injectLandlordCoreMethod(injection, signUp),
        signIn: injectLandlordCoreMethod(injection, signIn),
        signOut: injectLandlordCoreMethod(injection, signOut),
        validateSession: injectLandlordCoreMethod(injection, validateSession),
        validateEmailVerificationCode: injectLandlordCoreMethod(
          injection,
          validateEmailVerificationCode,
        ),
        sendPasswordResetEmail: injectLandlordCoreMethod(
          injection,
          sendPasswordResetEmail,
        ),
        resetPassword: injectLandlordCoreMethod(injection, resetPassword),
      },
      user: {
        list: injectLandlordCoreMethod(injection, listLandlordUsers),
        getById: injectLandlordCoreMethod(injection, getLandlordUserById),
        updateById: injectLandlordCoreMethod(injection, updateLandlordUserById),
        insert: injectLandlordCoreMethod(injection, createLandlordUser),
        delete: injectLandlordCoreMethod(injection, deleteLandlordUserById),
      },
      tenant: {
        list: injectLandlordCoreMethod(injection, listTenants),
        create: injectLandlordCoreMethod(injection, createTenant),
        getById: injectLandlordCoreMethod(injection, getTenantById),
        updateById: injectLandlordCoreMethod(injection, updateTenantById),
        deleteById: injectLandlordCoreMethod(injection, deleteTenantById),
      },
    })
  })
}

export type LandlordCore = InferResultValue<
  ReturnType<typeof createLandlordCore>
>
