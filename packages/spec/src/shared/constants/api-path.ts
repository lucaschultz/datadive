const PathPrefix = '/api'

export const ApiPath = {
  Landlord: {
    Auth: {
      CurrentUser: `${PathPrefix}/landlord/auth/current-user`,
      SignUp: `${PathPrefix}/landlord/sign-up`,
      SignIn: `${PathPrefix}/landlord/auth/sign-in`,
      SignOut: `${PathPrefix}/landlord/auth/sign-out`,
      Token: `${PathPrefix}/landlord/auth/token`,
      ForgotPassword: `${PathPrefix}/landlord/auth/forgot-password`,
      ResetPassword: `${PathPrefix}/landlord/auth/reset-password`,
      VerifyEmail: `${PathPrefix}/landlord/auth/verify-email`,
    },
    Users: {
      List: `${PathPrefix}/landlord/users`,
      Create: `${PathPrefix}/landlord/users`,
      Retrieve: `${PathPrefix}/landlord/users/{userId}`,
      Update: `${PathPrefix}/landlord/users/{userId}`,
      Delete: `${PathPrefix}/landlord/users/{userId}`,
    },
    Tenants: {
      List: `${PathPrefix}/landlord/tenant`,
      Create: `${PathPrefix}/landlord/tenant`,
      Retrieve: `${PathPrefix}/landlord/tenant/{tenantId}`,
      Update: `${PathPrefix}/landlord/tenant/{tenantId}`,
      Delete: `${PathPrefix}/landlord/tenant/{tenantId}`,
    },
  },
  Tenant: {
    Users: {
      List: `${PathPrefix}/tenant/{tenantDomain}/users`,
      Create: `${PathPrefix}/tenant/{tenantDomain}/users`,
      Retrieve: `${PathPrefix}/tenant/{tenantDomain}/users/{userId}`,
      Update: `${PathPrefix}/tenant/{tenantDomain}/users/{userId}`,
      Delete: `${PathPrefix}/tenant/{tenantDomain}/users/{userId}`,
    },
    Auth: {
      CurrentUser: `${PathPrefix}/tenant/{tenantDomain}/auth/current-user`,
      SignUp: `${PathPrefix}/tenant/{tenantDomain}/sign-up`,
      SignIn: `${PathPrefix}/tenant/{tenantDomain}/auth/sign-in`,
      SignOut: `${PathPrefix}/tenant/{tenantDomain}/auth/sign-out`,
      Token: `${PathPrefix}/tenant/{tenantDomain}/auth/token`,
      ForgotPassword: `${PathPrefix}/tenant/{tenantDomain}/auth/forgot-password`,
      ResetPassword: `${PathPrefix}/tenant/{tenantDomain}/auth/reset-password`,
      VerifyEmail: `${PathPrefix}/tenant/{tenantDomain}/auth/verify-email`,
    },
  },
} as const
