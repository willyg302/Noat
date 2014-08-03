'use strict';

define([
	'angular'
], function (angular) {
	var services = angular.module('noat.services', []);
	services.factory('Note', ['$resource', function ($resource) {
		var Note = $resource('/notes/:id', {id: '@id'}, {
			update: {method: 'PUT'}
		});
		return Note;
	}]);
	return services;
});
