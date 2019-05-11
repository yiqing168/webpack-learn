const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: "production",
  entry: {
    vendors: ['react', 'react-dom', 'lodash']
  },
  output: {
    path: path.resolve(__dirname, "../dll"),
    filename: "[name].dll.js",
    library: '[name]',                                  // 打包库文件
    libraryTarget: 'umd'                                //支持通用模块引入 
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.DllPlugin({
      name: "[name]",
      path: path.join(__dirname, "../dll/manifest.json"),
    })
  ]
}

