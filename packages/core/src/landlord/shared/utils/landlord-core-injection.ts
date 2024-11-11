import type { createLandlordAuth } from '@datadive/auth'
import type { createLandlordKysely } from '@datadive/db'
import type { createEmail } from '@datadive/email'
import type { ResultAsync } from 'neverthrow'
import type { createTenantDatabaseCreator } from './create-tenant-database-creator'
import type { createTenantMigrator } from './create-tenant-migrator'

import { createInjectionUtilities } from '@datadive/utils/common'

type ResultValue<T> = T extends ResultAsync<infer U, infer _> ? U : never

export interface LandlordCoreInjection {
  email: ReturnType<typeof createEmail>
  auth: ResultValue<ReturnType<typeof createLandlordAuth>>
  db: ResultValue<ReturnType<typeof createLandlordKysely>>
  createTenantMigrator: typeof createTenantMigrator
  createTenantDatabase: ReturnType<typeof createTenantDatabaseCreator>
}

export const [defineLandlordCoreMethod, injectLandlordCoreMethod] =
  createInjectionUtilities<LandlordCoreInjection>()
