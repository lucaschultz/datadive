import type { AnyKysely } from '../../utilities/type/any-kysely'

import { addTimestampColumns } from '../../utilities/add-timestamp-columns'
import { createUpdateTimestampTrigger } from '../../utilities/create-update-timestamp-trigger'
import { dropUpdateTimestampTrigger } from '../../utilities/drop-update-timestamp-trigger'

const TABLE_NAME = 'collaborator'

/**
 * Create the collaborators table
 * @param db - The database instance
 */
export async function up(db: AnyKysely): Promise<void> {
  const collaboratorsTable = db.schema
    .createTable(TABLE_NAME)
    .addColumn('id', 'text', (col) => col.primaryKey().notNull())
    .addColumn('user_id', 'text', (col) => col.notNull().references('user.id'))
    .addColumn('project_id', 'text', (col) =>
      col.notNull().references('project.id'),
    )
    .addUniqueConstraint('user_id_project_id_unique', ['user_id', 'project_id'])

  await addTimestampColumns(collaboratorsTable).execute()
  await createUpdateTimestampTrigger(db, TABLE_NAME)
}

/**
 * Drop the collaborators table
 * @param db - The database instance
 */
export async function down(db: AnyKysely): Promise<void> {
  await dropUpdateTimestampTrigger(db, TABLE_NAME)
  await db.schema.dropTable(TABLE_NAME).ifExists().execute()
}
