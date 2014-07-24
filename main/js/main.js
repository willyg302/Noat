require.config({
	packages: [],
	paths: {
		// Dependencies and libraries
		'text'              : '../bower_components/requirejs-text/text',
		'jquery'            : '../bower_components/jquery/dist/jquery.min',
		'underscore'        : '../bower_components/underscore/underscore',
		'i18next'           : '../bower_components/i18next/i18next.min',
		// Backbone
		'backbone'          : '../bower_components/backbone/backbone',
		// Other libraries
		'bootstrap'         : '../bower_components/bootstrap/dist/js/bootstrap.min'
	},
	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		},
		'bootstrap': {
			deps: ['jquery']
		},
		'i18next': {
			deps: ['jquery'],
			exports: 'i18n'
		}
	},
	findNestedDependencies: true,
	waitSeconds: 10
});

require([
	'jquery',
	'app'
], function($, App) {
	'use strict';

	function startApp() {
		App.start();
	}

	$(document).ready(function() {
		startApp();
	});
});