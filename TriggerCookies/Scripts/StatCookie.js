/*=====================================================================================
AUTO-COOKIE MOD
=======================================================================================*/

// Author:       Robert Jordan
// Written For:  v.1.0501 beta
// Repository:   https://github.com/nrensen/TriggerCookies/tree/master/TriggerCookies
// Raw File:     https://github.com/nrensen/TriggerCookies/raw/master/TriggerCookies/Scripts/StatCookie.js

// Based off "Cookieclicker Bots".
// Link: https://gist.githubusercontent.com/pernatiy/38bc231506b06fd85473/raw/cc.js

/*=====================================================================================
QUICK FUNCTIONS
=======================================================================================*/
//#region Quick Functions

/* Gets the URL of where the mod is being hosted. */
function GetModURL() {
	var name = 'StatCookie';
	var url = document.getElementById('modscript_' + name).getAttribute('src');
	url = url.replace('Scripts/' + name + '.js', '');
	return url;
}
/* Returns true if the specified mod is loaded. */
function IsModLoaded(name) {
	return (document.getElementById('modscript_' + name) != null);
}
/* Loads the Trigger Cookies Mod Manager. */
function LoadTriggerCookies() {
	if (!IsModLoaded('TriggerCookies')) {
		Game.LoadMod(GetModURL() + 'Scripts/TriggerCookies.js');
	}
}
/* Loads the specified Trigger Cookies Mod. */
function LoadMod(name) {
	if (!IsModLoaded(name)) {
		Game.LoadMod(GetModURL() + 'Scripts/' + name + '.js');
	}
}
/* Returns true if the variable is defined and equals the value. */
function IsDefined(name, value) {
	return eval('(typeof ' + name.split('.')[0] + ' !== \'undefined\') && (typeof ' + name + ' !== \'undefined\') && (' + name + ' === ' + value + ')');
}
/* Creates an interval to wait until TriggerCookies is loaded */
function IntervalUntilLoaded(func) {
	var checkReady = setInterval(function () {
		if (IsDefined('TriggerCookies.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}
/* Creates an interval to wait until all the specified mods are loaded loaded */
function IntervalUntilAllLoaded(mods, func) {
	var checkReady = setInterval(function () {
		var allLoaded = true;
		for (var i = 0; i < mods.length; i++) {
			if (!IsDefined(mods[i] + '.Loaded', 'true')) { allLoaded = false; break; }
		}
		if (allLoaded && IsDefined('TriggerCookies.Loaded', 'true')) {
			func();
			clearInterval(checkReady);
		}
	}, 100);
}

/* Returns the element used in Stat Cookie. */
function lStat(name) {
	if (name.indexOf('StatCookie') != 0)
		return l('StatCookie' + name);
	return l(name);
}
/* Returns the element with the name used in Stat Cookie. */
function iStat(name) {
	if (name.indexOf('StatCookie') != 0)
		return 'StatCookie' + name;
	return name;
}

//#endregion
/*=====================================================================================
AUTO-COOKIE DEFINITIONS
=======================================================================================*/
//#region Definitions

/* The static class that manages the mod. */
StatCookie = {};
/* The static class that manages Game backups. */
StatCookie.Backup = {};
/* True if the mod has been loaded. */
StatCookie.Loaded = false;
/* True if the mod is enabled. */
StatCookie.Enabled = false;

//#endregion
/*=====================================================================================
AUTO-COOKIE INITIALIZATION
=======================================================================================*/
//#region Initialization

/* Initializes Stat-Cookie. */
StatCookie.Init = function () {
	LoadTriggerCookies();
	LoadMod('CalcCookie');

	IntervalUntilAllLoaded(['CalcCookie'], function () {
		TriggerCookies.AddMod('Stat Cookie', 'StatCookie', [9, 6], StatCookie.Enable, StatCookie.Disable, null, null, StatCookie.WriteMenu, StatCookie.UpdateMenu, true);
		TriggerCookies.AddTab('Statistics', 100);

		// Hey guess what!? This is a mod you're using! So why not receive the plugin shadow achievement?
		Game.Win('Third-party');

		StatCookie.Loaded = true;
	});
}

/* Enables Stat-Cookie. */
StatCookie.Enable = function (firstTime) {
	
	if (firstTime) {
		l('goldenCookie').removeEventListener('click', Game.goldenCookie.click);
		l('goldenCookie').removeEventListener('touchend', Game.goldenCookie.click);
		Overrides.OverrideFunction('Game.goldenCookie.click', 'StatGolden.Click', 'StatCookie');
		Overrides.OverrideFunction('Game.seasonPopup.click', 'StatSeasons.Click', 'StatCookie');
		Game.customLogic.push(StatGolden.Logic);
		l('goldenCookie')[Game.clickStr] = Game.goldenCookie.click;
		l('seasonPopup')[Game.clickStr] = Game.seasonPopup.click;
	}

	StatCookie.Enabled = true;
}
/* Disables Stat-Cookie. */
StatCookie.Disable = function () {

	StatCookie.Enabled = false;
}

//#endregion
/*=====================================================================================
STAT COOKIE MENU
=======================================================================================*/
//#region Menu

/* Writes the mod menu. */
StatCookie.WriteMenu = function (tab) {

	var str = '';

	if (tab == 'Mod List') {
		
	}
	else if (tab == 'Statistics') {

		str += StatCookie.CookieStats.WriteStats();
		str += StatCookie.GoldenStats.WriteStats();
		str += StatCookie.PrestigeStats.WriteStats();
		str += StatCookie.WrinklerStats.WriteStats();
		str += StatCookie.SeasonStats.WriteStats();

	}

	return str;
}
/* Updates the mod menu. */
StatCookie.UpdateMenu = function () {

	if (TriggerCookies.CurrentTab == 'Mod List') {

	}
	else if (TriggerCookies.CurrentTab == 'Statistics') {

		StatCookie.CookieStats.UpdateStats();
		StatCookie.GoldenStats.UpdateStats();
		StatCookie.PrestigeStats.UpdateStats();
		StatCookie.WrinklerStats.UpdateStats();
		StatCookie.SeasonStats.UpdateStats();

	}
}

//#endregion
/*=====================================================================================
STAT COOKIE BUYOUT ITEM
=======================================================================================*/

function BuyoutItem(name, type, priority, price, time) {
	this.Name = name || '';
	this.Type = type || 'invalid';
	this.Priority = priority || 0;
	this.Price = price || 0;
	this.Time = time || 0;
	this.Afford = price <= Game.cookies;
}
BuyoutItem.prototype.Buy = function () {
	if (this.Type == 'building')
		Game.Objects[this.Name].buy();
	else if (this.Type == 'upgrade')
		Game.Upgrades[this.Name].buy(true);
}

/*=====================================================================================
STAT COOKIE COOKIES
=======================================================================================*/
//#region Cookies

function StatCookies() {

	this.BaseCPS = 0;
	this.ClickCPS = 0;
	this.ClicksPerSecond = 0;
	this.TotalCPS = 0;

	/*var t = 500.0;
	this.Clicks	 = [{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t },
					{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t },
					{ clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }, { clicks: 0, time: t }];
	this.Clicks[0].time = new Date().getTime();
	this.CookieClicksLast = Game.cookieClicks;*/

	//setInterval(this.UpdateClickRate.bind(this), 500);
}
StatCookies.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += Helper.Menu.WriteSectionHeader('Cookies', [3, 5]);

	str +=
	'<div class="listing"><b>Cookies in bank :</b> <div id="' + iStat('cookiesInBank') + '" class="price plain">' + Beautify(Game.cookies) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (this game) :</b> <div id="' + iStat('cookiesThisGame') + '" class="price plain">' + Beautify(Game.cookiesEarned) + '</div></div>' +
	'<div class="listing"><b>Cookies baked (all time) :</b> <div id="' + iStat('cookiesAllTime') + '" class="price plain">' + Beautify(Game.cookiesEarned + Game.cookiesReset) + '</div></div>' +
	'<div class="listing"><b>Cookies forfeited by ascending :</b> <div id="' + iStat('cookiesForfeited') + '" class="price plain">' + Beautify(Game.cookiesReset) + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b>Current CPS : </b> <div id="' + iStat('currentCPS') + '" class="price plain"> ' + Beautify(Game.cookiesPs, 1) + ' <small>' +
		'(multiplier : ' + Beautify(Math.round(Game.globalCpsMult * 100), 1) + '%)' +
		(Game.cpsSucked > 0 ? ' <span class="warning">(withered : ' + Beautify(Math.round(Game.cpsSucked * 100), 1) + '%)</span>' : '') +
		'</small></div></div>' +
	'<div class="listing"><b>Base CPS : </b> <div id="' + iStat('baseCPS') + '" class="price plain">' + Beautify(this.BaseCPS) + '</div></div>' +
	'<div class="listing"><b>Click CPS : </b> <div id="' + iStat('clickCPS') + '" class="price plain">' + Beautify(this.ClickCPS) + '</div></div>' +
	'<div class="listing"><b>Total CPS : </b> <div id="' + iStat('totalCPS') + '" class="price plain">' + Beautify(this.TotalCPS) + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b>Hand-made cookies : </b> <div id="' + iStat('handMade') + '" class="price plain"> ' + Beautify(Game.handmadeCookies) + '</div></div>' +
	'<div class="listing"><b>Cookies per click : </b> <div id="' + iStat('cookiesPerClick') + '" class="price plain"> ' + Beautify(Game.computedMouseCps, 1) + '</div></div>' +
	'<div class="listing"><b>Cookie clicks : </b> <div id="' + iStat('clicks') + '" class="priceoff">' + Beautify(Game.cookieClicks) + '</div></div>' +
	'<div class="listing"><b>Clicks per second : </b> <div id="' + iStat('clickRate') + '" class="priceoff">' + Beautify(this.ClicksPerSecond) + '</div></div>' +

	'';

	str += Helper.Menu.WriteSectionEnd();

	return str;
}
StatCookies.prototype.UpdateStats = function () {
	this.Update();

	lStat('cookiesInBank').innerHTML = Beautify(Game.cookies);
	lStat('cookiesThisGame').innerHTML = Beautify(Game.cookiesEarned);
	lStat('cookiesAllTime').innerHTML = Beautify(Game.cookiesEarned + Game.cookiesReset);
	lStat('cookiesForfeited').innerHTML = Beautify(Game.cookiesReset);

	lStat('currentCPS').innerHTML = Beautify(Game.cookiesPs, 1) + ' <small>' +
		'(multiplier : ' + Beautify(Math.round(Game.globalCpsMult * 100), 1) + '%)' +
		(Game.cpsSucked > 0 ? ' <span class="warning">(withered : ' + Beautify(Math.round(Game.cpsSucked * 100), 1) + '%)</span>' : '') +
		'</small>';
	lStat('baseCPS').innerHTML = Beautify(this.BaseCPS);
	lStat('clickCPS').innerHTML = Beautify(this.ClickCPS);
	lStat('totalCPS').innerHTML = Beautify(this.TotalCPS);

	lStat('handMade').innerHTML = Beautify(Game.handmadeCookies);
	lStat('cookiesPerClick').innerHTML = Beautify(Game.computedMouseCps, 1);
	lStat('clicks').innerHTML = Beautify(Game.cookieClicks);
	lStat('clickRate').innerHTML = Beautify(this.ClicksPerSecond);

}
StatCookies.prototype.Update = function () {

	var frenzyMod = (Game.frenzy > 0) ? Game.frenzyPower : 1;
	this.ClicksPerSecond = CalcCookie.ClicksPerSecond;

	this.BaseCPS = Game.cookiesPs / frenzyMod;
	this.ClickCPS = this.ClicksPerSecond * Game.computedMouseCps;
	this.TotalCPS = Game.cookiesPs * (1 - Game.cpsSucked) + this.ClickCPS;

}
/*StatCookies.prototype.UpdateClickRate = function () {
	this.Clicks[0].clicks = Math.max(0, Game.cookieClicks - this.CookieClicksLast);
	this.Clicks[0].time = new Date().getTime() - this.Clicks[0].time;
	var totalClicks = this.Clicks[0].clicks;
	var totalTime = this.Clicks[0].time;
	for (var i = this.Clicks.length - 2; i >= 0; i--) {
		totalClicks += this.Clicks[i + 1].clicks;
		totalTime += this.Clicks[i + 1].time;
		this.Clicks[i + 1] = this.Clicks[i];
	}
	this.Clicks[0].time = new Date().getTime();
	//this.ClicksPerSecond = totalClicks / this.Clicks.length;
	this.ClicksPerSecond = totalClicks / totalTime * 1000.0;

	this.CookieClicksLast = Game.cookieClicks;
}*/

//#endregion
/*=====================================================================================
STAT COOKIE GOLDEN COOKIES
=======================================================================================*/
//#region Golden Cookies

function StatGolden() {
	this.LuckyRequired = 0;
	this.LuckyFrenzyRequired = 0;
	this.LuckyReward = 0;
	this.LuckyFrenzyReward = 0;

	this.MaxCookieChain = 0;
	this.NextCookieChain = 0;
	this.NextCPSChain = 0;

	this.Effects = {};
	this.Resets = 0;
	this.Frenzy = 0;
	this.FrenzyKey = '';
	this.FrenzyEarn = 0;
	this.FrenzyPower = 0;
	this.ClickFrenzy = 0;
	this.ClickFrenzyKey = '';
	this.ClickFrenzyClicks = 0;
	this.ClickFrenzyEarn = 0;
	this.ClickFrenzyPower = 0;
}
StatGolden.prototype.WriteStats = function () {
	this.Update();

	var str = '';

	str += Helper.Menu.WriteSectionHeader('Golden Cookies', [10, 14]);

	str +=
	'<div class="listing"><b>Golden cookie clicks :</b> <div id="' + iStat('goldenClicks') + '" class="priceoff">' + Beautify(Game.goldenClicksLocal) +
		' <small>(all time : ' + Beautify(Game.goldenClicks) + ')</small></div></div>' +
	'<div class="listing"><b>Golden cookies missed : </b> <div id="' + iStat('goldenMissed') + '" class="priceoff">' + Beautify(Game.missedGoldenClicks) + '</div></div>' +
	'<div class="listing"><b>Last effect : </b> <div id="' + iStat('lastEffect') + '" class="priceoff">N/A</div></div>' +

	'<div id="' + iStat('goldenEffects') + '" class="priceoff"></div>' +

	'<div class="listing"><b>Lucky cookies required : </b> <div id="' + iStat('luckyRequired') + '" class="price plain">' + Beautify(this.LuckyRequired) + '</div></div>' +
	'<div class="listing"><b>Lucky+Frenzy cookies required : </b> <div id="' + iStat('luckyFrenzyRequired') + '" class="price plain">' + Beautify(this.LuckyFrenzyRequired) + '</div></div>' +
	'<div class="listing"><b>Lucky reward : </b> <div id="' + iStat('luckyReward') + '" class="price plain">' + Beautify(this.LuckyReward) + '</div></div>' +
	'<div class="listing"><b>Lucky+Frenzy reward : </b> <div id="' + iStat('luckyFrenzyReward') + '" class="price plain">' + Beautify(this.LuckyFrenzyReward) + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b>Max cookie chain reward : </b> <div id="' + iStat('maxCookieChain') + '" class="price plain">' + Beautify(this.MaxCookieChain) + '</div></div>' +
	'<div class="listing"><b>Cookies for next chain tier : </b> <div id="' + iStat('nextCookieChain') + '" class="price plain">' + Beautify(this.NextCookieChain) + '</div></div>' +
	'<div class="listing"><b>CPS for next chain tier : </b> <div id="' + iStat('nextCPSChain') + '" class="price plain">' + Beautify(this.NextCPSChain) + '</div></div>' +

	'';

	str += Helper.Menu.WriteSectionEnd();

	return str;
}
StatGolden.GetEffectName = function(effect) {
	var names = {
		'multiply cookies': 'Lucky',
		'ruin cookies': 'Ruin',
		'clot': 'Clot',
		'frenzy': 'Frenzy',
		'blood frenzy': 'Elder Frenzy',
		'click frenzy': 'Click Frenzy',
		'chain cookie': 'Cookie Chain',
		'dragon harvest': 'Dragon Harvest',
		'dragonflight': 'Dragon Flight',
		'blab': 'Blab'
	};
	return effect.split('+').map(item => names[item] || item).join('+');
}
StatGolden.prototype.UpdateStats = function () {
	this.Update();

	lStat('goldenClicks').innerHTML = Beautify(Game.goldenClicksLocal) +
		' <small>(all time : ' + Beautify(Game.goldenClicks) + ')</small>';
	lStat('goldenMissed').innerHTML = Beautify(Game.missedGoldenClicks);
	if (Game.goldenCookie.last == '')
		lStat('lastEffect').innerHTML = 'None';
	else
		lStat('lastEffect').innerHTML = StatGolden.GetEffectName(Game.goldenCookie.last);

	var effects = {}
	Object.keys(this.Effects).forEach(key =>
		effects[StatGolden.GetEffectName(key)] = this.Effects[key]);
	var str = Object.keys(effects).sort().reduce((str, name) => {
		var effect = effects[name];
		str += '<div class="listing">' +
		    '<b>' + name + ' : </b>' +
		    '<div class="priceoff">' + Beautify(effect.count) + '</div>' + ' for';
		if (effect.duration > 0)
			str += ' <div class="priceoff">' + Helper.Numbers.GetTime(effect.duration / Game.fps * 1000, 3) + '</div>';
		if (effect.cookies != 0)
			str += ' <div class="price plain">' + Beautify(effect.cookies) + '</div>';
		str += '</div>';
		return str;
	}, '');

	if (str != '')
		str = Helper.Menu.WriteSectionMiddle() + str + Helper.Menu.WriteSectionMiddle();
	lStat('goldenEffects').innerHTML = str;

	lStat('luckyRequired').innerHTML = Beautify(this.LuckyRequired);
	lStat('luckyFrenzyRequired').innerHTML = Beautify(this.LuckyFrenzyRequired);
	lStat('luckyReward').innerHTML = Beautify(this.LuckyReward);
	lStat('luckyFrenzyReward').innerHTML = Beautify(this.LuckyFrenzyReward);

	lStat('maxCookieChain').innerHTML = Beautify(this.MaxCookieChain);
	lStat('nextCookieChain').innerHTML = Beautify(this.NextCookieChain);
	lStat('nextCPSChain').innerHTML = Beautify(this.NextCPSChain);
}
StatGolden.prototype.Update = function () {

	// Lucky
	this.LuckyRequired = StatCookie.CookieStats.BaseCPS * 6000;
	this.LuckyReward = Math.min(Game.cookies * 0.15, StatCookie.CookieStats.BaseCPS * 900) + 13;//add 15% to cookies owned (+13), or 15 minutes of cookie production - whichever is lowest
	this.LuckyFrenzyRequired = StatCookie.CookieStats.BaseCPS * 42000;
	this.LuckyFrenzyReward = Math.min(Game.cookies * 0.15, StatCookie.CookieStats.BaseCPS * 6300) + 13;//add 15% to cookies owned (+13), or 105 minutes of cookie production - whichever is lowest

	
	// Cookie Chain
	var digit = 7;

	var maxCookies = Game.cookies * 0.25;
	var maxLogCookies = Math.floor(Math.log(maxCookies) / Math.LN10);
	var maxCookiesChain = maxLogCookies + 1;
	while (maxCookies < (Math.floor(1 / 9 * Math.pow(10, maxCookiesChain) * digit))) {
		maxCookiesChain--;
	}
	var nextCookies = (Math.floor(1 / 9 * Math.pow(10, maxCookiesChain + 1) * digit)) * 4;

	var maxCPS = Game.cookiesPs * 60 * 60 * 3;
	var maxLogCPS = Math.floor(Math.log(maxCPS) / Math.LN10);
	var maxCPSChain = maxLogCPS + 1;
	while (maxCPS < (Math.floor(1 / 9 * Math.pow(10, maxCPSChain) * digit))) {
		maxCPSChain--;
	}
	var nextCPS = (Math.floor(1 / 9 * Math.pow(10, maxCPSChain + 1) * digit)) / 60 / 60 / 3;
	
	this.NextCookieChain = nextCookies;
	this.NextCPSChain = nextCPS;

	var chain = 1 + Math.max(0, Math.ceil(Math.log(Game.cookies) / Math.LN10) - 10);
	var moni = 0;
	var nextMoni = 1;
	var maxPayout = Math.min(Game.cookiesPs * 60 * 60 * 3, Game.cookies * 0.25); // max payout is 25% of cookies owned, or 3 hours of production - whichever is lowest
	
	moni = 0; nextMoni = 1;
	for (; nextMoni < maxPayout || chain <= 4; chain++) {
		moni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain) * digit), maxPayout));
		nextMoni = Math.max(digit, Math.min(Math.floor(1 / 9 * Math.pow(10, chain + 1) * digit), maxPayout));
	}
	this.MaxCookieChain = moni;

	if (Game.resets != this.Resets) {
		this.Effects = {};
		this.Resets = Game.resets;
	}
}

