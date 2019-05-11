const webpack = require('webpack');
const commConfig = require("./webpack.comm.js");
const merge = require("webpack-merge");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const prodConfig = {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ],
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: "runtime"
    },
    minimizer: [
      // 压缩js
      new TerserJSPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: false,
      }),
      // 压缩css
      new OptimizeCSSAssetsPlugin({})
    ],
    splitChunks: {
      chunks: "all",
      minSize: 20000,                      //代码块最小大小
      minChunks: 1,                        //最少出现次数
      maxAsyncRequests: 5,                 //异步最大加载数
      maxInitialRequests: 3,               //初次加载数
      automaticNameDelimiter: '~',         //文件名称联接符
      name: true,
      cacheGroups: {                       //缓存组
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,                   //优先组
          minSize: 30000,
          minChunks: 1,
        },
        // 'vendor-react': {
        //   test: /react/,                    // react 单独打包   已使用 dll 此处仅为说明用法
        //   chunks: "initial",
        //   name: "vendor-react",
        //   enforce: true,                    //优先
        // },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
}

module.exports = merge(commConfig("production"), prodConfig);