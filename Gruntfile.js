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
                    {expand: true, cwd: 'app', src: ['index.html', 'css/*'], dest: 'dist/'},
                    {expand: true, cwd: 'doc/samples', src: ['*.yaml'], dest: 'dist/samples/'},
                ],
            },
            config: {
                src: 'app/scripts/config.js',
                dest: 'dist/scripts/config.js',
                options: {
                    process: function (content, srcpath) {
                        var distCopy = require('./distCopy');
                        return distCopy.updateSamples(content);
                    }
                }
            }
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
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    base: 'dist',
                    keepalive: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            simpleYamlWorker: {
                files: {
                    'dist/bower_components/morpho/src/index.js': ['src/index.js']
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
    grunt.loadNpmTasks('grunt-contrib-connect');
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
        //'cssmin:generated',
        //'uglify:generated',
        //'filerev',
        'uglify',
        'usemin'
    ]);
    grunt.registerTask('server', [
        'build',
        'connect',
    ]);
};
