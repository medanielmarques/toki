/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: 'always',
  printWidth: 80,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: false,
  trailingComma: 'all',
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
}
