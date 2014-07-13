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
						src: 'main/index.html',
						dest: 'dist/index.html'
					},
					{
						expand: true,
						cwd: 'main/',
						src: 'img/*',
						dest: 'dist/'
					},
					{
						src: 'main/noat.py',
						dest: 'dist/noat.py'
					}
				]
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
		'useminPrepare', 'copy', 'concat', 'cssmin', 'uglify', 'usemin'
	]);
};
