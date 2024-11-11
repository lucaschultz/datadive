import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'input'

/**
 * Create the inputs table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const inputsTable = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('description', 'text', (col) => col.notNull())
    .addColumn('type', 'text', (col) =>
      col.notNull().references('input_type.id'),
    )

  await addTimestampColumns(inputsTable).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the inputs table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
