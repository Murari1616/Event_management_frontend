const globals = require('globals');
const js = require('@eslint/js');
const pluginNode = require('eslint-plugin-node');

module.exports = [
  js.configs.recommended, // ESLint Recommended Rules
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "script", 
      },
    },
    plugins: {
      node: pluginNode,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-console': 'off',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(req|res|next)$',
        },
      ],
    },
  },
];
