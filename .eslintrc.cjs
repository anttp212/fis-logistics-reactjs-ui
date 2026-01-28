module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'eslint-config-prettier',
    'prettier'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'prettier', 'react'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/no-unknown-property': ['error', { ignore: [] }],
    'no-console': ['error', { allow: ['info', 'error'] }],
    'prettier/prettier': [
      'warn',
      {
        arrowParens: 'always',
        semi: false,
        trailingComma: 'none',
        tabWidth: 2,
        endOfLine: 'auto',
        useTabs: false,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: true
      }
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        args: 'all',
        argsIgnorePattern: '^_',
        caughtErrors: 'all',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'property',
        format: ['camelCase', 'PascalCase', 'snake_case'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'class',
        format: ['PascalCase']
      },
      {
        selector: 'method',
        format: ['camelCase']
      },
      {
        selector: 'parameter',
        format: ['camelCase', 'PascalCase'],
        leadingUnderscore: 'allow'
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^[A-Z]?[a-zA-Z0-9]*I$',
          match: true
        }
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^[A-Z]?[a-zA-Z0-9]*T$',
          match: true
        }
      },
      {
        selector: 'enum',
        format: ['PascalCase'],
        custom: {
          regex: '^[A-Z]?[a-zA-Z0-9]*E$',
          match: true
        }
      },
      {
        selector: 'enumMember',
        format: ['UPPER_CASE']
      }
    ]
  }
}
