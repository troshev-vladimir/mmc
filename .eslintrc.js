module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    "@typescript-eslint",
  ],
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/camelcase": ["warn"],
  }
}
