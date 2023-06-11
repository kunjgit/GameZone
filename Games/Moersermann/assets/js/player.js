(function(window, Math, game) {

	var YLOD; //Y Line of Doom


	function Player( args ) {

		var that = this;

		this.img = new Image();
		this.gun = new Image();

		this.x = args.x;
		this.y = YLOD = args.y;
		this.vx = 0;
		this.vy = 0;
		this.degree = 0;
		this.counter = 0;
		this.width = 0;
		this.height = 0;

		this.gunDegree = 0;
		this.currentGunDegree = 0;


		this.isRunning = true;
		this.isJumping = false;
		this.isLanding = false;


		this.img.onload = function() {
			that.width = this.width;
			that.height = this.height;
		};
		this.img.src = 'assets/images/razor.png';
		this.gun.src = 'assets/images/nader.png';

		return this;

	}

	Player.prototype = {


		setGunDegree : function( degree ) {

			this.gunDegree = degree;

		},

		update : function( delta ) {

			this.counter += (delta * 1); //one Tick per second


			if( this.currentGunDegree !== this.gunDegree ) {
				this.currentGunDegree += ( (this.gunDegree - this.currentGunDegree) * 0.1 );
			}

			//Jumping?
			if( this.isJumping ) {
				this.degree += 0.5;
				if( this.degree > 30 ) this.degree = 30;

				if( this.vy > 0 && this.y >= game.HEIGHT - 70 ) {

					this.onLanding();

					this.setGunDegree( 0 );
					this.isLanding = true;
					this.isJumping = false;
				}
			}

			//Landing
			if( this.isLanding ) {

				this.degree += 10;
				if( this.degree >= 355 ) {

					this.onLandingEnd();

					this.degree = 0;
					this.isLanding = false;
					this.isRunning = true;
				}
			}


			//Gravity
			this.vy += game.GRAVITY;

			//VY
			this.y += (this.vy * delta);

			//Keep above YLOD
			if( this.y > YLOD ) this.y = YLOD;
		},

		draw : function( ctx ) {

			var	w = this.width,
				h = this.height,
				x = this.x,
				y = this.y + (Math.sin( this.counter*8 ) * 2.5); //Shaky Shake
			
			//prevent top cutoff
			if( y-h/2 <= 0 ) {
				this.y = h/2;
				this.vy = 0;
			}

			//draw character
			ctx.save();
			ctx.translate( x, y );
			ctx.rotate( this.degree * Math.TO_RAD );
			ctx.drawImage( this.img, -w/2, -h/2, w, h);
			ctx.restore();

			//draw gun
			ctx.save();
			if( this.gunDegree === 180 ) {
				ctx.translate( x+8, y+15 );
			} else {
				ctx.translate( x-13, y+5 );
			}
			ctx.rotate( this.currentGunDegree * Math.TO_RAD );
			ctx.drawImage( this.gun, -5, -5);
			ctx.restore();
		},

		//set impulse to vy, will be reduced by gravity each loop
		jump : function() {

			if( this.isLanding ) return;

			//currently running
			if( this.isRunning ) {
				
				this.onJumping();

				this.setGunDegree( 100 );
				this.vy = -650; 
				this.isJumping = true;
				this.isRunning = false;

			//currently jumping and in front of a wall
			} else if( this.isJumping && this.inWallBoundaries() ) {

				this.onNading();

				this.setGunDegree( 180 );
				this.vy = -450;
			}
		},

		inWallBoundaries : function() {

			var 	x = game.distance + this.x,
				i = 0, 
				len = game.walls.length;

			for( ; i<len; i=i+1 ) {

				if(	this.y < game.WALL_HEIGHT &&
					x > game.walls[i].x - (game.walls[i].width/2) && 
					x < game.walls[i].x + (game.walls[i].width/2) ) {

					return true;
				}
			}

			return false;
		},

		onLanding : function() {


		},

		onLandingEnd : function() {

			if( game.score > game.highscore ) game.setHighscore( game.score );

			game.setSpeed( game.MIN_SPEED, 0.1 );
			game.setScore( 0 );
			game.setJumps( 0 );

		},

		onJumping : function() {

			game.setSpeed( game.JUMP_INCREASE, 1 );
			game.addToWorld( new Explosion({ x: this.x, y: this.y }) );
		},

		onNading : function() {

			game.addToWorld( new Explosion({ x: this.x, y: this.y }) );

			game.setSpeed( game.speed + game.NADE_INCREASE, 1 );
			game.setScore( game.score + 100 );
			game.setJumps( game.jumps + 1 );
		}
	};

	window.Player = Player;

})(window, Math, game);