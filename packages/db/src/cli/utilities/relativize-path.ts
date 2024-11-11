/**
 * Relativize a path to the current working directory if it is absolute and is
 * within the current working directory, otherwise return the path as is.
 * @param path - The path to relativize
 * @returns The relativized path
 */
export function relativizePath(path: string): string {
  return path.replace(process.cwd(), '.')
}
