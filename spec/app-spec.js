'use strict';

require('angular');
require('angular-mocks');
require('../app/js/app');


describe('app', function() {
	var Service, httpBackend, scope, createController;

	beforeEach(angular.mock.module('noat'));
	beforeEach(angular.mock.inject(['Note', '$httpBackend', '$rootScope', '$controller',
		function(Note, $httpBackend, $rootScope, $controller) {
			Service = Note;
			httpBackend = $httpBackend;
			scope = $rootScope.$new();

			createController = function() {
				return $controller('MainController', {
					'$scope': scope
				});
			};
		}
	]));

	it('has routing configured correctly', function() {
		angular.mock.inject(['$route', function($route) {
			expect($route.routes['/'].templateUrl).toEqual('partials/select.html');
			expect($route.routes['/note/:noteId'].templateUrl).toEqual('partials/note.html');
			expect($route.routes['/edit/:noteId'].templateUrl).toEqual('partials/edit.html');

			expect($route.routes['/note/:noteId'].controller).toEqual('NoteController');
			expect($route.routes['/edit/:noteId'].controller).toEqual('EditController');

			expect($route.routes[null].redirectTo).toEqual('/');
		}]);
	});

	it('initializes the MainController correctly', function() {
		var controller = createController();
	});
















	/* BUTTON CLICK FUNCTIONS */

	it('marks a note as deleted if deleted is clicked', function() {
		//
	});

	it('deletes a trashed note forever if delete is clicked', function() {
		//
	});

	it('restores a trashed note if restore is clicked', function() {
		//
	});

	it('stars a note if favorite is clicked', function() {
		//
	});

	it('loads the editor if edit is clicked', function() {
		//
	});

	it('backs out of the editor if cancel is clicked', function() {
		//
	});

	it('broadcasts a save event if save is clicked', function() {
		//
	});

	it('handles completion of a save', function() {
		//
	});


});
