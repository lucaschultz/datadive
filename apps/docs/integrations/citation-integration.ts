import type { AstroIntegration, RehypePlugins } from 'astro'

import { readFile, writeFile } from 'fs/promises'
import path from 'path'

import { ok, ResultAsync, safeTry } from 'neverthrow'
import { visit } from 'unist-util-visit'
import * as YAML from 'yaml'

interface Citation {
  key: string
  content: string
}

function parseCitations(sourceText: string): Array<Citation> {
  const lines = sourceText.split('\n').filter((line) => line.trim().length > 0)

  return lines.map((line) => {
    const match = /\[(#[^\]]+)\]:\s*(.+)/.exec(line)

    if (!match) {
      throw new Error(`Invalid citation format in line: ${line}`)
    }

    const [, key, content] = match

    if (!key || !content) {
      throw new Error(`Invalid citation format in line: ${line}`)
    }

    return {
      key: key.trim(),
      content: content.trim(),
    }
  })
}

interface NavigationConfig {
  link?: string | undefined
  label?: undefined
}

interface BadgeConfig {
  text: string
  variant?: 'note' | 'tip' | 'caution' | 'danger' | 'success' | 'default'
  class?: string
}

interface SidebarConfig {
  label?: string
  order?: number
  hidden?: boolean
  badge?: string | BadgeConfig
  attrs?: { [key: string]: string | number | boolean | undefined }
}

interface CitationPageFrontmatter {
  title?: string | undefined
  sidebar?: SidebarConfig | undefined
  slug?: string | undefined
  prev?: boolean | string | NavigationConfig | undefined
  next?: boolean | string | NavigationConfig | undefined
  pagefind?: boolean | undefined
  description?: string | undefined
  editUrl?: string | undefined
}

function worksCitedTemplate(
  citations: string,
  frontmatter: CitationPageFrontmatter,
): string {
  return `---
${YAML.stringify(frontmatter)}
---

<!-- This file is generated by the citation integration. Do not edit manually. -->

${citations}

<!-- This file is generated by the citation integration. Do not edit manually. -->
`
}

function renderCitationsPage(
  citations: Array<Citation>,
  frontmatter: CitationPageFrontmatter,
): string {
  const renderedCitations = citations
    .map(({ content }, index) => {
      return `${(index + 1).toString()}. ${content}`
    })
    .join('\n')

  return worksCitedTemplate(renderedCitations, frontmatter)
}

interface ReadFileError {
  code: 'read_file'
  cause: Error
}

const safeReadFile = ResultAsync.fromThrowable(
  readFile,
  (err): ReadFileError => {
    if (!(err instanceof Error)) {
      return {
        code: 'read_file',
        cause: new Error('Error reading file', {
          cause: err,
        }),
      }
    }

    return {
      code: 'read_file',
      cause: err,
    }
  },
)

interface WriteFileError {
  code: 'write_file'
  cause: Error
}

const safeWriteFile = ResultAsync.fromThrowable(
  writeFile,
  (originalError): WriteFileError => {
    if (!(originalError instanceof Error)) {
      return {
        code: 'write_file',
        cause: new Error('Error writing file', {
          cause: originalError,
        }),
      }
    }

    return {
      code: 'write_file',
      cause: originalError,
    }
  },
)

type RehypePlugin = Exclude<RehypePlugins[number], string | Array<unknown>>

function citationRehypePlugin(citations: Array<Citation>): RehypePlugin {
  return () => {
    return (tree) => {
      visit(tree, 'text', (node) => {
        node.value.match(/\[\]\[#\S+\]/g)?.forEach((match) => {
          const citeKey = match.slice(3, -1)
          const citationIndex = citations.findIndex(
            (citation) => citation.key === citeKey,
          )

          if (citationIndex === -1) {
            node.value = node.value.replace(match, `[${citeKey}]`)
          }

          node.value = node.value.replace(
            match,
            `[${(citationIndex + 1).toString()}]`,
          )

          return
        })
      })
    }
  }
}

export function citationIntegration(config: {
  citationsFile: string
  outputDir: string
  sortCitations?: boolean
  citationPageFrontmatter?: CitationPageFrontmatter
}): AstroIntegration {
  return {
    name: 'create-citations',
    hooks: {
      'astro:config:setup': async ({ logger, addWatchFile, updateConfig }) => {
        const result = await safeTry(async function* () {
          const citationsPath = path.resolve(config.citationsFile)

          addWatchFile(citationsPath)

          logger.debug(`Reading citations from ${citationsPath}`)
          const sourceText = yield* safeReadFile(citationsPath).safeUnwrap()
          const citations = parseCitations(sourceText.toString())

          if (config.sortCitations) {
            citations.sort((a, b) => a.content.localeCompare(b.content))
          }

          logger.debug('Updating markdown config with citation rehype plugin')
          updateConfig({
            markdown: {
              rehypePlugins: [citationRehypePlugin(citations)],
            },
          })

          const frontmatter: CitationPageFrontmatter = {
            ...config.citationPageFrontmatter,
            title: config.citationPageFrontmatter?.title ?? 'Works Cited',
            slug: config.citationPageFrontmatter?.slug ?? 'works-cited',
          }

          const citationPage = renderCitationsPage(citations, frontmatter)
          const outputPath = path.resolve(
            path.join(config.outputDir, 'works-cited.generated.md'),
          )
          logger.debug(`Writing rendered citations to ${outputPath}`)
          yield* safeWriteFile(outputPath, citationPage, 'utf-8').safeUnwrap()

          return ok(undefined)
        })

        if (result.isErr()) {
          switch (result.error.code) {
            case 'read_file':
              logger.error(
                `Error reading citations file: ${result.error.cause.message}`,
              )
              break
            case 'write_file':
              logger.error(
                `Error writing rendered citations: ${result.error.cause.message}`,
              )
              break
          }
        }

        logger.info('Successfully created works cited markdown file')
      },
    },
  }
}