/*
	ioBroker.vis flyout-menu Widget-Set

	version: "0.0.1"

	Copyright 2020 hawkoon hoelkeskamp@googlemail.com
*/
'use strict';

// add translations for edit mode
$.extend(
	true,
	systemDictionary,
	{
		"menuTranslations": {"en": "Translations", "de": "Übersetzungen"},
		"menuItemClass": {"Menu-Item CSS class": "Size", "de": "Menüpunkt CSS Klasse"},
		"menuClass": {"en": "Menu CSS class", "de": "Menü CSS Klasse"},
		"menuHeaderHtml": {"en": "Menu Header HTML", "de": "Menü Kopf HTML"},
		"menuFooterHtml": {"en": "Menu Footer HTML", "de": "Menü Fuß HTML"},
		"menuWidth": {"en": "Menu width", "de": "Menü Breite"},
		"menuPanelColor": {"en": "Menu panel color", "de": "Menü Hintergrungfarbe"},
		"menuFontColor": {"en": "Menu font color", "de": "Menü Font farne"},
		"menuFontSize": {"en": "Menu font size", "de": "Menü Font Größe"},
		"menuFont": {"en": "Menu font", "de": "Menu Font"},
	}
);

// this code can be placed directly in flyout-menu.html
vis.binds['flyout-menu'] = {

	version: '0.0.1',
	menuWidth: '250px',

	showVersion: function () {
		if (vis.binds['flyout-menu'].version) {
			console.log('Version flyout-menu: ' + vis.binds['flyout-menu'].version);
			vis.binds['flyout-menu'].version = null;
		}
	},
	createWidget: function (widgetID, view, data, style) {

		const _this = this;

		if(data.attr('menuWidth')) {
			this.menuWidth = (data.attr('menuWidth') || 250) + 'px';
		}

		var $div = $('#' + widgetID);
		// if nothing found => wait
		if (!$div.length) {
			return setTimeout(function () {
				vis.binds['flyout-menu'].createWidget(widgetID, view, data, style);
			}, 100);
		}

		if ($div.find('.side-menu-trigger').length) {
			// the init code will be called twice
			// so check if the content is already present. Is so, then simply exit.
			return;
		}
		createMenuTrigger($div);
		createMenu.call(this);

		function buildMenuContentFromViews(jsonMenuDefinition, menuContent){
			for (let view in vis.views) {
				if (!vis.views.hasOwnProperty(view) || '___settings' === view) continue;
				let menuItemLabel = view;
				if(jsonMenuDefinition[view] && jsonMenuDefinition[view].label){
					menuItemLabel = jsonMenuDefinition[view].label;
				}
				let menuItem = $('<div></div>').addClass('side-menu-item')
					.append($('<span></span>').html(menuItemLabel)).click({targetView: view},navigateTo);
				menuContent.append(menuItem)
			}
		}

		function createMenuTrigger(parentElement) {
			const menuTrigger = $('<span></span>').addClass('side-menu-trigger').on('click', openNav);
			parentElement.append(menuTrigger);
		}

		function createMenu() {
			const menu = $('<div></div>').addClass('sidenav');
			menu.css({'width': this.menuWidth, 'left':'-'+ this.menuWidth});

			const menuContent = $('<div></div>').addClass('side-menu-content');
			menu.append(menuContent);


			if (data.attr('menuHeaderHtml')) {
				const menuHeader = $('<div></div>').addClass('sidebar-header');
				menuHeader.html(data.attr('menuHeaderHtml'));
				menuContent.append(menuHeader);
			}


			const closeButton = $('<div></div>').addClass('closebtn').html('&times;').on('click',closeNav);
			menuContent.append(closeButton)

			if (data.attr('menuFooterHtml')) {
				const menuFooter = $('<div></div>').addClass('sidebar-footer').html(data.attr('menuFooterHtml'));
				menu.append(menuFooter);
			}

			let menuDefinition = {};
			if(data.attr('menuTranslations')) {
				menuDefinition = JSON.parse(data.attr('menuTranslations'));
			}
			buildMenuContentFromViews(menuDefinition, menuContent);


			if(typeof app !== 'undefined') {
				let mobileAppMenu = $('<div></div>').addClass('side-menu-item')
					.append($('<span></span>').html('Settings')).click(openAppMenu);
			}
			menu.appendTo(document.body);
		}

		function navigateTo(event){
			closeNav();
			vis.changeView(event.data.targetView);
		}

		function openAppMenu() {
			typeof app !== 'undefined' && $('#cordova_menu').trigger('click')
		}

		function openNav() {
			$('.sidenav').css('left','0');
		}

		function closeNav() {
			console.log('Close nav ', ('-' + _this.menuWidth));
			$('.sidenav').css('left',('-' + _this.menuWidth));
		}
	}
};

vis.binds['flyout-menu'].showVersion();
