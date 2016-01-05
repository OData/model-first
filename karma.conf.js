'use strict';

module.exports = function(config) {
  config.set({
    frameworks:  ['jasmine'],

    files: [
      'bower_components/js-yaml/dist/js-yaml.min.js',
      'bower_components/yaml-js/yaml.min.js',
      'bower_components/yaml-worker/index.js',
      'src/morpho.js',
      'src/visitor.js',
      'src/index.js',
      'src/modules/*.js',
      'src/conventions/*.js',
      'test/modules/*.js',
    ],

    exclude: [],
    reporters: ['spec'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    port: 9001
  });
};
