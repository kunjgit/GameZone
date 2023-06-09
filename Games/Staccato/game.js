/**
 * Main application class
 *
 * The state member variable defines the current screen :
 *  -2 : controls setup from pause menu (ingame)
 *  -1 : controls setup from main menu
 *   0 : main menu
 *   1 : track menu
 *   2 : race in progress
 *   3 : race completed, endgame menu
 *   4 : race paused
 *
 * @constructor
 */
function Game(controls)
{
	this.transitionTimer=0;
	this.players=2;
	this.level=0;
	this.controls = controls;
	this.soundManager = new SoundManager(this.persistentData = controls.persistentData);
	this.mainMenu = new MenuDriver(1, 5, controls, this.soundManager, -1);
	this.mainMenu.setAction(0, 3, this.mainMenu.toggleMusic);
	this.mainMenu.setAction(0, 4, this.mainMenu.toggleSfx);
	this.controlsMenu = new MenuDriver(2, 6, controls, this.soundManager, 4);
	for (var i=0; i<2; ++i) for (var j=0; j<5; ++j) {
		this.controlsMenu.setAction(i, j, this.controlsMenu.recordNextKey)
	}
	this.endRaceMenu = new MenuDriver(1, 3, controls, this.soundManager, 1);	
	this.endRaceMenu.setAction(0, 2, this.controlsMenu.tweetRaceTime)
	this.trackMenu = new MenuDriver(1, 6, controls, this.soundManager, 5); // hardcoded values for track count
	
	this.race = new Race(this.controls);	
}