StatGolden.prototype.Accumulate = function (oldfrenzy) {
	if (this.ClickFrenzyKey) {
		var key = this.ClickFrenzyKey;
		var effect = this.Effects[key];
		var duration = this.ClickFrenzy - Game.clickFrenzy;
		effect.duration += duration;
		var earn = Game.computedMouseCps *
		    (Game.cookieClicks - this.ClickFrenzyClicks) *
		    (1 - 1 / this.ClickFrenzyPower);
		this.ClickFrenzyClicks = Game.cookieClicks;
		effect.cookies += earn;
		this.ClickFrenzyEarn += earn;
		this.ClickFrenzy = Game.clickFrenzy;
		if (this.ClickFrenzy == 0) {
			this.ClickFrenzyKey = '';
			Helper.TimeLog(StatGolden.GetEffectName(key) +
			    ' ended: ' + Beautify(this.ClickFrenzyEarn) +
			    ' cookies');
		}
	}

	if (this.FrenzyKey) {
		var key = this.FrenzyKey;
		var effect = this.Effects[key];
		var interrupt = oldfrenzy !== undefined;
		var duration = this.Frenzy -
		    (interrupt ? oldfrenzy : Game.frenzy);
		effect.duration += duration;
		var nwrinklers = 0;
		for (var i in Game.wrinklers)
			if (Game.wrinklers[i].phase == 2)
				nwrinklers++;
		var earn = Game.cookiesPs / Game.fps *
		    (1 - Game.cpsSucked + nwrinklers * Game.cpsSucked) *
		    duration * (1 - 1 / this.FrenzyPower);
		effect.cookies += earn;
		this.FrenzyEarn += earn;
		this.Frenzy = Game.frenzy;
		if (this.Frenzy == 0 || interrupt) {
			this.FrenzyKey = '';
			var action = interrupt ? 'interrupted' : 'ended';
			Helper.TimeLog(StatGolden.GetEffectName(key) + ' ' +
			    action + ': ' + Beautify(this.FrenzyEarn) +
			    ' cookies');
		}
	}
}
StatGolden.Click = function(event, force) {
	var gc = Game.goldenCookie;
	var oldchain = gc.chain;
	var oldcookies = Game.cookies;
	var oldfrenzy = Game.frenzy;
	var oldclickFrenzy = Game.clickFrenzy;
	var oldclicks = Game.goldenClicks;
	var duration = 0;

	Overrides.Backup.Functions['Game.goldenCookie.click'].func(event,force);

	if (Game.goldenClicks == oldclicks)
		return;

	var me = StatCookie.GoldenStats;
	var earn = Game.cookies - oldcookies;
	var key = gc.last;
	if (Game.frenzy > 0 && (earn != 0 || Game.clickFrenzy > oldclickFrenzy))
		key += '+' + me.FrenzyKey;
	var effect = me.Effects[key];
	if (effect === undefined)
		me.Effects[key] = effect =
		    { count: 0, cookies: 0, duration: 0 };

	if (oldchain == 0)
		effect.count++;

	var msg = StatGolden.GetEffectName(key);

	if (earn != 0) {
		effect.cookies += earn;
		msg += ': ' + Beautify(earn) + ' cookies';
		if (gc.last == 'chain cookie' && gc.chain == 0)
			msg += ' (total: ' + Beautify(gc.total) +
			    ' cookies)';
	} else if (Game.clickFrenzy > oldclickFrenzy) {
		me.ClickFrenzyKey = key;
		me.ClickFrenzy = Game.clickFrenzy;
		me.ClickFrenzyClicks = Game.cookieClicks;
		me.ClickFrenzyPower = Game.clickFrenzyPower;
		me.ClickFrenzyEarn = 0;
		duration = Game.clickFrenzy / Game.fps;
		msg += ' started: ' + duration + 's';
	} else if (gc.last != 'blab') {
		// interruped frenzy
		if (me.FrenzyKey)
			me.Accumulate(oldfrenzy);
		me.FrenzyKey = key;
		me.Frenzy = Game.frenzy;
		me.FrenzyPower = Game.frenzyPower;
		me.FrenzyEarn = 0;
		duration = Game.frenzy / Game.fps;
		msg += ' started: ' + duration + 's';
	}

	Helper.TimeLog(msg);
}
StatGolden.Logic = function()
{
	StatCookie.GoldenStats.Accumulate();
}

