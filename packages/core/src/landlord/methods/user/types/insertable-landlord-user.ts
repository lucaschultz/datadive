import type {
  Insertable,
  LandlordDatabaseSchema,
  LandlordTable,
} from '@datadive/db'

export type InsertableLandlordUser = Insertable<
  LandlordDatabaseSchema,
  typeof LandlordTable.User
>
