import type { ArgsDef, CommandDef } from 'citty'

import { isPromise } from 'util/types'

/**
 * Rename a citty command
 * @param name The new name of the command
 * @param command The command to rename
 * @returns The renamed command
 */
export function renameCommand<TArgs extends ArgsDef>(
  name: string,
  command: CommandDef<TArgs>,
): CommandDef<TArgs> {
  if (isPromise(command.meta)) {
    return {
      ...command,
      meta: command.meta.then((meta) => ({ ...meta, name })),
    }
  }

  return { ...command, meta: { ...command.meta, name } }
}
