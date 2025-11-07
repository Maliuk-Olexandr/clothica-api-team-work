// import js from '@eslint/js';
// import globals from 'globals';
// import { defineConfig } from 'eslint/config';

// export default defineConfig([
//   {
//     files: ['**/*.{js,mjs,cjs}'],
//     plugins: { js },
//     extends: ['js/recommended'],
//     languageOptions: { globals: globals.node },
//     rules: {
//       semi: 'error',
//       'no-unused-vars': ['error', { args: 'none' }],
//       'no-undef': 'error',
//     },
//   },
// ]);
import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
// eslint-disable-next-line import/no-unresolved
import { defineConfig } from 'eslint/config';

export default defineConfig([
  js.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { import: importPlugin },
    languageOptions: { globals: globals.node },
    rules: {
      semi: ['error', 'always'],
      'no-unused-vars': ['error', { args: 'none' }],
      'no-undef': 'error',
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],
      'import/no-unresolved': 'error',
    },
  },
]);
