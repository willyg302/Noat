'use strict';

define([
	'angular',
	'angular-marked',
	'angular-ace',
	'./services'
], function(angular) {
	var controllers = angular.module('noat.controllers', ['hc.marked', 'ace', 'noat.services']);

	controllers.config(['markedProvider', function(markedProvider) {
		// Markdown settings
		markedProvider.setOptions({
			gfm: true,
			highlight: function(code) {
				return hljs.highlightAuto(code).value;
			}
		});
	}]);

	controllers.controller('NoteController', ['$scope', '$routeParams', function($scope, $routeParams) {
		var id = parseInt($routeParams.noteId);
		$scope.note = $scope.$parent.getNote(id);
		$scope.$parent.selectedNote = id;

		$scope.favoriteClicked = function() {
			$scope.$parent.favoriteClicked();
		};
	}]);

	controllers.controller('EditController', ['$scope', '$routeParams', 'Note', function($scope, $routeParams, Note) {
		$scope.$parent.editing = true;

		var id = $routeParams.noteId;
		if (id === 'new') {
			// We're making a new note!
			var note = new Note();
			note.id = 0;
			note.title = 'Untitled';
			note.date = '';
			note.favorited = false;
			note.deleted = false;
			note.content = '';
			$scope.note = note;
		} else {
			id = parseInt(id);
			$scope.note = angular.copy($scope.$parent.getNote(id));
		}

		$scope.initEditor = function(editor) {
			editor.getSession().setMode('ace/mode/markdown');
			editor.setTheme('ace/theme/tomorrow');
			editor.setFontSize(16);
			editor.getSession().setUseWrapMode(true);
		};

		$scope.$on('save-clicked', function(event, args) {
			if (id === 'new') {
				$scope.note.$save(function() {
					$scope.$parent.notes.unshift($scope.note);
					$scope.$parent.selectedNote = $scope.note.id;
					$scope.$parent.saveComplete();
				});
			} else {
				angular.copy($scope.note, $scope.$parent.getNote(id));
				$scope.$parent.getNote(id).$update(function() {
					$scope.$parent.selectedNote = $scope.note.id;
					$scope.$parent.saveComplete();
				});
			}
		});
	}]);

	return controllers;
});