Game.prototype = {

	loadTrack : function(level, playerCount) {
		this.race.initialize(playerCount, this.level=level);
		this.renderer.createTrackGeometry(this.race.track);
		this.renderer.createLandscapeGeometry(this.race.track);
	},

	launch : function() {
		this.changeState(0);	// menu
		this.intervalId = setInterval (function() { game.mainLoop(); }, 20);
		requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame;
		requestAnimationFrame(function() {game.renderLoop();});
	},
	
	/**
	 * Change the current state to the new one
	 * Set the transition timer to the default value (20)
	 * Reinitialize menus (selected item, keypresses)
	 */
	changeState : function(newState) {
		this.oldState = this.state;
		this.state = newState;
		this.transitionTimer = 20;
		this.mainMenu.initialize();
		this.controlsMenu.initialize();
		this.trackMenu.initialize();
		this.endRaceMenu.initialize();
		this.renderer.views = this.players;
		
		if (newState==0 && this.oldState !=-1) {
			// open the main menu : show a race in background
			this.loadTrack(2, 0);
			this.renderer.views = 2;
		}
		if (newState==1) {
			this.renderer.views = 1;
			this.trackMenu.selectedLine = this.level;
			this.loadTrack(this.level, this.players); // reinit car position, timer ...
		}
	},
	
	/**
	 * Main loop, actions only, no rendering
	 */
	mainLoop : function() {
		this.actionLoop();
		this.soundLoop();
	},
	
	/**
	 * Performs all the model edition + controls effect
	 *  - car motion, collision detection
	 */
	actionLoop : function() {
		if (this.state == 0) // main menu
		{
			this.mainMenu.processEvents();
			if (this.mainMenu.done) {
				if (this.mainMenu.selectedLine == 2) {
					this.changeState(-1); // switch to controls menu
				} else {	// 1UP or 2UP options
					this.players = this.mainMenu.selectedLine+1;			
					this.changeState(1); // tracks menu
				}
			}
		}
		if (this.state == -1) // controls menu
		{
			this.controlsMenu.processEvents();
			if (this.controlsMenu.done) {
				this.changeState(0); // back to main menu
			}
		}
		if (this.state == -2) // controls menu ingame
		{
			this.controlsMenu.processEvents();
			if (this.controlsMenu.done) {
				this.changeState(4); // back to pause menu
			}
		}
		if (this.state == 1) // tracks menu
		{
			this.trackMenu.processEvents();
			if (this.level != this.trackMenu.selectedLine && this.trackMenu.selectedLine < 5) {
				this.loadTrack(this.trackMenu.selectedLine, this.players);
			}
			if (this.trackMenu.done) {
				var newState = (this.trackMenu.selectedLine == this.trackMenu.lineCount -1 ? 0 : 2);
				this.changeState(newState); // start race, or back to main
			}
		}
		if (this.state == 3) // end race menu
		{
			this.endRaceMenu.processEvents();
			if (this.endRaceMenu.done) {
				var newState = [2, 1][this.endRaceMenu.selectedLine]; // race again, or track menu
				if (newState == 2) {
					this.loadTrack(this.level, this.players);
				}
				this.changeState(newState); 
			}
		}
		if (this.state == 4) // pause menu
		{
			this.mainMenu.processEvents();
			if (this.mainMenu.done) {
				var newState = [2, 1, -2][this.mainMenu.selectedLine];
				this.changeState(newState);
			}
		}
		
		// move cars, except during pause menu, track menu & controls setup during pause
		if (this.state != -2 && this.state != 1 && this.state != 4) {
			this.race.animateItems(true);
		}
		
		if (this.state == 2) {
		
			for (var i=0; i<this.race.players; ++i) {
				if (this.race.cars[i].bestLap > 0) {
					this.persistentData.recordTime(this.level, this.race.cars[i].bestLap, this.race.cars[i].lapTimes[this.race.cars[i].lap]);
				}
			}
			if (this.race.won()) {
				this.changeState(3);  // endgame menu
			}
			
			if (this.controls.controlEscape) {
				this.changeState(4);
			}

		}
	},	
	 
	/**
	 * Performs all the rendering (view) with no alteration of the model
	 * + controls related to the view only
	 */
	renderLoop : function() {
		this.overlayRenderer.clear();
		if (this.transitionTimer == 20) {
			this.renderer.resize();	// force split screen for 2UP
		}
		if (this.state == 2)	// race
		{
			this.overlayRenderer.showMessages(this.race.players);
		}
		if (this.renderer.views==2) {
			this.overlayRenderer.context.fillStyle="#000";
			this.overlayRenderer.context.fillRect(-1, -this.overlayRenderer.context.height>>1, 2, this.overlayRenderer.context.height);
		}
		if (this.state >=2) {
			this.overlayRenderer.renderStatusBar(this.race.players, this.race.cars, this.race.time, this.state==2);
			for (var i=0; i<this.players; ++i)
			{
				if (this.race.cars[i].bestLap>0) {
					this.overlayRenderer.renderTimingPanel(i, this.race.players, this.race.cars[i], this.persistentData.data.records[this.level]);
				} else if (this.race.cars[i].lapCompleted) {
					this.overlayRenderer.setMessage(i, "Lap "+(1+this.race.cars[i].lap)+"/"+this.race.finalLap);
				} else if (this.controls.customControlPressed[i][4]) {
					this.renderer.toggleCameraType(i);
				}
			}
			if (this.race.time<50) {	// before the first second : message "get ready" and traffic lights
				this.overlayRenderer.renderGetReadyMessage(this.race.time/50);
				this.overlayRenderer.renderLights(this.race.time/50);
			}
			
		}

		// show menus on top
		if (this.transitionTimer>0) {
			this.overlayRenderer.offsetDisplay(1-this.transitionTimer/20);
			if (this.oldState == 0 || this.oldState == 4) // main menu
			{
				this.overlayRenderer.renderMainMenu(this.mainMenu, this.oldState == 4);
			}
			if (this.oldState == -1 ||this.oldState == -2) // controls menu
			{
				this.overlayRenderer.renderControlsMenu(this.controlsMenu, this.controls);
			}
			if (this.oldState == 1) {	// track menu
				this.overlayRenderer.renderTrackMenu(this.trackMenu, this.race.track, this.persistentData.data.records);
			}			
			if (this.oldState == 3) {	// end race menu
				this.overlayRenderer.renderEndRaceMenu(this.endRaceMenu);
			}			
			this.overlayRenderer.endOffset();
		}
		this.overlayRenderer.offsetDisplay(-this.transitionTimer/20);
		if (this.state == 0 || this.state == 4) // main menu
		{
			this.overlayRenderer.renderMainMenu(this.mainMenu, this.state==4);
		}
		if (this.state == -1 || this.state == -2) // controls menu
		{
			this.overlayRenderer.renderControlsMenu(this.controlsMenu, this.controls);
		}
		if (this.state == 1) {	// track menu
			this.overlayRenderer.renderTrackMenu(this.trackMenu, this.race.track, this.persistentData.data.records);
		}			
		if (this.state == 3) {	// end race menu
			this.overlayRenderer.renderEndRaceMenu(this.endRaceMenu);
		}
		
		this.overlayRenderer.endOffset();

		
		this.renderer.drawMain();
		this.controls.partialClear();
		
		if (this.transitionTimer) {
			--this.transitionTimer;
		}
		requestAnimationFrame(function() {game.renderLoop();});
	},
	
	soundLoop : function() {
		var engineSound = (this.state == 2);
		this.soundManager.adjustEngineSound(0, engineSound, this.race.cars[0].rpm, this.race.cars[0].accelerating, this.race.cars[0].inTunnel);
		this.soundManager.adjustEngineSound(1, engineSound, this.race.cars[this.players-1].rpm, this.race.cars[this.players-1].accelerating, this.race.cars[this.players-1].inTunnel);
		
		if (this.race.cars[0].collisionStrength>0) {
			this.soundManager.playCollisionSound(0, Math.min(1.0, this.race.cars[0].collisionStrength), this.race.cars[0].collisionSpeed/30.0);
		}
		if (this.race.cars[this.players-1].collisionStrength>0) {
			this.soundManager.playCollisionSound(1, Math.min(1.0, this.race.cars[this.players-1].collisionStrength), this.race.cars[this.players-1].collisionSpeed/30.0);
		}
		if (this.race.time>=-150 && this.race.time<=0 && (this.race.time%50) == 0) {
			this.soundManager.playStartSound(!this.race.time);
		}
	},
	
	/**
	 * Define the renderers (main view and overlay) in charge
	 */
	setRenderer : function(renderer, overlayRenderer) {
		this.renderer = renderer;
		this.overlayRenderer = overlayRenderer;
	}
}
