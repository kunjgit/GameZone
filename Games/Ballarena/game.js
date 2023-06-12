function Game(controls, soundManager)
{
	this.transitionTimer=0; // in game
	this.transitionToHof=0;
	this.menuOffset=10;
	this.controls = controls;
	this.level = new Level(this.controls, soundManager);
	this.hof = new Array();
	for (var i=0; i<16; ++i) { this.hof.push(["...", 1000*(16-i)]); }
	this.menu=new MenuDriver(controls, soundManager);
	this.signingToHof=-1;	// 0-based index of player score in hall of fame
}

Game.prototype = {

	launchMenu : function() {
		this.menu.initialize();
		this.startLevel(0);
		this.menu.active=true;
		this.eventType=0;
		var game=this;
		this.intervalId = setInterval (function() { game.mainLoop(); }, 40);
	},
	

	/*
	 * Point d'entrée pour démarrer une partie.
	 * Initialise les données (score, nombre de balles) et lance le niveau
	 */
	startGame : function() {
		this.level.initialize();
		this.score=0;
		this.startLevel(1);
		var game=this;
	},
	
	/**
	 * Lance un nouveau niveau.
	 */
	startLevel : function(level) {
		this.level.createContents(level);
		if (level) {
			this.level.giveInitialBall(true);
		}
	},
	
	/**
	 * Boucle d'animation et d'affichage, pendant le jeu ou l'affichage du menu
	 */
	mainLoop : function() {
		if (this.level.level && this.controls.controlEscape && this.eventType!=3) {
			this.menu.active=true;
			this.menu.done=false;
			this.controls.partialClear();
		}
		this.menuOffset=(this.menu.active?Math.max(this.menuOffset-1,0):Math.min(this.menuOffset+1,10));
		
		this.level.animateItems(!this.menu.active);
		this.renderer.drawMain();
		if (this.menu.active) {
			this.menu.processEvents();
			
			if (this.menu.done) { 
				if (this.menu.selectedOption) { // hall of fame (main menu), or quit (during game)
					this.eventType=3;
					this.transitionTimer=1;
				} else {
					if (!this.level.level) { // start game (main menu). Nothing to do for resume (during game)
						this.startGame();
					}
				}				
			}
		}
		this.controls.partialClear();
		
		if (this.transitionTimer) {
			if (!--this.transitionTimer) {
				switch (this.eventType) {
					case 1 :
						this.startLevel(this.level.level);
						break;
					case 2 : 
						this.level.giveInitialBall(false);
						break;
					case 3 : 
						this.level.ballsInPlay=0;
						clearInterval(this.intervalId);
						this.recordScore(this.level.score);
						this.level.score=0;
						this.hofLoop(); 
						break;
					case 4 : 
						this.level.ballsInPlay=0;
						clearInterval(this.intervalId);
						this.endGameLoop(); 
						break;
					default :
				}
			} else if (this.eventType==3 && this.transitionTimer<10) { // timer running, game over : translate to HOF view
				this.transitionToHof = Math.min(this.transitionToHof+1,10);
			}
		} else {
			this.eventType=0;
			this.transitionToHof = Math.max(this.transitionToHof-1,0);
			if (this.level.level) {	
			
				if (this.level.lost()) {
					this.level.soundManager.playBallLoss();
					this.transitionTimer = (this.level.lives?50:100);
					this.eventType = (this.level.lives?2:3);
					--this.level.lives;
				}
				
				if (this.level.won()) {
					++this.level.level;
					this.transitionTimer = (this.level.level==14?1:70);
					this.eventType = (this.level.level==14?4:1);
				}
			}
		}
	},
	
	endGameLoop : function() {
		this.renderer.drawEndGame();
		if (this.controls.controlFire) {
			this.controls.totalClear();
			this.recordScore(this.level.score);
			this.hofLoop(); 
		} else {
			var game=this;
			setTimeout (function() { game.endGameLoop(); }, 40);
		}
	},
	
	/**
	 * Boucle d'animation et d'affichage, pendant le hall of fame
	 */
	hofLoop : function() {
		this.transitionToHof = Math.min(this.transitionToHof+1,10);
		this.menuOffset=Math.min(this.menuOffset+1,10);
		if (this.signingToHof>-1) {
			if (this.controls.lastKeyDown==8 || this.controls.lastKeyDown==46) {
				this.hof[this.signingToHof][0]=this.hof[this.signingToHof][0].substr(0, Math.max(0, this.hof[this.signingToHof][0].length-1));
			} else 	if (this.controls.lastKeyDown>31 && this.hof[this.signingToHof][0].length<8) {
				this.hof[this.signingToHof][0]+=String.fromCharCode(this.controls.lastKeyDown);
			}
			if (this.controls.lastKeyDown==13) {
				if (this.hof[this.signingToHof][0]=="CHEATER") {
					this.level.canCheat = true;
				}
				this.signingToHof=-1; // end validation
			}
			this.controls.totalClear();
		}
		this.renderer.drawMain();
		
		if (this.controls.controlFire) {
			this.launchMenu();
		} else {
			var game=this;
			setTimeout (function() { game.hofLoop(); }, 40);
		}
	},
	
	/**
	 * Définit le renderer en charge de l'affichage
	 */
	setRenderer : function(renderer) {
		this.renderer = renderer;
	},
	
	/**
	 * Attempt to record the score into the hall of fame.
	 * Return the new rank (0-based), -1 if the score did not make it
	 */
	recordScore : function (score) {
		this.signingToHof=-1;
		for (var i=0; i<this.hof.length && this.signingToHof==-1; ++i) {
			if (score > this.hof[i][1]) {
				this.signingToHof=i;
			}
		}
		if (this.signingToHof>-1) {
			for (var i=this.hof.length-1; i>this.signingToHof;--i) {
				this.hof[i]=this.hof[i-1];
			}
			this.hof[this.signingToHof]=["",score];
		}
		
	}
}
