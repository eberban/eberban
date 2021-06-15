const path = require('path');

module.exports = {
  entry: './webpack/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../web/res'),
  },
  resolve: {
    alias: {
        jquery: "jquery/jquery.min.js"
    }
  }
};