const path = require('path');

module.exports = {
  mode: 'development',
  entry: './webpack/parser.js',
  output: {
    library: 'bundle',
    filename: 'parser.js',
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