import type {
  DbError,
  ExplicitMigrationTarget,
  ImplicitMigrationTarget,
  MigrationInfo,
  MigrationResult,
} from '@datadive/db'
import type { ResultAsync } from 'neverthrow'

import { ok, safeTry } from 'neverthrow'

import {
  createDatabaseClient,
  createLandlordKysely,
  getMigrationInfos,
  migrate,
  MigrationFolder,
} from '@datadive/db'

interface TenantMigrator {
  migrate: (
    target: ExplicitMigrationTarget | ImplicitMigrationTarget,
  ) => ResultAsync<ReadonlyArray<MigrationResult>, DbError.MigrationFailed>
  getMigrations: () => Promise<ReadonlyArray<MigrationInfo>>
}

export function createTenantMigrator(credentials: {
  url: string
  authToken?: string | undefined
}): ResultAsync<
  TenantMigrator,
  | DbError.ClientInitializationFailed
  | DbError.QueryFailed
  | DbError.KyselyInitializationFailed
> {
  return safeTry(async function* () {
    const client = yield* createDatabaseClient(credentials).safeUnwrap()
    const kysely = yield* createLandlordKysely(client).safeUnwrap()

    const migrator: TenantMigrator = {
      migrate: (target) => migrate(kysely, MigrationFolder.Tenant, target),
      getMigrations: () => getMigrationInfos(kysely, MigrationFolder.Tenant),
    }

    return ok(migrator)
  })
}
