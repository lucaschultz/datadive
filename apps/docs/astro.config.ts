import react from '@astrojs/react'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'
import starlightUtils from '@lorenzo_lewis/starlight-utils'
import astroD2 from 'astro-d2'
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
    }),
    starlightUtils(),
    astroD2({ layout: 'tala' }),
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
      ],
    }),
  ],
})
