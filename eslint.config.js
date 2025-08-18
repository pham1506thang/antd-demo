import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';
import pluginStyledComponentsA11y from 'eslint-plugin-styled-components-a11y';
import tseslint from 'typescript-eslint';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: { react: { version: '18.2' } },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      'styled-components-a11y': pluginStyledComponentsA11y,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Tắt yêu cầu import React trong React 18+
      'react/prop-types': 'off', // Tắt prop-types khi dùng TypeScript
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      quotes: ['error', 'single'],
      'no-unused-vars': 'warn', // Chuyển lỗi thành cảnh báo
      'no-undef': 'error',
    },
  },
];
