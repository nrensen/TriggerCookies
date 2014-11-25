/*=====================================================================================
TRIGGER COOKIES MODS
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/trigger-death/CookieMods
// Raw File:     https://raw.githubusercontent.com/trigger-death/CookieMods/master/TriggerCookies.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'TriggerCookies';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return document.getElementById('modscript_' + name) != null;
}
/* Loads the mod from the same location as this mod if the mod hasn't been loaded yet. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		var url = GetModURL() + 'Scripts/' + name + '.js';
		Game.LoadMod(url);
	}
}
/* Loads the style sheet from the same location as this mod. */
function LoadStyleSheet(name) {
	var url = GetModURL() + 'Styles/' + name + '.css';
		
	var link = document.createElement("link");
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	link.media = 'all';

	document.head.appendChild(link);
	console.log('Loaded the style sheet ' + url + ', ' + name + '.');
}
/* Returns true if the variable is defined and equals the value. */
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
/* Creates an interval to wait until the specified mod is loaded */
function IntervalUntilLoaded(mod, func) {
	var checkReady = setInterval(function () {
		if (IsDefined(mod + '.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}

//#endregion
/*=====================================================================================
TRIGGER COOKIES DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
TriggerCookies = {};
/* True if the mod has been loaded. */
TriggerCookies.Loaded = false;

//#endregion
/*=====================================================================================
TRIGGER COOKIES INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Trigger_Cookie Mods. */
TriggerCookies.Init = function () {

	// Overrides.js is required
	LoadMod('Overrides');

	// Set the favicon to a cookie, which it should have been all along.
	TriggerCookies.ChangeFavicon();

	//TriggerCookies.RemoveTopBar();

	// Wait until Overrides.js is loaded
	IntervalUntilLoaded('Overrides', function () {
		Overrides.OverrideFunction('Game.ShowMenu', 'TriggerCookies.ShowMenu', 'TriggerCookies');
		Overrides.OverrideFunction('Overrides.UpdateMenuLog', 'TriggerCookies.UpdateMenuLog', 'TriggerCookies');
		
		LoadStyleSheet('TriggerCookies');
		//TriggerCookies.LoadTabCSS();
		TriggerCookies.ChangeLogButton();
		//TriggerCookies.ChangeScrollBar();
		//TriggerCookies.ChangeNewsTicker();

		// Just to let you know the mod is loaded and working.
		Game.Notify('Mod Loaded', '<div class="title" style="font-size:18px;">' + 'Trigger Cookies'.fontcolor('cyan') + '</div>', [16, 5]);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		var menu = document.createElement('div');
		menu.className = 'modmenu';
		menu.id = 'modMenu';
		l('menu').parentNode.appendChild(menu);

		// States that this mod has been loaded.
		TriggerCookies.Loaded = true;

		TriggerCookies.ForceWriteMenu = true;
	});
}

//#endregion
/*=====================================================================================
TRIGGER COOKIES VISUAL IMPROVEMENTS
=======================================================================================*/
//#region Visual Improvements

TriggerCookies.ChangeFavicon = function () {

	// Set the favicon to a cookie, which it should have been all along.
	var link = document.createElement('link');
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = 'img/favicon.ico';
	//link.href = 'img/heavenlyMoney.png';
	document.getElementsByTagName('head')[0].appendChild(link);
}
TriggerCookies.RemoveTopBar = function () {

	l('topBar').parentNode.removeChild(l('topBar'));
	var gameDiv = document.getElementById('game');
	gameDiv.style.top = '0px';
	var canvasDiv = document.getElementById('backgroundLeftCanvas');
	canvasDiv.height += 32;
}
TriggerCookies.ChangeLogButton = function () {

	l('logButton').innerHTML = 'Mods';
}
TriggerCookies.ChangeScrollBar = function () {

	l('sectionMiddle').style.overflow = 'inherit';
	l('menu').style.overflowX = 'hidden';
	l('menu').style.overflowY = 'scroll';

	l('rows').style.overflowX = 'hidden';
	l('rows').style.overflowY = 'scroll';
	l('rows').style.display = 'block';
	l('rows').style.position = 'absolute';
	l('rows').style.left = '16px';
	l('rows').style.right = '0px';
	l('rows').style.top = '112px';
	l('rows').style.bottom = '0px';
}
TriggerCookies.ChangeNewsTicker = function () {

	l('comments').style.backgroundImage = "url('img/darkNoise.jpg')";// = 'url(\'img/darkNoise.jpg\') repeat scroll 0% 0% #000;';
}

//#endregion
/*=====================================================================================
TRIGGER COOKIES MENU
=======================================================================================*/
//#region Menu

TriggerCookies.WriteSectionHead = function (name, icon) {
	var str = '';
	str += '<div class="listing"><div class="icon" style="background-position:' + (-icon[0] * 48) + 'px ' + (-icon[1] * 48) + 'px;"></div>' +
				'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + name + '</span></span></div>';
	str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 4px 0px 10px 14px;"></div>';
	return str;
}

TriggerCookies.WriteSectionMiddle = function () {
	var str = '<div style="width: 100%; margin: 12px 0px;"></div>';
	return str;
}
TriggerCookies.WriteSectionEnd = function () {
	var str = '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
	return str;
}

TriggerCookies.WriteSpacing = function (pixels) {
	if (!pixels)
		pixels = 8;
	var str = '<div style="margin-left: ' + pixels.toString() + 'px; display: inline;"></div>';
	return str;
}

/* Writes a mod button to the menu. */
TriggerCookies.WriteEnabledButton = function (mod) {
	var button = mod.Name + 'Button';
	var on = 'ENABLED'.fontcolor('green');
	var off = 'DISABLED'.fontcolor('red');
	return '<a class="option" id="' + button + '" style="margin-left:16px; vertical-align:29%;" ' + Game.clickStr + '="TriggerCookies.Toggle(\'' + mod.Name + '\',\'' + button + '\');' + '">' + (mod.Enabled ? on : off) + '</a>';
}
/* Toggles the mod button function. */
TriggerCookies.Toggle = function (name, button) {
	var mod = TriggerCookies.Mods[name];
	if (mod.Enabled) {
		l(button).innerHTML = 'DISABLED'.fontcolor('red');
		l(button).className = 'option';
		mod.Disable();
	}
	else {
		l(button).innerHTML = 'ENABLED'.fontcolor('green');
		l(button).className = 'option enabled';
		mod.Enable();
	}
	Game.UpdateMenu();
}


TriggerCookies.WriteTabButton = function (name) {
	return '<a id="' + 'tabbutton-' + name.replace(' ', '') + '" class="option framed large' + (TriggerCookies.CurrentTab != name ? ' off' : '') + ' title" style="margin: 2px 2px; border-style: none;"' +
		Game.clickStr + '="TriggerCookies.ChangeTab(\'' + name + '\'); Game.UpdateMenu();">' + name + '</a>';
}

TriggerCookies.WriteMenus = function () {
	TriggerCookies.ForceWriteMenu = false;

	TriggerCookies.SortTabs();

	var menu = l('modMenu');

	var str = '';

	str += '<div class="section">' + 'Trigger Cookies'.fontcolor('cyan') + '</div>';

	str += '<div style="width: 100%; margin: 0px; border-color: #733725; border-width: 1px 0px 0px; border-style: solid;"></div>' +
			'<div style="width: 100%; margin: 0px; border-color: #D1A699; border-width: 1px 0px 0px; border-style: solid;"></div>' +
			'<div style="width: 100%; margin: 0px; border-color: #733725; border-width: 1px 0px 0px; border-style: solid;"></div>';

	str += '<div id="tabList" class="listing" style="padding-top: 2px; padding-bottom: 2px">';

	for (var i in TriggerCookies.TabList) {
		var tab = TriggerCookies.TabList[i].name;
		str += TriggerCookies.WriteTabButton(tab);
	}

	str += '</div>';

	str += '<div style="width: 100%; margin: 0px; border-color: #733725; border-width: 1px 0px 0px; border-style: solid;"></div>' +
			'<div style="width: 100%; margin: 0px; border-color: #D1A699; border-width: 1px 0px 0px; border-style: solid;"></div>' +
			'<div style="width: 100%; margin: 0px 0px 5px; border-color: #733725; border-width: 1px 0px 0px; border-style: solid;"></div>';

	menu.innerHTML = str;

	var currentTab = TriggerCookies.CurrentTab.replace(' ', '');

	for (var i in TriggerCookies.TabList) {
		var realTab = TriggerCookies.TabList[i].name;
		var tab = realTab.replace(' ', '');

		var section = document.createElement('div');
		section.className = 'modsubsection';
		section.id = 'tab-' + tab;

		str = '';

		var empty = true;

		for (var i in TriggerCookies.Mods) {
			var mod = TriggerCookies.Mods[i];

			if (tab == 'ModList') {
				empty = false;

				// Enabling mods isn't really useful right now so don't draw the enable button
				/*str += '<div class="listing"><div class="icon" style="background-position:' + (-mod.Icon[0] * 48) + 'px ' + (-mod.Icon[1] * 48) + 'px;"></div>' +
					'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + mod.Name +
					TriggerCookies.WriteEnabledButton(mod) + '</span></span></div>';*/

				str += '<div class="listing"><div class="icon" style="background-position:' + (-mod.Icon[0] * 48) + 'px ' + (-mod.Icon[1] * 48) + 'px;"></div>' +
					'<span style="vertical-align:100%;"><span class="title" style="font-size:22px;">' + mod.Name +
					'</span></span></div>';

				if (mod.Enabled) {
					var str2 = mod.WriteMenu(realTab);
					if (str2.length != 0) {
						str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 10px 14px;"></div>';
						str += str2;
						str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 10px 0px 6px 14px;"></div>';
					}
					else {
						str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
					}
				}
				else {
					str += '<div style="width: calc(100% - 28px); border-bottom: 1px solid #333; margin: 6px 0px 6px 14px;"></div>';
				}
			}
			else {
				if (mod.Enabled) {
					var str2 = mod.WriteMenu(realTab);
					if (str2.length != 0) {
						str += str2;
						empty = false;
					}
				}
			}
		}
		section.style.display = (tab == currentTab ? 'block' : 'none');

		str += '<div style="padding-bottom:128px;"></div>';

		section.innerHTML = str;
		menu.appendChild(section);

		var button = l('tabbutton-' + tab);
		if (empty) {
			button.style.display = 'none';
		}
		else {
			display: 'inline-block';
		}
	}
}

/* Adds information to the Game menu menu. */
TriggerCookies.UpdateMenuLog = function () {

	if (TriggerCookies.ForceWriteMenu) {
		TriggerCookies.WriteMenus();
	}
	else {
		for (var i in TriggerCookies.Mods) {
			var mod = TriggerCookies.Mods[i];
			mod.UpdateMenu();
		}
	}

	return '';

}
TriggerCookies.ShowMenu = function (what) {
	if (!what || what == '') {
		what = Game.onMenu;
	}
	if (Game.onMenu == '' && what != '') {
		if (what == 'log') {
			Game.removeClass('onMenu');
			Game.addClass('onModMenu');
		}
		else {
			Game.addClass('onMenu');
			Game.removeClass('onModMenu');
		}
	}
	else if (Game.onMenu != '' && what != Game.onMenu) {
		if (what == 'log') {
			Game.removeClass('onMenu');
			Game.addClass('onModMenu');
		}
		else {
			Game.addClass('onMenu');
			Game.removeClass('onModMenu');
		}
	}
	else if (what == Game.onMenu) {
		Game.removeClass('onMenu');
		Game.removeClass('onModMenu');
		what = '';
	}
	if (what == 'log2')
		l('donateBox').className = 'on';
	else
		l('donateBox').className = '';
	Game.onMenu = what;

	l('prefsButton').className = (Game.onMenu == 'prefs') ? 'button selected' : 'button';
	l('statsButton').className = (Game.onMenu == 'stats') ? 'button selected' : 'button';
	l('logButton').className = (Game.onMenu == 'log') ? 'button selected' : 'button';

	Game.UpdateMenu();
}

TriggerCookies.ChangeTab = function (name) {
	TriggerCookies.CurrentTab = name;
	var currentTab = name.replace(' ', '');
	for (var i in TriggerCookies.TabList) {
		var tab = TriggerCookies.TabList[i].name.replace(' ', '');

		var button = l('tabbutton-' + tab);
		//button.style.display = (tab == currentTab ? 'block' : 'none');
		button.className = 'option framed large' + (tab != currentTab ? ' off' : '') + ' title';

		var section = l('tab-' + tab);
		section.style.display = (tab == currentTab ? 'block' : 'none');
	}
}

//#endregion
/*=====================================================================================
TRIGGER COOKIES MODS
=======================================================================================*/
//#region Mods

/* Adds the mod to the collection. */
TriggerCookies.AddMod = function (name, icon, load, unload, write, update, enabled) {

	TriggerCookies.Mods[name] = new ModInfo(name, icon, load, unload, write, update, enabled);

	TriggerCookies.ForceWriteMenu = true;
}

/* Adds a single tab. Lower priorities go first. */
TriggerCookies.AddTab = function (name, priority) {
	var newTab = { name: name, priority: priority };
	var tabExists = false;

	for (var j = 0; j < TriggerCookies.TabList.length; j++) {
		var tab = TriggerCookies.TabList[j];

		if (newTab.name == tab.name) {
			tabExists = true;
			break;
		}
	}

	if (!tabExists) {
		TriggerCookies.TabList.push(newTab);
	}
}

/* Adds a list of tabs in the structure [{name:, priority:},...]. Lower priorities go first. */
TriggerCookies.AddTabs = function (tabs) {
	for (var i = 0; i < tabs.length; i++) {
		var newTab = tabs[i];
		var tabExists = false;

		for (var j = 0; j < TriggerCookies.TabList.length; j++) {
			var tab = TriggerCookies.TabList[j];

			if (newTab.name == tab.name) {
				tabExists = true;
				break;
			}
		}

		if (!tabExists) {
			TriggerCookies.TabList.push(newTab);
		}
	}
}

TriggerCookies.SortTabs = function () {

	TriggerCookies.TabList.sort(function (a, b) {
		if (a.priority != b.priority)
			return a.priority - b.priority;
		else
			return a.name - b.name;
	});

	TriggerCookies.CurrentTab = TriggerCookies.TabList[0].name;
}

function ModInfo(name, icon, load, unload, write, update, enabled) {
	this.Name = name;
	this.Icon = icon;
	this.Load = load;
	this.Unload = unload;
	this.WriteMenu = write;
	this.UpdateMenu = update;
	this.Enabled = enabled;

	if (enabled)
		load();

	Game.Notify('Mod Loaded', '<div class="title" style="font-size:18px;">' + name.fontcolor(enabled ? 'cyan' : 'red') + '</div>', icon);

	TriggerCookies.ForceWriteMenu = true;
}
ModInfo.prototype.Enable = function () {
	if (!this.Enabled) {
		this.Enabled = true;
		this.Load();
		Game.Notify('Mod Enabled', '<div class="title" style="font-size:18px;">' + this.Name.fontcolor('cyan') + '</div>', this.Icon);
	}
}
ModInfo.prototype.Disable = function () {
	if (this.Enabled) {
		this.Enabled = false;
		this.Unload();
		Game.Notify('Mod Disabled', '<div class="title" style="font-size:18px;">' + this.Name.fontcolor('red') + '</div>', this.Icon);
	}
}

//#endregion
/*=====================================================================================
TRIGGER COOKIES VARIABLES
=======================================================================================*/
//#region Variables

/* The collection of mods. */
TriggerCookies.Mods = [];

/* The current tab open in the mods menu. */
TriggerCookies.CurrentTab = '';

/* The list of tabs. */
TriggerCookies.TabList = [
	//{ name: 'Statistics', priority: 100 },
	//{ name: 'Functionality', priority: 200 },
	//{ name: 'Automation', priority: 300 },
	//{ name: 'Cheating', priority: 400 },
	{ name: 'Mod List', priority: 1000000000 }
];

TriggerCookies.ForceWriteMenu = true;

//#endregion
/*=====================================================================================
LAUNCH TRIGGER COOKIES
=======================================================================================*/

// Launch Trigger Cookies
TriggerCookies.Init();

