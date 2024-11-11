import { BooleanQueryParam } from './boolean-query-param'

export const DeleteQueryParams = {
  deletePermanently: BooleanQueryParam.openapi({
    description: 'If true, the record will be deleted permanently',
    example: 'true',
  }),
}
