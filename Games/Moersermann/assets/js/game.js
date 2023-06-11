var game = game || {};

(function(window, game) {


	window.requestAnimFrame = (function () {
		return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();


	var	canvas = document.getElementById('game'),
		ctx = canvas.getContext('2d'),
		lastUpdate = new Date(),
		player,
		world = [];


	game.init = function() {

		//global game statics
		game.WIDTH 			= canvas.width;
		game.HEIGHT 			= canvas.height;
		game.WALL_HEIGHT		= game.HEIGHT - 75;

		game.GRAVITY 			= 25;
		game.MIN_SPEED			= 100;
		game.MAX_SPEED			= 1100;
		game.MIN_WALL_WIDTH		= 60;
		game.MAX_WALL_WIDTH		= game.WIDTH;
		game.MAX_JUMPS			= 12;

		game.NADE_INCREASE		= 100;
		game.JUMP_INCREASE		= 300;
		

		//global game variables
		game.score 			= 0;
		game.highscore 			= 0;
		game.jumps 			= 0;
		game.distance 			= 0;
		game.speed 			= 0;
		game.targetSpeed		= 0;
		game.acceleration 		= 0.05;

		game.walls 			= [];
		game.gradients 			= {};
		game.lastWallX			= 0;


		$('#title').addEventListener('mousedown', function() {
			this.classList.add('hidden');
			startGame();
		});		
	};


	game.addToWorld = function( entity ) {

		world.push( entity );
	};


	game.setSpeed = function( speed, acceleration ) {

		if( speed > game.MAX_SPEED ) speed = game.MAX_SPEED;

		game.targetSpeed = speed;
		game.acceleration = acceleration || game.acceleration;
	};


	game.setJumps = function( jumps ) {

		game.jumps = jumps;
		$('#jumps').innerHTML = jumps;

		if( game.jumps < game.MAX_JUMPS ) {
			game.resizeWalls();
		}
	};

	game.setScore = function( score ) {

		var diff = score - game.score;

		if( diff > 0 ) diff = '+' + diff;

		game.score = score;
		$('#score').innerHTML = score;

		$('#increase').style.top = (player.y - 80) + 'px';
		$('#increase').innerHTML = '<div class="ding">' + diff + '</div>';
	};

	game.setHighscore = function( highscore ) {

		game.highscore = highscore;
		$('#highscore').innerHTML = highscore;

		$('#newhighscore').classList.add('visible');

		window.setTimeout(function() {
			$('#newhighscore').classList.remove('visible');
		}, 1500);
	};


	game.resizeWalls = function() {

		var width = game.MIN_WALL_WIDTH + ( (1 - (game.jumps / game.MAX_JUMPS) ) * (game.MAX_WALL_WIDTH - game.MIN_WALL_WIDTH) );

		for( var i = 0, len = game.walls.length; i<len; i=i+1 ) {
			game.walls[i].resize( width );
		}
	};


	game.renderToCanvas = function( width, height, renderFunction, entity ) {
		
		var buffer = document.createElement('canvas');

		if( typeof entity === 'undefined' ) entity = {};
		
		buffer.width = width;
		buffer.height = height;
		renderFunction.call( entity, buffer.getContext('2d') );
		return buffer;
	};


	function createGradients() {

		var 	shadow = ctx.createLinearGradient(0,game.WALL_HEIGHT,0,game.HEIGHT),
			wall = ctx.createLinearGradient(0,0,0,game.WALL_HEIGHT);

		shadow.addColorStop(0, '#5d5c4f' );
		shadow.addColorStop(1, '#747362' );

		wall.addColorStop(0, '#838678' );
		wall.addColorStop(0.33, '#929585' );
		wall.addColorStop(0.33, '#676b52' );
		wall.addColorStop(0.66, '#676b52' );
		wall.addColorStop(0.66, '#545743' );
		wall.addColorStop(0.68, '#929585' );
		wall.addColorStop(1, '#838678' );

		game.gradients = {
			shadow: shadow,
			wall: wall
		};
	}


	function startGame() {

		createGradients();
		game.setSpeed( game.MIN_SPEED );

		game.addToWorld( new Background() );

		for( var i=0, k=3; i<k; i=i+1 ) {

			game.walls[i] = new Wall({
				x: game.WIDTH + (game.WIDTH * i),
				width: game.WIDTH
			});

			game.addToWorld( game.walls[i] );

			game.lastWallX = game.walls[i].x;
		}
		
		game.addToWorld( new Light() );
		game.addToWorld( player = new Player({
			x: 200,
			y: game.HEIGHT - 60
		}) );

		$('#game').addEventListener('mousedown', function() {
			player.jump();
		});

		loop();
	}


	function loop() {

		var 	thisUpdate = new Date(),
                        delta = (thisUpdate - lastUpdate) / 1000,
			amount = world.length,
			i = 0;

		game.distance += delta * game.speed;
		if( game.speed !== game.targetSpeed ) game.speed += ( (game.targetSpeed - game.speed) * game.acceleration );

		canvas.width = game.WIDTH;

		for(;i<amount;i=i+1) {

			world[ i ].update( delta );
			world[ i ].draw( ctx );
		}

		lastUpdate = thisUpdate;

		requestAnimFrame( loop );
	}


	function $( elem ) {
		return document.querySelector( elem );
	}


})(window, game);