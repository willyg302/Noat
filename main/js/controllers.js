'use strict';

define([
	'angular',
	'angular-marked'
], function(angular) {
	var controllers = angular.module('noat.controllers', ['hc.marked']);

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

	return controllers;
});
