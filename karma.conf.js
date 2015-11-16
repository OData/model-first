'use strict';

module.exports = function(config) {
  config.set({
    frameworks:  ['jasmine'],

    files: [
      'bower_components/js-yaml/dist/js-yaml.min.js',
      'src/morpho.js',
      'src/visitor.js',
      'src/modules/*.js',
      'src/conventions/*.js',
      'test/modules/*.js',
    ],

    exclude: [],
    reporters: ['spec'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Chrome'],
    singleRun: false
  });
};
