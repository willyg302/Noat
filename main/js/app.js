'use strict';

define([
	'angular',
	'i18n',
	'i18n-loader'
], function(angular) {
	var app = angular.module('noat', ['pascalprecht.translate']);
	app.config(['$translateProvider', function($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: '/locales/',
			suffix: '.json'
		});
		$translateProvider.preferredLanguage('en');
	}]);
	return app;
});
