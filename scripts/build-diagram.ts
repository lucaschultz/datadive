import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

import { Glob } from 'bun'

function exec(
  command: string,
  args: Array<string>,
  stdin?: string,
  cwd?: string,
) {
  return new Promise<Array<string>>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: [],
    })

    const output: Array<string> = []
    const errorMessage = `Unable to run command: '${command} ${args.join(' ')}'.`

    child.stdout.on('data', (data: Buffer) => {
      const lines = data
        .toString()
        .split('\n')
        .filter((line) => line.length > 0)

      output.push(...lines)
    })

    child.on('error', (error) => {
      reject(new Error(errorMessage, { cause: error }))
    })

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(errorMessage))

        return
      }

      resolve(output)
    })

    if (stdin) {
      child.stdin.write(stdin)
      child.stdin.end()
    }
  })
}

type VarValue = string | number | boolean | null | VarObject

interface VarObject {
  [key: string]: VarValue
}

function indent(str: string, level: number, indentation = ' ') {
  return str
    .split('\n')
    .map((line) => indentation.repeat(level) + line)
    .join('\n')
}

function varValueToString(value: VarValue, indentLevel = 0): string {
  if (typeof value === 'string') {
    return `"${value}"`
  }

  if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    value === null
  ) {
    return String(value)
  }

  const keys = Object.entries(value)
    .map(([key, val]) => `${key}: ${varValueToString(val, indentLevel)}`)
    .join('\n')

  return `{\n${indent(keys, indentLevel + 1)}\n}`
}

export interface D2Config {
  /**
   * The variables to use for the generated diagrams.
   * These will be prefixed to the first line of the diagram. If the diagram already
   * has a variables line, the variables will be merged by d2.
   * @see https://d2lang.com/tour/variables/
   */
  vars?: VarObject | undefined
  /**
   * Defines the fonts to use for the generated diagrams.
   * @see https://d2lang.com/tour/fonts/
   */
  fonts?:
    | {
        /**
         * The relative path from the project's root to the .ttf font file to use for the regular font.
         */
        regular?: string | undefined
        /**
         * The relative path from the project's root to the .ttf font file to use for the italic font.
         */
        italic?: string | undefined
        /**
         * The relative path from the project's root to the .ttf font file to use for the bold font.
         */
        bold?: string | undefined
      }
    | undefined
  /**
   * Defines the layout engine to use to generate the diagrams.
   * @default 'dagre'
   * @see https://d2lang.com/tour/layouts#layout-engines
   */
  layout?: 'dagre' | 'elk' | 'tala' | undefined
  /**
   * The name of the output directory containing the generated diagrams relative
   * to the current working directory.
   * @default 'd2'
   */
  output?: string | undefined
  /**
   * The padding (in pixels) around the rendered diagrams.
   * @default 100
   */
  pad?: number | undefined
  /**
   * Whether to render the diagrams as if they were sketched by hand.
   * @default false
   */
  sketch?: boolean | undefined
  /**
   * The themes to use for the generated diagrams.
   * @see https://d2lang.com/tour/themes
   */
  theme?:
    | {
        /**
         * The dark theme to use for the diagrams when the user's system preference is set to dark mode.
         * To disable the dark theme and have all diagrams look the same, set this option to `false`.
         * @default '200'
         * @see https://d2lang.com/tour/themes
         */
        dark?: string | false | undefined
        /**
         * The default theme to use for the diagrams.
         * @default '0'
         * @see https://d2lang.com/tour/themes
         */
        default?: string | undefined
      }
    | undefined
}

async function getD2Version() {
  try {
    const [version] = await exec('d2', ['--version'])

    if (!version || !/^v?\d+\.\d+\.\d+/.test(version)) {
      throw new Error(`Invalid D2 version, got '${String(version)}'.`)
    }

    return version
  } catch (error) {
    throw new Error('Failed to get D2 version.', { cause: error })
  }
}

const viewBoxRegex = /viewBox="\d+ \d+ (?<width>\d+) (?<height>\d+)"/

export async function isD2Installed() {
  try {
    await getD2Version()

    return true
  } catch {
    return false
  }
}

type D2Size =
  | {
      height: number
      width: number
    }
  | undefined

export async function getD2DiagramSize(diagramPath: string): Promise<D2Size> {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = await fs.readFile(diagramPath, 'utf8')
    const match = viewBoxRegex.exec(content)
    const { height, width } = match?.groups ?? {}

    if (!height || !width) {
      return
    }

    const computedHeight = Number.parseInt(height, 10)
    const computedWidth = Number.parseInt(width, 10)

    return { height: computedHeight, width: computedWidth }
  } catch (error) {
    throw new Error(`Failed to get D2 diagram size at '${diagramPath}'.`, {
      cause: error,
    })
  }
}

