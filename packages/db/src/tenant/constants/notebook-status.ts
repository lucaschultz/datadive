import { constEnum } from '@datadive/utils/common'

/**
 * The status of a notebook
 */
export const NotebookStatus = constEnum({
  Active: 'active',
  Archived: 'archived',
})

export type NotebookStatus = constEnum<typeof NotebookStatus>
