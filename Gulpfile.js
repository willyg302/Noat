var gulp       = require('gulp');
var less       = require('gulp-less');
var minifycss  = require('gulp-minify-css');
var uglify     = require('gulp-uglify');

var browserify = require('browserify');
var deamdify   = require('deamdify');
var debowerify = require('debowerify');
var del        = require('del');
var request    = require('request');
var url        = require('url');
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

var deps = [
	{
		name: 'tomorrow.min.css',
		src: 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/',
		dest: paths.dist + "/css"
	},
	{
		name: 'highlight.min.js',
		src: 'http://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/',
		dest: paths.dist + "/js/vendor"
	},
	{
		name: 'modernizr.min.js',
		src: 'http://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/',
		dest: paths.dist + "/js/vendor"
	}
];


gulp.task('clean', function(cb) {
	del(paths.dist, cb);
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
		.pipe(gulp.dest(paths.dist));
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

gulp.task('download-deps', ['copy-assets'], function() {
	deps.map(function(dep) {
		request(url.resolve(dep.src, dep.name))
			.pipe(vinyl(dep.name))
			.pipe(gulp.dest(dep.dest));
	});
});

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'compile-css', 'compile-js', 'download-deps');
});
