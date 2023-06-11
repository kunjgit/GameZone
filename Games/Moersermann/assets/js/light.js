(function(window, Math, game) {

	var source;

	function Light() {

		source = {
			x: game.WIDTH/2, 
			y: game.HEIGHT/4
		};
		
	}

	Light.prototype = {

		update : function( delta ) {
		},

		draw : function( ctx ) {

			var	p1, p2, degree1, degree2,
				i = 0, 
				len = game.walls.length;

			for( ; i<len; i=i+1 ) {

				p1 = {
					x: game.walls[i].x - (game.walls[i].width/2), 
					y: game.WALL_HEIGHT
				}, 
				p2 = {
					x: game.walls[i].x + (game.walls[i].width/2), 
					y: game.WALL_HEIGHT
				}, 
				degree1 = Math.getDegree( p1.x - game.distance, p1.y, source.x, source.y ),
				degree2 = Math.getDegree( p2.x - game.distance, p2.y, source.x, source.y );

				ctx.save();
				ctx.translate( -game.distance, 0 );

				ctx.beginPath();
				ctx.moveTo( p1.x, p1.y );
				ctx.lineTo( p2.x, p2.y );
				ctx.lineTo(	p2.x + Math.cos( degree2 * Math.TO_RAD ) * 200, 
						p2.y + Math.sin( degree2 * Math.TO_RAD ) * 200 );
				

				ctx.lineTo(	p1.x + Math.cos( degree1 * Math.TO_RAD ) * 200, 
						p1.y + Math.sin( degree1 * Math.TO_RAD ) * 200 );

				ctx.closePath();

				ctx.fillStyle = game.gradients.shadow;
				ctx.fill();
				ctx.restore();
			}

		}
	};

	
	window.Light = Light;

})(window, Math, game);