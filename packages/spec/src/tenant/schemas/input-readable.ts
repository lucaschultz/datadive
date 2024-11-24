import { Id } from '../../shared/schemas/id'
import { Deletable, Timestamps } from '../../shared/schemas/timestamp'
import { z } from '../../shared/utilities/z'
import { InputDescription, InputTitle, InputType } from './input-creatable'

export const InputReadable = z
  .object({
    id: Id,

    title: InputTitle,
    description: InputDescription.nullable(),
    type: InputType,

    ...Timestamps,
    ...Deletable,
  })
  .openapi('TenantInputReadable')
