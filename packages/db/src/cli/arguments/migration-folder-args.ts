import type { ArgsDef } from 'citty'

import { MigrationFolder } from '../../migrate'

export const migrationFolderArgs = {
  'tenant-migrations': {
    type: 'string',
    alias: 't',
    description: 'The folder where tenant migrations are stored',
    default: MigrationFolder.Tenant,
  },
  'landlord-migrations': {
    type: 'string',
    alias: 'l',
    description: 'The folder where landlord migrations are stored',
    default: MigrationFolder.Landlord,
  },
} satisfies ArgsDef
