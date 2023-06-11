module.exports = function(grunt) {
    grunt.initConfig({

        uglify: {
            options: {
                wrap: true
            },
            dist: {
                files: {
                    'dist/ap11.min.js': [
                        'src/utils.js',
                        'src/world.js',
                        'src/cars.js',
                        'src/jsfxr.js',
                        'src/audio.js',
                        'src/text.js',
                        'src/ap11.js'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'dist/index.html'
                }
            }
        },
        watch: {
            all: {
                files: ['src/index.html', 'src/*.js'],
                options: {
                    livereload: true
                }
            }
        },
        connect: {
            options: {
                port: 9000,
                hostname: 'localhost',
                livereload: 35729,
                open: true
            },
            livereload: {
                options: {
                    open: true
                }
            }
        },
        jshint: {
            all: ['src/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('build', ['uglify', 'htmlmin']);

    grunt.registerTask('serve', ['connect:livereload', 'watch']);

    grunt.registerTask('default', 'build');
};