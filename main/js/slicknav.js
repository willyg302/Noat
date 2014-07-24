/**
 * SlickNav
 * Modified from Google Nexus Website Menu, copyright (c) 2013 Codrops
 *   https://github.com/codrops/GoogleNexusWebsiteMenu
 * Licensed under the MIT License.
 */
define([
	'jquery',
	'mobilecheck'
], function ($, MobileCheck) {
	'use strict';

	function slicknav(elem) {
		this.elem = elem;
		this._init();
	}

	slicknav.prototype = {
		_init: function() {
			this.trigger = $('.trigger');
			this.menu = $('nav.sidenav');
			this.isMenuOpen = false;
			this.eventtype = MobileCheck() ? 'touchstart' : 'click';
			this._initEvents();

			var self = this;
			this.bodyClickFn = function() {
				self._closeMenu();
				this.removeEventListener(self.eventtype, self.bodyClickFn);
			};
		},
		_initEvents: function() {
			var self = this;
			if (!MobileCheck()) {
				this.trigger.mouseover(function() {
					self._openIconMenu();
				}).mouseout(function() {
					self._closeIconMenu();
				});
				this.menu.mouseover(function() {
					self._openMenu();
					document.addEventListener(self.eventtype, self.bodyClickFn);
				});
			}
			this.trigger.on(this.eventtype, function(ev) {
				ev.stopPropagation();
				ev.preventDefault();
				if (self.isMenuOpen) {
					self._closeMenu();
					document.removeEventListener(self.eventtype, self.bodyClickFn);
				} else {
					self._openMenu();
					document.addEventListener(self.eventtype, self.bodyClickFn);
				}
			});
			this.menu.on(this.eventtype, function(ev) {
				ev.stopPropagation();
			});
		},
		_openIconMenu: function() {
			this.menu.addClass('open-part');
		},
		_closeIconMenu: function() {
			this.menu.removeClass('open-part');
		},
		_openMenu: function() {
			if (this.isMenuOpen) {
				return;
			}
			this.trigger.addClass('selected');
			this.menu.addClass('open-all');
			this._closeIconMenu();
			this.isMenuOpen = true;
		},
		_closeMenu: function() {
			if (!this.isMenuOpen) {
				return;
			}
			this.trigger.removeClass('selected');
			this.menu.removeClass('open-all');
			this._closeIconMenu();
			this.isMenuOpen = false;
		}
	}
	
	return slicknav;
});
