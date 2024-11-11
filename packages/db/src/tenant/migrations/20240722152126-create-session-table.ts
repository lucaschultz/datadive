import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'session'

/**
 * Create the sessions table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const table = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'text', (col) => col.references('user.id').notNull())
    .addColumn('expires_at', 'integer', (col) => col.notNull())

  await addTimestampColumns(table, { omitDeletedAt: true }).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the sessions table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
}
