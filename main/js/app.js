'use strict';

define([
	'angular',
	'angular-route',
	'i18n',
	'i18n-loader',
	'./controllers',
	'./services'
], function(angular) {
	var app = angular.module('noat', [
		'ngRoute',
		'pascalprecht.translate',
		'noat.controllers',
		'noat.services'
	]);

	app.config(['$routeProvider', '$translateProvider',
		function($routeProvider, $translateProvider) {
			//$locationProvider.html5mode(true);

			$routeProvider
				.when('/', {
					templateUrl: 'partials/note.html',
					controller: 'NoteController'
				})
				.otherwise({
					redirectTo: '/'
				});

			$translateProvider.useStaticFilesLoader({
				prefix: '/locales/',
				suffix: '.json'
			});
			$translateProvider.preferredLanguage('en');
		}]);

	// http://stackoverflow.com/questions/12931369/click-everywhere-but-here-event
	app.directive('clickOff', ['$document', function($document) {
		return {
			restrict: 'A',
			link: function(scope, elem, attr, ctrl) {
				elem.bind('click', function(e) {
					e.stopPropagation();
				});
				$document.bind('click', function() {
					scope.$apply(attr.clickOff);
				});
			}
		};
	}]);

	app.controller('MainController', ['$scope', function($scope) {
		$scope.triggerHover = false;
		$scope.menuOpen = false;

		var _openMenu = function() {
			if ($scope.menuOpen) {
				return;
			}
			$scope.triggerHover = false;
			$scope.menuOpen = true;
		};

		var _closeMenu = function() {
			if (!$scope.menuOpen) {
				return;
			}
			$scope.triggerHover = false;
			$scope.menuOpen = false;
		};

		$scope.triggerClick = function($event) {
			$event.stopPropagation();
			$event.preventDefault();
			if ($scope.menuOpen) {
				_closeMenu();
			} else {
				_openMenu();
			}
		};

		$scope.menuOver = function() {
			_openMenu();
		};

		$scope.menuClose = function() {
			_closeMenu();
		};
	}]);

	return app;
});
