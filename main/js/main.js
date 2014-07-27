'use strict';

require.config({
	packages: [],
	paths: {
		// Dependencies and libraries
		'angular'           : '../bower_components/angular/angular.min',
		'jquery'            : '../bower_components/jquery/dist/jquery.min',

		'i18n'              : '../bower_components/angular-translate/angular-translate.min',
		'i18n-loader'       : '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'i18n': {
			deps: ['angular']
		},
		'i18n-loader': {
			deps: ['i18n']
		}
	},
	findNestedDependencies: true,
	waitSeconds: 10
});

require([
	'angular',
	'app'
], function(angular, app) {
	angular.bootstrap(document, ['noat']);
});