import { stat } from 'fs/promises'

import { exitWithError } from '../arguments/exit-with-error'

/**
 * Assert that the output file does not already exist
 * @param out - The output file
 * @param force - Whether to force overwrite
 * @throws Error if the output file already exists
 */
export async function assertNoAccidentalOverwrite(out: string, force: boolean) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const stats = await stat(out)
    if (stats.isFile() && !force) {
      exitWithError(
        `File already exists: ${out.replace(process.cwd(), '.')} (use --force to overwrite)`,
      )
    } else if (stats.isDirectory()) {
      exitWithError(
        `Output path is a directory: ${out.replace(process.cwd(), '.')}`,
      )
    }
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      // file does not exist
    } else {
      exitWithError(err)
    }
  }
}
