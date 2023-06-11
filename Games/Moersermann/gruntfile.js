module.exports = function(grunt) {


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		uglify: {

			dist: {
				files: {
					'assets/min/game.min.js': [

						'assets/js/math.js',
						'assets/js/game.js',
						'assets/js/wall.js',
						'assets/js/player.js',
						'assets/js/light.js',
						'assets/js/particle.js',
						'assets/js/background.js'
					]
				}
			}

		},

		cssmin: {

			dist: {
				files: {
					'assets/min/style.min.css': ['assets/css/style.css']
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
        				'index.min.html': 'index.html'
				}
			}
    		},

		jshint: {
			dist: [
				'Gruntfile.js', 
				'assets/js/game.js',
				'assets/js/wall.js',
				'assets/js/player.js',
				'assets/js/light.js',
				'assets/js/particle.js',
				'assets/js/background.js'
			]
		}

	});


	grunt.registerTask('build', ['uglify', 'cssmin', 'htmlmin']);
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

};