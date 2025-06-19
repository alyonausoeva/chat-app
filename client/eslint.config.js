import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11yPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react-refresh/only-export-components': 'warn',

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],
      '@typescript-eslint/no-use-before-define': ['error'],
      '@typescript-eslint/no-var-requires': 'off',

      'no-use-before-define': 'off',
      'no-restricted-globals': 'warn',
      'no-case-declarations': 'off',
      'no-tabs': 'off',
      'camelcase': 'off',
      'eqeqeq': 'off',
      'linebreak-style': 'off',
      'consistent-return': 'off',
      'class-methods-use-this': 'off',
      'object-curly-newline': 'off',
      'id-length': ['warn', { min: 1 }],
      'arrow-parens': 'off',
      'max-len': ['warn', 200, 2, { ignoreUrls: true }],
      'implicit-arrow-linebreak': 'off',

      'react/jsx-filename-extension': ['warn', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
      'react/jsx-props-no-spreading': 'off',
      'react/require-default-props': 'off',
      'react/forbid-prop-types': ['error', { forbid: ['any'] }],
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',

      'import/extensions': 'off',
      'import/no-unresolved': 'off',
      'import/prefer-default-export': 'off',
      'import/no-extraneous-dependencies': 'off',
      'import/no-useless-path-segments': ['error', { noUselessIndex: true }],
      'import/no-duplicates': 'error',
      'import/no-cycle': 'off',
      'import/no-self-import': 'off',
      'import/no-named-as-default': 'off',
      'import/no-named-as-default-member': 'off',

      'prettier/prettier': 'warn',

      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',
    },
  },
];