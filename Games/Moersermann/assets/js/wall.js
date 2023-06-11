(function(window, game) {


	function Wall( opts ) {

		this.x = opts.x;
		this.width = opts.width;
		this.targetWidth = opts.width;
	}

	Wall.prototype = {

		spawn : function() {

			this.x = game.lastWallX + game.WIDTH;

			if( game.speed === game.MAX_SPEED ) this.x -= Math.randMinMax(0, 200);
			game.lastWallX = this.x;

		},

		resize : function( width ) {

			this.targetWidth = width;

		},

		update : function( delta ) {

			if( this.width !== this.targetWidth ) {
				this.width += (this.targetWidth - this.width) * 0.1;
			}

			if( game.distance > this.x + (this.width/2) ) this.spawn();

		},

		draw : function( ctx ) {

			var w = this.width;
			var h = game.WALL_HEIGHT;

			ctx.save();
			ctx.translate( this.x - game.distance, 0 );
			ctx.fillStyle = game.gradients.wall;
			ctx.fillRect( -w/2, 0, w, h );
			ctx.restore();
		}
	};

	
	window.Wall = Wall;

})(window, game);