import type { Result } from 'neverthrow'
import type { MigrationResult } from '../../migrate'

import consola from 'consola'
import { colorize } from 'consola/utils'

import { exhaustive } from '@datadive/utils/common'

import { DbError } from '../../errors/db-error'
import { MigrationResultStatus } from '../../migrate'

export function processMigrationResult(
  migrationResult: Result<ReadonlyArray<MigrationResult>, unknown>,
  messages: {
    success: string
    failure: string
  },
) {
  if (migrationResult.isErr()) {
    consola.warn(messages.failure)

    if (!(migrationResult.error instanceof DbError.MigrationFailed)) {
      throw migrationResult.error
    }

    processMigrationFailedError(migrationResult.error, messages.failure)
    return
  }

  processMigrationResults(migrationResult.value, messages.success)
}

export function processMigrationResults(
  migrationResults: ReadonlyArray<MigrationResult>,
  message: string,
) {
  consola.success(message)

  for (const { migrationName, direction } of migrationResults) {
    if (direction === 'up') {
      consola.info(`Applied migration "${migrationName}"`)
    } else {
      consola.info(`Reverted migration "${migrationName}"`)
    }
  }
}

export function processMigrationFailedError(
  error: DbError.MigrationFailed,
  message: string,
) {
  consola.warn(message)

  for (const { migrationName, status } of error.migrationResults) {
    switch (status) {
      case MigrationResultStatus.Skipped:
        consola.log(
          colorize('yellow', `⚠︎ Migration "${migrationName}" was skipped`),
        )
        break
      case MigrationResultStatus.Succeeded:
        consola.log(
          colorize('green', `✔︎ Migration "${migrationName}" has succeeded`),
        )
        break
      case MigrationResultStatus.Failed:
        consola.log(
          colorize('red', `✘ Migration "${migrationName}" has failed`),
        )
        break
      default:
        return exhaustive(status)
    }
  }

  if (error.cause) {
    consola.error(error.cause)
  }

  return
}
