import z from 'zod'

export type Extensions = z.infer<typeof Extensions>
export const Extensions = z.union([
  z.literal('all'),
  z.array(
    z.union([
      z.literal('vector'),
      z.literal('vss'),
      z.literal('crypto'),
      z.literal('fuzzy'),
      z.literal('math'),
      z.literal('stats'),
      z.literal('text'),
      z.literal('unicode'),
      z.literal('uuid'),
      z.literal('regexp'),
    ]),
  ),
])

export type Organization = z.infer<typeof Organization>
export const Organization = z.object({
  name: z.string().nullish(),
  slug: z.string().nullish(),
  type: z.union([z.literal('personal'), z.literal('team')]).nullish(),
  overages: z.boolean().nullish(),
  blocked_reads: z.boolean().nullish(),
  blocked_writes: z.boolean().nullish(),
})

export type Member = z.infer<typeof Member>
export const Member = z.object({
  username: z.string().nullish(),
  role: z
    .union([z.literal('owner'), z.literal('admin'), z.literal('member')])
    .nullish(),
  email: z.string().nullish(),
})

export type Invite = z.infer<typeof Invite>
export const Invite = z.object({
  ID: z.number().nullish(),
  CreatedAt: z.string().nullish(),
  UpdatedAt: z.string().nullish(),
  DeletedAt: z.string().nullish(),
  Role: z.union([z.literal('admin'), z.literal('member')]).nullish(),
  Email: z.string().nullish(),
  OrganizationID: z.number().nullish(),
  Token: z.string().nullish(),
  Organization: z
    .object({
      name: z.string().nullish(),
      slug: z.string().nullish(),
      type: z.union([z.literal('personal'), z.literal('team')]).nullish(),
      overages: z.boolean().nullish(),
      blocked_reads: z.boolean().nullish(),
      blocked_writes: z.boolean().nullish(),
    })
    .nullish(),
  Accepted: z.boolean().nullish(),
})

export type APIToken = z.infer<typeof APIToken>
export const APIToken = z.object({
  name: z.string().nullish(),
  id: z.string().nullish(),
})

export type AuditLog = z.infer<typeof AuditLog>
export const AuditLog = z.object({
  code: z
    .union([
      z.literal('user-signup'),
      z.literal('db-create'),
      z.literal('db-delete'),
      z.literal('instance-create'),
      z.literal('instance-delete'),
      z.literal('org-create'),
      z.literal('org-delete'),
      z.literal('org-member-add'),
      z.literal('org-member-rm'),
      z.literal('org-member-leave'),
      z.literal('org-plan-update'),
      z.literal('org-set-overages'),
      z.literal('group-create'),
      z.literal('group-delete'),
      z.literal('mfa-enable'),
      z.literal('mfa-disable'),
    ])
    .nullish(),
  message: z.string().nullish(),
  origin: z.string().nullish(),
  author: z.string().nullish(),
  created_at: z.string().nullish(),
  data: z.unknown().nullish(),
})

export type Database = z.infer<typeof Database>
export const Database = z.object({
  Name: z.string().nullish(),
  DbId: z.string().nullish(),
  Hostname: z.string().nullish(),
  block_reads: z.boolean().nullish(),
  block_writes: z.boolean().nullish(),
  allow_attach: z.boolean().nullish(),
  regions: z.array(z.string()).nullish(),
  primaryRegion: z.string().nullish(),
  type: z.string().nullish(),
  version: z.string().nullish(),
  group: z.string().nullish(),
  is_schema: z.boolean().nullish(),
  schema: z.string().nullish(),
  archived: z.boolean().nullish(),
})

export type Instance = z.infer<typeof Instance>
export const Instance = z.object({
  uuid: z.string().nullish(),
  name: z.string().nullish(),
  type: z.union([z.literal('primary'), z.literal('replica')]).nullish(),
  region: z.string().nullish(),
  hostname: z.string().nullish(),
})

export type CreateDatabaseInput = z.infer<typeof CreateDatabaseInput>
export const CreateDatabaseInput = z.object({
  name: z.string(),
  group: z.string(),
  seed: z
    .union([
      z.object({
        type: z.union([z.literal('database'), z.literal('dump')]).nullish(),
        name: z.string().nullish(),
        url: z.string().nullish(),
        timestamp: z.string().nullish(),
      }),
      z.undefined(),
    ])
    .nullish(),
  size_limit: z.union([z.string(), z.undefined()]).nullish(),
  is_schema: z.union([z.boolean(), z.undefined()]).nullish(),
  schema: z.union([z.string(), z.undefined()]).nullish(),
})

export type CreateDatabaseOutput = z.infer<typeof CreateDatabaseOutput>
export const CreateDatabaseOutput = z.object({
  DbId: z.string().nullish(),
  Hostname: z.string().nullish(),
  Name: z.string().nullish(),
})

