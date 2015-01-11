'use strict';

require('angular');
require('angular-mocks');
require('../app/js/services');


describe('services', function() {
	var Note, httpBackend;

	beforeEach(angular.mock.module('noat.services'));
	beforeEach(angular.mock.inject(['$injector', function($injector) {
		Note = $injector.get('Note');
		httpBackend = $injector.get('$httpBackend');
	}]));

	afterEach(function() {
		httpBackend.verifyNoOutstandingExpectation();
		httpBackend.verifyNoOutstandingRequest();
	});

	it('implements the Note service correctly', function() {
		var note = new Note();
		httpBackend.expectPUT('/notes/123', note).respond(200);
		note.id = 123;
		note.$update();
		httpBackend.flush();
	});
});
