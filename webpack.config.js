'use strict';

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var argv = require('minimist')(process.argv.slice(2));

var config = {
  devtool: 'source-map',

  entry: {
    frontend: ['./frontend.js'],
    cgtestjs: ['./cgtestjs.js']
  },

  output: {
    path: path.join(__dirname, 'public/javascript'),
    filename: '[name].bundle.js',
    sourcePrefix: '',
    publicPath: 'javascript/'
  },

  resolve: {
    extensions: ['', '.js', '.json'],
    root: __dirname,
    modulesDirectories: ['node_modules'],
    alias: {
        jquery: "jquery/src/jquery"
    }
  },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css')
  ],

  module: {
    loaders: [
      {
        test: '/.js$/',
        loader: 'eslint-loader',
        exclude: 'node_modules/'
      },
      {
        test: /test samples\\.*\.json$/,
        loader: 'file?name=../samples/[name].[ext]'
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
        exclude: /test samples\\.*\.json$/
      },
      { test: /\.css$/, 
        loader: ExtractTextPlugin.extract("style-loader", "css-loader") 
      },
      {
        test: /samples\\.*\.yaml$/,
        loader: 'file?name=../samples/[name].[ext]'
      },
      {
        test: /\.worker.js$/,
        loader: 'worker-loader',
        exclude: 'node_modules/'
      },
      {
        test: /simpleYamlWorker.js$/,
        loader: 'file?name=../dist/[name].[ext]'
      },
      {
        test: /\.png$/,
        loader: "url-loader",
        query: {mimetype: "image/png"}
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader'
      }
    ]
  }
};

// if --production is passed, uglify the code
if (argv.production) {
  console.info('This might take awhile ...');

  config.plugins.unshift(new webpack.optimize.UglifyJsPlugin({mangle: true}));
}

module.exports = config;
