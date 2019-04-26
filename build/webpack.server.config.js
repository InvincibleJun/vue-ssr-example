const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.js');
const VueSSRServerPlugin = require('./vue/server');
const merge = require('webpack-merge');
const WebPackBar = require('webpackbar');

module.exports = merge(baseConfig, {
  context: path.resolve(__dirname, '../'),

  entry: './client/entry-server.js',

  output: {
    libraryTarget: 'commonjs2',
    filename: 'server-bundle.js'
  },

  target: 'node',

  devtool: 'source-map',

  plugins: [
    new WebPackBar({
      name: 'server',
      color: 'green',
      compiledIn: false,
      profile: false
    }),

    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV,
        VUE_ENV: 'server'
      })
    }),

    new VueSSRServerPlugin()
  ],

  externals: nodeExternals({
    whitelist: /\.css$/
  })
});
