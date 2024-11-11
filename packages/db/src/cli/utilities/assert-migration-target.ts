import { ImplicitMigrationTarget } from '../../migrate'
import { exitWithError } from '../arguments/exit-with-error'

/**
 * Asserts that the given target is a valid migration target
 * @param target - The target to assert
 * @throws Error if the target is invalid
 */
export function assertMigrationTarget(
  target: string,
): asserts target is ImplicitMigrationTarget {
  if (!Object.values(ImplicitMigrationTarget).includes(target)) {
    exitWithError(
      `Invalid migration target: ${target}. Must be one of "${Object.values(ImplicitMigrationTarget).join('", "')}"`,
    )
  }
}
