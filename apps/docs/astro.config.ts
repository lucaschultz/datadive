import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'
import starlightUtils from '@lorenzo_lewis/starlight-utils'
import { defineConfig } from 'astro/config'

import { citationIntegration } from './integrations/citation-integration'

// https://astro.build/config
export default defineConfig({
  site: 'https://docs.datadive.app',
  integrations: [
    citationIntegration({
      citationsFile: 'src/assets/works-cited.txt',
      outputDir: 'src/content/docs/thesis',
      sortCitations: true,
      citationPageFrontmatter: {
        author: 'Luca Schultz',
        description: 'Works cited in the Datadive thesis',
        sidebar: {
          order: 11,
        },
      },
    }),
    starlightUtils(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    starlight({
      title: 'Datadive Docs',
      customCss: ['./src/styles/tailwind.css'],
      social: {
        github: 'https://github.com/withastro/starlight',
      },
      sidebar: [
        {
          slug: 'about',
        },
        {
          label: 'Thesis',
          autogenerate: {
            directory: 'thesis',
            collapsed: false,
          },
        },
        {
          label: 'Datadive API',
          collapsed: true,
          items: [
            {
              label: 'Specification',
              link: '/spec',
            },
            {
              label: 'OpenAPI (JSON)',
              link: '/openapi.json',
            },
            {
              label: 'OpenAPI (YAML)',
              link: '/openapi.yml',
            },
          ],
        },
      ],
    }),
  ],
})
