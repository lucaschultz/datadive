import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

import { landlordCoreEnv } from '../../landlord-core-env'

const getPasswordResetEmailText = (params: {
  firstName: string
  resetUrl: string
}) => `
Hi ${params.firstName},

Please change your password by clicking the link below:

${params.resetUrl}

Thanks,
The Datadive Team
`

export function sendPasswordResetEmail(
  injection: LandlordCoreInjection,
  credentials: { email: string },
) {
  const { auth, email } = injection

  return safeTry(async function* () {
    const { user, token } = yield* (
      await auth.generatePasswordResetToken(credentials)
    ).safeUnwrap()

    const resetUrl = new URL(landlordCoreEnv.EMAIL_RESET_PASSWORD_URL)

    resetUrl.searchParams.append('token', token.plainText)

    const emailResult = yield* (
      await email.sendEmail({
        to: credentials.email,
        subject: 'Reset your password',
        text: getPasswordResetEmailText({
          firstName: user.firstName,
          resetUrl: resetUrl.toString(),
        }),
      })
    ).safeUnwrap()

    return ok({
      token: token,
      user: user,
      email: emailResult,
    })
  })
}
