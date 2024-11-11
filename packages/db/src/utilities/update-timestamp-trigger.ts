import type { AnyKysely } from './type/any-kysely'

import { sql } from 'kysely'

import { TimestampColumn } from './add-timestamp-columns'

/**
 * Get the name of the trigger to update the `updated_at` column
 * @param tableName The name of the table the trigger is for
 * @returns The name of the trigger
 */
function getUpdateTimestampTriggerName(tableName: string) {
  return `${tableName}_updated_at_trigger`
}

/**
 * Create a trigger to update the `updated_at` column when a row is updated
 * @param db The database to create the trigger in
 * @param tableName The table to create the trigger for
 */
async function createUpdateTimestampTrigger(db: AnyKysely, tableName: string) {
  await sql
    .raw(
      `
      CREATE TRIGGER ${getUpdateTimestampTriggerName(tableName)}
      AFTER UPDATE ON ${tableName}
      WHEN old.${TimestampColumn.updatedAt} <> current_timestamp
      BEGIN
        UPDATE ${tableName}
        SET ${TimestampColumn.updatedAt} = CURRENT_TIMESTAMP
        WHERE id = OLD.id;
      END;
      `,
    )
    .execute(db)
}

/**
 * Drop the trigger to update the `updated_at` column when a row is updated
 * @param db The database to drop the trigger in
 * @param tableName The table the trigger is for
 */
async function dropUpdateTimestampTrigger(db: AnyKysely, tableName: string) {
  await sql
    .raw(`DROP TRIGGER IF EXISTS ${getUpdateTimestampTriggerName(tableName)};`)
    .execute(db)
}

/**
 * Manage the trigger to update the `updated_at` column when a row is updated
 */
export const UpdateTimestampTrigger = {
  drop: dropUpdateTimestampTrigger,
  create: createUpdateTimestampTrigger,
}
