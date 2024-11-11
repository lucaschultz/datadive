import type { LandlordKysely } from '@datadive/db'
import type { Lucia } from '../create-landlord-lucia'

import { createInjectionUtilities } from '@datadive/utils/common'

export interface LandlordAuthInjection {
  lucia: Lucia
  db: LandlordKysely
}

export const [defineAuthFunction, injectAuthFunction] =
  createInjectionUtilities<LandlordAuthInjection>()
