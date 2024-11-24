import { InputType as InputTypeEnum } from '@datadive/db'

import { Description } from '../../shared/schemas/description'
import { Id } from '../../shared/schemas/id'
import { Deletable } from '../../shared/schemas/timestamp'
import { Title } from '../../shared/schemas/title'
import { z } from '../../shared/utilities/z'

export const InputType = z
  .nativeEnum(InputTypeEnum)
  .openapi({ example: 'number' })

export const InputTitle = Title.openapi({ example: 'Number Input' })

export const InputDescription = Description.openapi({
  example: 'Adds a HTML number input to the cell template.',
})

export const InputCreatable = z
  .object({
    id: Id.optional(),

    title: InputTitle,
    description: InputDescription.nullable(),
    type: InputType,

    ...Deletable,
  })
  .openapi('TenantInputCreatable')
