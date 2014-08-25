'use strict';

require.config({
	packages: [],
	paths: {
		// Dependencies and libraries
		'angular'           : '../bower_components/angular/angular.min',
		'jquery'            : '../bower_components/jquery/dist/jquery.min',

		'angular-route'     : '../bower_components/angular-route/angular-route.min',

		'i18n'              : '../bower_components/angular-translate/angular-translate.min',
		'i18n-loader'       : '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min',

		// Markdown
		'marked'            : '../bower_components/marked/lib/marked',
		'angular-marked'    : '../bower_components/angular-marked/angular-marked.min'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-route': {
			deps: ['angular']
		},
		'i18n': {
			deps: ['angular']
		},
		'i18n-loader': {
			deps: ['i18n']
		},
		'angular-marked': {
			deps: ['marked']
		}
	},
	findNestedDependencies: true,
	waitSeconds: 10
});

require([
	'marked',
	'angular',
	'./app'
], function(marked, angular, app) {
	this.marked = marked;  // Add window.marked, since required by angular-marked
	angular.bootstrap(document, ['noat']);
});
