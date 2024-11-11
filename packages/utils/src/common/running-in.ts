import { runningInBrowser } from './running-in-browser'
import { runningInBun } from './running-in-bun'
import { runningInNode } from './running-in-node'

const ExecutionEnvironments = ['node', 'browser', 'bun'] as const
type ExecutionEnvironment = (typeof ExecutionEnvironments)[number]

/**
 * Check the execution environment of the code
 * @returns The execution environment of the code, either `'node'`, `'browser'`, `'bun'` or `undefined` if the environment is unknown
 */
export function runningIn(): ExecutionEnvironment | undefined {
  if (runningInBrowser()) {
    return 'browser'
  }

  if (runningInBun()) {
    return 'bun'
  }

  if (runningInNode()) {
    return 'node'
  }

  return undefined
}
