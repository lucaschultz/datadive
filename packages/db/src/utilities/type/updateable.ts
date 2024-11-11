import type { Prettify } from '@datadive/utils/type'
import type { Updateable as KyselyUpdateable } from 'kysely'
import type { LandlordDatabaseSchema } from '../../landlord/create-landlord-kysely'
import type { TenantDatabaseSchema } from '../../tenant/create-tenant-kysely'
import type { WithoutNonUpdateable } from './without-non-updateable'

export type Updateable<
  TSchema extends LandlordDatabaseSchema | TenantDatabaseSchema,
  TTableName extends keyof TSchema,
  TShape extends WithoutNonUpdateable<
    KyselyUpdateable<TSchema[TTableName]>
  > = WithoutNonUpdateable<KyselyUpdateable<TSchema[TTableName]>>,
> = Prettify<{
  [K in keyof TShape]?: TShape[K] | undefined
}>
