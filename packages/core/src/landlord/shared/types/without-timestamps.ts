import type { Prettify } from '@datadive/utils/type'

export type WithoutTimestamps<T> = Prettify<Omit<T, 'createdAt' | 'updatedAt'>>
