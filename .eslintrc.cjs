module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'node_modules'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
  plugins: ['react-refresh', '@typescript-eslint', 'import'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
    ],
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Prevent features from importing from app
          {
            target: './src/features',
            from: './src/app',
            message: 'Features cannot import from app layer',
          },
          // Prevent features from importing from other features
          {
            target: './src/features/auth',
            from: './src/features/!(auth)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/partners',
            from: './src/features/!(partners)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/leads',
            from: './src/features/!(leads)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/dashboard',
            from: './src/features/!(dashboard)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/deals',
            from: './src/features/!(deals)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/import-export',
            from: './src/features/!(import-export)',
            message: 'Features cannot import from other features',
          },
          {
            target: './src/features/settings',
            from: './src/features/!(settings)',
            message: 'Features cannot import from other features',
          },
          // Prevent shared folders from importing from features/app
          {
            target: './src/components',
            from: './src/{features,app}',
            message: 'Shared components cannot import from features or app',
          },
          {
            target: './src/hooks',
            from: './src/{features,app}',
            message: 'Shared hooks cannot import from features or app',
          },
          {
            target: './src/utils',
            from: './src/{features,app}',
            message: 'Shared utils cannot import from features or app',
          },
          {
            target: './src/lib',
            from: './src/{features,app}',
            message: 'Shared lib cannot import from features or app',
          },
        ],
      },
    ],
  },
};
