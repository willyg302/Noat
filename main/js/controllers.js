'use strict';

define([
	'angular',
	'angular-marked',
	'angular-ace'
], function(angular) {
	var controllers = angular.module('noat.controllers', ['hc.marked', 'ace']);

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

	controllers.controller('EditController', ['$scope', '$routeParams', function($scope, $routeParams) {
		$scope.$parent.editing = true;

		var id = $routeParams.noteId;
		if (id === 'new') {
			// We're making a new note!
			$scope.note = {
				id: -1,
				title: 'Untitled',
				date: '',
				favorited: false,
				deleted: false,
				content: ''
			}
		} else {
			id = parseInt(id);
			$scope.note = angular.copy($scope.$parent.getNote(id));
		}

		$scope.initEditor = function(editor) {
			editor.getSession().setMode('ace/mode/markdown');
			editor.setTheme('ace/theme/tomorrow');
			editor.setFontSize(14);
			editor.getSession().setUseWrapMode(true);
		};

		$scope.$on('save-clicked', function(event, args) {
			if (id === 'new') {
				// Create new note, add it to parent note...
			} else {
				// Update existing note
			}
		});
	}]);

	return controllers;
});
