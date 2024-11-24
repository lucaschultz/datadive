import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

import { defineCommand } from 'citty'
import consola from 'consola'

import { generateKey } from '@datadive/utils/node'

import { exitWithError } from '../arguments/exit-with-error'
import { relativizePath } from '../utilities/relativize-path'

export function extractEnvVariable(variableName: string, content: string) {
  const lines = content.split('\n')

  return lines.reduce<
    { value: string; replaceWith: (appKey: string) => string } | undefined
  >((result, line, index) => {
    if (result) {
      return result
    }

    const splitResults = line.split('=')
    const key = splitResults[0]?.trim()
    let value = splitResults[1]?.trim()

    if (key !== variableName || value === undefined) {
      return undefined
    }

    if (value.startsWith("'") || value.startsWith('"')) {
      value = value.slice(1)
    }

    if (value.endsWith("'") || value.endsWith('"')) {
      value = value.slice(0, -1)
    }

    return {
      value: value,
      replaceWith: (value: string) => {
        const newLines = [...lines]
        newLines.splice(index, 1, `${variableName}=${value}`)

        return newLines.join('\n')
      },
    }
  }, undefined)
}

export const makeAppkeyCommand = defineCommand({
  meta: {
    name: 'make:appkey',
    description: 'Generate a new app key',
  },
  args: {
    env: {
      type: 'string',
      description:
        'The env file to write the generated APP_KEY to, if not provided, the key will be printed to the console',
      valueHint: 'path',
      alias: 'e',
      required: false,
    },
    force: {
      type: 'boolean',
      description: 'Overwrite the APP_KEY in the env file if it already exists',
      alias: 'f',
      required: false,
    },
  },
  async run({ args }) {
    const appKey = generateKey()

    if (!args.env) {
      consola.success(`Generated app key: ${appKey}`)
      return
    }

    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      const content = (await readFile(args.env)).toString()
      const existingAppKey = extractEnvVariable('APP_KEY', content)

      if (existingAppKey) {
        if (!args.force) {
          exitWithError(
            `The file already contains an APP_KEY: ${relativizePath(args.env)} (use --force to overwrite)`,
          )
        }

        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await writeFile(args.env, existingAppKey.replaceWith(appKey), {
          flag: 'w',
        })
        consola.success(`App key updated in ${args.env}`)
        return
      }

      // eslint-disable-next-line security/detect-non-literal-fs-filename
      await writeFile(args.env, `APP_KEY=${appKey}\n${content}`, { flag: 'w' })
      consola.success(`App key written to ${relativizePath(args.env)}`)
    } catch (err) {
      if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await mkdir(path.dirname(args.env), { recursive: true })
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await writeFile(args.env, `APP_KEY=${appKey}\n`)
        consola.success(`App key written to ${relativizePath(args.env)}`)
      } else {
        exitWithError(err)
      }
    }
  },
})
