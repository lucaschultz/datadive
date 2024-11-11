import type { AnyKysely } from '../../utilities/type/any-kysely'

import { sql } from 'kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { UpdateTimestampTrigger } from '../../utilities/update-timestamp-trigger'

const TABLE_NAME = 'tenant_database'

/**
 * Create the tenant-databases table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const table = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('url', 'text', (col) => col.notNull().unique())
    .addCheckConstraint(
      'valid_tenant_database_url',
      sql`URL LIKE 'libsql://%' OR URL LIKE 'file:%'`,
    )
    .addColumn('encrypted_auth_token', 'text')
    .addColumn('tenant_id', 'text', (col) =>
      col
        .notNull()
        .unique()
        .references(`tenant.id`)
        .onDelete('cascade')
        .onUpdate('cascade'),
    )
    .modifyEnd(sql`WITHOUT ROWID`)

  await addTimestampColumns(table).execute()
  await UpdateTimestampTrigger.create(db, TABLE_NAME)
}

/**
 * Drop the tenant-databases table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
  await UpdateTimestampTrigger.drop(db, TABLE_NAME)
}