export type DatabaseStatsOutput = z.infer<typeof DatabaseStatsOutput>
export const DatabaseStatsOutput = z.object({
  query: z.string().nullish(),
  rows_read: z.number().nullish(),
  rows_written: z.number().nullish(),
})

export type DatabaseUsageOutput = z.infer<typeof DatabaseUsageOutput>
export const DatabaseUsageOutput = z.object({
  uuid: z.string().nullish(),
  instances: z
    .array(
      z.object({
        uuid: z.string().nullish(),
        usage: z
          .object({
            rows_read: z.number().nullish(),
            rows_written: z.number().nullish(),
            storage_bytes: z.number().nullish(),
          })
          .nullish(),
      }),
    )
    .nullish(),
  total: z
    .object({
      rows_read: z.number().nullish(),
      rows_written: z.number().nullish(),
      storage_bytes: z.number().nullish(),
    })
    .nullish(),
})

export type DatabaseUsageObject = z.infer<typeof DatabaseUsageObject>
export const DatabaseUsageObject = z.object({
  rows_read: z.number().nullish(),
  rows_written: z.number().nullish(),
  storage_bytes: z.number().nullish(),
})

export type CreateTokenInput = z.infer<typeof CreateTokenInput>
export const CreateTokenInput = z.object({
  permissions: z
    .object({
      read_attach: z
        .object({
          databases: z.array(z.string()).nullish(),
        })
        .nullish(),
    })
    .nullish(),
})

export type DatabaseConfigurationInput = z.infer<
  typeof DatabaseConfigurationInput
>
export const DatabaseConfigurationInput = z.object({
  size_limit: z.string().nullish(),
  allow_attach: z.boolean().nullish(),
  block_reads: z.boolean().nullish(),
  block_writes: z.boolean().nullish(),
})

export type DatabaseConfigurationResponse = z.infer<
  typeof DatabaseConfigurationResponse
>
export const DatabaseConfigurationResponse = z.object({
  size_limit: z.string().nullish(),
  allow_attach: z.boolean().nullish(),
  block_reads: z.boolean().nullish(),
  block_writes: z.boolean().nullish(),
})

export type BaseGroup = z.infer<typeof BaseGroup>
export const BaseGroup = z.object({
  name: z.string().nullish(),
  version: z.string().nullish(),
  uuid: z.string().nullish(),
  locations: z.array(z.string()).nullish(),
  primary: z.string().nullish(),
  archived: z.boolean().nullish(),
})

export type PlanQuotas = z.infer<typeof PlanQuotas>
export const PlanQuotas = z.object({
  rowsRead: z.number().nullish(),
  rowsWritten: z.number().nullish(),
  databases: z.number().nullish(),
  locations: z.number().nullish(),
  storage: z.number().nullish(),
  groups: z.number().nullish(),
  bytesSynced: z.number().nullish(),
})

export type NewGroup = z.infer<typeof NewGroup>
export const NewGroup = z.object({
  name: z.string(),
  location: z.string(),
  extensions: z
    .union([
      z.literal('all'),
      z.array(
        z.union([
          z.literal('vector'),
          z.literal('vss'),
          z.literal('crypto'),
          z.literal('fuzzy'),
          z.literal('math'),
          z.literal('stats'),
          z.literal('text'),
          z.literal('unicode'),
          z.literal('uuid'),
          z.literal('regexp'),
        ]),
      ),
      z.undefined(),
    ])
    .nullish(),
})

export type Group = z.infer<typeof Group>
export const Group = z.intersection(
  z.object({
    name: z.string().nullish(),
    version: z.string().nullish(),
    uuid: z.string().nullish(),
    locations: z.array(z.string()).nullish(),
    primary: z.string().nullish(),
    archived: z.boolean().nullish(),
  }),
  z.unknown(),
)

export type get_ListDatabases = typeof get_ListDatabases
export const get_ListDatabases = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/databases'),
  parameters: z.object({
    query: z.object({
      group: z.string().nullish(),
      schema: z.string().nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    databases: z
      .array(
        z.object({
          Name: z.string(),
          DbId: z.string().nullish(),
          Hostname: z.string(),
          block_reads: z.boolean().nullish(),
          block_writes: z.boolean().nullish(),
          allow_attach: z.boolean().nullish(),
          regions: z.array(z.string()).nullish(),
          primaryRegion: z.string().nullish(),
          type: z.string().nullish(),
          version: z.string().nullish(),
          group: z.string().nullish(),
          is_schema: z.boolean().nullish(),
          schema: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
      ),
  }),
}

export type post_CreateDatabase = typeof post_CreateDatabase
export const post_CreateDatabase = {
  method: z.literal('POST'),
  path: z.literal('/v1/organizations/{organizationName}/databases'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      name: z.string(),
      group: z.string(),
      seed: z
        .union([
          z.object({
            type: z.union([z.literal('database'), z.literal('dump')]).nullish(),
            name: z.string().nullish(),
            url: z.string().nullish(),
            timestamp: z.string().nullish(),
          }),
          z.undefined(),
        ])
        .nullish(),
      size_limit: z.union([z.string(), z.undefined()]).nullish(),
      is_schema: z.union([z.boolean(), z.undefined()]).nullish(),
      schema: z.union([z.string(), z.undefined()]).nullish(),
    }),
  }),
  response: z.object({
    database: z
      .object({
        DbId: z.string().nullish(),
        Hostname: z.string(),
        Name: z.string(),
      }),
  }),
}

