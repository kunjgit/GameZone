module.exports = function() {
    const gulp = require('gulp');
    const util = require('gulp-util');
    const concat = require('gulp-concat');
    const plumber = require('gulp-plumber');
    const notify = require('gulp-notify');
    const gulpif = require('gulp-if');
    const uglify = require('gulp-uglify-es').default;
    const browserSync = require('browser-sync');

    const isWatching = ['serve', 'watch'].indexOf(process.argv[2]) >= 0;
    const config = util.env.boilerplate.config;
    const concatConfig = config.tasks.concatjs;
    gulp.task('concatjs', function () {
        return gulp.src(concatConfig.source, {cwd: config.sourceRoot})
            .pipe(plumber({
                errorHandler: notify.onError({
                    message: '<%= error.message %>',
                    title: 'JS Error'
                })
            }))
            .pipe(concat(concatConfig.filename))
            .pipe(gulpif(util.env.production, uglify().on('error', function(err) {
                util.log(util.colors.bgRed('UglifyJS error:'), util.colors.red(err));
            })))
            .pipe(gulp.dest(config.destinationRoot + concatConfig.destination))
            .pipe(gulpif(isWatching, browserSync.stream({once: true})))
            .pipe(notify('Successfully compiled JS'));
    });
};