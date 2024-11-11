import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { UpdateTimestampTrigger } from '../../utilities/update-timestamp-trigger'

const TABLE_NAME = 'email_verification_code'

/**
 *
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const table = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('code', 'text', (col) => col.notNull())
    .addColumn('user_id', 'text', (col) => col.references('user.id').notNull())
    .addColumn('email', 'text', (col) => col.notNull())
    .addColumn('expires_at', 'timestamp', (col) => col.notNull())

  await addTimestampColumns(table, { omitDeletedAt: true }).execute()
  await UpdateTimestampTrigger.create(db, TABLE_NAME)
}

/**
 *
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
  await UpdateTimestampTrigger.drop(db, TABLE_NAME)
}
