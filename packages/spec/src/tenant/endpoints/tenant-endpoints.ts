import type { EndpointMap } from '../../shared/types/endpoint-map'

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
} satisfies EndpointMap
