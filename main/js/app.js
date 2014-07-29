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
					templateUrl: 'partials/select.html'
				})
				.when('/note/:noteId', {
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
		$scope.query = '';
		$scope.triggerHover = false;
		$scope.menuOpen = false;
		$scope.selectedNote = null;
		$scope.notes = [
			{
				'id': '1',
				'title': 'Note 1',
				'date': 'August 23, 2014',
				'favorited': false,
				'deleted': false,
				'content': 'Text 1'
			},
			{
				'id': '2',
				'title': 'Note 2',
				'date': 'August 24, 2014',
				'favorited': true,
				'deleted': false,
				'content': 'Text 2'
			},
			{
				'id': '3',
				'title': 'Note 3',
				'date': 'August 25, 2014',
				'favorited': false,
				'deleted': true,
				'content': 'Text 3'
			},
			{
				'id': '4',
				'title': 'Note 4',
				'date': 'August 26, 2014',
				'favorited': true,
				'deleted': true,
				'content': 'Text 4'
			}
		];

		$scope.noteFilter = 'home';

		$scope.filterNotes = function(query) {
			return function(note) {
				if (query.indexOf('#') === 0) {
					if (['#favorite', '#star'].indexOf(query) !== -1) {
						$scope.noteFilter = 'star';
						return note.favorited && !note.deleted;
					} else if (['#deleted', '#trash'].indexOf(query) !== -1) {
						$scope.noteFilter = 'trash';
						return note.deleted;
					}
					// Do not filter # until as late as possible
					$scope.noteFilter = 'home';
					return !note.deleted;
				}
				$scope.noteFilter = 'home';
				return note.title.toLowerCase().indexOf(query.toLowerCase()) !== -1 && !note.deleted;
			};
		};

		$scope.getNote = function(id) {
			for (var i = 0; i < $scope.notes.length; i++) {
				if ($scope.notes[i].id === id) {
					return $scope.notes[i];
				}
			}
			return null;
		};

		$scope.showRestore = function() {
			if ($scope.selectedNote === null) {
				return false;
			}
			return $scope.getNote($scope.selectedNote).deleted;
		};

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