export async function generateD2Diagram(
  config: D2Config,
  input: string,
  outputPath: string,
  cwd = process.cwd(),
) {
  const extraArgs = []

  if (config.theme?.dark !== undefined && config.theme.dark !== false) {
    extraArgs.push(`--dark-theme=${config.theme.dark}`)
  }

  if (config.fonts?.regular) {
    extraArgs.push(`--font-regular=${path.relative(cwd, config.fonts.regular)}`)
  }

  if (config.fonts?.italic) {
    extraArgs.push(`--font-italic=${path.relative(cwd, config.fonts.italic)}`)
  }

  if (config.fonts?.bold) {
    extraArgs.push(`--font-bold=${path.relative(cwd, config.fonts.bold)}`)
  }

  if (config.vars) {
    const vars = varValueToString(config.vars)
    input = `vars: ${vars}\n\n${input}`
  }

  try {
    // The `-` argument is used to read from stdin instead of a file.
    await exec(
      'd2',
      [
        `--layout=${config.layout ?? 'dagre'}`,
        `--theme=${config.theme?.default ?? '0'}`,
        `--sketch=${config.sketch ? String(config.sketch) : 'false'}`,
        `--pad=${config.pad ? String(config.pad) : '100'}`,
        ...extraArgs,
        '-',
        outputPath,
      ],
      input,
      cwd,
    )
  } catch (error) {
    throw new Error('Failed to generate D2 diagram.', { cause: error })
  }

  return await getD2DiagramSize(outputPath)
}

async function getUniqueFileName(
  dir: string,
  basename: string,
  extension: string,
) {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const files = await fs.readdir(dir)

  let index = 0
  let fileName = `${basename}.${extension}`

  while (files.includes(fileName)) {
    index++
    fileName = `${basename}-${String(index)}.${extension}`
  }

  return fileName
}

const d2Glob = new Glob('**/*.d2')

type D2FromDirectoryConfig = D2Config & {
  /**
   * The directory to scan for D2 files.
   * @default '.''
   */
  source?: string | undefined
  /**
   * Whether to overwrite existing diagrams.
   * @default false
   */
  force?: boolean
  /**
   * The format to use for the generated diagrams.
   * @default 'svg'
   */
  format?: 'svg' | 'png'
  /**
   * Whether to log verbose output.
   * @default false
   */
  verbose?: boolean
}

async function generateD2DiagramsForDirectory(
  config: D2FromDirectoryConfig = {},
) {
  const source = config.source ?? '.'
  for await (const filePath of d2Glob.scan(source)) {
    if (config.verbose) {
      console.log(`🔄 Diagram found: ${filePath}`)
    }

    const fileDir = path.dirname(filePath)
    const fileName = path.basename(filePath, '.d2')

    const outputDir = config.output ?? fileDir
    const outputFileName = config.force
      ? `${fileName}.${config.format ?? 'svg'}`
      : await getUniqueFileName(outputDir, fileName, config.format ?? 'svg')
    const outputFilePath = path.join(outputDir, outputFileName)

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    const content = (await fs.readFile(path.join(source, filePath))).toString()
    const dimensions = await generateD2Diagram(
      config,
      content,
      outputFilePath,
      '.',
    )

    if (config.verbose) {
      console.log(
        `✅ Generated diagram: ${outputFilePath}${dimensions ? ` (${String(dimensions.width)}x${String(dimensions.height)})` : ''}`,
      )
    }
  }
}

const theme = '1'

const themeOverrides = {
  'd2-config': {
    'theme-overrides': {
      N1: '#141414',
      N2: '#141414',
      N4: '#ffffff',
      N5: '#ffffff',
      N7: '#ffffff',

      B1: '#2e2e2e',
      B2: '#2e2e2e',
      B3: '#cfcfcf',
      B4: '#e4e4e4',
      B5: '#f3f3f3',
      B6: '#fbfbfb',

      AA4: '#fbfbfb',
      AA5: '#ffffff',

      AB4: '#fbfbfb',
      AB5: '#ffffff',
    },
  },
}

await generateD2DiagramsForDirectory({
  vars: themeOverrides,
  source: 'thesis/img/diagrams',
  theme: { default: theme },
  force: true,
  output: 'thesis/img/diagrams',
  verbose: true,
  layout: 'tala',
  pad: 50,
})
