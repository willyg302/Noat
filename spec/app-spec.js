'use strict';

require('angular');
require('angular-mocks');
require('../app/js/app');


describe('app', function() {
	var Note, httpBackend, scope, location, controller;

	beforeEach(angular.mock.module('noat'));
	beforeEach(angular.mock.inject(['$injector', function($injector) {
		Note = $injector.get('Note');
		httpBackend = $injector.get('$httpBackend');
		scope = $injector.get('$rootScope').$new();
		location = $injector.get('$location');
		controller = $injector.get('$controller')('MainController', {
			'$scope': scope,
			'$location': location
		});
		// Upon load the controller makes a request to translate and queries all notes
		httpBackend.expectGET('/locales/en.json').respond(200);
		httpBackend.expectGET('/notes').respond(200);
		httpBackend.flush();
	}]));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

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

	it('sets the selected note whenever the selected note ID changes', function() {
		// This mainly tests the watcher functions correctly
		httpBackend.expectGET('/notes/123').respond(new Note({id: 123, title: 'Hi!'}));
		scope.selectedNoteId = 123;
		scope.$apply();
		httpBackend.flush();
		expect(scope.selectedNote.title).toEqual('Hi!');
		scope.notes = [new Note({id: 456, title: 'Hola!'})];
		scope.selectedNoteId = 456;
		scope.$apply();
		expect(scope.selectedNote.title).toEqual('Hola!');
		scope.selectedNoteId = null;
		scope.$apply();
		expect(scope.selectedNote).toBe(null);
	});


	/* BUTTON CLICK FUNCTIONS */

	it('marks a note as deleted if deleted is clicked', function() {
		scope.selectedNote = new Note({id: 456});
		httpBackend.expectPUT('/notes/456', scope.selectedNote).respond(200);
		scope.deleteClicked();
		httpBackend.flush();
		expect(scope.selectedNote.deleted).toBe(true);
	});

	it('deletes a trashed note forever if delete is clicked', function() {
		spyOn(location, 'path');
		scope.selectedNote = new Note({id: 456, deleted: true});
		scope.notes = [scope.selectedNote];
		httpBackend.expectDELETE('/notes/456').respond(200);
		scope.deleteClicked();
		httpBackend.flush();
		expect(scope.notes).toEqual([]);
		expect(scope.selectedNoteId).toBe(null);
		expect(location.path).toHaveBeenCalledWith('/');
	});

	it('restores a trashed note if restore is clicked', function() {
		scope.selectedNote = new Note({id: 456, deleted: true});
		httpBackend.expectPUT('/notes/456', scope.selectedNote).respond(200);
		scope.restoreClicked();
		httpBackend.flush();
		expect(scope.selectedNote.deleted).toBe(false);
	});

	it('stars a note if favorite is clicked', function() {
		scope.selectedNote = new Note({id: 456});
		httpBackend.expectPUT('/notes/456', scope.selectedNote).respond(200);
		scope.favoriteClicked();
		httpBackend.flush();
		expect(scope.selectedNote.favorited).toBe(true);
	});

	it('loads the editor if edit is clicked', function() {
		spyOn(location, 'path');
		httpBackend.expectGET('/notes/123').respond(200);
		scope.selectedNoteId = 123;
		scope.editClicked();
		httpBackend.flush();
		expect(location.path).toHaveBeenCalledWith('/edit/123');
	});

	it('backs out of the editor if cancel is clicked', function() {
		spyOn(location, 'path');
		scope.cancelClicked();
		expect(scope.editing).toBe(false);
		expect(location.path).toHaveBeenCalledWith('/');
		httpBackend.expectGET('/notes/123').respond(200);
		scope.selectedNote = new Note();
		scope.selectedNoteId = 123;
		scope.cancelClicked();
		httpBackend.flush();
		expect(location.path).toHaveBeenCalledWith('/note/123');
	});

	it('broadcasts a save event if save is clicked', function() {
		spyOn(scope, '$broadcast');
		scope.saveClicked();
		expect(scope.$broadcast).toHaveBeenCalledWith('save-clicked');
	});

	it('handles completion of a save', function() {
		spyOn(location, 'path');
		httpBackend.expectGET('/notes/123').respond(200);
		scope.selectedNoteId = 123;
		scope.saveComplete();
		httpBackend.flush();
		expect(scope.editing).toBe(false);
		expect(location.path).toHaveBeenCalledWith('/note/123');
	});
});
