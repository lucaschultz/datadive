/**
 * No query result limit
 */
export const NoLimitOption = 'none'

export type NoLimitOption = typeof NoLimitOption

/**
 * Commonly used options to limit query results
 */
export type LimitOption = number | NoLimitOption
