'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'test/**/*.js',
                'app/**/*.js',
                '!src/index.js',
                '!bower_components/**',
                '!app/bower_components/**'
            ]
        },
        karma: {
            dev: {
                configFile: 'karma.dev.conf.js',
            },
            build: {
                configFile: 'karma.conf.js',
            }
        },
        copy: {
            dist: {
                files: [
                    {expand: true, cwd: 'app', src: ['index.ejs'], dest: 'views/'},
					{expand: true, cwd: 'app/css', src: ['*.css'], dest: 'public/stylesheets/'},
                    {expand: true, cwd: 'doc/samples', src: ['*.yaml'], dest: 'public/samples/'}
                ],
            },
            config: {
                src: 'app/scripts/config.js',
                dest: 'public/javascripts/config.js',
                options: {
                    process: function (content, srcpath) {
                        var distCopy = require('./distCopy');
                        return distCopy.updateSamples(content);
                    }
                }
            }
        },
        clean: {
			dist: [
				'public/bower_components/*', 
				'public/samples/todo-minimal.yaml',
				'public/samples/trippin.yaml',
				'public/stylesheets/codemirror-mf.css', 
				'public/stylesheets/demo.css', 
				'public/javascripts/app.js',
				'public/javascripts/config.js',
				'public/javascripts/lib.js',
				'views/index.ejs'
			]
        },
        useminPrepare: {
            html: 'views/index.ejs',
            options: {
                dest: 'public',
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
            html: 'views/index.ejs'
        },
        uglify: {
            options: {
                mangle: false
            },
            simpleYamlWorker: {
                files: {
                    'public/bower_components/morpho/src/index.js': ['src/index.js']
                }
            }
        },
        execute: {
            target: {
                src: ['src/codegen/app.js']
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-execute');

    grunt.registerTask('default', ['karma:build', 'jshint']);
    grunt.registerTask('tdd', ['karma:dev']);
    grunt.registerTask('build', [
        'clean:dist',
        'copy:dist',
        'copy:config',
        'useminPrepare',
        'concat:generated',
        'uglify',
        'usemin'
    ]);
    grunt.registerTask('server', [
        'build',
        'execute',
    ]);
};
