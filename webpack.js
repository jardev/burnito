var webpack = require('webpack')

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      './application'
    ]
  },
  output: {
    filename: './build/bundle.js'
  },
  devServer: {
    publicPath: '/',
    contentBase: './build',
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { presets: ['es2015', 'react'] }
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      }
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({ fetch: 'imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch' }),
    new webpack.NoEmitOnErrorsPlugin()
  ]
}
