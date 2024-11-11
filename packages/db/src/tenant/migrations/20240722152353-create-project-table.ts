import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'project'

/**
 * Create the projects table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const projectsTable = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('owner_id', 'text', (col) => col.notNull().references('user.id'))

  await addTimestampColumns(projectsTable).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the projects table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
