import { constEnum } from '@datadive/utils/common'

/**
 * The type of an input
 */
export const InputType = constEnum({
  Text: 'text',
  Number: 'number',
  Boolean: 'boolean',
  Select: 'select',
})

export type InputType = constEnum<typeof InputType>
