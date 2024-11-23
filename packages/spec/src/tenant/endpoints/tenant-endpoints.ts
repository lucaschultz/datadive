import type { EndpointMap } from '../../shared/types/endpoint-map'

import { TenantCurrentUserEndpoint } from './auth/tenant-current-user'
import { TenantForgotPasswordEndpoint } from './auth/tenant-forgot-password'
import { TenantResetPasswordEndpoint } from './auth/tenant-reset-password'
import { TenantSignInEndpoint } from './auth/tenant-sign-in'
import { TenantSignOutEndpoint } from './auth/tenant-sign-out'
import { TenantSignUpEndpoint } from './auth/tenant-sign-up'
import { TenantTokenEndpoint } from './auth/tenant-token'
import { TenantVerifyEmailEndpoint } from './auth/tenant-verify-email'
import { TenantCreateUserEndpoint } from './user/tenant-create-user-endpoint'
import { TenantDeleteUserEndpoint } from './user/tenant-delete-user-endpoint'
import { TenantListUsersEndpoint } from './user/tenant-list-users-endpoint'
import { TenantRetrieveUserEndpoint } from './user/tenant-retrieve-user-endpoint'
import { TenantUpdateUserEndpoint } from './user/tenant-update-user-endpoint'

export const TenantEndpoints = {
  User: {
    List: TenantListUsersEndpoint,
    Create: TenantCreateUserEndpoint,
    Retrieve: TenantRetrieveUserEndpoint,
    Update: TenantUpdateUserEndpoint,
    Delete: TenantDeleteUserEndpoint,
  },
  Auth: {
    SignUp: TenantSignUpEndpoint,
    SignIn: TenantSignInEndpoint,
    SignOut: TenantSignOutEndpoint,
    CurrentUser: TenantCurrentUserEndpoint,
    VerifyEmail: TenantVerifyEmailEndpoint,
    Token: TenantTokenEndpoint,
    ResetPassword: TenantResetPasswordEndpoint,
    ForgotPassword: TenantForgotPasswordEndpoint,
  },
} satisfies EndpointMap