//#endregion
/*=====================================================================================
STAT COOKIE PRESTIGE
=======================================================================================*/
//#region Prestige

function StatPrestige() {

	this.AscendNowToGet = 0;

	this.CookiesToNextXChips = 0;

	this.XAmount = 1;

	this.CookiesPerChip = 0;

	this.ChipsPerSecond = 0;
	this.BaseChipsPerSecond = 0;
	this.ClickChipsPerSecond = 0;
	this.TotalChipsPerSecond = 0;
}
StatPrestige.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += Helper.Menu.WriteSectionHeader('Prestige', [19, 7]);

	str +=
	'<div class="listing"><b>Heavenly Cookies in bank : </b> <div id="' + iStat('hcookiesBank') + '" class="priceoff">' + Beautify(Game.heavenlyCookies) + '</div></div>' +
	'<div class="listing"><b>Heavenly Chips in bank : </b> <div id="' + iStat('hchipsBank') + '" class="price plain heavenly">' + Beautify(Game.heavenlyChips) + '</div></div>' +
	'<div class="listing"><b>Heavenly Chips earned : </b> <div id="' + iStat('hchipsEarned') + '" class="price plain heavenly">' + Beautify(Game.heavenlyChipsEarned) + '</div></div>' +
	'<div class="listing"><b>Chips earned from ascend : </b> <div id="' + iStat('hchipsAscend') + '" class="price plain heavenly">' + Beautify(this.AscendNowToGet) + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b>Current chips per second : </b> <div id="' + iStat('currentHCPS') + '" class="price plain heavenly">' + Beautify(this.ChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Base chips per second : </b> <div id="' + iStat('baseHCPS') + '" class="price plain heavenly">' + Beautify(this.BaseChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Click chips per second : </b> <div id="' + iStat('clickHCPS') + '" class="price plain heavenly">' + Beautify(this.ClickChipsPerSecond) + '</div></div>' +
	'<div class="listing"><b>Total chips per second : </b> <div id="' + iStat('totalHCPS') + '" class="price plain heavenly">' + Beautify(this.TotalChipsPerSecond) + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b id="' + iStat('hchipNextXAmount') + '">Cookies to next ' + Beautify(this.XAmount) + ' chip' + (this.XAmount != 1 ? 's' : '') + ' : </b> <div id="' + iStat('hchipNextCookies') + '" class="price plain">' + Beautify(this.CookiesToNextXChips) + '</div></div>' +
	'<div class="listing"><b>Cookies per chip : </b> <div id="' + iStat('cookiesPerHChip') + '" class="price plain">' + Beautify(this.CookiesPerChip) + '</div></div>' +

	'';

	str += Helper.Menu.WriteSectionEnd();

	return str;
}
StatPrestige.prototype.UpdateStats = function () {
	this.Update();

	lStat('hcookiesBank').innerHTML = Beautify(Game.heavenlyCookies);
	lStat('hchipsBank').innerHTML = Beautify(Game.heavenlyChips);
	lStat('hchipsEarned').innerHTML = Beautify(Game.heavenlyChipsEarned);
	lStat('hchipsAscend').innerHTML = Beautify(this.AscendNowToGet);

	lStat('currentHCPS').innerHTML = Beautify(this.ChipsPerSecond);
	lStat('baseHCPS').innerHTML = Beautify(this.BaseChipsPerSecond);
	lStat('clickHCPS').innerHTML = Beautify(this.ClickChipsPerSecond);
	lStat('totalHCPS').innerHTML = Beautify(this.TotalChipsPerSecond);

	lStat('hchipNextXAmount').innerHTML = 'Cookies to next ' + Beautify(this.XAmount) + ' chip' + (this.XAmount != 1 ? 's' : '') + ' : ';
	lStat('hchipNextCookies').innerHTML = Beautify(this.CookiesToNextXChips);
	lStat('cookiesPerHChip').innerHTML = Beautify(this.CookiesPerChip);

}
StatPrestige.prototype.Update = function () {

	this.AscendNowToGet = Math.floor(Game.HowMuchPrestige(Game.cookiesReset + Game.cookiesEarned) - Game.HowMuchPrestige(Game.cookiesReset));

	var totalChips = Game.heavenlyChipsEarned + this.AscendNowToGet;
	var chipXDigits = Math.max(0, Math.floor(Math.log(this.AscendNowToGet) / Math.log(10)) - 3);

	this.CookiesPerChip = Game.HowManyCookiesReset(totalChips + 1) - Game.HowManyCookiesReset(totalChips);

	this.XAmount = Math.pow(10, chipXDigits);


	var chipsNext = Game.heavenlyChipsEarned + (this.AscendNowToGet + this.XAmount) - (this.AscendNowToGet + this.XAmount) % this.XAmount;
	this.CookiesToNextXChips = Game.HowManyCookiesReset(chipsNext) - (Game.cookiesReset + Game.cookiesEarned);

	this.ChipsPerSecond = Game.cookiesPs / this.CookiesPerChip;
	this.BaseChipsPerSecond = StatCookie.CookieStats.BaseCPS / this.CookiesPerChip;
	this.ClickChipsPerSecond = StatCookie.CookieStats.ClickCPS / this.CookiesPerChip;
	this.TotalChipsPerSecond = StatCookie.CookieStats.TotalCPS / this.CookiesPerChip;

}

