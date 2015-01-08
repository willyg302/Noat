'use strict';

require('angular');
require('angular-marked');
require('angular-ui-ace');
require('./services');


var controllers = angular.module('noat.controllers', [
	'hc.marked',
	'ui.ace',
	'noat.services'
]);

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
	$scope.$parent.editing = false;
	$scope.$parent.selectedNoteId = parseInt($routeParams.noteId);

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
		// Do this dance so angular.copy() will succeed
		var note = $scope.$parent.getNote(id);
		if (typeof(note.$promise) !== 'undefined') {
			note.$promise.then(function(n) {
				$scope.note = angular.copy(n);
			});
		} else {
			$scope.note = angular.copy(note);
		}
	}

	$scope.initEditor = function(editor) {
		editor.setFontSize(16);
	};

	var saveComplete = function() {
		$scope.$parent.selectedNoteId = $scope.note.id;
		$scope.$parent.saveComplete();
	};

	$scope.$on('save-clicked', function(event, args) {
		if (id === 'new') {
			$scope.note.$save(function() {
				$scope.$parent.notes.unshift($scope.note);
				saveComplete();
			});
		} else {
			angular.copy($scope.note, $scope.$parent.getNote(id));
			$scope.$parent.getNote(id).$update(function() {
				saveComplete();
			});
		}
	});
}]);

module.exports = controllers;
