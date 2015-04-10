'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc:   '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'lib/**/*.js',
        'test/**/*.js'
      ]
    },

    karma: {
      dev:{
        configFile: 'karma.conf.js',
        singleRun: false
      },
      build: {
        configFile: 'karma.conf.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');

  grunt.registerTask('default', ['karma:build', 'jshint']);
  grunt.registerTask('tdd', ['karma:dev']);
};