//#endregion
/*=====================================================================================
STAT COOKIE WRINKLERS
=======================================================================================*/
//#region Wrinklers

function StatWrinklers() {
	this.CookiesSucked = 0;
	this.CookiesReward = 0;
	this.NumWrinklers = 0;
	this.NumWrinklersSucking = 0;
	this.WrinklerMultiplier = 1;
}
StatWrinklers.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += Helper.Menu.WriteSectionHeader('Wrinklers', [19, 8]);

	str +=
	'<div class="listing"><b>Wrinklers popped : </b> <div id="' + iStat('wrinklersPopped') + '" class="priceoff">' + Beautify(Game.wrinklersPopped) + '</div></div>' +
	'<div class="listing"><b>Wrinkler multiplier : </b> <div id="' + iStat('wrinklerMultiplier') + '" class="priceoff">' + Beautify(this.WrinklerMultiplier * 100) + '%' + '</div></div>' +

	Helper.Menu.WriteSectionMiddle() +

	'<div class="listing"><b>Number of wrinklers : </b> <div id="' + iStat('numWrinklers') + '" class="priceoff">' + Beautify(this.NumWrinklers) +
		(this.NumWrinklers == 10 ? ' <small>(maxed)</small>' : '') + '</div></div>' +
	'<div class="listing"><b>Cookies sucked : </b> <div id="' + iStat('cookiesSucked') + '" class="price plain">' + Beautify(this.CookiesSucked) + '</div></div>' +
	'<div class="listing"><b>Reward for popping :</b> <div id="' + iStat('cookiesSuckedReward') + '" class="price plain">' + Beautify(this.CookiesReward) + '</div></div>' +

	'';

	str += Helper.Menu.WriteSectionEnd();

	return str;
}
StatWrinklers.prototype.UpdateStats = function () {
	this.Update();

	lStat('wrinklersPopped').innerHTML = Beautify(Game.wrinklersPopped);
	lStat('wrinklerMultiplier').innerHTML = Beautify(this.WrinklerMultiplier * 100) + '%';

	lStat('numWrinklers').innerHTML = Beautify(this.NumWrinklers) +
		(this.NumWrinklers == 10 ? ' <small>(maxed)</small>' : '')
	lStat('cookiesSucked').innerHTML = Beautify(this.CookiesSucked);
	lStat('cookiesSuckedReward').innerHTML = Beautify(this.CookiesReward);
}
StatWrinklers.prototype.Update = function () {

	this.NumWrinklers = 0;
	this.NumWrinklersSucking = 0;
	this.CookiesSucked = 0;

	this.WrinklerMultiplier = 1.1;
	if (Game.Has('Sacrilegious corruption')) this.WrinklerMultiplier *= 1.05;
	if (Game.Has('Wrinklerspawn')) this.WrinklerMultiplier *= 1.05;

	for (var i in Game.wrinklers) {
		var me = Game.wrinklers[i];

		if (me.phase > 0) {
			this.NumWrinklers++;
			if (me.phase == 2) {
				this.NumWrinklersSucking++;
				this.CookiesSucked += me.sucked;
			}
		}
	}

	this.CookiesReward = this.CookiesSucked * this.WrinklerMultiplier;
}

