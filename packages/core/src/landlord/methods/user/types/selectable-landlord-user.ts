import type {
  LandlordDatabaseSchema,
  LandlordTable,
  Selectable,
} from '@datadive/db'

export type SelectableLandlordUser = Selectable<
  LandlordDatabaseSchema,
  typeof LandlordTable.User
>
