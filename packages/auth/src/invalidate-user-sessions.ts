import { defineAuthFunction } from './utility/define-auth-function'

export const invalidateUserSessions = defineAuthFunction(
  async (injected, user: { id: string }) => {
    const { lucia } = injected
    await lucia.invalidateUserSessions(user.id)

    return { sessionCookie: lucia.createBlankSessionCookie() }
  },
)
