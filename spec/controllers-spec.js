'use strict';

require('angular');
require('angular-mocks');
require('../app/js/controllers');


describe('controllers', function() {
	var Note, httpBackend, scope, createNoteController, createEditController;

	beforeEach(angular.mock.module('noat.controllers'));
	beforeEach(angular.mock.inject(['$injector', function($injector) {
		Note = $injector.get('Note');
		httpBackend = $injector.get('$httpBackend');
		scope = $injector.get('$rootScope').$new();

		createNoteController = function(id) {
			return $injector.get('$controller')('NoteController', {
				'$scope': scope,
				'$routeParams': {
					noteId: id
				}
			});
		};

		createEditController = function(id) {
			return $injector.get('$controller')('EditController', {
				'$scope': scope,
				'$routeParams': {
					noteId: id
				}
			});
		};
	}]));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	it('initializes the NoteController correctly', function() {
		var controller = createNoteController('123');
		expect(scope.$parent.editing).toBe(false);
		expect(scope.$parent.selectedNoteId).toEqual(123);
	});

	it('initializes the EditController correctly', function() {
		scope.$parent.getNote = jasmine.createSpy('getNote spy').and.returnValue(new Note());
		var controller = createEditController('123');
		expect(scope.$parent.editing).toBe(true);
		expect(scope.$parent.getNote).toHaveBeenCalledWith(123);
		expect(scope.note).toEqual(new Note());
	});

	it('properly handles creating a new note', function() {
		var controller = createEditController('new');
		expect(scope.note).toEqual(new Note({
			id: 0,
			title: 'Untitled',
			date: '',
			favorited: false,
			deleted: false,
			content: ''
		}));
	});

	it('sets up the Ace editor', function() {
		var editor = {
			setFontSize: jasmine.createSpy('setFontSize spy')
		};
		var controller = createEditController('new');
		scope.initEditor(editor);
		expect(editor.setFontSize).toHaveBeenCalledWith(16);
	});

	it('saves a new note', function() {
		scope.$parent.saveComplete = jasmine.createSpy('saveComplete spy');
		scope.$parent.notes = [];
		httpBackend.expectPOST('/notes/0', scope.note).respond(200);
		var controller = createEditController('new');
		scope.$broadcast('save-clicked');
		httpBackend.flush();
		expect(scope.$parent.notes).toEqual([scope.note]);
		expect(scope.$parent.selectedNoteId).toEqual(0);
		expect(scope.$parent.saveComplete).toHaveBeenCalled();
	});

	it('saves edits to a previously created note', function() {
		var copiedNote = new Note({id: 456});
		scope.$parent.getNote = jasmine.createSpy('getNote spy').and.returnValue(copiedNote);
		scope.$parent.saveComplete = jasmine.createSpy('saveComplete spy');
		httpBackend.expectPUT('/notes/456', copiedNote).respond(200);
		var controller = createEditController('456');
		scope.note.title = 'Whoa new title!';
		scope.$broadcast('save-clicked');
		httpBackend.flush();
		expect(copiedNote.title).toEqual('Whoa new title!');
		expect(scope.$parent.getNote.calls.count()).toEqual(3);
		expect(scope.$parent.selectedNoteId).toEqual(456);
		expect(scope.$parent.saveComplete).toHaveBeenCalled();
	});
});
