module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
							'noat.py',
							'app.yaml',
							'img/*'
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

	grunt.registerTask('default', [
		'clean:dist',
		'less',
		'useminPrepare', 'copy', 'concat', 'cssmin', 'uglify', 'usemin'
	]);
};
