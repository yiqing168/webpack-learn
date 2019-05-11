const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require("webpack");
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

//路径设置
const configPath = {
  // 打包入口
  entryPath: path.resolve(__dirname, "../src/index.js"),
  // 打包出口
  outputPath: path.resolve(__dirname, "../client")
}

/**
 * wwebpack 公共配置
 */
module.exports = function (webpackEnv) {

  //环境区分
  const isEnvDevelopment = webpackEnv === 'development';
  const isEnvProduction = webpackEnv === 'production';

  // 处理css 
  const getStyleLoaders = (cssOptions, isLess) => {
    const config = [
      isEnvProduction ? {
        loader: MiniCssExtractPlugin.loader,
        options: {
          publicPath: '../',
        },
      } : 'style-loader',
      {
        loader: 'css-loader',
        options: cssOptions,
      },
      {
        loader: 'postcss-loader',
        options: {
          config: {
            path: path.resolve(__dirname, "../postcss.config.js"),
          }
        }
      }
    ]
    return config;
  };

  return {
    mode: isEnvProduction ? 'production' : 'development',
    entry: {
      index: configPath.entryPath
    },
    output: {
      path: configPath.outputPath,
      // 生产环境配置 contenthash 
      filename: isEnvProduction ? 'static/js/[name].[contenthash:8].js' : 'static/js/bundle.js',
      chunkFilename: isEnvProduction ? 'static/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
    },
    resolve: {
      alias: {
        // 使用别名 简写
        '@': path.resolve(__dirname, "../src")
      }
    },
    // 开发环境使用devtool  生产环境为了不影响打包速度 去除
    devtool: isEnvDevelopment ? 'cheap-module-source-map' : undefined,
    // loader配置 
    module: {
      rules: [
        {
          test: /\.(jpg|png|gif|jpeg)/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10240,
                name: 'static/image/[name].[hash:8].[ext]',
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                limit: 10240,
                name: 'static/file/[name].[hash:8].[ext]',
              }
            }
          ]
        },
        {
          test: /\.css/,
          use: getStyleLoaders({
            importLoaders: 1
          })
        },
        {
          test: /\.less/,
          use: getStyleLoaders({
            importLoaders: 2
          }, true)
        },
        {
          test: /\.(js|jsx)$/,
          //把对.js 的文件处理交给id为happyBabel 的HappyPack 的实例执行
          loader: 'happypack/loader?id=happyBabel',
          //排除node_modules 目录下的文件
          exclude: /node_modules/
        },
      ]
    },
    // 插件配置
    plugins: [
      // 清除目录
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin(
        Object.assign({}, {
          title: "首页",
          inject: 'body',
          template: path.resolve(__dirname, "../src/index.html")
        },
          // 生产优化
          isEnvProduction ? {
            minify: {
              removeComments: true,
              collapseWhitespace: true,
              removeRedundantAttributes: true,
              useShortDoctype: true,
              removeEmptyAttributes: true,
              removeStyleLinkTypeAttributes: true,
              keepClosingSlash: true,
              minifyJS: true,
              minifyCSS: true,
              minifyURLs: true,
            },
          } : undefined
        )
      ),
      isEnvProduction && new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
      }),
      isEnvProduction && new AddAssetHtmlPlugin({ filepath: require.resolve('../dll/vendors.dll.js') }),
      isEnvProduction && new webpack.DllReferencePlugin({
        manifest: require("../dll/manifest.json")
      }),
      new HappyPack({
        //用id来标识 happypack处理那里类文件
        id: 'happyBabel',
        //如何处理  用法和loader 的配置一样
        loaders: [{
          loader: 'babel-loader',
        }],
        //共享进程池
        threadPool: happyThreadPool,
        //允许 HappyPack 输出日志
        verbose: true,
      })
    ].filter(Boolean)
  }
}
