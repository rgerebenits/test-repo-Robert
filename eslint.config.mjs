import js from '@eslint/js';
import globals from 'globals';
import pluginCypress from 'eslint-plugin-cypress';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  pluginCypress.configs.recommended,
  prettier,
  {
    files: ['cypress.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
  },
];
