'use strict';

require.config({
	packages: [],
	paths: {
		// Dependencies and libraries
		'angular'           : '../bower_components/angular/angular.min',
		'jquery'            : '../bower_components/jquery/jquery.min',

		'angular-route'     : '../bower_components/angular-route/angular-route.min',
		'angular-resource'  : '../bower_components/angular-resource/angular-resource.min',

		'i18n'              : '../bower_components/angular-translate/angular-translate.min',
		'i18n-loader'       : '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min',

		// Markdown
		'marked'            : '../bower_components/marked/lib/marked',
		'angular-marked'    : '../bower_components/angular-marked/angular-marked.min',

		// Ace Editor
		'ace'               : '../bower_components/ace-builds/src-min-noconflict/ace',
		'ace-markdown'      : '../bower_components/ace-builds/src-min-noconflict/mode-markdown',
		'ace-tomorrow'      : '../bower_components/ace-builds/src-min-noconflict/theme-tomorrow',
		'ace-searchbox'     : '../bower_components/ace-builds/src-min-noconflict/ext-searchbox',
		'angular-ace'       : '../bower_components/angular-ace/lib/angular-ace'
	},
	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-route': {
			deps: ['angular']
		},
		'angular-resource': {
			deps: ['angular']
		},
		'i18n': {
			deps: ['angular']
		},
		'i18n-loader': {
			deps: ['i18n']
		},
		'angular-marked': {
			deps: ['marked']
		},
		'angular-ace': {
			deps: ['ace', 'ace-markdown', 'ace-tomorrow', 'ace-searchbox']
		}
	},
	findNestedDependencies: true,
	waitSeconds: 10
});

require([
	'marked',
	'angular',
	'./app'
], function(marked, angular, app) {
	this.marked = marked;  // Add window.marked, since required by angular-marked
	angular.bootstrap(document, ['noat']);
});
