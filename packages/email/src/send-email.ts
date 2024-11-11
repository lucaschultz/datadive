import { err, ok } from 'neverthrow'

import { emailEnv } from './email-env'
import { EmailError } from './errors/email-error'
import { defineEmailFunction } from './utilities/email-injection'

export const sendEmail = defineEmailFunction(
  async (
    injection,
    params: { to: string; subject: string; text: string; from?: string },
  ) => {
    const { resend } = injection

    let to = params.to

    if (emailEnv.NODE_ENV === 'development') {
      to = emailEnv.EMAIL_DUMMY
    }

    const { data, error } = await resend.emails.send({
      ...params,
      to,
      from: params.from ?? emailEnv.EMAIL_FROM,
    })

    if (error !== null || data === null) {
      return err(
        new EmailError.SendingEmailFailed("Couldn't send email", {
          cause: error,
        }),
      )
    }

    return ok(data)
  },
)
