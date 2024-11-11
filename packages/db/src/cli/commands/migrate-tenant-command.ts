import { defineCommand } from 'citty'
import consola from 'consola'

import { decryptText } from '@datadive/utils/node'

import { createDatabaseClient } from '../../create-database-client'
import { LandlordTable } from '../../landlord/constants/landlord-table'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import {
  ImplicitMigrationTarget,
  migrate,
  MigrationFolder,
} from '../../migrate'
import { createTenantKysely } from '../../tenant/create-tenant-kysely'
import { exitWithError } from '../arguments/exit-with-error'
import { assertMigrationTarget } from '../utilities/assert-migration-target'
import {
  AppKeyEnvSchema,
  envArg,
  LandlordDatabaseEnvSchema,
  loadEnv,
} from '../utilities/load-env'
import { processMigrationResult } from '../utilities/process-migration-results'

export const migrateTenantCommand = defineCommand({
  meta: {
    name: 'migrate:tenant',
    description: 'Migrate the tenant database',
  },
  args: {
    'tenant-name': {
      type: 'positional',
      required: true,
      description: 'The name of the new tenant',
      valueHint: 'tenant-name',
    },
    target: {
      type: 'positional',
      description: 'The target to migrate the database to',
      default: ImplicitMigrationTarget.LatestMigration,
      valueHint: `"${Object.values(ImplicitMigrationTarget).join('"|"')}"`,
    },
    env: envArg,
  },
  async run({ args }) {
    const env = loadEnv(LandlordDatabaseEnvSchema.merge(AppKeyEnvSchema), {
      path: args.env,
    })
    assertMigrationTarget(args.target)

    consola.start(`Connecting to tenant database: ${env.LANDLORD_DATABASE_URL}`)

    const landlordDbResult = await createDatabaseClient({
      url: env.LANDLORD_DATABASE_URL,
      authToken: env.LANDLORD_DATABASE_AUTH_TOKEN,
    }).asyncAndThen(createLandlordKysely)

    if (landlordDbResult.isErr()) {
      throw landlordDbResult.error
    }

    const landlordDb = landlordDbResult.value

    consola.success(`Connected to landlord database`)

    const tenant = await landlordDb
      .selectFrom(LandlordTable.Tenant)
      .selectAll()
      .where('tenant.name', '==', args['tenant-name'])
      .executeTakeFirst()

    if (!tenant) {
      exitWithError(`Tenant "${args['tenant-name']}" not found`)
    }

    const tenantDatabase = await landlordDb
      .selectFrom(LandlordTable.TenantDatabase)
      .selectAll()
      .where('tenantDatabase.tenantId', '==', tenant.id)
      .executeTakeFirst()

    if (!tenantDatabase) {
      exitWithError(`Database for tenant "${args['tenant-name']}" not found`)
    }

    consola.start(`Connecting to tenant database: ${tenantDatabase.url}`)

    const tenantKyselyResult = await createDatabaseClient({
      url: tenantDatabase.url,
      authToken: tenantDatabase.encryptedAuthToken
        ? decryptText(tenantDatabase.encryptedAuthToken, env.APP_KEY)
        : undefined,
    }).asyncAndThen(createTenantKysely)

    if (tenantKyselyResult.isErr()) {
      throw tenantKyselyResult.error
    }

    const tenantKysely = tenantKyselyResult.value

    consola.success(`Connected to tenant database`)

    consola.start(`Migrating tenant database`)

    const migrationResults = await migrate(
      tenantKysely,
      MigrationFolder.Tenant,
      args.target,
    )

    processMigrationResult(migrationResults, {
      success: 'Tenant database migrated successfully',
      failure: 'Tenant database migration failed',
    })

    await tenantKysely.destroy()
  },
})
