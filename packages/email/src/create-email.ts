import { Resend } from 'resend'

import { sendEmail } from './send-email'
import { injectEmailDependencies } from './utilities/email-injection'

export const createEmail = (apiToken: string) => {
  const resend = new Resend(apiToken)

  return {
    sendEmail: injectEmailDependencies({ resend }, sendEmail),
  }
}
