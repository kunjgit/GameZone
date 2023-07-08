var Site = {};	// The Site namespace

Site.initPage = function() {
	var links = get('nav a');
	for (var i = 0; i < links.length; i++) {
		links[i].onclick = Site.onMenuClick;
	};
	Site.changePageFromHash();
};

/**
 * Triggers on a click on a menu button
 */
Site.onMenuClick = function(event) {
	// We set the clicked button as the current menu
	var target = event.target || event.srcElement,
		hash = window.location.hash;

	Game.pauseHint();	// We pause the hint timer

	if (target.getAttribute('href') == '#game')
		window.location.hash = 'game';
	else if (target.getAttribute('href') == '#rules')
		window.location.hash = 'rules';
	else
		window.location.hash = '';

	if (window.location.hash != hash)
		Site.changePageFromHash();
};

/**
 * Changes the site page from the hash given in url
 */
Site.changePageFromHash = function () {
	var links = get('nav a');

	get("#site_content").style.display = window.location.hash === '' ? 'block' : 'none';
	get("#game_content").style.display = window.location.hash === '#game' ? 'block' : 'none';
	get("#rules_content").style.display = window.location.hash === '#rules' ? 'block' : 'none';

	if (window.location.hash === '#game') {
		if (Game.paused == undefined) {	// If the game hasn't been initialized yet, we do so
			Game.init();
		}else{
			Game.resumeHint();
		}
	}
	
	for (var i = 0; i < links.length; i++) {
		links[i].setAttribute('class', '');
	};

	if (window.location.hash === '')
		links[0].setAttribute('class', 'current_menu');
	else
		get('#bt_' + window.location.hash.substr(1)).setAttribute('class', 'current_menu');
};

// We initialize the menu buttons listeners
window.onload = Site.initPage();