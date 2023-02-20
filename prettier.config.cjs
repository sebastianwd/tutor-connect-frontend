/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  endOfLine: "lf",
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: "es5",
  lineWidth: 120,
};
