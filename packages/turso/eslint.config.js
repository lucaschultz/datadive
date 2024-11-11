import { configs, defineConfig } from '@datadive/eslint'

export default defineConfig(
  ...configs.base,

  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    // Ignore all files that end with `.test.ts` or `.spec.ts`
    ignores: ['**/*.generated.*'],
  },
)
