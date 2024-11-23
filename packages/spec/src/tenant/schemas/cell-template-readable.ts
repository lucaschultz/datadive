import { Description } from '../../shared/schemas/description'
import { Id } from '../../shared/schemas/id'
import { Deletable, Timestamps } from '../../shared/schemas/timestamp'
import { Title } from '../../shared/schemas/title'
import { z } from '../../shared/utilities/z'
import { CellTemplateCode } from './cell-template-creatable'

export const CellTemplateReadable = z
  .object({
    id: Id,

    title: Title.openapi({ example: 'Hello World Cell' }),
    description: Description.nullish().openapi({
      example: 'A simple Python script that prints "Hello World!" to stdout.',
    }),
    code: CellTemplateCode,

    ...Deletable,
    ...Timestamps,
  })
  .openapi('TenantCellTemplateReadable')
