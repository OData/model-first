// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

var path = require("path");

var webpackConfig = require('../webpack.config.js');

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '.',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
    'index.js',
    ],

    // list of files / patterns to exclude
    //exclude: [],

    // Process test fies with webpack so require statements work in them
    preprocessors: {
      'index.js': ['webpack'],
    },

    // Use a better looking test reporter
    reporters: ['spec'],

    // enable webpack
    webpack: {
      module: {
        loaders: webpackConfig.module.loaders
      },
      output:{
        sourcePrefix: ''
      },
      resolve: {
        root: [
          __dirname,
          path.join(__dirname, '../')
        ]
      },
    },

    // Configuarion of webpackMiddleware
    webpackMiddleware: {
      quiet: true,
      progress: true,
      noInfo: true
    },

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],
    singleRun: true,
    port: 8080
  });
};