export type get_GetDatabase = typeof get_GetDatabase
export const get_GetDatabase = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    database: z
      .object({
        Name: z.string().nullish(),
        DbId: z.string().nullish(),
        Hostname: z.string().nullish(),
        block_reads: z.boolean().nullish(),
        block_writes: z.boolean().nullish(),
        allow_attach: z.boolean().nullish(),
        regions: z.array(z.string()).nullish(),
        primaryRegion: z.string().nullish(),
        type: z.string().nullish(),
        version: z.string().nullish(),
        group: z.string().nullish(),
        is_schema: z.boolean().nullish(),
        schema: z.string().nullish(),
        archived: z.boolean().nullish(),
      })
      .nullish(),
  }),
}

export type delete_DeleteDatabase = typeof delete_DeleteDatabase
export const delete_DeleteDatabase = {
  method: z.literal('DELETE'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    database: z.string(),
  }),
}

export type get_GetDatabaseConfiguration = typeof get_GetDatabaseConfiguration
export const get_GetDatabaseConfiguration = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/configuration',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    size_limit: z.string().nullish(),
    allow_attach: z.boolean().nullish(),
    block_reads: z.boolean().nullish(),
    block_writes: z.boolean().nullish(),
  }),
}

export type patch_UpdateDatabaseConfiguration =
  typeof patch_UpdateDatabaseConfiguration
export const patch_UpdateDatabaseConfiguration = {
  method: z.literal('PATCH'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/configuration',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
    body: z.object({
      size_limit: z.string().nullish(),
      allow_attach: z.boolean().nullish(),
      block_reads: z.boolean().nullish(),
      block_writes: z.boolean().nullish(),
    }),
  }),
  response: z.object({
    size_limit: z.string().nullish(),
    allow_attach: z.boolean().nullish(),
    block_reads: z.boolean().nullish(),
    block_writes: z.boolean().nullish(),
  }),
}

export type post_UploadDatabaseDump = typeof post_UploadDatabaseDump
export const post_UploadDatabaseDump = {
  method: z.literal('POST'),
  path: z.literal('/v1/organizations/{organizationName}/databases/dumps'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      file: z.string(),
    }),
  }),
  response: z.object({
    dump_url: z.string().nullish(),
  }),
}

export type get_ListDatabaseInstances = typeof get_ListDatabaseInstances
export const get_ListDatabaseInstances = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/instances',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    instances: z
      .array(
        z.object({
          uuid: z.string().nullish(),
          name: z.string().nullish(),
          type: z.union([z.literal('primary'), z.literal('replica')]).nullish(),
          region: z.string().nullish(),
          hostname: z.string().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type get_GetDatabaseInstance = typeof get_GetDatabaseInstance
export const get_GetDatabaseInstance = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/instances/{instanceName}',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
      instanceName: z.string(),
    }),
  }),
  response: z.object({
    instance: z
      .object({
        uuid: z.string().nullish(),
        name: z.string().nullish(),
        type: z.union([z.literal('primary'), z.literal('replica')]).nullish(),
        region: z.string().nullish(),
        hostname: z.string().nullish(),
      })
      .nullish(),
  }),
}

