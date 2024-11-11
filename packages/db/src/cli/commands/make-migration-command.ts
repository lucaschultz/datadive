import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

import { defineCommand } from 'citty'
import consola from 'consola'

import { isKebabCase } from '@datadive/utils/common'

import { assertAllowedForArg, getForArg } from '../arguments/for-arg'
import { migrationFolderArgs } from '../arguments/migration-folder-args'
import { relativizePath } from '../utilities/relativize-path'

const getMigrationPrefix = () => {
  const date = new Date()
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hour = date.getHours().toString().padStart(2, '0')
  const minute = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')

  return `${year}${month}${day}${hour}${minute}${second}`
}

const migrationTemplate = `import type { AnyKysely } from '../../utilities/type/any-kysely'

/** @tutorial Use this constant to avoid spelling mistakes */
const TABLE_NAME = ''

/**
 *
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  // migrate up
}

/**
 *
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  // migrate down
}
`

export const makeMigrationCommand = defineCommand({
  meta: {
    name: 'make:migration',
    description: 'Create a new migration file',
  },
  args: {
    for: getForArg('The database to create the migration file for'),
    'migration-name': {
      type: 'positional',
      description: 'The name of the migration file to create (kebab-case)',
      valueHint: 'migration-name',
      required: true,
    },
    ...migrationFolderArgs,
  },
  async run({ args }) {
    assertAllowedForArg(args.for)

    if (!isKebabCase(args['migration-name'])) {
      throw new Error(
        "The migration name must be in kebab-case (e.g. 'create-users-table')",
      )
    }

    const fileName = `${getMigrationPrefix()}-${args['migration-name']}.ts`
    const migrationFolder =
      args.for === 'landlord'
        ? args['landlord-migrations']
        : args['tenant-migrations']
    const filePath = path.join(migrationFolder, fileName)

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await mkdir(migrationFolder, {
      recursive: true,
    })

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await writeFile(filePath, migrationTemplate, { flag: 'wx' })

    consola.success(
      `Created empty ${args.for} migration file: ${relativizePath(filePath)}`,
    )
  },
})
