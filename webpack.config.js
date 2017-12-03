module.exports = {
  entry: './client/index.js',
  output: {
    filename: './client-dist/bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' }
    ]
  }
}
