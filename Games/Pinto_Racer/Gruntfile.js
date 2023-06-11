/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      js: {
        src: [
          'src/core/Util.js',
          'src/core/Decorators.js',
          'src/components/Audio.js',
          'src/components/Camera.js',
          'src/components/Cone.js',
          'src/components/Level.js',
          'src/components/LevelMenuItem.js',
          'src/components/Player.js',
          'src/components/PlayerController.js',
          'src/components/Shadow.js',
          'src/core/game.js'
        ],
        dest: 'src/main.js',
      },
    },
    copy: {
      game: {
        files: [{ cwd: 'src/', flatten: true, expand: true, src: ['index.html','game.css','main.js', 'pinto.svg'], dest: 'game/', filter: 'isFile'}]
      },
      ghpages: {
        files: [{ cwd: 'game/', flatten: true, expand: true, src: ['*'], dest: '../pinto-gh-page/pinto-rally-racer/', filter: 'isFile'}]
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>',
        mangle: true
      },
      gameMin: {
        files: [{
          'game-min/main.js': ['src/main.js']
        }]
      }
    },
    cssmin: {
      gameMin: {
        files: {
          'game-min/game.css': ['src/game.css']
        }
      }
    },
    htmlmin: {
      gameMin: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'game-min/index.html': 'src/index.html',
          'game-min/pinto.svg': 'src/pinto.svg',
        }
      }
    },
    compress: {
      min: {
        options: {
          archive: 'game.zip'
        },
        files: [
          {src: ['game-min/*'], dest: '', filter: 'isFile'}
        ]
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    connect: {
      server: {
        options: {
          port: 9000,
          keepalive: true,
          base: 'src/',
        }
      }
    },
    open: {
      server: {
        path: 'http://localhost:<%= connect.options.port %>'
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'qunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  // Default task.
  grunt.registerTask('default', ['concat', 'jshint', 'uglify', 'cssmin', 'htmlmin', 'copy', 'compress']);




  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('serve', function () { //target
    grunt.task.run([
      'connect',
      'open',
      'watch'
    ]);
  });
};
