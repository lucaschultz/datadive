import type { AnyKysely } from '../../utilities/type/any-kysely'

const TABLE_NAME = 'input_type'

/**
 * Create the input_types table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .execute()

  await db
    .insertInto(TABLE_NAME)
    .values([
      { id: 'text' },
      { id: 'number' },
      { id: 'boolean' },
      { id: 'select' },
    ])
    .execute()
}

/**
 * Drop the input_types table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
