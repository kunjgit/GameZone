'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function () {
	return gulp.src('app/styles/main.scss')
		.pipe($.plumber())
		.pipe($.rubySass({
			style: 'expanded',
			precision: 5,
			require: 'susy',
			bundleExec: true
		}))
		.pipe($.autoprefixer('last 1 version'))
		.pipe(gulp.dest('.tmp/styles'));
});

gulp.task('jshint', function () {
	return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
		.pipe($.jshint())
		.pipe($.jshint.reporter('jshint-stylish'));
		// .pipe($.jshint.reporter('fail'));
});

gulp.task('jade', function () {
	return gulp.src(['app/*.jade'])
		.pipe($.jade({pretty: true}))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('html', ['jade', 'styles'], function () {
	var assets = $.useref.assets({searchPath: '{.tmp,app}'});

	return gulp.src('.tmp/*.html')
		.pipe(assets)
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.csso()))
		.pipe(assets.restore())
		.pipe($.useref())
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	return gulp.src('app/images/**/*')
		// .pipe($.cache($.imagemin({
		// 	progressive: true,
		// 	interlaced: true
		// })))
		.pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function () {
	return gulp.src(require('main-bower-files')().concat('app/fonts/**/*'))
		.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
		.pipe($.flatten())
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('extras', function () {
	return gulp.src(['app/*.*', '!app/*.html', '!app/**/*.jade'], { dot: true })
		.pipe(gulp.dest('dist'));
});

gulp.task('clean', require('del').bind(null, ['.tmp', 'dist']));

gulp.task('connect', function () {
	var serveStatic = require('serve-static');
	var serveIndex = require('serve-index');
	var app = require('connect')()
		.use(require('connect-livereload')({port: 35729}))
		.use(serveStatic('app'))
		.use(serveStatic('.tmp'))
		// paths to bower_components should be relative to the current file
		// e.g. in app/index.html you should use ../bower_components
		.use('/bower_components', serveStatic('bower_components'))
		.use(serveIndex('app'));

	require('http').createServer(app)
		.listen(9000)
		.on('listening', function () {
			console.log('Started connect web server on http://0.0.0.0:9000');
		});
});

gulp.task('serve', ['connect', 'jade', 'styles'], function () {
	require('opn')('http://0.0.0.0:9000');
});

gulp.task('watch', ['connect', 'serve'], function () {
	$.livereload.listen();

	// Notify livereload when these files change
	gulp.watch([
		'app/*.html',
		'.tmp/*.html',
		'app/templates/*.jade',
		'.tmp/styles/**/*.css',
		'app/scripts/**/*.js',
		'app/images/**/*'
	]).on('change', $.livereload.changed);

	// Run these tasks when these files change
	gulp.watch('app/*.jade', ['jade']);
	gulp.watch('app/styles/**/*.scss', ['styles']);
});

gulp.task('build', ['jshint', 'html', 'images', 'extras'], function () {
	return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
