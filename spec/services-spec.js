'use strict';

require('angular');
require('angular-mocks');
require('../app/js/services');


describe('services', function() {
	var Service, httpBackend;

	beforeEach(angular.mock.module('noat.services'));
	beforeEach(angular.mock.inject(['Note', '$httpBackend', function(Note, $httpBackend) {
		Service = Note;
		httpBackend = $httpBackend;
	}]));

	it('implements the Note service correctly', function() {
		var note = new Service();
		httpBackend.expectPUT('/notes/123', note).respond(200);
		note.id = 123;
		note.$update();
		httpBackend.flush();
	});
});
