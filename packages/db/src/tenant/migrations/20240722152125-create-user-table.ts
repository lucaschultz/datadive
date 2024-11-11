import type { AnyKysely } from '../../utilities/type/any-kysely'

import { sql } from 'kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'user'

/**
 * Create the users table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const table = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('username', 'text', (col) => col.notNull().unique())
    .addColumn('email', 'text', (col) => col.unique().notNull())
    .addColumn('email_verified', 'boolean', (col) =>
      col.notNull().defaultTo(false),
    )
    .addColumn('password_hash', 'text', (col) => col.notNull())
    .addColumn('first_name', 'text', (col) => col.notNull())
    .addColumn('last_name', 'text', (col) => col.notNull())
    .modifyEnd(sql`WITHOUT ROWID`)

  await addTimestampColumns(table).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the users table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
