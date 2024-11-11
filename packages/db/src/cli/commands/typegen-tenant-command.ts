import path from 'path'

import { defineCommand } from 'citty'
import { consola } from 'consola'
import { Generator, LibsqlDialect } from 'kysely-codegen'

import { decryptText } from '@datadive/utils/node'

import { createDatabaseClient } from '../../create-database-client'
import { LandlordTable } from '../../landlord/constants/landlord-table'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import { createTenantKysely } from '../../tenant/create-tenant-kysely'
import { exitWithError } from '../arguments/exit-with-error'
import { assertNoAccidentalOverwrite } from '../utilities/assert-no-accidental-overwrite'
import {
  AppKeyEnvSchema,
  envArg,
  LandlordDatabaseEnvSchema,
  loadEnv,
} from '../utilities/load-env'

const DEFAULT_PATH = path.join(
  process.cwd(),
  'src',
  'tenant',
  'tenant-database-types.generated.ts',
)

export const typegenTenantCommand = defineCommand({
  meta: {
    name: 'typegen:tenant',
    description: 'Generate types for the tenant database by introspection',
  },
  args: {
    'tenant-name': {
      type: 'positional',
      description:
        'The name of the tenant database used to generate types via introspection',
      valueHint: 'tenant-name',
      required: true,
    },
    out: {
      type: 'string',
      description: 'The file to write the generated types to',
      valueHint: 'path',
      alias: 'o',
      required: false,
      default: DEFAULT_PATH,
    },
    exclude: {
      type: 'string',
      description: 'An pattern to exclude tables from the generated types',
      valueHint: 'exclude-pattern',
      alias: 'e',
      required: false,
    },
    force: {
      type: 'boolean',
      description: 'Overwrite the output file if it already exists',
      alias: 'f',
      required: false,
    },
    env: envArg,
  },
  async run({ args }) {
    const env = loadEnv(LandlordDatabaseEnvSchema.merge(AppKeyEnvSchema), {
      path: args.env,
    })

    await assertNoAccidentalOverwrite(args.out, args.force)

    consola.start(
      `Connecting to landlord database: ${env.LANDLORD_DATABASE_URL}`,
    )

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
      .selectFrom('tenant')
      .selectAll()
      .where('name', '==', args['tenant-name'])
      .executeTakeFirst()

    if (!tenant) {
      exitWithError(`Tenant "${args['tenant-name']}" not found`)
    }

    const tenantDatabase = await landlordDb
      .selectFrom(LandlordTable.TenantDatabase)
      .selectAll()
      .where('tenantId', '==', tenant.id)
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

    consola.start(`Generating types for tenant database`)

    const generator = new Generator()

    await generator.generate({
      db: tenantKysely,
      dialect: new LibsqlDialect(),
      camelCase: true,
      outFile: args.out,
      excludePattern: args.exclude,
      typeOnlyImports: true,
      runtimeEnums: false,
    })

    await tenantKysely.destroy()

    consola.success(
      `Generated types for tenant database at: ${args.out.replace(process.cwd(), '.')}`,
    )
  },
})
