/**
 * Initializes the level timer
 */
Game.initTimer = function() {
	var minutes = 3;	// The timer is initialized at 3 minutes
	Game.timer = minutes * 60 * 1000;
	get('#current_gauge').style.height = '100%';
	
	/**
	 * Updates the level timer
	 */
	Game.updateTimer = function() {
		Game.timer -= 50;

		// Every second
		if (Game.timer % 1000 == 0) {
			get("#current_gauge").style.height = (Game.timer * 100 / (minutes * 60 * 1000)) + '%';
		}

		if (Game.timer <= 0) {
			Game.timesUp();
		}
	};
};
Game.resetTimer = Game.initTimer;


/**
 * The player loses if the timer is finished
 */
Game.timesUp = function() {
	Popup.confirm('Temps écoulé !<br/>Voulez-vous recommencer ?', null, Game.restart);
}