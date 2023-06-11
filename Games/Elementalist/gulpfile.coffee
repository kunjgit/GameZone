browserify = require 'browserify'
browserSync = require 'browser-sync'
del = require 'del'
mold = require 'mold-source-map'
reload = browserSync.reload
source = require 'vinyl-source-stream'

gulp = require 'gulp'
gulpif = require 'gulp-if'
gutil = require 'gulp-util'
buffer = require 'gulp-buffer'
coffeelint = require 'gulp-coffeelint'
concat = require 'gulp-concat'
cssmin = require 'gulp-cssmin'
filter = require 'gulp-filter'
htmlmin = require 'gulp-htmlmin'
jade = require 'gulp-jade'
size = require 'gulp-size'
stylus = require 'gulp-stylus'
uglify = require 'gulp-uglify'
zip = require 'gulp-zip'

compress = gutil.env.compress
prod = gutil.env.prod

gulp.task 'default', [
  'build:all'
  'watch'
  'serve'
]

gulp.task 'build:all', [
  'build:css'
  'build:js'
  'build:html'
]

gulp.task 'build:css', ->
  gulp.src 'src/stylesheets/*.styl'
    .pipe do stylus
    .pipe concat 'build.css'
    .pipe gulpif prod, do cssmin
    .pipe gulp.dest 'build'
    .pipe reload stream: true

gulp.task 'build:js', ->
  bundler = browserify './src/scripts/main.litcoffee',
    debug: !prod
    extensions: ['.coffee', '.litcoffee']

  bundler
    .transform 'coffeeify'
    .bundle()
    .on 'error', handleError
    .pipe gulpif !prod, mold.transformSourcesRelativeTo __dirname
    .pipe source 'build.js'
    .pipe do buffer
    .pipe gulpif prod, do uglify
    .pipe gulp.dest 'build'

gulp.task 'build:html', ->
  gulp.src 'src/*.jade'
    .pipe jade pretty: !prod
    .pipe gulpif prod, do htmlmin
    .pipe gulp.dest 'build'
    .pipe reload stream: true

gulp.task 'build:dist', ['build:all'], ->
  unless prod
    gutil.log gutil.colors.yellow 'Warning',
      gutil.colors.grey 'You should use the --prod flag'

  unless compress
    gutil.log gutil.colors.yellow 'Warning',
      gutil.colors.grey 'You should use the --compress flag'

  gulp.src 'build/**/*'
    .pipe gulpif compress, zip 'build.zip'
    .pipe do size
    .pipe gulp.dest 'dist'

gulp.task 'lint', ->
  gulp.src 'src/scripts/**/*.*coffee'
    .pipe do coffeelint
    .pipe do coffeelint.reporter

gulp.task 'watch', ->
  gulp.watch 'src/stylesheets/*.styl', ['build:css']
  gulp.watch 'src/scripts/**/*.*coffee', ['lint', 'build:js', reload]
  gulp.watch 'src/*.jade', ['build:html']

gulp.task 'serve', ->
  browserSync
    server:
      baseDir: 'build'
    port: 8000

gulp.task 'clean:all', -> del ['build', 'dist'], force: true

gulp.task 'clean:css', -> del 'build/*.css', force: true

gulp.task 'clean:js', -> del 'build/*.js', force: true

gulp.task 'clean:html', -> del 'build/*.html', force: true

gulp.task 'clean:dist', -> del 'dist', force: true

handleError = (err) ->
  gutil.log gutil.colors.red 'Error', gutil.colors.grey err.message
