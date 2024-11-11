/**
 * Commonly used option for ordering query results
 */
export type OrderByOption<TSelectable> = {
  [K in keyof TSelectable]: [property: K, direction: 'asc' | 'desc']
}[keyof TSelectable]
