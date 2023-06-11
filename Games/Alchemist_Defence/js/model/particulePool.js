var particulePool=new (function(){

	this.particules = []

	this.add = function( fromx , fromy , tox , toy , type , cb ){

		this.particules.push({
			type : type,
			t : Math.abs( fromx - tox ) + Math.abs( fromy - toy ),
			v : 0.2,
			hh : type[0] == 'f' ? 5 : 0.2,
			a : 0,
			fromx: fromx,
			fromy: fromy,
			fromh: map.get(fromx|0,fromy|0).h,
			toh: map.get(tox|0,toy|0).h+1,
			vx: tox - fromx,
			vy: toy - fromy,
			cb : cb,
			traine : []
		})
	}

	this.tick = function( k ){

		for( var i=this.particules.length;i--;){

			var p = this.particules[i]

			p.a += p.v

			var k = p.a/p.t

			

			p.x = p.fromx + p.vx * k
			p.y = p.fromy + p.vy * k

			var kk = Math.abs(0.5-k)*2

			p.h = p.fromh * (1-k) + p.toh * k  + (1-kk*kk) * p.hh



			p.traine.unshift({
				x : p.x,
				y : p.y,
				h : p.h,
			})

			if( p.traine.length == 15 )
				p.traine.splice(14,1)

			if( k > 1 )
				this.particules.splice(i,1)[0].cb()

		}
	}

})();