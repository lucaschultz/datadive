import type { MigrationResultSet } from 'kysely'
import type { Result } from 'neverthrow'
import type { AnyKysely } from './utilities/type/any-kysely'

import { promises as fs } from 'fs'
import * as path from 'path'

import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely'
import { err, ok, ResultAsync } from 'neverthrow'

import { constEnum } from '@datadive/utils/common'

import { DbError } from './errors/db-error'

export const MigrationFolder = {
  Tenant: path.join(import.meta.dirname, 'tenant', 'migrations'),
  Landlord: path.join(import.meta.dirname, 'landlord', 'migrations'),
}

export type MigrationFolder =
  (typeof MigrationFolder)[keyof typeof MigrationFolder]

export const MigrationResultStatus = constEnum({
  Succeeded: 'succeeded',
  Failed: 'failed',
  Skipped: 'skipped',
})
export type MigrationResultStatus = constEnum<typeof MigrationResultStatus>

export const MigrationResultDirection = constEnum({
  Up: 'up',
  Down: 'down',
})
export type MigrationResultDirection = constEnum<
  typeof MigrationResultDirection
>

export interface MigrationResult {
  migrationName: string
  direction: MigrationResultDirection
  status: MigrationResultStatus
}

export const ImplicitMigrationTarget = constEnum({
  LatestMigration: 'latest-migration',
  NoMigration: 'no-migration',
  Up: 'up',
  Down: 'down',
})
export type ImplicitMigrationTarget = constEnum<typeof ImplicitMigrationTarget>

export interface ExplicitMigrationTarget {
  migrationName: string
}

function processMigrationResult(
  migrationResult: Awaited<ReturnType<Migrator['migrateTo']>>,
): Result<ReadonlyArray<MigrationResult>, DbError.MigrationFailed> {
  const { error: migrationError, results } = migrationResult

  const migrationResults: ReadonlyArray<MigrationResult> =
    results?.map((result) => ({
      migrationName: result.migrationName,
      direction:
        result.direction === 'Down'
          ? MigrationResultDirection.Down
          : MigrationResultDirection.Up,
      status:
        result.status === 'Success'
          ? MigrationResultStatus.Succeeded
          : MigrationResultStatus.Failed,
    })) ?? []

  if (migrationError || !results) {
    return err(new DbError.MigrationFailed(migrationError, migrationResults))
  }

  return ok(migrationResults)
}

export function migrate(
  kysely: AnyKysely,
  migrationFolder: MigrationFolder,
  migrationTarget: ImplicitMigrationTarget | ExplicitMigrationTarget,
): ResultAsync<ReadonlyArray<MigrationResult>, DbError.MigrationFailed> {
  const migrator = new Migrator({
    db: kysely,
    provider: new FileMigrationProvider({
      fs: fs,
      path: path,
      migrationFolder: migrationFolder,
    }),
  })

  let migrationPromise: Promise<MigrationResultSet>

  switch (migrationTarget) {
    case ImplicitMigrationTarget.NoMigration:
      migrationPromise = migrator.migrateTo(NO_MIGRATIONS)
      break
    case ImplicitMigrationTarget.LatestMigration:
      migrationPromise = migrator.migrateToLatest()
      break
    case ImplicitMigrationTarget.Up:
      migrationPromise = migrator.migrateUp()
      break
    case ImplicitMigrationTarget.Down:
      migrationPromise = migrator.migrateDown()
      break
    default:
      migrationPromise = migrator.migrateTo(migrationTarget.migrationName)
      break
  }

  return ResultAsync.fromSafePromise(migrationPromise).andThen(
    processMigrationResult,
  )
}

export interface MigrationInfo {
  migrationName: string
  executedAt?: Date | undefined
}

function toMigrationInfos(
  migrations: Awaited<ReturnType<Migrator['getMigrations']>>,
) {
  return migrations.map(
    (migrationInfo): MigrationInfo => ({
      migrationName: migrationInfo.name,
      executedAt: migrationInfo.executedAt,
    }),
  )
}

export async function getMigrationInfos(
  kysely: AnyKysely,
  migrationFolder: MigrationFolder,
): Promise<ReadonlyArray<MigrationInfo>> {
  const migrator = new Migrator({
    db: kysely,
    provider: new FileMigrationProvider({
      fs: fs,
      path: path,
      migrationFolder: migrationFolder,
    }),
  })

  return toMigrationInfos(await migrator.getMigrations())
}
