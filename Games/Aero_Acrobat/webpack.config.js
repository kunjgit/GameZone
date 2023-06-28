var path = require('path');

module.exports = {
  entry: "./lib/rise_to_the_skies.js",
  output: {
    filename: "./lib/bundle.js"
  },
  devtool: 'source-map',
  resolve: {
    extensions: [".js", '.jsx', "*"]
  }
};
