import { Deletable } from '../../shared/schemas/timestamp'
import { z } from '../../shared/utilities/z'
import { InputDescription, InputTitle, InputType } from './input-creatable'

export const InputUpdateable = z
  .object({
    title: InputTitle,
    description: InputDescription.nullable(),
    type: InputType,

    ...Deletable,
  })
  .openapi('TenantInputUpdateable')
