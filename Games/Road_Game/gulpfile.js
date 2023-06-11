// Load modules
var gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    zip = require('gulp-zip'),
    htmlreplace = require('gulp-html-replace'),
    htmlmin = require('gulp-htmlmin')
;





// optionss and names and stuff
var options = {
  js_files : [ 'assets/js/audio.js', 'assets/js/car.js', 'assets/js/player.js', 'assets/js/points.js', 'assets/js/draw.js', 'assets/js/init.js' ],
  jsmin : 'roadthegame.js',
  css : [ 'assets/css/style.css'],
  html : 'index.html',
  compile : 'compile',
  build : 'build',
  archive : 'roadthegame.zip',
  archive_content : [ 'compile/*', 'index.html' ]
};





// Create the minified version of all JS files
gulp.task('js', function() {
  return gulp.src(options.js_files)
    .pipe(concat(options.jsmin))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(options.compile))
  ;
});





// Create the minified version of all CSS files
gulp.task('css', function() {
  return gulp.src(options.css)
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(options.compile))
  ;
});





// Replace blocks and minifiy the HTML
gulp.task('html', function() {
  return gulp.src(options.html)
    // Replace blocks with new code
    .pipe(htmlreplace({
        'css': 'style.min.css',
        'js': 'roadthegame.min.js'
    }))
    // Minify the HTML
    .pipe(htmlmin({
        collapseWhitespace: true,
        removeComments : true
    }))
    .pipe(gulp.dest(options.compile))
  ;
});





// Calls other tasks and creates the archive
gulp.task('build', [ 'js', 'css', 'html' ], function() {
    return gulp.src(options.archive_content)
      .pipe(zip(options.archive))
      .pipe(gulp.dest(options.build))
      .pipe(notify({ message: 'created ' + options.archive + '!' }))
    ;
});