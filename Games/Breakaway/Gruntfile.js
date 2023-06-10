module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        browser: true
      },
      all: ['breakaway.js']
    },
    uglify: {
      minify: {
        files: {
          'breakaway.min.js': ['breakaway.js']
        }
      }
    },
    compress: {
      main: {
        options: {
          archive: 'breakaway.zip',
          mode: 'zip',
          level: 9
        },
        files: [
          {src: ['index.html', 'breakaway.min.js', 'style/style.min.css', 'lib/*', 'assets/*'] }
        ]
      }
    },
    cssmin: {
      combine: {
        files: {
          'style/style.min.css': ['style/style.css']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

  // Default task.
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin', 'compress']);

};