export type post_CreateDatabaseToken = typeof post_CreateDatabaseToken
export const post_CreateDatabaseToken = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/auth/tokens',
  ),
  parameters: z.object({
    query: z.object({
      expiration: z.string().nullish(),
      authorization: z
        .union([z.literal('full-access'), z.literal('read-only')])
        .nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
    body: z.object({
      permissions: z
        .object({
          read_attach: z
            .object({
              databases: z.array(z.string()).nullish(),
            })
            .nullish(),
        })
        .nullish(),
    }),
  }),
  response: z.object({
    jwt: z.string(),
  }),
}

export type get_GetDatabaseUsage = typeof get_GetDatabaseUsage
export const get_GetDatabaseUsage = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/usage',
  ),
  parameters: z.object({
    query: z.object({
      from: z.string().nullish(),
      to: z.string().nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    database: z
      .object({
        uuid: z.string().nullish(),
        instances: z
          .array(
            z.object({
              uuid: z.string().nullish(),
              usage: z
                .object({
                  rows_read: z.number().nullish(),
                  rows_written: z.number().nullish(),
                  storage_bytes: z.number().nullish(),
                })
                .nullish(),
            }),
          )
          .nullish(),
        total: z
          .object({
            rows_read: z.number().nullish(),
            rows_written: z.number().nullish(),
            storage_bytes: z.number().nullish(),
          })
          .nullish(),
      })
      .nullish(),
  }),
}

export type get_GetDatabaseStats = typeof get_GetDatabaseStats
export const get_GetDatabaseStats = {
  method: z.literal('GET'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/stats',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.object({
    top_queries: z
      .array(
        z.object({
          query: z.string().nullish(),
          rows_read: z.number().nullish(),
          rows_written: z.number().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type post_InvalidateDatabaseTokens = typeof post_InvalidateDatabaseTokens
export const post_InvalidateDatabaseTokens = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/databases/{databaseName}/auth/rotate',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      databaseName: z.string(),
    }),
  }),
  response: z.unknown(),
}

export type get_ListGroups = typeof get_ListGroups
export const get_ListGroups = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/groups'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    groups: z
      .array(
        z.intersection(
          z.object({
            name: z.string().nullish(),
            version: z.string().nullish(),
            uuid: z.string().nullish(),
            locations: z.array(z.string()).nullish(),
            primary: z.string().nullish(),
            archived: z.boolean().nullish(),
          }),
          z.unknown(),
        ),
      )
      .nullish(),
  }),
}

export type post_CreateGroup = typeof post_CreateGroup
export const post_CreateGroup = {
  method: z.literal('POST'),
  path: z.literal('/v1/organizations/{organizationName}/groups'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      name: z.string(),
      location: z.string(),
      extensions: z
        .union([
          z.literal('all'),
          z.array(
            z.union([
              z.literal('vector'),
              z.literal('vss'),
              z.literal('crypto'),
              z.literal('fuzzy'),
              z.literal('math'),
              z.literal('stats'),
              z.literal('text'),
              z.literal('unicode'),
              z.literal('uuid'),
              z.literal('regexp'),
            ]),
          ),
          z.undefined(),
        ])
        .nullish(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type get_GetGroup = typeof get_GetGroup
export const get_GetGroup = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/groups/{groupName}'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type delete_DeleteGroup = typeof delete_DeleteGroup
export const delete_DeleteGroup = {
  method: z.literal('DELETE'),
  path: z.literal('/v1/organizations/{organizationName}/groups/{groupName}'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type post_TransferGroup = typeof post_TransferGroup
export const post_TransferGroup = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/unarchive',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type post_AddLocationToGroup = typeof post_AddLocationToGroup
export const post_AddLocationToGroup = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/locations/{location}',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
      location: z.string(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type delete_RemoveLocationFromGroup =
  typeof delete_RemoveLocationFromGroup
export const delete_RemoveLocationFromGroup = {
  method: z.literal('DELETE'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/locations/{location}',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
      location: z.string(),
    }),
  }),
  response: z.object({
    group: z
      .intersection(
        z.object({
          name: z.string().nullish(),
          version: z.string().nullish(),
          uuid: z.string().nullish(),
          locations: z.array(z.string()).nullish(),
          primary: z.string().nullish(),
          archived: z.boolean().nullish(),
        }),
        z.unknown(),
      )
      .nullish(),
  }),
}

export type post_UpdateGroupDatabases = typeof post_UpdateGroupDatabases
export const post_UpdateGroupDatabases = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/update',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
  }),
  response: z.unknown(),
}

export type post_CreateGroupToken = typeof post_CreateGroupToken
export const post_CreateGroupToken = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/auth/tokens',
  ),
  parameters: z.object({
    query: z.object({
      expiration: z.string().nullish(),
      authorization: z
        .union([z.literal('full-access'), z.literal('read-only')])
        .nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
    body: z.object({
      permissions: z
        .object({
          read_attach: z
            .object({
              databases: z.array(z.string()).nullish(),
            })
            .nullish(),
        })
        .nullish(),
    }),
  }),
  response: z.object({
    jwt: z.string().nullish(),
  }),
}

export type post_InvalidateGroupTokens = typeof post_InvalidateGroupTokens
export const post_InvalidateGroupTokens = {
  method: z.literal('POST'),
  path: z.literal(
    '/v1/organizations/{organizationName}/groups/{groupName}/auth/rotate',
  ),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      groupName: z.string(),
    }),
  }),
  response: z.unknown(),
}

