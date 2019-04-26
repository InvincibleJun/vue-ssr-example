const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const VueSSRClientPlugin = require('./vue/client');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebPackBar = require('webpackbar');
const path = require('path');
const isProd = process.env.NODE_ENV === 'production';

let config = merge(baseConfig, {
  context: path.resolve(__dirname, '../'),

  entry: {
    app: './client/entry-client.js'
  },
  optimization: isProd
    ? {
        splitChunks: {
          cacheGroups: {
            commons: {
              chunks: 'initial',
              minChunks: 2,
              maxInitialRequests: 5,
              minSize: 0
            },
            vendor: {
              // 将第三方模块提取出来
              test: /node_modules/,
              chunks: 'initial',
              name: 'vendor',
              priority: 10,
              enforce: true
            },
            styles: {
              name: 'styles',
              // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/113#issuecomment-400083706
              test: module =>
                module.nameForCondition &&
                /\.(s?css|vue)$/.test(module.nameForCondition()) &&
                !/^javascript/.test(module.type),
              chunks: 'all',
              enforce: true,
              priority: 100,
              minChunks: 1,
              reuseExistingChunk: true
            }
          }
        },
        minimizer: [
          new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessorOptions: {
              safe: true,
              autoprefixer: {
                disable: true
              },
              mergeLonghand: false,
              discardComments: {
                removeAll: true
              }
            },
            canPrint: true
          })
        ]
      }
    : {},
  plugins: [
    new WebPackBar({
      name: 'client',
      color: 'orange',
      profile: false,
      compiledIn: false
    }),

    // new webpack.optimize.ModuleConcatenationPlugin(),

    new VueSSRClientPlugin(),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV,
        VUE_ENV: 'client'
      })
    })
  ]
});

module.exports = config;
