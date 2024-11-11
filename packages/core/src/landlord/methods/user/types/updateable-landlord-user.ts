import type {
  LandlordDatabaseSchema,
  LandlordTable,
  Updateable,
} from '@datadive/db'

export type UpdateableLandlordUser = Updateable<
  LandlordDatabaseSchema,
  typeof LandlordTable.User
>
