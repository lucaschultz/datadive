import type { UppercaseFirst } from '@datadive/utils/type'
import type { DB as GeneratedTenantDatabase } from '../tenant-database-types.generated'

export type TenantTable = {
  [Key in keyof GeneratedTenantDatabase as UppercaseFirst<Key>]: Key & string
}

export const TenantTable: TenantTable = {
  EmailVerificationCode: 'emailVerificationCode',
  User: 'user',
  PasswordResetToken: 'passwordResetToken',
  Session: 'session',
  CellTemplateInput: 'cellTemplateInput',
  CellTemplate: 'cellTemplate',
  Notebook: 'notebook',
  Input: 'input',
  Collaborator: 'collaborator',
  InputType: 'inputType',
  NotebookStatus: 'notebookStatus',
  Project: 'project',
}
