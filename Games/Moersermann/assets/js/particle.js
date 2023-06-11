(function(window) {


	function Explosion( args ) {

		this.life = 0;
		this.x = args.x;
		this.y = args.y;

		this.particles = [];
		

		for(var i=0;i<40;i=i+1) { 

			this.particles.push({
				parent: this,
				x: this.x,
				y: this.y,
				color: 'rgba(255,255,255,'+ Math.random() +')',
				speed: Math.randMinMax(100, 300),
				size: Math.randMinMax(2,10),
				degree: Math.randMinMax(0, 360),
				vd: Math.randMinMax(-30,0),
				vs: Math.randMinMax(-12, -6)
			});
		}

		return this;

	}

	Explosion.prototype = {

		update : function( delta ) {

			this.life += delta;

			if( this.life > 0.5 ) return;

			for(var i=0,p;i<40;i=i+1) { 

				p = this.particles[i];

				p.degree += (p.vd * delta);
				p.speed += (p.vs);

				if( p.speed < 0 ) p.speed = 0;

				p.x += Math.cos(p.degree * Math.TO_RAD) * (p.speed * delta);
				p.y += Math.sin(p.degree * Math.TO_RAD) * (p.speed * delta);

				p.x -= delta * game.speed;

				if( p.y > p.parent.y + 20) p.degree *= -1;

			}

		},

		draw : function( ctx ) {

			if( this.life > 0.5 ) return;

			for(var i=0,p;i<40;i=i+1) { 

				p = this.particles[i];

				ctx.save();
			
				ctx.translate( p.x, p.y );
				ctx.rotate( p.degree * Math.TO_RAD );

				ctx.fillStyle = p.color;
				ctx.fillRect( -p.size, -p.size, p.size*2, p.size*2 );

				ctx.restore();

			}
		}


	};

	window.Explosion = Explosion;

})(window);