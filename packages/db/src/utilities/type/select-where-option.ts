export type ComparisonOperator =
  | '='
  | '=='
  | '!='
  | '<>'
  | '>'
  | '>='
  | '<'
  | '<='
  | 'in'
  | 'not in'
  | 'is'
  | 'is not'
  | 'like'
  | 'not like'
  | 'match'
  | 'ilike'
  | 'not ilike'
  | '@>'
  | '<@'
  | '^@'
  | '&&'
  | '?'
  | '?&'
  | '?|'
  | '!<'
  | '!>'
  | '<=>'
  | '!~'
  | '~'
  | '~*'
  | '!~*'
  | '@@'
  | '@@@'
  | '!!'
  | '<->'
  | 'regexp'
  | 'is distinct from'
  | 'is not distinct from'

/**
 * Commonly used option for selecting rows by a condition
 */
export type SelectWhereOption<TSelectable> = {
  [K in keyof TSelectable]: K extends keyof TSelectable & string
    ? [property: K, comparator: ComparisonOperator, value: TSelectable[K]]
    : never
}[keyof TSelectable]
