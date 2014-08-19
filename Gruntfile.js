module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		bower: {
			all: {
				rjsConfig: 'main/js/main.js'
			}
		},

		clean: {
			dist: ['.tmp', 'dist', '!dist/index.yaml']
		},

		copy: {
			dist: {
				files: [
					{
						expand: true,
						cwd: 'main/',
						src: [
							'index.html',
							'auth.html',
							'noat.py',
							'app.yaml',
							'img/*',
							'fonts/*/*',
							'locales/*',
							'partials/*'
						],
						dest: 'dist/'
					}
				]
			}
		},

		less: {
			compile: {
				files : {
					'main/css/main.css': 'main/css/main.less'
				},
				options: {
					compress: false,
					dumpLineNumbers: 'comments'
				}
			}
		},

		requirejs: {
			dist: {
				options: {
					baseUrl: 'main/js',
					mainConfigFile: 'main/js/main.js',
					out: 'dist/js/main.js',
					name: 'main',
					optimize: 'uglify',
					findNestedDependencies: true,
					useStrict: true,
					wrapShim: true,
					wrap: true,
					include: ['../bower_components/requirejs/require.js']
				}
			}
		},

		useminPrepare: {
			html: 'main/index.html',
			options: {
				dest: 'dist'
			}
		},
		usemin: {
			html: ['dist/index.html']
		}
	});

	grunt.registerTask('build', [
		'clean:dist',
		'less',
		'useminPrepare',
		'requirejs',
		'copy',
		'concat',
		'cssmin',
		'uglify',
		'usemin'
	]);

	grunt.registerTask('default', [
		'build'
	]);
};
