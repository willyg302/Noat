module.exports = function(config) {
	config.set({
		browsers: ['PhantomJS'],
		frameworks: ['browserify', 'jasmine'],
		reporters: ['dots'],
		files: [
			'spec/**/*-spec.js'
		],
		preprocessors: {
			'spec/**/*-spec.js': ['browserify']
		},
		browserify: {
			transform: ['debowerify', 'deamdify']
		}
	});
};