export type get_ListLocations = typeof get_ListLocations
export const get_ListLocations = {
  method: z.literal('GET'),
  path: z.literal('/v1/locations'),
  parameters: z.never(),
  response: z.object({
    locations: z.unknown().nullish(),
  }),
}

export type get_ListOrganizations = typeof get_ListOrganizations
export const get_ListOrganizations = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations'),
  parameters: z.never(),
  response: z.array(
    z.object({
      name: z.string().nullish(),
      slug: z.string().nullish(),
      type: z.union([z.literal('personal'), z.literal('team')]).nullish(),
      overages: z.boolean().nullish(),
      blocked_reads: z.boolean().nullish(),
      blocked_writes: z.boolean().nullish(),
    }),
  ),
}

export type patch_UpdateOrganization = typeof patch_UpdateOrganization
export const patch_UpdateOrganization = {
  method: z.literal('PATCH'),
  path: z.literal('/v1/organizations/{organizationName}'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      overages: z.boolean().nullish(),
    }),
  }),
  response: z.object({
    organization: z
      .object({
        name: z.string().nullish(),
        slug: z.string().nullish(),
        type: z.union([z.literal('personal'), z.literal('team')]).nullish(),
        overages: z.boolean().nullish(),
        blocked_reads: z.boolean().nullish(),
        blocked_writes: z.boolean().nullish(),
      })
      .nullish(),
  }),
}

export type get_ListOrganizationPlans = typeof get_ListOrganizationPlans
export const get_ListOrganizationPlans = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/plans'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    name: z.string().nullish(),
    price: z.string().nullish(),
    quotas: z
      .object({
        rowsRead: z.number().nullish(),
        rowsWritten: z.number().nullish(),
        databases: z.number().nullish(),
        locations: z.number().nullish(),
        storage: z.number().nullish(),
        groups: z.number().nullish(),
        bytesSynced: z.number().nullish(),
      })
      .nullish(),
  }),
}

export type get_ListOrganizationInvoices = typeof get_ListOrganizationInvoices
export const get_ListOrganizationInvoices = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/invoices'),
  parameters: z.object({
    query: z.object({
      type: z
        .union([z.literal('all'), z.literal('upcoming'), z.literal('issued')])
        .nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    invoices: z
      .array(
        z.object({
          invoice_number: z.string().nullish(),
          amount_due: z.string().nullish(),
          due_date: z.string().nullish(),
          paid_at: z.string().nullish(),
          payment_failed_at: z.string().nullish(),
          invoice_pdf: z.string().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type get_GetOrganizationSubscription =
  typeof get_GetOrganizationSubscription
export const get_GetOrganizationSubscription = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/subscription'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    subscription: z.string().nullish(),
    overages: z.boolean().nullish(),
    plan: z.string().nullish(),
    timeline: z.string().nullish(),
  }),
}

export type get_GetOrganizationUsage = typeof get_GetOrganizationUsage
export const get_GetOrganizationUsage = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/usage'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    organization: z
      .object({
        uuid: z.string().nullish(),
        usage: z
          .object({
            rows_read: z.number().nullish(),
            rows_written: z.number().nullish(),
            databases: z.number().nullish(),
            locations: z.number().nullish(),
            storage: z.number().nullish(),
            groups: z.number().nullish(),
            bytes_synced: z.number().nullish(),
          })
          .nullish(),
        databases: z
          .array(
            z.object({
              uuid: z.string().nullish(),
              instances: z
                .array(
                  z.object({
                    uuid: z.string().nullish(),
                    usage: z
                      .object({
                        rows_read: z.number().nullish(),
                        rows_written: z.number().nullish(),
                        storage_bytes: z.number().nullish(),
                      })
                      .nullish(),
                  }),
                )
                .nullish(),
              total: z
                .object({
                  rows_read: z.number().nullish(),
                  rows_written: z.number().nullish(),
                  storage_bytes: z.number().nullish(),
                })
                .nullish(),
            }),
          )
          .nullish(),
      })
      .nullish(),
  }),
}

export type get_ListOrganizationMembers = typeof get_ListOrganizationMembers
export const get_ListOrganizationMembers = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/members'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    members: z
      .array(
        z.object({
          username: z.string().nullish(),
          role: z
            .union([
              z.literal('owner'),
              z.literal('admin'),
              z.literal('member'),
            ])
            .nullish(),
          email: z.string().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type post_AddOrganizationMember = typeof post_AddOrganizationMember
export const post_AddOrganizationMember = {
  method: z.literal('POST'),
  path: z.literal('/v1/organizations/{organizationName}/members'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      username: z.union([z.string(), z.undefined()]).nullish(),
      role: z
        .union([z.literal('admin'), z.literal('member'), z.undefined()])
        .nullish(),
    }),
  }),
  response: z.object({
    member: z.string().nullish(),
    role: z
      .union([z.literal('owner'), z.literal('admin'), z.literal('member')])
      .nullish(),
  }),
}

export type delete_RemoveOrganizationMember =
  typeof delete_RemoveOrganizationMember
export const delete_RemoveOrganizationMember = {
  method: z.literal('DELETE'),
  path: z.literal('/v1/organizations/{organizationName}/members/{username}'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      username: z.string(),
    }),
  }),
  response: z.object({
    member: z.string().nullish(),
  }),
}

