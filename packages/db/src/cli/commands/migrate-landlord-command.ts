import { defineCommand } from 'citty'
import consola from 'consola'

import { createDatabaseClient } from '../../create-database-client'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import {
  ImplicitMigrationTarget,
  migrate,
  MigrationFolder,
} from '../../migrate'
import { assertMigrationTarget } from '../utilities/assert-migration-target'
import {
  envArg,
  LandlordDatabaseEnvSchema,
  loadEnv,
} from '../utilities/load-env'
import { processMigrationResult } from '../utilities/process-migration-results'

export const migrateLandlordCommand = defineCommand({
  meta: {
    name: 'migrate:landlord',
    description: 'Migrate the landlord database',
  },
  args: {
    env: envArg,
    target: {
      type: 'positional',
      description: 'The target to migrate the database to',
      default: ImplicitMigrationTarget.LatestMigration,
      valueHint: `"${Object.values(ImplicitMigrationTarget).join('"|"')}"`,
    },
  },
  async run({ args }) {
    const env = loadEnv(LandlordDatabaseEnvSchema, { path: args.env })

    assertMigrationTarget(args.target)

    consola.start(
      'Connecting to landlord database: ${env.LANDLORD_DATABASE_URL}',
    )

    const landlordKyselyResult = await createDatabaseClient({
      url: env.LANDLORD_DATABASE_URL,
      authToken: env.LANDLORD_DATABASE_AUTH_TOKEN,
    }).asyncAndThen(createLandlordKysely)

    if (landlordKyselyResult.isErr()) {
      throw landlordKyselyResult.error
    }

    const landlordKysely = landlordKyselyResult.value

    consola.success(`Connected to landlord database`)

    consola.start(`Migrating landlord database`)

    const results = await migrate(
      landlordKysely,
      MigrationFolder.Landlord,
      args.target,
    )

    processMigrationResult(results, {
      success: 'Landlord database migrated successfully',
      failure: 'Landlord database migration failed',
    })

    consola.success('Migrated landlord database')

    await landlordKysely.destroy()
  },
})
