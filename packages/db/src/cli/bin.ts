#!/usr/bin/env bun
import { defineCommand, runMain } from 'citty'

import { makeAppkeyCommand } from './commands/make-appkey-command'
import { makeCommand } from './commands/make-command'
import { makeLandlordCommand } from './commands/make-landlord-command'
import { makeMigrationCommand } from './commands/make-migration-command'
import { makeTenantCommand } from './commands/make-tenant-command'
import { migrateCommand } from './commands/migrate-command'
import { migrateLandlordCommand } from './commands/migrate-landlord-command'
import { migrateTenantCommand } from './commands/migrate-tenant-command'
import { typegenCommand } from './commands/typegen-command'
import { typegenLandlordCommand } from './commands/typegen-landlord-command'
import { typegenTenantCommand } from './commands/typegen-tenant-command'

const main = defineCommand({
  meta: {
    name: 'datadive',
    description: 'Help with datadive development and deployment process',
  },
  subCommands: {
    'make:migration': makeMigrationCommand,
    'make:tenant': makeTenantCommand,
    'make:landlord': makeLandlordCommand,
    'typegen:landlord': typegenLandlordCommand,
    'typegen:tenant': typegenTenantCommand,
    'migrate:landlord': migrateLandlordCommand,
    'migrate:tenant': migrateTenantCommand,
    'make:appkey': makeAppkeyCommand,
    make: makeCommand,
    typegen: typegenCommand,
    migrate: migrateCommand,
  },
})

await runMain(main)
