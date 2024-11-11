import { defineCommand } from 'citty'

import { renameCommand } from '../utilities/rename-command'
import { makeAppkeyCommand } from './make-appkey-command'
import { makeLandlordCommand } from './make-landlord-command'
import { makeMigrationCommand } from './make-migration-command'
import { makeTenantCommand } from './make-tenant-command'

export const makeCommand = defineCommand({
  meta: {
    name: 'make',
    description:
      'Create migrations, tenants, queries, landlords, or an app key',
  },
  subCommands: {
    migration: renameCommand('migration', makeMigrationCommand),
    tenant: renameCommand('tenant', makeTenantCommand),
    landlord: renameCommand('landlord', makeLandlordCommand),
    appkey: renameCommand('appkey', makeAppkeyCommand),
  },
})
