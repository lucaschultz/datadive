import type { Prettify } from '@datadive/utils/type'
import type { TimestampColumn } from '../add-timestamp-columns'

/**
 * Omit columns that are generated
 */
export type WithoutGenerated<T> = Prettify<
  Omit<T, typeof TimestampColumn.createdAt | typeof TimestampColumn.updatedAt>
>
