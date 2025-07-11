module.exports = {
  bracketSpacing: false,
  jsxBracketSameLine: true,
  singleQuote: true,
  trailingComma: 'none',
  arrowParens: 'avoid',
  tabWidth: 2,
  semi: false,
  importOrder: [
    '^react',
    '^redux',
    '^recompose$',
    '^lodash',
    '^moment',

    '^@react-navigation$',
    '^@react-navigation',

    '^locales/use-translation$',

    '^stores$',
    '^stores',

    '^screens$',
    '^screens',

    '<THIRD_PARTY_MODULES>',

    '^@.navigation*',

    '^@.*',

    '^[./]'
  ],
  importOrderSortSpecifiers: true
}
