const path = require('path')
const webpack =  require('webpack')

module.exports = {
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "dist/assets"),
    filename: "bundle.js",
    sourceMapFilename: 'bundle.map'
  },
  devtool: '#source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_models)/,
        loader: 'babel-loader',
        query: {
            presets: ['env', 'stage-0', 'react']
        }
      }
    ]
  },
  mode: "development"
}
