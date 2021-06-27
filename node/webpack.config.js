const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    parser: './webpack/parser.js',
    root_generator: './webpack/root_generator.js',
    dictionary: './webpack/dictionary.js',
  },
  output: {
    library: 'bundle',
    filename: 'wp_[name].js',
    path: path.resolve(__dirname, '../web/res'),
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      }
    ]
  }
};