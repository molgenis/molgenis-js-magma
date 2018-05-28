var path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/magma-script-evaluator.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'magma-script-evaluator.js',
    library: 'magma-script-evaluator',
    libraryTarget: 'commonjs'
  },
  plugins: [
    new UglifyJsPlugin({
      sourceMap: false
    })
  ],
  externals: {
    moment: {
      commonjs: 'moment'
    },
    mathjs: {
      commonjs: 'mathjs'
    }
  }
}