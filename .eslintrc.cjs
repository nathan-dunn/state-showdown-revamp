module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'no-useless-concat': 'off',
    'no-useless-constructor': 'warn',
    eqeqeq: 'off',
    'no-unused-vars': 'warn',
    'react/jsx-pascal-case': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
