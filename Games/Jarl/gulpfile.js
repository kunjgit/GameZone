var gulp = require('gulp');
var ugly = require('gulp-uglify');
var zip = require('gulp-zip');
var size = require('gulp-size');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');
var css = require('gulp-css');


gulp.task('default', ['compress', 'zip']);

gulp.task('watch',  ['default'],  function() {
   gulp.watch("src/*", ['default']);
}); 

gulp.task('compress', ['uglify-js', 'minify-html', 'minify-css', 'move-gif']);

gulp.task('move-gif', function() {
   gulp.src('./src/*.min.gif')
      .pipe(gulp.dest('./build'));
});

gulp.task('uglify-js', function() {
   gulp.src('./src/*.js')
      .pipe(ugly())
      .pipe(rename({
          suffix : ".min"
      }))
      .pipe(gulp.dest('./build'));
});

gulp.task('minify-css', function() {
   gulp.src('./src/style.css')
      .pipe(css())
      .pipe(gulp.dest('./build'));
});

gulp.task('minify-html', function() {
   gulp.src('./src/*.html')
      .pipe(minifyHTML())
      .pipe(gulp.dest('./build'));
});

gulp.task('zip', function() {
   var name = "jarl.zip";
   gulp.src('./build/*')
      .pipe(zip(name))
      .pipe(size({
         title : "jarl.zip"
      }))
      .pipe(gulp.dest('./'));

   console.log('');
});
