(function(window) {

	function Background() {

		//create back background
		this.image = (function() {

			var 	patternWidth = game.WIDTH/12, 
				pattern, image;

			pattern = game.renderToCanvas( patternWidth, game.HEIGHT, function( ctx ) {

	 			//bg
	 			ctx.fillStyle = '#383933';
				ctx.fillRect( 0, 0, patternWidth, game.HEIGHT );

				//streifen
				ctx.fillStyle = '#2a2b26';
				ctx.fillRect( 0, 0, 10, game.HEIGHT );

				//bodenzeile
				ctx.fillStyle = '#484235';
				ctx.fillRect( 0, game.HEIGHT-150, patternWidth, 10 );

				//boden
				ctx.fillStyle = '#747362';
				ctx.fillRect( 0, game.HEIGHT-140, patternWidth, 140 );
		 	});


		 	//bild erstellen
			image = game.renderToCanvas( game.WIDTH*2, game.HEIGHT, function( ctx ) {

		 		var patternFill = ctx.createPattern( pattern, 'repeat' );

				ctx.fillStyle = patternFill;
				ctx.fillRect( 0,0, game.WIDTH*2, game.HEIGHT );
		 	});

		 	return image;

		})();

	}

	Background.prototype = {

		update : function( delta ) {

		},

		draw : function( ctx ) {

			var x = ( (game.distance) % game.WIDTH ) / 2;

			ctx.save();
			ctx.translate( -x, 0 );
			ctx.drawImage( this.image, 0, 0 );
			ctx.fill();
			ctx.restore();
		}
	};

	window.Background = Background;

})(window);