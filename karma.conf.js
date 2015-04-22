'use strict';

module.exports = function(config) {
  config.set({
    frameworks:  ['jasmine'],

    files: [
      'app/bower_components/yaml-js/yaml.min.js',
      'src/morpho.js',
      'src/visitor.js',
      'src/modules/*.js',
      'test/modules/*.js',
    ],

    exclude: [],
    reporters: ['spec'],
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true
  });
};
