/**
 * Main application class
 *
 * The state member variable defines the current screen :
 *   0 : main menu
 *   1 : tutorial
 *   2 : game in progress
 *   3 : tutorial ends
 *
 * @constructor
 */
function Game(controls, savedData)
{
	this.controls = controls;	
	this.mainMenu = new MenuDriver(3, controls);
	
	this.persistentData = {
	};
	
	this.world = new World(controls);
	if (savedData.hasOwnProperty('gameProgress')) {
		this.world.loadGame(savedData.gameProgress);
	}
	this.mainMenu.setMinLine(this.world.gameInProgress ? 0 : 1);
	this.world.addSaveGameListener(this);
	this.state = -1;
}

Game.prototype = {


	/**
	 * Launch the game : set the state to main menu and start the timers (main loop and rendering loop)
	 */
	launch : function() {
		this.changeState(0);	// initialize and show main menu
		this.intervalId = setInterval (function() { game.mainLoop(); }, 40);
		//requestAnimationFrame = requestAnimationFrame || webkitRequestAnimationFrame;
		requestAnimationFrame(function() {game.renderLoop();});
	},
	
	
	/**
	 * Change the current state to the new one
	 * Set the transition timer to the default value (20)
	 * Reinitialize menus (selected item, keypresses)
	 */
	changeState : function(newState) {
		this.controls.totalClear(); // do not forward mouse or keyboard actions to the new state
		
		if (newState == 0) {	// entering menu
			this.mainMenu.initialize();
			this.mainMenu.setMinLine(this.world.gameInProgress ? 0 : 1);
			if (!this.world.gameInProgress) {
				// enter the menu after ending a game : clear all progress in saved game (local storage)
				delete this.persistentData.gameProgress;
				this.storeData();
			}
		}
		/*
		if (newState == 1) {	// entering tutorial
			this.world.startTutorial();
		}*/
		this.state = newState;

	},

	
	/**
	 * Main loop, actions only, no rendering
	 * Performs all the model edition + controls effect
	 */
	mainLoop : function() {
		if (this.state == 0) // main menu
		{
			this.mainMenu.processEvents();
			if (this.mainMenu.done) {
				switch(this.mainMenu.selectedLine) {
					case 1 :// new game
						this.world.startNewGame();
						// no break : we start the game by changing state
					case 0 : // resume game
						this.changeState(2); 
						break;
						/*
					case 2 : // tutorial
						this.changeState(1); 
						break;
						*/
					case 2 : // save and quit
						this.world.saveGame();
						//window.close();
						// already saved : quit
						break;
				}
			}
		}
		
		
		
		if (this.state == 1 || this.state == 2) {
			this.world.processControls();
		
			if (this.controls.controlEscape) {
				// escape pressed : invoke main menu
				this.changeState(0);
			}

			this.world.animateItems();
			
			if (!this.world.gameInProgress) {
				// game ended, won or lost : return to main menu
				this.changeState(0);
			}
				
		}
		
	},	
	 
	/**
	 * Performs all the rendering (view) with no alteration of the model
	 * + controls related to the view only
	 */
	renderLoop : function() {
				
		this.renderer.drawMessage(this.state>0);
		this.renderer.drawMain();
		if (this.state == 0) {
			this.renderer.drawMainMenu(this.mainMenu);
		}
		requestAnimationFrame(function() {game.renderLoop();});
	},
		
	/**
	 * Define the renderer in charge (one does both overlay canvas and scenery canvas)
	 */
	setRenderer : function(renderer) {
		this.renderer = renderer;
	},
	
	/**
	 * Private method to synchronize local storage with current data
	 */
	storeData : function() {
		localStorage.setItem("GlitchData", JSON.stringify(this.persistentData));	
	},
		
	
	/**
	 * Called when a manual or auto save of the game in progress is requested
	 */
	notifySave : function(posX, posY, floor, keysAcquired, doors, ground, timer) {
		this.persistentData.gameProgress = {
			posX : posX,
			posY : posY,
			floor : floor,
			keysAcquired : keysAcquired,
			doors : doors,
			ground : ground,
			timer : timer};
		this.storeData();
	},
	
	/**
	 * Called when the window is resized and the window layout changes
	 */
	layoutChanged : function(windowLayout) {
		this.controls.onLayoutChange(windowLayout);
	}
}
