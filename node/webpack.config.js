const path = require('path');

module.exports = {
  mode: 'development',
  entry: './webpack/index.js',
  output: {
    library: 'bundle',
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../web/res'),
  },
};