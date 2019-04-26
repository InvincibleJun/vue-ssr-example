const path = require('path');
const webpack = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WarnFixPlugin = require('./warnFixPlugin');
const isClient = process.env.VUE_ENV === 'client';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: 'production',

  output: {
    filename: 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: '/',
    path: path.resolve(__dirname, '../dist')
  },

  externals: [],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },

      // font
      {
        test: /\.(woff2?|eot|ttf|oft)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'fonts/[name].[hash].[ext]'
        }
      },
      // img
      {
        test: /\.(gif|svg|jpe?g|png)\??.*$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          name: 'images/[name].[hash].[ext]'
        }
      },
      // css
      {
        test: /\.(css|scss|sass|less)$/,
        use: [
          // This plugin should be used only on production builds without style-loader in the loaders
          // chain, especially if you want to have HMR in development.
          isProd && isClient ? MiniCssExtractPlugin.loader : 'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: loader => [
                require('postcss-import')(),
                // require('autoprefixer')(),
                require('postcss-cssnext')()
              ]
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // 根路径
      '@': path.resolve(__dirname, '../client')
    }
  },
  plugins: [
    // new webpack.ProvidePlugin({
    // 'window.CKEDITOR': 'CKEDITOR'
    // }),
    new VueLoaderPlugin(),
    new WarnFixPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    })
  ]
};
