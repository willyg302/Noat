'use strict';

require('angular');
require('angular-resource');


var services = angular.module('noat.services', [
	'ngResource'
]);

services.factory('Note', ['$resource', function ($resource) {
	var Note = $resource('/notes/:id', {id: '@id'}, {
		update: {method: 'PUT'}
	});
	return Note;
}]);

module.exports = services;
