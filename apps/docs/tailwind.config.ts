import type { Config } from 'tailwindcss'

import starlightPlugin from '@astrojs/starlight-tailwind'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx,astro}'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [starlightPlugin()],
}

export default config
