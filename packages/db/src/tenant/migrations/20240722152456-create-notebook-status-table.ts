import type { AnyKysely } from '../../utilities/type/any-kysely'

import { NotebookStatus } from '../constants/notebook-status'

const TABLE_NAME = 'notebook_status'

/**
 * Create the notebook_status table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  await db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .execute()

  await db
    .insertInto(TABLE_NAME)
    .values([{ id: NotebookStatus.Active }, { id: NotebookStatus.Archived }])
    .execute()
}

/**
 * Drop the notebook_status table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
