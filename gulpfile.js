var annotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var minifyCSS = require('gulp-minify-css');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('default', ['build']);
gulp.task('build', ['scripts', 'style']);
gulp.task('scripts', ['scripts-loader', 'scripts-ng-loader']);

gulp.task('style', function() {
	gulp.src('./src/*.css')
		.pipe(concat('loader.css'))
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist'))
});

gulp.task('scripts-loader', function() {
	gulp.src('./src/loader.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
});

gulp.task('scripts-ng-loader', function() {
	gulp.src('./src/ng-loader.js')
		.pipe(annotate())
		.pipe(uglify())
		.pipe(gulp.dest('./dist'))
});

gulp.task('server', ['build'], function(finish) {
	watch('./src/*.js', function() {
		gutil.log('Rebuild client-side JS files...');
		gulp.start('scripts');
	});

	watch('./src/*.css', function() {
		gutil.log('Rebuild client-side CSS files...');
		gulp.start('style');
	});

	var runCount = 0;
	nodemon({
		script: './demo/server.js',
		ext: 'html js css',
	})
		.on('start', function() {
			if (runCount > 0) return;
			notify({
				title: 'MFDC-Loader - Nodemon',
				message: 'Server started',
			}).write(0);
		})
		.on('restart', function() {
			runCount++;
			notify({
				title: 'MFDC-Loader - Nodemon',
				message: 'Server restart' + (++runCount > 1 ? ' #' + runCount : ''),
			}).write(0);
		});
});