//#endregion
/*=====================================================================================
STAT COOKIE SEASONS
=======================================================================================*/
//#region Seasons

function StatSeasons() {
	this.SantaLevel = 0;
	this.SantaDrops = 0;
	this.ChristmasCookies = 0;
	this.SpookyCookies = 0
	this.HeartCookies = 0;
	this.EasterEggs = 0;
	this.RareEggs = 0;
	this.Reindeer = {};
	this.Resets = 0;

	this.Lists = {};
	this.Lists.SantaLevels = ['Festive test tube', 'Festive ornament', 'Festive wreath', 'Festive tree', 'Festive present', 'Festive elf fetus', 'Elf toddler', 'Elfling', 'Young elf', 'Bulky elf', 'Nick', 'Santa Claus', 'Elder Santa', 'True Santa', 'Final Claus'];
	this.Lists.SantaDrops = ['A festive hat', 'An itchy sweater', 'Increased merriness', 'Improved jolliness', 'A lump of coal', 'An itchy sweater', 'Reindeer baking grounds', 'Weighted sleighs', 'Ho ho ho-flavored frosting', 'Season savings', 'Toy workshop', 'Naughty list', 'Santa\'s bottomless bag', 'Santa\'s helpers', 'Santa\'s legacy', 'Santa\'s milk and cookies'];
	this.Lists.ChristmasCookies = ['Christmas tree biscuits', 'Snowflake biscuits', 'Snowman biscuits', 'Holly biscuits', 'Candy cane biscuits', 'Bell biscuits', 'Present biscuits'];
	this.Lists.SpookyCookies = ['Skull cookies', 'Ghost cookies', 'Bat cookies', 'Slime cookies', 'Pumpkin cookies', 'Eyeball cookies', 'Spider cookies'];
	this.Lists.HeartCookies = ['Pure heart biscuits', 'Ardent heart biscuits', 'Sour heart biscuits', 'Weeping heart biscuits', 'Golden heart biscuits', 'Eternal heart biscuits'];
	this.Lists.EasterEggs = ['Chicken egg', 'Duck egg', 'Turkey egg', 'Quail egg', 'Robin egg', 'Ostrich egg', 'Cassowary egg', 'Salmon roe', 'Frogspawn', 'Shark egg', 'Turtle egg', 'Ant larva', 'Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
	this.Lists.RareEggs = ['Golden goose egg', 'Faberge egg', 'Wrinklerspawn', 'Cookie egg', 'Omelette', 'Chocolate egg', 'Century egg', '"egg"'];
}
StatSeasons.prototype.WriteStats = function () {
	this.Update();

	var str = ''

	str += Helper.Menu.WriteSectionHeader('Seasons', [16, 6]);

	var seasonNames = {
		'': 'None',
		christmas: 'Christmas',
		halloween: 'Halloween',
		valentines: 'Valentines Day',
		easter: 'Easter',
		fools: 'Business Day'
	};

	str +=
	'<div class="listing"><b>Current season : </b> <div id="' + iStat('currentSeason') + '" class="priceoff">' + seasonNames[Game.season] + (Game.seasonT > 0 && Game.season != '' ? ' (time remaining: ' + Helper.Numbers.GetTime(Game.seasonT / Game.fps * 1000, 3) + ')' : '') + '</div></div>' +

	'<div id="' + iStat('reindeerFound') + '" class="priceoff"></div>' +

	// Christmas
	'<div class="listing"><b>Santa level : </b> <div id="' + iStat('santaLevel') + '" class="priceoff">' + Beautify(this.SantaLevel) + '/' + Beautify(15) + (this.SantaLevel > 0 ? ' ' + this.Lists.SantaLevels[this.SantaLevel - 1] : '') + '</div></div>' +
	'<div class="listing"><b>Santa drops : </b> <div id="' + iStat('santaDrops') + '" class="priceoff">' + Beautify(this.SantaDrops) + '/' + Beautify(this.Lists.SantaDrops.length) + '</div></div>' +
	'<div class="listing"><b>Christmas cookies : </b> <div id="' + iStat('xmasCookies') + '" class="priceoff">' + Beautify(this.ChristmasCookies) + '/' + Beautify(this.Lists.ChristmasCookies.length) + '</div></div>' +

	// Halloween
	'<div class="listing"><b>Spooky cookies : </b> <div id="' + iStat('spookyCookies') + '" class="priceoff">' + Beautify(this.SpookyCookies) + '/' + Beautify(this.Lists.SpookyCookies.length) + '</div></div>' +

	// Valentines Day
	'<div class="listing"><b>Heart cookies : </b> <div id="' + iStat('heartCookies') + '" class="priceoff">' + Beautify(this.HeartCookies) + '/' + Beautify(this.Lists.HeartCookies.length) + '</div></div>' +

	// Easter
	'<div class="listing"><b>Easter eggs : </b> <div id="' + iStat('easterEggs') + '" class="priceoff">' + Beautify(this.EasterEggs) + '/' + Beautify(this.Lists.EasterEggs.length) + ' <small>' +
		'(rare eggs : ' + Beautify(this.RareEggs) + '/' + Beautify(this.Lists.RareEggs.length) + ')' + '</small></div></div>' +

	'';

	str += Helper.Menu.WriteSectionEnd();

	return str;
}
StatSeasons.prototype.UpdateStats = function () {
	this.Update();

	var seasonNames = {
		'': 'None',
		christmas: 'Christmas',
		halloween: 'Halloween',
		valentines: 'Valentines Day',
		easter: 'Easter',
		fools: 'Business Day'
	};

	lStat('currentSeason').innerHTML = seasonNames[Game.season] + (Game.seasonT > 0 && Game.season != '' ? ' (time remaining: ' + Helper.Numbers.GetTime(Game.seasonT / Game.fps * 1000, 3) + ')' : '');

	var reindeer = {}
	Object.keys(this.Reindeer).forEach(key =>
		reindeer[StatGolden.GetEffectName(key)] = this.Reindeer[key]);
	var str = Object.keys(reindeer).sort().reduce((str, name) => {
		var deer = reindeer[name];
		str += '<div class="listing">' +
		    '<b>' + name + ' : </b>' +
		    '<div class="priceoff">' + Beautify(deer.count) + '</div>' + ' for';
		if (deer.cookies != 0)
			str += ' <div class="price plain">' + Beautify(deer.cookies) + '</div>';
		str += '</div>';
		return str;
	}, '');

	if (str != '')
		str = Helper.Menu.WriteSectionMiddle() + str + Helper.Menu.WriteSectionMiddle();
	lStat('reindeerFound').innerHTML = str;

	lStat('santaLevel').innerHTML = Beautify(this.SantaLevel) + '/' + Beautify(15) + (this.SantaLevel > 0 ? ' ' + this.Lists.SantaLevels[this.SantaLevel - 1] : '');
	lStat('santaDrops').innerHTML = Beautify(this.SantaDrops) + '/' + Beautify(this.Lists.SantaDrops.length);
	lStat('xmasCookies').innerHTML = Beautify(this.ChristmasCookies) + '/' + Beautify(this.Lists.ChristmasCookies.length);

	lStat('spookyCookies').innerHTML = Beautify(this.SpookyCookies) + '/' + Beautify(this.Lists.SpookyCookies.length);

	lStat('heartCookies').innerHTML = Beautify(this.HeartCookies) + '/' + Beautify(this.Lists.HeartCookies.length);

	lStat('easterEggs').innerHTML = Beautify(this.EasterEggs) + '/' + Beautify(this.Lists.EasterEggs.length) + ' <small>' +
		'(rare eggs : ' + Beautify(this.RareEggs) + '/' + Beautify(this.Lists.RareEggs.length) + ')' + '</small>';

}
StatSeasons.prototype.Update = function () {

	//======== CHRISTMAS ========

	// Check Santa level
	this.SantaLevel = (Game.Has('A festive hat') ? Game.santaLevel + 1 : 0);

	// Check Santa drops
	this.SantaDrops = 0;
	for (var i = 0; i < this.Lists.SantaDrops.length; i++) {
		var name = this.Lists.SantaDrops[i];
		if (Game.Has(name)) this.SantaDrops++;
	}
	// Check Christmas cookies
	this.ChristmasCookies = 0;
	for (var i = 0; i < this.Lists.ChristmasCookies.length; i++) {
		var name = this.Lists.ChristmasCookies[i];
		if (Game.Has(name)) this.ChristmasCookies++;
	}

	//======== HALLOWEEN ========

	// Check spooky cookies
	this.SpookyCookies = 0;
	for (var i = 0; i < this.Lists.SpookyCookies.length; i++) {
		var name = this.Lists.SpookyCookies[i];
		if (Game.Has(name)) this.SpookyCookies++;
	}

	//======== VALENTINES DAY ========

	// Check heart cookies
	this.HeartCookies = 0;
	for (var i = 0; i < this.Lists.HeartCookies.length; i++) {
		var name = this.Lists.HeartCookies[i];
		if (Game.Has(name)) this.HeartCookies++;
	}

	//======== EASTER ========

	// Check easter eggs
	this.EasterEggs = 0;
	for (var i = 0; i < this.Lists.EasterEggs.length; i++) {
		var name = this.Lists.EasterEggs[i];
		if (Game.Has(name) || (name == 'Chocolate egg' && Game.HasUnlocked('Chocolate egg'))) this.EasterEggs++;
	}
	// Check rare eggs
	this.RareEggs = 0;
	for (var i = 0; i < this.Lists.RareEggs.length; i++) {
		var name = this.Lists.RareEggs[i];
		if (Game.Has(name) || (name == 'Chocolate egg' && Game.HasUnlocked('Chocolate egg'))) this.RareEggs++;
	}

	if (Game.resets != this.Resets) {
		this.Reindeer = {};
		this.Resets = Game.resets;
	}
}
StatSeasons.Click = function() {
	var cookies = Game.cookies;
	var clicks = Game.reindeerClicked;

	Overrides.Backup.Functions['Game.seasonPopup.click'].func();

	if (Game.reindeerClicked > clicks) {
		var me = StatCookie.SeasonStats;
		var key = 'Reindeer';
		if (StatCookie.GoldenStats.FrenzyKey)
			key += '+' + StatCookie.GoldenStats.FrenzyKey;

		var reindeer = me.Reindeer[key];
		if (reindeer === undefined)
			me.Reindeer[key] = reindeer = { count: 0, cookies: 0 };
		var earn = Game.cookies - cookies;
		reindeer.count++;
		reindeer.cookies += earn;
		Helper.TimeLog(StatGolden.GetEffectName(key) + ': ' +
		    Beautify(earn) + ' cookies');
	}
}

//#endregion
/*=====================================================================================
AUTO-COOKIE VARIABLES
=======================================================================================*/


StatCookie.CookieStats = new StatCookies();
StatCookie.GoldenStats = new StatGolden();
StatCookie.PrestigeStats = new StatPrestige();
StatCookie.WrinklerStats = new StatWrinklers();
StatCookie.SeasonStats = new StatSeasons();





/*=====================================================================================
LAUNCH AUTO-COOKIE
=======================================================================================*/

// Launch Stat-Cookie
StatCookie.Init();

