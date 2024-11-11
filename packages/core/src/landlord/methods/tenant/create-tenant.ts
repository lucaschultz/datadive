import type { DbError, MigrationResult } from '@datadive/db'
import type { Head } from '@datadive/utils/type'
import type { ResultAsync } from 'neverthrow'
import type { CoreError } from '../../../errors/core-error'
import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'
import type { InsertableTenant } from './types/insertable-tenant'
import type { InsertableTenantDatabase } from './types/insertable-tenant-database'
import type { SelectableTenant } from './types/selectable-tenant'
import type { SelectableTenantDatabase } from './types/selectable-tenant-database'

import { executeTakeFirst } from '@datadive/db'
import { generateDatadiveId } from '@datadive/utils/common'
import { encryptText } from '@datadive/utils/node'

export interface CreateTenantData {
  domain: string
  name: string
}

function migrateTenantToLatest(
  injection: {
    createTenantMigrator: LandlordCoreInjection['createTenantMigrator']
  },
  params: {
    credentials: Head<Parameters<LandlordCoreInjection['createTenantMigrator']>>
  },
): ResultAsync<
  ReadonlyArray<MigrationResult>,
  | DbError.MigrationFailed
  | DbError.ClientInitializationFailed
  | DbError.QueryFailed
  | DbError.KyselyInitializationFailed
> {
  return injection
    .createTenantMigrator(params.credentials)
    .andThen((migrator) => {
      return migrator.migrate('latest-migration')
    })
}

function insertTenantIntoDb(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    tenant: InsertableTenant
  },
): ResultAsync<SelectableTenant, DbError.QueryFailed | DbError.NoQueryResult> {
  const { db } = injection
  const { tenant } = params

  const insertTenantQuery = db
    .insertInto('tenant')
    .values({
      id: generateDatadiveId(),
      name: tenant.name,
      domain: tenant.domain,
    })
    .returningAll()

  return executeTakeFirst(insertTenantQuery)
}

function insertTenantDatabaseIntoDb(
  injection: { db: LandlordCoreInjection['db'] },
  params: {
    tenantDatabase: InsertableTenantDatabase
  },
): ResultAsync<
  SelectableTenantDatabase,
  DbError.QueryFailed | DbError.NoQueryResult
> {
  const { db } = injection
  const { tenantDatabase } = params

  const insertTenantDatabaseQuery = db
    .insertInto('tenantDatabase')
    .values(tenantDatabase)
    .returningAll()

  return executeTakeFirst(insertTenantDatabaseQuery)
}

export function createTenant(
  injection: LandlordCoreInjection,
  params: {
    tenant: CreateTenantData
    encryptionKey: string
  },
): ResultAsync<
  SelectableTenant & { databaseUrl: string },
  | DbError.QueryFailed
  | DbError.NoQueryResult
  | DbError.MigrationFailed
  | DbError.DatabaseExists
  | DbError.ClientInitializationFailed
  | DbError.KyselyInitializationFailed
  | CoreError.CreateDatabase
> {
  const { createTenantDatabase } = injection

  return createTenantDatabase(params.tenant.domain)
    .andThrough((credentials) =>
      migrateTenantToLatest(injection, { credentials }),
    )
    .andThen((credentials) => {
      return insertTenantIntoDb(injection, {
        tenant: { ...params.tenant, id: generateDatadiveId() },
      }).map((tenant) => ({ tenant, credentials }))
    })
    .andThrough(({ tenant, credentials }) =>
      insertTenantDatabaseIntoDb(injection, {
        tenantDatabase: {
          id: generateDatadiveId(),
          tenantId: tenant.id,
          url: credentials.url,
          encryptedAuthToken: credentials.authToken
            ? encryptText(credentials.authToken, params.encryptionKey)
            : null,
        },
      }),
    )
    .map(({ tenant, credentials }) => ({
      ...tenant,
      databaseUrl: credentials.url,
    }))
}
