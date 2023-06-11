gulp = require('gulp')
uglify = require('gulp-uglify')
jshint = require("gulp-jshint")
concat = require('gulp-concat')
cssmin = require('gulp-cssmin')
minifyHTML = require('gulp-minify-html')
zip = require('gulp-zip');

gulp.task 'minify-js', ->
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(concat('js/app.js'))
        .pipe(gulp.dest('build'))

gulp.task 'minify-html', ->
    gulp.src('app/index.html')
        .pipe(minifyHTML())
        .pipe(gulp.dest('build'))


gulp.task 'minify-css', ->
    gulp.src('app/css/*.css')
        .pipe(cssmin())
        .pipe(concat('css/style.css'))
        .pipe(gulp.dest('build'))

gulp.task 'copy-img', ->
    gulp.src('app/img/*')
        .pipe(gulp.dest('build/img/'))


gulp.task 'zip', ['minify-js', 'minify-css', 'minify-html', 'copy-img'], ->
    gulp.src('build/**')
        .pipe(zip('game.zip'))
        .pipe(gulp.dest('.'));


gulp.task 'default', ['zip']


gulp.task 'jshint', ->
    return gulp.src('app/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