export type get_ListOrganizationInvites = typeof get_ListOrganizationInvites
export const get_ListOrganizationInvites = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/invites'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    invites: z
      .array(
        z.object({
          ID: z.number().nullish(),
          CreatedAt: z.string().nullish(),
          UpdatedAt: z.string().nullish(),
          DeletedAt: z.string().nullish(),
          Role: z.union([z.literal('admin'), z.literal('member')]).nullish(),
          Email: z.string().nullish(),
          OrganizationID: z.number().nullish(),
          Token: z.string().nullish(),
          Organization: z
            .object({
              name: z.string().nullish(),
              slug: z.string().nullish(),
              type: z
                .union([z.literal('personal'), z.literal('team')])
                .nullish(),
              overages: z.boolean().nullish(),
              blocked_reads: z.boolean().nullish(),
              blocked_writes: z.boolean().nullish(),
            })
            .nullish(),
          Accepted: z.boolean().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type post_InviteOrganizationMember = typeof post_InviteOrganizationMember
export const post_InviteOrganizationMember = {
  method: z.literal('POST'),
  path: z.literal('/v1/organizations/{organizationName}/invites'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
    }),
    body: z.object({
      email: z.string(),
      role: z
        .union([z.literal('admin'), z.literal('member'), z.undefined()])
        .nullish(),
    }),
  }),
  response: z.object({
    invited: z
      .object({
        ID: z.number().nullish(),
        CreatedAt: z.string().nullish(),
        UpdatedAt: z.string().nullish(),
        DeletedAt: z.string().nullish(),
        Role: z.union([z.literal('admin'), z.literal('member')]).nullish(),
        Email: z.string().nullish(),
        OrganizationID: z.number().nullish(),
        Token: z.string().nullish(),
        Organization: z
          .object({
            name: z.string().nullish(),
            slug: z.string().nullish(),
            type: z.union([z.literal('personal'), z.literal('team')]).nullish(),
            overages: z.boolean().nullish(),
            blocked_reads: z.boolean().nullish(),
            blocked_writes: z.boolean().nullish(),
          })
          .nullish(),
        Accepted: z.boolean().nullish(),
      })
      .nullish(),
  }),
}

export type delete_DeleteOrganizationInviteByEmail =
  typeof delete_DeleteOrganizationInviteByEmail
export const delete_DeleteOrganizationInviteByEmail = {
  method: z.literal('DELETE'),
  path: z.literal('/v1/organizations/{organizationName}/invites/{email}'),
  parameters: z.object({
    path: z.object({
      organizationName: z.string(),
      email: z.string(),
    }),
  }),
  response: z.unknown(),
}

export type get_ValidateAPIToken = typeof get_ValidateAPIToken
export const get_ValidateAPIToken = {
  method: z.literal('GET'),
  path: z.literal('/v1/auth/validate'),
  parameters: z.never(),
  response: z.object({
    exp: z.number().nullish(),
  }),
}

export type get_ListAPITokens = typeof get_ListAPITokens
export const get_ListAPITokens = {
  method: z.literal('GET'),
  path: z.literal('/v1/auth/api-tokens'),
  parameters: z.never(),
  response: z.object({
    tokens: z
      .array(
        z.object({
          name: z.string().nullish(),
          id: z.string().nullish(),
        }),
      )
      .nullish(),
  }),
}

export type post_CreateAPIToken = typeof post_CreateAPIToken
export const post_CreateAPIToken = {
  method: z.literal('POST'),
  path: z.literal('/v1/auth/api-tokens/{tokenName}'),
  parameters: z.object({
    path: z.object({
      tokenName: z.string(),
    }),
  }),
  response: z.object({
    name: z.string().nullish(),
    id: z.string().nullish(),
    token: z.string().nullish(),
  }),
}

export type delete_RevokeAPIToken = typeof delete_RevokeAPIToken
export const delete_RevokeAPIToken = {
  method: z.literal('DELETE'),
  path: z.literal('/v1/auth/api-tokens/{tokenName}'),
  parameters: z.object({
    path: z.object({
      tokenName: z.string(),
    }),
  }),
  response: z.object({
    token: z.string().nullish(),
  }),
}

