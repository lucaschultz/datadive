import path from 'path'

import { defineCommand } from 'citty'
import consola from 'consola'
import { Generator, LibsqlDialect } from 'kysely-codegen'

import { createDatabaseClient } from '../../create-database-client'
import { createLandlordKysely } from '../../landlord/create-landlord-kysely'
import { assertNoAccidentalOverwrite } from '../utilities/assert-no-accidental-overwrite'
import {
  envArg,
  LandlordDatabaseEnvSchema,
  loadEnv,
} from '../utilities/load-env'
import { relativizePath } from '../utilities/relativize-path'

const DEFAULT_PATH = path.join(
  process.cwd(),
  'src',
  'landlord',
  'landlord-database-types.generated.ts',
)

export const typegenLandlordCommand = defineCommand({
  meta: {
    name: 'typegen:landlord',
    description: 'Generate types for landlord by introspecting the database',
  },
  args: {
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
    const env = loadEnv(LandlordDatabaseEnvSchema, { path: args.env })
    await assertNoAccidentalOverwrite(args.out, args.force)

    consola.start(
      `Connecting to landlord database: ${env.LANDLORD_DATABASE_URL}`,
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

    consola.start(`Generating types for landlord database`)

    const generator = new Generator()

    await generator.generate({
      db: landlordKysely,
      dialect: new LibsqlDialect(),
      camelCase: true,
      outFile: args.out,
      excludePattern: args.exclude,
      typeOnlyImports: true,
      runtimeEnums: false,
    })

    await landlordKysely.destroy()

    consola.success(
      `Generated types for landlord database: ${relativizePath(args.out)}`,
    )
  },
})
