import type { EndpointMap } from '../../shared/types/endpoint-map'

import { LandlordCurrentUserEndpoint } from './auth/landlord-current-user'
import { LandlordForgotPasswordEndpoint } from './auth/landlord-forgot-password'
import { LandlordResetPasswordEndpoint } from './auth/landlord-reset-password'
import { LandlordSignInEndpoint } from './auth/landlord-sign-in'
import { LandlordSignOutEndpoint } from './auth/landlord-sign-out'
import { LandlordSignUpEndpoint } from './auth/landlord-sign-up'
import { LandlordTokenEndpoint } from './auth/landlord-token'
import { LandlordVerifyEmailEndpoint } from './auth/landlord-verify-email'
import { CreateTenantEndpoint } from './tenant/create-tenant-endpoint'
import { DeleteTenantEndpoint } from './tenant/delete-tenant-endpoint'
import { ListTenantsEndpoint } from './tenant/list-tenants-endpoint'
import { RetrieveTenantEndpoint } from './tenant/retrieve-tenant-endpoint'
import { UpdateTenantEndpoint } from './tenant/update-tenant-endpoint'
import { LandlordCreateUserEndpoint } from './user/landlord-create-user-endpoint'
import { LandlordDeleteUserEndpoint } from './user/landlord-delete-user-endpoint'
import { LandlordListUsersEndpoint } from './user/landlord-list-users-endpoint'
import { LandlordRetrieveUserEndpoint } from './user/landlord-retrieve-user-endpoint'
import { LandlordUpdateUserEndpoint } from './user/landlord-update-user-endpoint'

export const LandlordEndpoints = {
  User: {
    List: LandlordListUsersEndpoint,
    Create: LandlordCreateUserEndpoint,
    Retrieve: LandlordRetrieveUserEndpoint,
    Update: LandlordUpdateUserEndpoint,
    Delete: LandlordDeleteUserEndpoint,
  },
  Auth: {
    SignUp: LandlordSignUpEndpoint,
    SignIn: LandlordSignInEndpoint,
    SignOut: LandlordSignOutEndpoint,
    CurrentUser: LandlordCurrentUserEndpoint,
    VerifyEmail: LandlordVerifyEmailEndpoint,
    Token: LandlordTokenEndpoint,
    ResetPassword: LandlordResetPasswordEndpoint,
    ForgotPassword: LandlordForgotPasswordEndpoint,
  },
  Tenant: {
    List: ListTenantsEndpoint,
    Create: CreateTenantEndpoint,
    Retrieve: RetrieveTenantEndpoint,
    Update: UpdateTenantEndpoint,
    Delete: DeleteTenantEndpoint,
  },
} satisfies EndpointMap
