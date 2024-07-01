/**
 * Main application class
 *
 * The state member variable defines the current screen :
 *   0 : main menu / game over
 *   1 : game in progress
 *   2 : ball lost
 *
 * @constructor
 */
function Game(controls, savedData)
{
	this.controls = controls;	
	this.soundManager = new SoundManager(savedData);

	this.world = new World(controls, this.soundManager);
	this.state = -1;
}

Game.prototype = {


	/**
	 * Launch the game : set the state to main menu and start the timers (main loop and rendering loop)
	 */
	launch : function() {
		this.soundManager.initSoundFX();
		
		this.changeState(0);	// initialize and show main menu
		this.intervalId = setInterval (function() { game.mainLoop(); }, 20);
		requestAnimationFrame(function() {game.renderLoop();});
	},
	
	
	/**
	 * Change the current state to the new one
	 * Reinitialize menus (selected item, keypresses)
	 * @param newState new value of the state (0 .. 2)
	 */
	changeState : function(newState) {
		this.controls.totalClear(); // do not forward mouse or keyboard actions to the new state
		
		if (newState == 0) {	// entering menu
			this.renderer.setDemoMode();
			this.world.time = 0;
		}
		
		if (newState == 1) {
			this.renderer.messageId = 0;
			if (this.state < 1) {
				this.world.startNewGame(this.controls.playerCount);
			}
			this.world.prepareNewBall();
		}
		this.state = newState;

	},

	
	/**
	 * Main loop, actions only, no rendering
	 * Performs all the model edition + controls effect
	 */
	mainLoop : function() {
		if (this.state == 0) // main menu
		{
			++this.world.time; // animate pinball table
			
			// ensure all scores are shown during game over
			this.world.currentPlayer = Math.floor(this.world.time/100)%this.world.playerCount;
			this.world.score = this.world.playerScore[this.world.currentPlayer];
			if (this.controls.controlUp) {
				// start game
				this.changeState(1);
			}
			// force flippers down in demo mode
			this.controls.controlLeft = this.controls.controlRight = false;
		}
		this.world.processControls();
				
		
		if (this.state == 1 && !this.world.pause) {	// playing
		
			if (this.controls.controlEscape) {
				// escape pressed : invoke main menu
				this.changeState(0);
			}

			this.world.animateItems();
			
			if (this.world.isBallLost()) {
				this.soundManager.playLoseBall();
				this.changeState(2);
			}
				
		}
		
		if (this.state == 2) {	// ball lost : add bonus to score, then launch new ball or end game
			this.world.cashOutBonus();
			if (this.world.ballLostAnimationStep>5) {
				this.changeState(this.world.isLastBall()?0:1);
			}
		}
		//game.renderLoop();
	},	
	 
	/**
	 * Performs all the rendering (view) with no alteration of the model
	 * + controls related to the view only
	 */
	renderLoop : function() {				
		this.renderer.drawMain();
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
	
}
