import type { AnyKysely } from '../../utilities/type/any-kysely'

import { sql } from 'kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'cell_template_input'

/**
 * Create the cells_inputs table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const cellsInputsTable = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('cell_template_id', 'text', (col) =>
      col.notNull().references('cell_template.id'),
    )
    .addColumn('input_id', 'text', (col) =>
      col.notNull().references('input.id'),
    )
    .addColumn('placeholder', 'text')
    .addColumn('label', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('required', 'boolean')
    .addUniqueConstraint('user_id_project_id_unique', [
      'cell_template_id',
      'input_id',
    ])
    .addCheckConstraint('required_is_zero_or_one', sql`required IN (0, 1)`)

  await addTimestampColumns(cellsInputsTable).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the cells_inputs table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
