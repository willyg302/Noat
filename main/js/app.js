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

	app.controller('MainController', ['$scope', '$location', 'Note', function($scope, $location, Note) {
		$scope.query = '';
		$scope.triggerHover = false;
		$scope.menuOpen = false;

		$scope.selectedNote = null;
		$scope.notes = Note.query();

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

		$scope.showButton = function() {
			return $scope.selectedNote !== null;
		};

		$scope.showRestore = function() {
			return $scope.showButton() && $scope.getNote($scope.selectedNote).deleted;
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


		$scope.deleteClicked = function() {
			var note = $scope.getNote($scope.selectedNote);
			if (note.deleted) {
				note.$delete(function() {
					$scope.notes.splice($scope.notes.indexOf(note), 1);
					$scope.selectedNote = null;
					$location.path('/');  // No note is selected, back outta there!
				});
			} else {
				note.deleted = true;
				note.$update();
			}
		};

		$scope.restoreClicked = function() {
			var note = $scope.getNote($scope.selectedNote);
			note.deleted = false;
			note.$update();
		};

		$scope.favoriteClicked = function() {
			var note = $scope.getNote($scope.selectedNote);
			note.favorited = !note.favorited;
			note.$update();
		};
	}]);

	return app;
});
