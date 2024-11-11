import type { AnyKysely } from './type/any-kysely'

import { sql } from 'kysely'

import { TimestampColumn } from './add-timestamp-columns'

/**
 * Get the name of the trigger to update the updated_at column
 * @param tableName The name of the table the trigger is for
 * @returns The name of the trigger
 */
export function getUpdateTimestampTriggerName(tableName: string) {
  return `${tableName}_updated_at_trigger`
}

/**
 * Create a trigger to update the updated_at column when a row is updated
 * @param db The database to create the trigger in
 * @param tableName The table to create the trigger for
 */
export async function createUpdateTimestampTrigger(
  db: AnyKysely,
  tableName: string,
) {
  await sql
    .raw(
      `
      CREATE TRIGGER ${getUpdateTimestampTriggerName(tableName)}
      AFTER UPDATE ON ${tableName}
      WHEN OLD.${TimestampColumn.updatedAt} <> strftime('%Y-%m-%dT%H:%M:%SZ')
      BEGIN
        UPDATE ${tableName}
        SET ${TimestampColumn.updatedAt} = strftime('%Y-%m-%dT%H:%M:%SZ')
        WHERE id = OLD.id;
      END;
      `,
    )
    .execute(db)
}
