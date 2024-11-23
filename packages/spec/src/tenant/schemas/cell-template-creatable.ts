import { Description } from '../../shared/schemas/description'
import { Id } from '../../shared/schemas/id'
import { Deletable } from '../../shared/schemas/timestamp'
import { Title } from '../../shared/schemas/title'
import { z } from '../../shared/utilities/z'

export const CellTemplateCode = z
  .string()
  .max(65_535)
  .openapi({ example: 'print("Hello, World!")' })

export const CellTemplateCreatable = z
  .object({
    id: Id.optional(),

    title: Title.openapi({ example: 'Hello World Cell' }),
    description: Description.nullable().openapi({
      example: 'A simple Python script that prints "Hello World!" to stdout.',
    }),
    code: CellTemplateCode,

    ...Deletable,
  })
  .openapi('TenantCellTemplateCreatable')
