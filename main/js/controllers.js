'use strict';

define([
	'angular'
], function(angular) {
	var controllers = angular.module('noat.controllers', []);
	controllers.controller('NoteController', ['$scope', function($scope) {
		$scope.note = {
			'title': 'Hello world! This is a long title so I can see what happens.',
			'date': 'August 23, 2014',
			'favorited': true,
			'content': 'And this is some text.'
		}
	}]);
	return controllers;
});
