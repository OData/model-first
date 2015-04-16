'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc:   '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js'
      ]
    },

    karma: {
      dev:{
        configFile: 'karma.conf.js',
      },
      build: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    copy: {
      dist: {
        files: [
          {expand: true, cwd:'app', src: ['index.html','css/*'], dest: 'dist/'},
        ],
      },
    },

    clean: {
      dist: ['dist/*', '.tmp/']
    },

    useminPrepare: {
      html: 'dist/index.html',
      options: {
        dest: 'dist',
        root: 'app',
        flow: {
          html: {
            steps: {
              js: ['concat'],
              css: ['concat']
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: 'dist/index.html'
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-usemin');

  grunt.registerTask('default', ['karma:build', 'jshint']);
  grunt.registerTask('tdd', ['karma:dev']);
  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'useminPrepare',
    'concat:generated',
    //'cssmin:generated',
    //'uglify:generated',
    //'filerev',
    'usemin'
  ]);
};
