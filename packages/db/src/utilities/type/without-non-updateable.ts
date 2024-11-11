import type { Prettify } from '@datadive/utils/type'
import type { WithoutGenerated } from './without-generated'

/**
 * Omit columns that are not updateable
 */
export type WithoutNonUpdateable<T> = Prettify<
  Omit<WithoutGenerated<T>, 'id' | 'createdAt' | 'updatedAt'>
>