export type get_ListOrganizationAuditLogs = typeof get_ListOrganizationAuditLogs
export const get_ListOrganizationAuditLogs = {
  method: z.literal('GET'),
  path: z.literal('/v1/organizations/{organizationName}/audit-logs'),
  parameters: z.object({
    query: z.object({
      page_size: z.number().nullish(),
      page: z.number().nullish(),
    }),
    path: z.object({
      organizationName: z.string(),
    }),
  }),
  response: z.object({
    audit_logs: z
      .array(
        z.object({
          code: z
            .union([
              z.literal('user-signup'),
              z.literal('db-create'),
              z.literal('db-delete'),
              z.literal('instance-create'),
              z.literal('instance-delete'),
              z.literal('org-create'),
              z.literal('org-delete'),
              z.literal('org-member-add'),
              z.literal('org-member-rm'),
              z.literal('org-member-leave'),
              z.literal('org-plan-update'),
              z.literal('org-set-overages'),
              z.literal('group-create'),
              z.literal('group-delete'),
              z.literal('mfa-enable'),
              z.literal('mfa-disable'),
            ])
            .nullish(),
          message: z.string().nullish(),
          origin: z.string().nullish(),
          author: z.string().nullish(),
          created_at: z.string().nullish(),
          data: z.unknown().nullish(),
        }),
      )
      .nullish(),
    pagination: z
      .object({
        page: z.number().nullish(),
        page_size: z.number().nullish(),
        total_pages: z.number().nullish(),
        total_rows: z.number().nullish(),
      })
      .nullish(),
  }),
}

// <EndpointByMethod>
export const EndpointByMethod = {
  get: {
    '/v1/organizations/{organizationName}/databases': get_ListDatabases,
    '/v1/organizations/{organizationName}/databases/{databaseName}':
      get_GetDatabase,
    '/v1/organizations/{organizationName}/databases/{databaseName}/configuration':
      get_GetDatabaseConfiguration,
    '/v1/organizations/{organizationName}/databases/{databaseName}/instances':
      get_ListDatabaseInstances,
    '/v1/organizations/{organizationName}/databases/{databaseName}/instances/{instanceName}':
      get_GetDatabaseInstance,
    '/v1/organizations/{organizationName}/databases/{databaseName}/usage':
      get_GetDatabaseUsage,
    '/v1/organizations/{organizationName}/databases/{databaseName}/stats':
      get_GetDatabaseStats,
    '/v1/organizations/{organizationName}/groups': get_ListGroups,
    '/v1/organizations/{organizationName}/groups/{groupName}': get_GetGroup,
    '/v1/locations': get_ListLocations,
    '/v1/organizations': get_ListOrganizations,
    '/v1/organizations/{organizationName}/plans': get_ListOrganizationPlans,
    '/v1/organizations/{organizationName}/invoices':
      get_ListOrganizationInvoices,
    '/v1/organizations/{organizationName}/subscription':
      get_GetOrganizationSubscription,
    '/v1/organizations/{organizationName}/usage': get_GetOrganizationUsage,
    '/v1/organizations/{organizationName}/members': get_ListOrganizationMembers,
    '/v1/organizations/{organizationName}/invites': get_ListOrganizationInvites,
    '/v1/auth/validate': get_ValidateAPIToken,
    '/v1/auth/api-tokens': get_ListAPITokens,
    '/v1/organizations/{organizationName}/audit-logs':
      get_ListOrganizationAuditLogs,
  },
  post: {
    '/v1/organizations/{organizationName}/databases': post_CreateDatabase,
    '/v1/organizations/{organizationName}/databases/dumps':
      post_UploadDatabaseDump,
    '/v1/organizations/{organizationName}/databases/{databaseName}/auth/tokens':
      post_CreateDatabaseToken,
    '/v1/organizations/{organizationName}/databases/{databaseName}/auth/rotate':
      post_InvalidateDatabaseTokens,
    '/v1/organizations/{organizationName}/groups': post_CreateGroup,
    '/v1/organizations/{organizationName}/groups/{groupName}/transfer':
      post_TransferGroup,
    '/v1/organizations/{organizationName}/groups/{groupName}/unarchive':
      post_TransferGroup,
    '/v1/organizations/{organizationName}/groups/{groupName}/locations/{location}':
      post_AddLocationToGroup,
    '/v1/organizations/{organizationName}/groups/{groupName}/update':
      post_UpdateGroupDatabases,
    '/v1/organizations/{organizationName}/groups/{groupName}/auth/tokens':
      post_CreateGroupToken,
    '/v1/organizations/{organizationName}/groups/{groupName}/auth/rotate':
      post_InvalidateGroupTokens,
    '/v1/organizations/{organizationName}/members': post_AddOrganizationMember,
    '/v1/organizations/{organizationName}/invites':
      post_InviteOrganizationMember,
    '/v1/auth/api-tokens/{tokenName}': post_CreateAPIToken,
  },
  delete: {
    '/v1/organizations/{organizationName}/databases/{databaseName}':
      delete_DeleteDatabase,
    '/v1/organizations/{organizationName}/groups/{groupName}':
      delete_DeleteGroup,
    '/v1/organizations/{organizationName}/groups/{groupName}/locations/{location}':
      delete_RemoveLocationFromGroup,
    '/v1/organizations/{organizationName}/members/{username}':
      delete_RemoveOrganizationMember,
    '/v1/organizations/{organizationName}/invites/{email}':
      delete_DeleteOrganizationInviteByEmail,
    '/v1/auth/api-tokens/{tokenName}': delete_RevokeAPIToken,
  },
  patch: {
    '/v1/organizations/{organizationName}/databases/{databaseName}/configuration':
      patch_UpdateDatabaseConfiguration,
    '/v1/organizations/{organizationName}': patch_UpdateOrganization,
  },
}
export type EndpointByMethod = typeof EndpointByMethod
// </EndpointByMethod>

