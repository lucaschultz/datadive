import { ok, safeTry } from 'neverthrow'

import {
  EmailConflictError,
  ExpiredEmailValidationCodeError,
  ExpiredPasswordResetTokenError,
  IncorrectEmailValidationCodeError,
  IncorrectPasswordError,
  IncorrectPasswordResetTokenError,
  StorePasswordResetTokenError,
  StoreUserError,
  UpdateSessionError,
  UpdateUserError,
  UsernameConflictError,
  UserNotFoundError,
} from '@datadive/auth'
import { SendingEmailFailed } from '@datadive/email/error'
import { LandlordEndpoints } from '@datadive/spec'
import { exhaustive, isInstanceOf } from '@datadive/utils/common'

import { ConflictException } from '../../shared/exceptions/conflict-exception'
import { InternalException } from '../../shared/exceptions/internal-exception'
import { InvalidCredentialsException } from '../../shared/exceptions/invalid-credentials-exception'
import { ValidationException } from '../../shared/exceptions/validation-exception'
import { getErrorType } from '../../shared/utils/get-error-type'
import { useResponseHelper } from '../../shared/utils/use-response-helper'
import { ProtectedLandlordRegister } from '../shared/utils/protected-landlord-register'
import { PublicLandlordRegister } from '../shared/utils/public-landlord-register'

PublicLandlordRegister.register(LandlordEndpoints.Auth.SignUp, async (c) => {
  const r = useResponseHelper(LandlordEndpoints.Auth.SignUp)
  const core = c.get('landlordCore')
  const userData = c.req.valid('json')

  const result = await safeTry(async function* () {
    const signUpResult = yield* core.auth.signUp(userData).safeUnwrap()

    return ok(signUpResult)
  })

  if (result.isErr()) {
    if (result.error instanceof EmailConflictError) {
      throw ConflictException.forRoute(LandlordEndpoints.Auth.SignUp, {
        detail: 'A user with this email already exists',
        errorMessages: {
          body: {
            email: ['Already in use.'],
          },
        },
      })
    } else if (result.error instanceof UsernameConflictError) {
      throw ConflictException.forRoute(LandlordEndpoints.Auth.SignUp, {
        detail: 'A user with this username already exists',
        errorMessages: {
          body: {
            username: ['Already in use.'],
          },
        },
      })
    } else if (
      isInstanceOf(result.error, [SendingEmailFailed, StoreUserError])
    ) {
      throw InternalException.fromError(result.error)
    } else {
      return exhaustive(result.error)
    }
  }

  const { sessionCookie, user } = result.value

  c.set('sessionCookie', sessionCookie)

  return c.json(
    ...r(201, {
      success: true,
      message: 'Successfully signed up',
      data: user,
    }),
  )
})

PublicLandlordRegister.register(LandlordEndpoints.Auth.SignIn, async (c) => {
  const r = useResponseHelper(LandlordEndpoints.Auth.SignIn)
  const core = c.get('landlordCore')
  const credentials = c.req.valid('json')

  const result = await safeTry(async function* () {
    const signUpResult = yield* core.auth.signIn(credentials).safeUnwrap()

    return ok(signUpResult)
  })

  if (result.isErr()) {
    if (result.error instanceof UserNotFoundError) {
      throw InvalidCredentialsException.forRoute(
        LandlordEndpoints.Auth.SignIn,
        {
          detail:
            'username' in credentials
              ? 'A user with this username does not exist'
              : 'A user with this email does not exist',
          errorMessages: {
            body: {
              ...('username' in credentials
                ? { username: ['Not found.'] }
                : { email: ['Not found.'] }),
            },
          },
        },
      )
    } else if (result.error instanceof IncorrectPasswordError) {
      throw InvalidCredentialsException.forRoute(
        LandlordEndpoints.Auth.SignIn,
        {
          detail: 'The password is incorrect',
          errorMessages: {
            body: {
              password: ['Incorrect password.'],
            },
          },
        },
      )
    } else {
      return exhaustive(result.error)
    }
  }

  const { sessionCookie, user } = result.value

  c.set('sessionCookie', sessionCookie)

  return c.json(
    ...r(200, {
      success: true,
      message: 'Successfully signed in',
      data: user,
    }),
  )
})

PublicLandlordRegister.register(LandlordEndpoints.Auth.Token, async (c) => {
  const r = useResponseHelper(LandlordEndpoints.Auth.Token)
  const core = c.get('landlordCore')
  const credentials = c.req.valid('json')

  const result = await safeTry(async function* () {
    const tokenResult = yield* core.auth.createToken(credentials).safeUnwrap()

    return ok(tokenResult)
  })

  if (result.isErr()) {
    if (result.error instanceof UserNotFoundError) {
      throw InvalidCredentialsException.forRoute(
        LandlordEndpoints.Auth.SignIn,
        {
          detail:
            'username' in credentials
              ? 'A user with this username does not exist'
              : 'A user with this email does not exist',
          errorMessages: {
            body: {
              ...('username' in credentials
                ? { username: ['Not found.'] }
                : { email: ['Not found.'] }),
            },
          },
        },
      )
    } else if (result.error instanceof IncorrectPasswordError) {
      throw InvalidCredentialsException.forRoute(
        LandlordEndpoints.Auth.SignIn,
        {
          detail: 'The password is incorrect',
          errorMessages: {
            body: {
              password: ['Incorrect password.'],
            },
          },
        },
      )
    } else if (result.error instanceof UpdateSessionError) {
      throw InternalException.fromError(result.error)
    } else {
      return exhaustive(result.error)
    }
  }

  const { sessionCookie, user, session } = result.value

  c.set('sessionCookie', sessionCookie)

  return c.json(
    ...r(201, {
      success: true,
      message: 'Successfully signed in',
      data: {
        user,
        token: session.id,
      },
    }),
  )
})

