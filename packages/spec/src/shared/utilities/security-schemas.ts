export const SessionCookieSecurityScheme = [
  'securitySchemes',
  'sessionCookie',
  {
    type: 'apiKey',
    in: 'cookie',
    name: 'session',
  },
] as const

export const SessionHeaderSecurityScheme = [
  'securitySchemes',
  'sessionHeader',
  {
    type: 'apiKey',
    in: 'header',
    name: 'x-session',
  },
] as const

export const SecuritySchemas = [
  SessionCookieSecurityScheme,
  SessionHeaderSecurityScheme,
] as const
