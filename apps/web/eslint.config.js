import { configs, defineConfig } from '@datadive/eslint'

export default defineConfig(
  ...configs.base,
  ...configs.react,
  ...configs.playwright,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
)
