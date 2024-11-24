import { readFile, writeFile } from 'fs/promises'

import { defineCommand } from 'citty'
import consola from 'consola'
import { ok, safeTry } from 'neverthrow'

import { createDatabase } from '../../create-database'
import { createDatabaseClient } from '../../create-database-client'
import { DbError } from '../../errors/db-error'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import { getLandlordDatabaseName } from '../../landlord/utility/get-landlord-database-name'
import { ImplicitMigrationTarget, migrate } from '../../migrate'
import { migrationFolderArgs } from '../arguments/migration-folder-args'
import { envArg, loadEnv, TursoEnvSchema } from '../utilities/load-env'
import {
  processMigrationFailedError,
  processMigrationResults,
} from '../utilities/process-migration-results'
import { extractEnvVariable } from './make-appkey-command'

export const makeLandlordCommand = defineCommand({
  meta: {
    name: 'make:landlord',
    description: 'Create and migrate new landlord database',
  },
  args: {
    name: {
      type: 'positional',
      required: true,
      description: 'The name of the new landlord',
      valueHint: 'landlord-name',
    },
    env: envArg,
    'replace-env-vars': {
      type: 'boolean',
      alias: 'r',
      required: false,
      default: false,
      description: 'Replace the landlord env variables in the env file',
    },
    'landlord-migrations': migrationFolderArgs['landlord-migrations'],
  },
  async run({ args }) {
    const env = loadEnv(TursoEnvSchema, { path: args.env })

    consola.start(`Creating database for landlord "${args.name}"`)

    const landlordDatabaseName = getLandlordDatabaseName(args.name)
    const result = await safeTry(async function* () {
      const databaseClientConfig = yield* createDatabase(landlordDatabaseName, {
        authToken: env.TURSO_API_TOKEN,
        organization: env.TURSO_ORG,
        group: 'default',
      }).safeUnwrap()

      consola.success(`Created landlord database: ${landlordDatabaseName}`)
      consola.info(`Name: ${landlordDatabaseName}`)
      consola.info(`Host: ${databaseClientConfig.url}`)
      consola.info(`Auth-Token: ${databaseClientConfig.authToken}`)

      const databaseClient =
        yield* createDatabaseClient(databaseClientConfig).safeUnwrap()
      const landlordKysely =
        yield* createLandlordKysely(databaseClient).safeUnwrap()

      consola.start(`Migrating landlord database`)

      const migrationResult = yield* migrate(
        landlordKysely,
        args['landlord-migrations'],
        ImplicitMigrationTarget.LatestMigration,
      ).safeUnwrap()

      processMigrationResults(
        migrationResult,
        `Landlord database migrated successfully`,
      )

      return ok({
        url: databaseClientConfig.url,
        authToken: databaseClientConfig.authToken,
      })
    })

    if (result.isErr()) {
      if (!(result.error instanceof DbError.MigrationFailed)) {
        throw result.error
      }

      processMigrationFailedError(
        result.error,
        `Landlord database migration failed`,
      )
      return
    }

    if (args['replace-env-vars']) {
      if (args.env) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        let content = (await readFile(args.env)).toString()

        const landlordDatabaseUrl = extractEnvVariable(
          'LANDLORD_DATABASE_URL',
          content.toString(),
        )
        if (landlordDatabaseUrl) {
          content = landlordDatabaseUrl.replaceWith(result.value.url)
        }

        const landlordDatabaseAuthToken = extractEnvVariable(
          'LANDLORD_DATABASE_AUTH_TOKEN',
          content.toString(),
        )
        if (landlordDatabaseAuthToken) {
          content = landlordDatabaseAuthToken.replaceWith(
            result.value.authToken,
          )
        }

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await writeFile(args.env, content)

        consola.info(`Replaced landlord env variables in the env file`)
      } else {
        consola.warn(
          `Cannot replace env variables in the env file because the env file is not provided`,
        )
      }
    }

    consola.success(`Created landlord ${args.name}`)
  },
})
