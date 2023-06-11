var spartanPool=new (function(){

	this.spartans = []

	var spartanVelocity = 0.02
	var spawnDelay = 300

	this.spawnPoints = [
		{
			start : {x:0,y:1},
			end : {x:12,y:13},
		}
	];

	this.alter = function( path , dx , dy ){
		for(var i=path.length;i--;){
			path[i].x += dx
			path[i].y += dy
		}
		return path
	}

	this.spawnSpartan = function(k){
		var p = this.alter ( map.aStar( this.spawnPoints[k||0].start , this.spawnPoints[k||0].end  ) , 0.1 + Math.random() * 0.8 , 0.1 + Math.random() * 0.8 )
		this.spartans.push({
			health : 10,
			path : p,
			x : p[0].x,
			y : p[0].y,
			shake : 0
		})
	}

	this.tick = function( k ){


		// loop
		for( var i=this.spartans.length;i--;){

			// death
			if( this.spartans[i].health < 0 ){
				this.spartans.splice(i,1)

				renderer.shake(20);

				continue
			}

			// move
			var dx = this.spartans[i].path[0].x - this.spartans[i].x,
				dy = this.spartans[i].path[0].y - this.spartans[i].y

			var l = Math.sqrt( dx*dx + dy*dy )

			if( l <= spartanVelocity ){

				this.spartans[i].x+=dx
				this.spartans[i].y+=dy

				this.spartans[i].path.shift()

				if( this.spartans[i].path.length == 0 )
					this.spartans.splice( i , 1 )

			} else {

				this.spartans[i].x+=dx/l*spartanVelocity
				this.spartans[i].y+=dy/l*spartanVelocity

			}

		}

		if( k% 100 == 0 )
			spawnDelay = Math.max( 8 , spawnDelay * 0.93 - 5 ) | 0

		// spawn
		if( k % spawnDelay == 0 )
			this.spawnSpartan()
			
		

	}

})();