module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: ["dist/"],
		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'src/',
					src: '*.ogg',
					dest: 'dist/'
				}]
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
				},
				files: {
					'dist/index.html': 'src/index.html',
				}
			}
		},
		jshint: {
			all: ['Gruntfile.js', 'src/main.js'],
			options: {
				browser: true
			}
		},
		uglify: {
			dist: {
				files: {
					'dist/main.js': 'src/main.js'
				}
			}
		},
		compress: {
			dist: {
				options: {
					archive: 'dist/<%= pkg.name %>.zip',
					mode: "zip",
					pretty: true,
					level: 9,
				},
				files: [
					{
						expand: true,
						cwd: 'dist',
						src: ['*.js', '*.html', '*.ogg'],
						dest: ''
					},
				]
			}
		}
	});


	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean', 'copy', 'htmlmin', 'jshint', 'uglify', 'compress']);
};
