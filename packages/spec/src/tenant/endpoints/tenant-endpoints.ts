import type { EndpointMap } from '../../shared/types/endpoint-map'

import { TenantCurrentUserEndpoint } from './auth/tenant-current-user'
import { TenantForgotPasswordEndpoint } from './auth/tenant-forgot-password'
import { TenantResetPasswordEndpoint } from './auth/tenant-reset-password'
import { TenantSignInEndpoint } from './auth/tenant-sign-in'
import { TenantSignOutEndpoint } from './auth/tenant-sign-out'
import { TenantSignUpEndpoint } from './auth/tenant-sign-up'
import { TenantTokenEndpoint } from './auth/tenant-token'
import { TenantVerifyEmailEndpoint } from './auth/tenant-verify-email'
import { CreateCellTemplateEndpoint } from './cell-template/create-cell-template-endpoint'
import { DeleteCellTemplateEndpoint } from './cell-template/delete-cell-template-endpoint'
import { ListCellTemplatesEndpoint } from './cell-template/list-cell-templates-endpoint'
import { RetrieveCellTemplateEndpoint } from './cell-template/retrieve-cell-template-endpoint'
import { UpdateCellTemplateEndpoint } from './cell-template/update-cell-template-endpoint'
import { CreateInputEndpoint } from './input/create-input-endpoint'
import { DeleteInputEndpoint } from './input/delete-input-endpoint'
import { ListInputsEndpoint } from './input/list-inputs-endpoint'
import { RetrieveInputEndpoint } from './input/retrieve-input-endpoint'
import { UpdateInputEndpoint } from './input/update-input-endpoint'
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
  CellTemplate: {
    List: ListCellTemplatesEndpoint,
    Create: CreateCellTemplateEndpoint,
    Retrieve: RetrieveCellTemplateEndpoint,
    Update: UpdateCellTemplateEndpoint,
    Delete: DeleteCellTemplateEndpoint,
  },
  Input: {
    List: ListInputsEndpoint,
    Create: CreateInputEndpoint,
    Retrieve: RetrieveInputEndpoint,
    Update: UpdateInputEndpoint,
    Delete: DeleteInputEndpoint,
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
