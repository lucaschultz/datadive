import { defineCommand } from 'citty'
import consola from 'consola'

import { generateDatadiveId } from '@datadive/utils/common'
import { encryptText } from '@datadive/utils/node'

import { createDatabase } from '../../create-database'
import { createDatabaseClient } from '../../create-database-client'
import { LandlordTable } from '../../landlord/constants/landlord-table'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import { ImplicitMigrationTarget, migrate } from '../../migrate'
import { createTenantKysely } from '../../tenant/create-tenant-kysely'
import { getTenantDatabaseName } from '../../tenant/utility/get-tenant-database-name'
import { exitWithError } from '../arguments/exit-with-error'
import { migrationFolderArgs } from '../arguments/migration-folder-args'
import {
  AppKeyEnvSchema,
  envArg,
  LandlordDatabaseEnvSchema,
  loadEnv,
  TursoEnvSchema,
} from '../utilities/load-env'
import { processMigrationResult } from '../utilities/process-migration-results'

export const makeTenantCommand = defineCommand({
  meta: {
    name: 'make:tenant',
    description: 'Create and migrate new tenant database',
  },
  args: {
    'tenant-name': {
      type: 'positional',
      required: true,
      description: 'The name of the new tenant',
      valueHint: 'tenant-name',
    },
    'tenant-domain': {
      type: 'string',
      description: 'The domain of the new tenant (defaults to the tenant name)',
      valueHint: 'tenant-domain',
      alias: 'd',
      required: false,
    },
    force: {
      type: 'boolean',
      description:
        'Overwrite the tenant database if it already exists (takes precedence over "adopt")',
      alias: 'f',
      required: false,
    },
    adopt: {
      type: 'boolean',
      description: 'Adopt the tenant database if it already exists',
      alias: 'a',
      required: false,
    },
    'tenant-migrations': migrationFolderArgs['tenant-migrations'],
    env: envArg,
  },
  async run({ args }) {
    const env = loadEnv(
      TursoEnvSchema.merge(LandlordDatabaseEnvSchema).merge(AppKeyEnvSchema),
      { path: args.env },
    )

    const tenantName = args['tenant-name']
    const tenantDomain = args['tenant-domain'] as string | undefined

    consola.start(`Creating database for tenant "${tenantName}"`)

    const tenantDatabaseName = getTenantDatabaseName(tenantName)

    const databaseClientConfig = await createDatabase(
      tenantDatabaseName,
      {
        authToken: env.TURSO_API_TOKEN,
        organization: env.TURSO_ORG,
        group: 'default',
      },
      {
        duplicateHandling: args.force
          ? 'override'
          : args.adopt
            ? 'adopt'
            : 'abort',
      },
    )

    if (databaseClientConfig.isErr()) {
      throw databaseClientConfig.error
    }

    consola.success(`Created tenant database: ${tenantDatabaseName}`)

    const tenantKyselyResult = await createDatabaseClient(
      databaseClientConfig.value,
    ).asyncAndThen((client) => {
      return createTenantKysely(client)
    })

    if (tenantKyselyResult.isErr()) {
      throw tenantKyselyResult.error
    }

    const tenantKysely = tenantKyselyResult.value

    consola.start(`Migrating tenant database`)

    const migrationResults = await migrate(
      tenantKysely,
      args['tenant-migrations'],
      ImplicitMigrationTarget.LatestMigration,
    )

    processMigrationResult(migrationResults, {
      success: `Tenant database migrated successfully`,
      failure: `Tenant database migration failed`,
    })

    consola.start(`Saving tenant database credentials in landlord`)

    const landlordDbResult = await createDatabaseClient({
      url: env.LANDLORD_DATABASE_URL,
      authToken: env.LANDLORD_DATABASE_AUTH_TOKEN,
    }).asyncAndThen((client) => {
      return createLandlordKysely(client)
    })

    if (landlordDbResult.isErr()) {
      throw landlordDbResult.error
    }

    const landlordDb = landlordDbResult.value

    await landlordDb
      .deleteFrom(LandlordTable.Tenant)
      .where('name', '==', tenantName)
      .execute()

    const tenant = await landlordDb
      .insertInto(LandlordTable.Tenant)
      .returningAll()
      .values({
        id: generateDatadiveId(),
        name: tenantName,
        domain: tenantDomain ?? tenantName,
      })
      .executeTakeFirst()

    if (!tenant) {
      exitWithError(
        'Failed to insert tenant. The database has been created but the tenant record could not be saved. Please insert the tenant manually in the "tenants" table of the landlord database.',
      )
    }

    const tenantDatabase = await landlordDb
      .insertInto(LandlordTable.TenantDatabase)
      .returningAll()
      .values({
        tenantId: tenant.id,
        encryptedAuthToken: encryptText(
          databaseClientConfig.value.authToken,
          env.APP_KEY,
        ),
        url: databaseClientConfig.value.url,
        id: generateDatadiveId(),
      })
      .executeTakeFirst()

    if (!tenantDatabase) {
      exitWithError(
        'Failed to insert tenant database. The database has been created but the tenant database record could not be saved. Please insert the tenant database manually in the "tenant-databases" table of the landlord database.',
      )
    }

    consola.success(`Tenant created`)
    consola.info(`Name: ${tenantName}`)
    consola.info(`Database name: ${tenantDatabaseName}`)
    consola.info(`Database host: ${databaseClientConfig.value.url}`)
    consola.info(`Database auth-token: ${databaseClientConfig.value.authToken}`)
  },
})
