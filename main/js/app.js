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

	app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'partials/select.html'
			})
			.when('/note/:noteId', {
				templateUrl: 'partials/note.html',
				controller: 'NoteController'
			})
			.when('/edit/:noteId', {
				templateUrl: 'partials/edit.html',
				controller: 'EditController'
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
		// UI variables
		$scope.query = '';
		$scope.triggerHover = false;
		$scope.menuOpen = false;
		$scope.noteFilter = 'home';

		// Note variables
		$scope.notes = Note.query();
		$scope.selectedNote = null;
		$scope.selectedNoteId = null;

		// Note state variables
		$scope.editing = false;

		// Button state variables
		$scope.showButton = false;
		$scope.showEditButton = false;
		$scope.showRestoreButton = false;

		var updateButtons = function() {
			$scope.showButton = ($scope.selectedNote !== null && !$scope.editing);
			$scope.showEditButton = $scope.editing;
			$scope.showRestoreButton = ($scope.showButton && $scope.selectedNote.deleted);
		};

		var openMenu = function() {
			if ($scope.menuOpen) {
				return;
			}
			$scope.triggerHover = false;
			$scope.menuOpen = true;
		};

		var closeMenu = function() {
			if (!$scope.menuOpen) {
				return;
			}
			$scope.triggerHover = false;
			$scope.menuOpen = false;
		};

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
			if (id === null) {
				return null;
			}
			for (var i = 0; i < $scope.notes.length; i++) {
				if ($scope.notes[i].id === id) {
					return $scope.notes[i];
				}
			}
			// Fallback to a get on id
			return Note.get({id: id});
		};

		$scope.$watch('selectedNoteId', function(newValue, oldValue) {
			$scope.selectedNote = $scope.getNote($scope.selectedNoteId);
			updateButtons();
		});

		$scope.$watch('editing', function(newValue, oldValue) {
			updateButtons();
		});

		/* MENU FUNCTIONS */

		$scope.triggerClick = function($event) {
			$event.stopPropagation();
			$event.preventDefault();
			if ($scope.menuOpen) {
				closeMenu();
			} else {
				openMenu();
			}
		};

		$scope.menuOver = function() {
			openMenu();
		};

		$scope.menuClose = function() {
			closeMenu();
		};

		/* BUTTON CLICK FUNCTIONS */

		$scope.deleteClicked = function() {
			var note = $scope.selectedNote;
			if (note.deleted) {
				note.$delete(function() {
					$scope.notes.splice($scope.notes.indexOf(note), 1);
					$scope.selectedNoteId = null;
					$location.path('/');  // No note is selected, back outta there!
				});
			} else {
				note.deleted = true;
				note.$update();
				updateButtons();
			}
		};

		$scope.restoreClicked = function() {
			var note = $scope.selectedNote;
			note.deleted = false;
			note.$update();
			updateButtons();
		};

		$scope.favoriteClicked = function() {
			var note = $scope.selectedNote;
			note.favorited = !note.favorited;
			note.$update();
		};

		$scope.editClicked = function() {
			$location.path('/edit/' + $scope.selectedNoteId);
		};

		$scope.cancelClicked = function() {
			$scope.editing = false;
			if ($scope.selectedNote === null) {
				$location.path('/');
			} else {
				$location.path('/note/' + $scope.selectedNoteId);
			}
		};

		$scope.saveClicked = function() {
			$scope.$broadcast('save-clicked');
		};

		$scope.saveComplete = function() {
			$scope.editing = false;
			$location.path('/note/' + $scope.selectedNoteId);
		};
	}]);

	return app;
});
