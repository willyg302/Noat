var gulp       = require('gulp');
var less       = require('gulp-less');
var minifycss  = require('gulp-minify-css');
var uglify     = require('gulp-uglify');

var browserify = require('browserify');
var deamdify   = require('deamdify');
var debowerify = require('debowerify');
var del        = require('del');
var fs         = require('fs');
var request    = require('request');
var buffer     = require('vinyl-buffer');
var vinyl      = require('vinyl-source-stream');


var paths = {
	assets: [
		'./app/index.html',
		'./app/auth.html',
		'./app/noat.py',
		'./app/app.yaml',
		'./app/img/**/*.*',
		'./app/fonts/**/*.*',
		'./app/locales/**/*.*',
		'./app/partials/**/*.*'
	],
	app: './app',
	dist: './dist',
	css: './app/less/main.less',
	js: './app/js/main.js'
};

gulp.task('clean', function(cb) {
	del(paths.dist, cb);
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('copy-modernizr', function() {
	return gulp.src("./bower_components/modernizr/modernizr.js")
		.pipe(gulp.dest(paths.dist + "/js/vendor"));
});

gulp.task('compile-css', function() {
	return gulp.src(paths.css)
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dist + "/css"));
});

gulp.task('compile-js', function() {
	return browserify(paths.js)
		.transform(debowerify)
		.transform(deamdify)
		.bundle()
		.pipe(vinyl('main.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist + "/js"));
});

gulp.task('download-highlight', ['copy-assets'], function() {
	request('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/tomorrow.min.css')
		.pipe(fs.createWriteStream(paths.dist + "/css/tomorrow.min.css"));
	request('http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/highlight.min.js')
		.pipe(fs.createWriteStream(paths.dist + "/js/vendor/highlight.min.js"));
});

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'copy-modernizr', 'compile-css', 'compile-js', 'download-highlight');
});
