import type { LandlordCoreInjection } from '../../shared/utils/landlord-core-injection'

import { ok, safeTry } from 'neverthrow'

import { landlordCoreEnv } from '../../landlord-core-env'

function getVerificationEmailText(params: {
  firstName: string
  code: string
  verificationUrl: string
}) {
  return `
Hi ${params.firstName},

Please verify your email by entering the code below at ${params.verificationUrl}:

${params.code}

Thanks,
The Datadive Team
`
}

export function signUp(
  injection: LandlordCoreInjection,
  userData: {
    email: string
    username: string
    password: string
    firstName: string
    lastName: string
  },
) {
  return safeTry(async function* () {
    const { auth, email } = injection

    const { user, session, sessionCookie } = yield* (
      await auth.signUp(userData)
    ).safeUnwrap()

    const emailVerificationCode = yield* (
      await auth.generateEmailVerificationCode({
        userId: user.id,
        email: user.email,
      })
    ).safeUnwrap()

    const emailResult = yield* (
      await email.sendEmail({
        subject: 'Verify your email',
        to: user.email,
        text: getVerificationEmailText({
          firstName: user.firstName,
          code: emailVerificationCode,
          verificationUrl: landlordCoreEnv.EMAIL_VERIFICATION_URL,
        }),
      })
    ).safeUnwrap()

    return ok({ user, session, sessionCookie, emailResult })
  })
}
