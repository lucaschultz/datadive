import type { CreateTableBuilder } from 'kysely'

import { sql } from 'kysely'

import { constEnum } from '@datadive/utils/common'

export const TimestampColumn = constEnum({
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})

export type TimestampColumn = constEnum<typeof TimestampColumn>

/**
 * Add timestamps to a table
 * @param table The table to add timestamps to
 * @param options The options for adding timestamps
 * @returns The table with timestamps
 */
export function addTimestampColumns<
  TTable extends string,
  TColumn extends string = never,
>(
  table: CreateTableBuilder<TTable, TColumn>,
  options?: Partial<{ omitDeletedAt?: boolean }>,
) {
  if (options?.omitDeletedAt) {
    return table
      .addColumn(TimestampColumn.createdAt, 'timestamp', (col) =>
        col.notNull().defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%SZ'))`),
      )
      .addColumn(TimestampColumn.updatedAt, 'timestamp', (col) =>
        col.notNull().defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%SZ'))`),
      )
  }

  return table
    .addColumn(TimestampColumn.createdAt, 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%SZ'))`),
    )
    .addColumn(TimestampColumn.updatedAt, 'timestamp', (col) =>
      col.notNull().defaultTo(sql`(strftime('%Y-%m-%dT%H:%M:%SZ'))`),
    )
    .addColumn(TimestampColumn.deletedAt, 'timestamp', (col) =>
      col.defaultTo(null),
    )
}