ProtectedLandlordRegister.register(
  LandlordEndpoints.Auth.VerifyEmail,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Auth.VerifyEmail)
    const core = c.get('landlordCore')
    const { code } = c.req.valid('json')
    const user = c.get('user')

    const result = await safeTry(async function* () {
      const tokenResult = yield* core.auth
        .validateEmailVerificationCode(code, user)
        .safeUnwrap()

      return ok(tokenResult)
    })

    if (result.isErr()) {
      if (result.error instanceof IncorrectEmailValidationCodeError) {
        throw ValidationException.forRoute(LandlordEndpoints.Auth.VerifyEmail, {
          detail: 'The email verification code is incorrect',
          code: 'body_validation',
          type: getErrorType('body_validation'),
          errorMessages: {
            body: {
              code: ['Code is incorrect'],
            },
          },
        })
      } else if (result.error instanceof ExpiredEmailValidationCodeError) {
        throw ValidationException.forRoute(LandlordEndpoints.Auth.VerifyEmail, {
          detail: 'The email verification code has expired',
          code: 'body_validation',
          type: getErrorType('body_validation'),
          errorMessages: {
            body: {
              code: ['Code has expired'],
            },
          },
        })
      } else {
        return exhaustive(result.error)
      }
    }

    const { sessionCookie } = result.value

    c.set('sessionCookie', sessionCookie)

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully verified email',
      }),
    )
  },
)

ProtectedLandlordRegister.register(LandlordEndpoints.Auth.CurrentUser, (c) => {
  const r = useResponseHelper(LandlordEndpoints.Auth.CurrentUser)
  const user = c.get('user')

  return c.json(
    ...r(200, {
      success: true,
      message: 'Successfully retrieved current user',
      data: user,
    }),
  )
})

PublicLandlordRegister.register(
  LandlordEndpoints.Auth.ForgotPassword,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Auth.ForgotPassword)
    const core = c.get('landlordCore')
    const resetData = c.req.valid('json')

    const result = await safeTry(async function* () {
      const tokenResult = yield* core.auth
        .sendPasswordResetEmail(resetData)
        .safeUnwrap()

      return ok(tokenResult)
    })

    if (result.isErr()) {
      if (result.error instanceof UserNotFoundError) {
        throw InvalidCredentialsException.forRoute(
          LandlordEndpoints.Auth.ForgotPassword,
          {
            detail: 'A user with this email does not exist',
            errorMessages: {
              body: {
                email: ['User not found'],
              },
            },
          },
        )
      } else if (
        isInstanceOf(result.error, [
          SendingEmailFailed,
          StorePasswordResetTokenError,
        ])
      ) {
        throw InternalException.fromError(result.error)
      } else {
        return exhaustive(result.error)
      }
    }

    return c.json(
      ...r(200, {
        success: true,
        message: 'Password reset email sent',
      }),
    )
  },
)

ProtectedLandlordRegister.register(
  LandlordEndpoints.Auth.SignOut,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Auth.SignOut)
    const core = c.get('landlordCore')
    const user = c.get('user')

    const result = await safeTry(async function* () {
      const tokenResult = yield* core.auth.signOut({ id: user.id }).safeUnwrap()

      return ok(tokenResult)
    })

    if (result.isErr()) {
      return exhaustive(result.error)
    }

    const { sessionCookie } = result.value

    c.set('sessionCookie', sessionCookie)

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully signed out',
        data: user,
      }),
    )
  },
)

PublicLandlordRegister.register(
  LandlordEndpoints.Auth.ResetPassword,
  async (c) => {
    const r = useResponseHelper(LandlordEndpoints.Auth.ResetPassword)
    const core = c.get('landlordCore')
    const credentials = c.req.valid('json')

    const result = await safeTry(async function* () {
      const tokenResult = yield* core.auth
        .resetPassword(credentials)
        .safeUnwrap()

      return ok(tokenResult)
    })

    if (result.isErr()) {
      if (result.error instanceof IncorrectPasswordResetTokenError) {
        throw InvalidCredentialsException.forRoute(
          LandlordEndpoints.Auth.ResetPassword,
          {
            detail: 'The password reset token is incorrect',
            errorMessages: {
              body: {
                token: ['Incorrect token'],
              },
            },
          },
        )
      } else if (result.error instanceof ExpiredPasswordResetTokenError) {
        throw InvalidCredentialsException.forRoute(
          LandlordEndpoints.Auth.ResetPassword,
          {
            detail: 'The password reset token has expired',
            errorMessages: {
              body: {
                token: ['Expired token'],
              },
            },
          },
        )
      } else if (result.error instanceof UpdateUserError) {
        throw InternalException.fromError(result.error)
      } else {
        return exhaustive(result.error)
      }
    }

    return c.json(
      ...r(200, {
        success: true,
        message: 'Successfully reset password',
      }),
    )
  },
)

export const publicLandlordAuthApp = PublicLandlordRegister.app
export const protectedLandlordRoutesApp = ProtectedLandlordRegister.app
