const docGen = require('react-docgen-typescript');

module.exports = {
  components: 'src/components/**/*.tsx',

  showSidebar: false,
  exampleMode: 'expand',
  usageMode: 'expand',

  styleguideDir: 'docs',

  propsParser: docGen.withCustomConfig('./tsconfig.json').parse,
};
