/* eslint-disable security/detect-non-literal-fs-filename */

import type { PackageJson } from 'pkg-types'

import * as fs from 'fs'
import * as path from 'path'

/**
 * Function to read and parse the root package.json
 * @param cwd the current working directory
 * @returns the root package.json in the workspace.
 */
function getRootPackageJson(cwd: string): PackageJson {
  const rootPackageJsonPath = path.resolve(cwd, 'package.json')
  const rootPackageJson = JSON.parse(
    fs.readFileSync(rootPackageJsonPath, 'utf-8'),
  ) as PackageJson
  return rootPackageJson
}

/**
 * Function to get all workspace package paths.
 * @param workspaces the workspaces defined in the root package.json.
 * @returns an array of all workspace package paths.
 */
function getWorkspacePackagePaths(workspaces: Array<string>): Array<string> {
  const workspacePackagePaths: Array<string> = []

  workspaces.forEach((workspacePattern) => {
    const workspaceDirs = workspacePattern.replace(/\/\*$/, '')
    const absolutePath = path.resolve(process.cwd(), workspaceDirs)
    const packages = fs
      .readdirSync(absolutePath)
      .map((pkgDir) => path.join(workspaceDirs, pkgDir))
      .filter((pkgPath) => fs.existsSync(path.join(pkgPath, 'package.json'))) // Filter only directories with package.json
    workspacePackagePaths.push(...packages)
  })

  return workspacePackagePaths
}

/**
 * Function to get package names from package.json files
 * @param packagePaths an array of package paths
 * @returns an array of package names
 */
function getPackageNamesFromPaths(packagePaths: Array<string>): Array<string> {
  const packageNames = packagePaths
    .map((pkgPath) => {
      const packageJsonPath = path.join(pkgPath, 'package.json')
      const packageJson = JSON.parse(
        fs.readFileSync(packageJsonPath, 'utf-8'),
      ) as PackageJson
      return packageJson.name
    })
    .filter((name): name is string => !!name) // Filter out undefined names

  return packageNames
}

/**
 * Function to get all workspace package names
 * @param cwd the current working directory
 * @returns an array of all workspace package names
 */
export function getWorkspacePackageNames(cwd: string): Array<string> {
  const rootPackageJson = getRootPackageJson(cwd)
  if (!rootPackageJson.workspaces) {
    throw new Error('No workspaces defined in the root package.json')
  }

  const workspacePackagePaths = getWorkspacePackagePaths(
    rootPackageJson.workspaces,
  )
  const packageNames = getPackageNamesFromPaths(workspacePackagePaths)

  return [
    ...packageNames,
    ...(rootPackageJson.name ? [rootPackageJson.name] : []),
  ]
}

/* eslint-enable security/detect-non-literal-fs-filename */
