import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'notebook'

/**
 * Create the notebooks table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const notebooksTable = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('path', 'text', (col) => col.notNull())
    .addColumn('project_id', 'text', (col) =>
      col.notNull().references('project.id'),
    )
    .addColumn('status', 'text', (col) =>
      col.notNull().references('notebook_status.id'),
    )

  await addTimestampColumns(notebooksTable).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the notebooks table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
