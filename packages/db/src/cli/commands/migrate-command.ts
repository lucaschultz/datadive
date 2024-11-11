import { defineCommand } from 'citty'

import { renameCommand } from '../utilities/rename-command'
import { migrateLandlordCommand } from './migrate-landlord-command'
import { migrateTenantCommand } from './migrate-tenant-command'

export const migrateCommand = defineCommand({
  meta: {
    name: 'migrate',
    description: 'Migrate the landlord or tenant database',
  },
  subCommands: {
    tenant: renameCommand('tenant', migrateTenantCommand),
    landlord: renameCommand('landlord', migrateLandlordCommand),
  },
})