// <EndpointByMethod.Shorthands>
export type GetEndpoints = EndpointByMethod['get']
export type PostEndpoints = EndpointByMethod['post']
export type DeleteEndpoints = EndpointByMethod['delete']
export type PatchEndpoints = EndpointByMethod['patch']
export type AllEndpoints = EndpointByMethod[keyof EndpointByMethod]
// </EndpointByMethod.Shorthands>

// <ApiClientTypes>
export type EndpointParameters = {
  body?: unknown
  query?: Record<string, unknown>
  header?: Record<string, unknown>
  path?: Record<string, unknown>
}

export type MutationMethod = 'post' | 'put' | 'patch' | 'delete'
export type Method = 'get' | 'head' | MutationMethod

export type DefaultEndpoint = {
  parameters?: EndpointParameters | undefined
  response: unknown
}

export type Endpoint<TConfig extends DefaultEndpoint = DefaultEndpoint> = {
  operationId: string
  method: Method
  path: string
  parameters?: TConfig['parameters']
  meta: {
    alias: string
    hasParameters: boolean
    areParametersRequired: boolean
  }
  response: TConfig['response']
}

type Fetcher = (
  method: Method,
  url: string,
  parameters?: EndpointParameters | undefined,
) => Promise<Endpoint['response']>

type RequiredKeys<T> = {
  [P in keyof T]-?: undefined extends T[P] ? never : P
}[keyof T]

type MaybeOptionalArg<T> =
  RequiredKeys<T> extends never ? [config?: T] : [config: T]

// </ApiClientTypes>

// <ApiClient>
export class ApiClient {
  baseUrl: string = ''

  constructor(public fetcher: Fetcher) {}

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl
    return this
  }

  // <ApiClient.get>
  get<Path extends keyof GetEndpoints, TEndpoint extends GetEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): Promise<z.infer<TEndpoint['response']>> {
    return this.fetcher('get', this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint['response']>
    >
  }
  // </ApiClient.get>

  // <ApiClient.post>
  post<Path extends keyof PostEndpoints, TEndpoint extends PostEndpoints[Path]>(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): Promise<z.infer<TEndpoint['response']>> {
    return this.fetcher('post', this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint['response']>
    >
  }
  // </ApiClient.post>

  // <ApiClient.delete>
  delete<
    Path extends keyof DeleteEndpoints,
    TEndpoint extends DeleteEndpoints[Path],
  >(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): Promise<z.infer<TEndpoint['response']>> {
    return this.fetcher('delete', this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint['response']>
    >
  }
  // </ApiClient.delete>

  // <ApiClient.patch>
  patch<
    Path extends keyof PatchEndpoints,
    TEndpoint extends PatchEndpoints[Path],
  >(
    path: Path,
    ...params: MaybeOptionalArg<z.infer<TEndpoint['parameters']>>
  ): Promise<z.infer<TEndpoint['response']>> {
    return this.fetcher('patch', this.baseUrl + path, params[0]) as Promise<
      z.infer<TEndpoint['response']>
    >
  }
  // </ApiClient.patch>
}

export function createApiClient(fetcher: Fetcher, baseUrl?: string) {
  return new ApiClient(fetcher).setBaseUrl(baseUrl ?? '')
}

/**
 Example usage:
 const api = createApiClient((method, url, params) =>
   fetch(url, { method, body: JSON.stringify(params) }).then((res) => res.json()),
 );
 api.get("/users").then((users) => console.log(users));
 api.post("/users", { body: { name: "John" } }).then((user) => console.log(user));
 api.put("/users/:id", { path: { id: 1 }, body: { name: "John" } }).then((user) => console.log(user));
*/

// </ApiClient
