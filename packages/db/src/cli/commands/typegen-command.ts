import { defineCommand } from 'citty'

import { renameCommand } from '../utilities/rename-command'
import { typegenLandlordCommand } from './typegen-landlord-command'
import { typegenTenantCommand } from './typegen-tenant-command'

export const typegenCommand = defineCommand({
  meta: {
    name: 'typegen',
    description: 'Generate types by introspecting the database',
  },
  subCommands: {
    landlord: renameCommand('landlord', typegenLandlordCommand),
    tenant: renameCommand('tenant', typegenTenantCommand),
  },
})
