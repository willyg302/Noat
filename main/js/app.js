define([
    'jquery',
    'slicknav'
], function($, Nav) {
    'use strict';

    var App = {};

    App.start = function() {
        new Nav($('#menu'));
    };

    return App;
});
