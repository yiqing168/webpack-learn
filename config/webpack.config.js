const path = require("path");
const webpack = require('webpack');
const merge = require("webpack-merge");
const commConfig = require("./webpack.comm.js");

let devConfig = {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, "../client"),
    hot: true,
    port: 3000,
    compress: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

module.exports = merge(commConfig, devConfig);