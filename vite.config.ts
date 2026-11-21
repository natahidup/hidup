import { defineConfig } from 'vite-plus'

const ignored = [
  '.git/**',
  '.turbo/**',
  '.alchemy/**',
  '.wrangler/**',
  'node_modules/**',
  'dist/**',
  'coverage/**',
]

export default defineConfig({
  fmt: {
    // Generated from TypeScript — kept in sync by @nata/tokens tests.
    ignorePatterns: [...ignored, '**/*.d.ts', 'packages/tokens/tokens.css'],
    semi: false,
    singleQuote: true,
    trailingComma: 'all',
  },
  lint: {
    ignorePatterns: ignored,
    options: { typeAware: true, typeCheck: false },
    plugins: ['typescript', 'unicorn', 'oxc'],
    rules: {
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'typescript/no-explicit-any': 'error',
    },
  },
})
