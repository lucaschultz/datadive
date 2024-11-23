import { Description } from '../../shared/schemas/description'
import { Deletable } from '../../shared/schemas/timestamp'
import { Title } from '../../shared/schemas/title'
import { z } from '../../shared/utilities/z'
import { CellTemplateCode } from './cell-template-creatable'

export const CellTemplateUpdatable = z
  .object({
    title: Title.openapi({ example: 'Hello World Cell' }),
    description: Description.nullable().openapi({
      example: 'A simple Python script that prints "Hello World!" to stdout.',
    }),
    code: CellTemplateCode,

    ...Deletable,
  })
  .openapi('TenantCellTemplateCreatable')
