import type { AnyKysely } from './type/any-kysely'

import { sql } from 'kysely'

import { getUpdateTimestampTriggerName } from './create-update-timestamp-trigger'

/**
 * Drop the trigger to update the updated_at column when a row is updated
 * @param db The database to drop the trigger in
 * @param tableName The table the trigger is for
 */
export async function dropUpdateTimestampTrigger(
  db: AnyKysely,
  tableName: string,
) {
  await sql
    .raw(`DROP TRIGGER IF EXISTS ${getUpdateTimestampTriggerName(tableName)};`)
    .execute(db)
}
