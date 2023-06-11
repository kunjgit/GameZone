/**
 * Main application class
 *
 * The state member variable defines the current screen :
 *  -1 : startup
 *   0 : main menu
 *   1 : game in progress
 *   2 : game paused
 *   3 : game ends
 *
 * @constructor
 */
function Game(controls, savedData)
{
	this.controls = controls;	
	
	this.persistentData = {
	};
	
	this.world = new World(controls);
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
	 * Reinitialize menus (selected item, keypresses)
	 * @param newState new value of the state (0 .. 2)
	 */
	changeState : function(newState) {
		this.controls.totalClear(); // do not forward mouse or keyboard actions to the new state
		
		this.state = newState;

	},

	
	/**
	 * Main loop, actions only, no rendering
	 * Performs all the model edition + controls effect
	 */
	mainLoop : function() {
		if (this.state == 0) // main menu
		{
			if (this.controls.controlEscape || this.controls.controlFire || this.controls.leftMouseButton) { // start game
				this.world.startNewGame();
				this.renderer.resetSceneGraph();
				this.changeState (1);
			}
		}
		
		
		
		if (this.state == 1) {
			this.world.processControls();
		
			this.world.animateItems();
			
			if (this.world.gameCondition > 0) {
				// game ended, won or lost : return to main menu
				this.changeState(this.world.gameCondition == 4 ? 2 : 3);
			}
				
		}
		
		if (this.state == 2) {
			if (this.controls.controlEscape || this.controls.controlFire) { // resume game
				this.world.gameCondition = 0;
				this.changeState (1);
			}
		}
		
		if (this.state == 3) // endgame
		{
			if (this.controls.controlEscape || this.controls.controlFire || this.controls.leftMouseButton) { 
				this.changeState (0);
			}
		}
	},	
	 
	/**
	 * Performs all the rendering (view) with no alteration of the model
	 * + controls related to the view only
	 */
	renderLoop : function() {
				
		this.renderer.drawMain();
		this.renderer.drawMessage();
		requestAnimationFrame(function() {game.renderLoop();});
	},
		
	/**
	 * Define the renderer in charge (one does both overlay canvas and scenery canvas)
	 *
	 * @param renderer new renderer
	 */
	setRenderer : function(renderer) {
		this.renderer = renderer;
	},
	
	/**
	 * Private method to synchronize local storage with current data
	 */
	storeData : function() {
		localStorage.setItem("LineOfFireData", JSON.stringify(this.persistentData));	
	},
		
	
	/**
	 * Called when the window is resized and the window layout changes
	 * Transmits it to the controls
	 * @param windowLayout new layout (grid size, control banner size, drop areas ..)
	 */
	layoutChanged : function(windowLayout) {
		this.controls.onLayoutChange(windowLayout);
	}
}
