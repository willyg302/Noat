'use strict';

// Shim Ace/Marked into the global namespace because they're designed horribly
require('ace-builds/src-min-noconflict/ace');
require('ace-builds/src-min-noconflict/mode-markdown');
require('ace-builds/src-min-noconflict/theme-tomorrow');
require('ace-builds/src-min-noconflict/ext-searchbox');
global.marked = require('marked/lib/marked');

require('angular');
require('./app');

angular.bootstrap(document, ['noat']);
