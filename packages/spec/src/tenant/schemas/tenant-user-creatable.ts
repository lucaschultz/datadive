import { Email } from '../../shared/schemas/email'
import { Id } from '../../shared/schemas/id'
import { Name } from '../../shared/schemas/name'
import { Password } from '../../shared/schemas/password'
import { Deletable } from '../../shared/schemas/timestamp'
import { Username } from '../../shared/schemas/username'
import { z } from '../../shared/utilities/z'

export const TenantUserCreatable = z
  .object({
    id: Id.optional(),

    username: Username,
    email: Email,
    firstName: Name.openapi({ example: 'Jane' }),
    lastName: Name.openapi({ example: 'Doe' }),

    password: Password.optional(),

    ...Deletable,
  })
  .openapi('TenantUserCreatable')
