export type OrderOption<TSchema, TTable extends keyof TSchema & string> = [
  (
    | (keyof TSchema[TTable] & string)
    | `${TTable}.${keyof TSchema[TTable] & string}`
  ),
  'asc' | 'desc',
]
