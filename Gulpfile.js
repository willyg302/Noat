var gulp       = require('gulp');
var clean      = require('gulp-clean');
var less       = require('gulp-less');
var minifycss  = require('gulp-minify-css');
var requirejs  = require('gulp-requirejs');
var uglify     = require('gulp-uglify');

var paths = {
	requireJSIncludes: ['../bower_components/requirejs/require.js'],
	assets: [
		'./main/index.html',
		'./main/auth.html',
		'./main/noat.py',
		'./main/app.yaml',
		'./main/img/**/*.*',
		'./main/fonts/**/*.*',
		'./main/locales/**/*.*',
		'./main/partials/**/*.*'
	],
	app: './main',
	dist: './dist',
	js: './main/js',
	css: './main/less'
};

gulp.task('clean', function() {
	return gulp.src([paths.dist, '.tmp', '!dist/index.yaml'], {read: false})
		.pipe(clean());
});

gulp.task('copy-assets', function() {
	return gulp.src(paths.assets, {base: paths.app})
		.pipe(gulp.dest(paths.dist));
});

gulp.task('copy-modernizr', function() {
	return gulp.src(paths.app + "/bower_components/modernizr/modernizr.js")
		.pipe(gulp.dest(paths.dist + "/js/vendor"));
})

gulp.task('compile-js', function() {
	requirejs({
		baseUrl: paths.js,
		mainConfigFile: paths.js + "/main.js",
		out: 'main.js',
		name: 'main',
		findNestedDependencies: true,
		waitSeconds: 10,
		wrapShim: true,
		wrap: true,
		include: paths.requireJSIncludes
	})
		.pipe(uglify())
		.pipe(gulp.dest(paths.dist + "/js"));
});

gulp.task('compile-css', function() {
	return gulp.src(paths.css + "/main.less")
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest(paths.dist + "/css"));
});

gulp.task('default', ['clean'], function() {
	gulp.start('copy-assets', 'copy-modernizr', 'compile-js', 'compile-css');
});
