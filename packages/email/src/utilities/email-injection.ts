import type { Resend } from 'resend'

import { createInjectionUtilities } from '@datadive/utils/common'

export interface EmailInjection {
  resend: Resend
}

export const [defineEmailFunction, injectEmailDependencies] =
  createInjectionUtilities<EmailInjection>()
