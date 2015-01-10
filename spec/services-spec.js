'use strict';

require('angular');
require('angular-mocks');
require('../app/js/services');

describe('services', function() {

	beforeEach(angular.mock.module('noat.services'));

	it('should add correctly', function() {
		expect(1 + 1).toBe(2);
	});
});
