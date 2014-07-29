'use strict';

define([
	'angular'
], function(angular) {
	var controllers = angular.module('noat.controllers', []);
	controllers.controller('NoteController', ['$scope', '$routeParams', function($scope, $routeParams) {
		var id = $routeParams.noteId;
		$scope.note = $scope.$parent.getNote(id);
		$scope.$parent.selectedNote = id;
	}]);
	return controllers;
});
