'use strict';

define([
	'angular',
	'angular-resource'
], function (angular) {
	var services = angular.module('noat.services', ['ngResource']);
	services.factory('Note', ['$resource', function ($resource) {
		var Note = $resource('/notes/:id', {id: '@id'}, {
			update: {method: 'PUT'}
		});
		return Note;
	}]);
	return services;
});
