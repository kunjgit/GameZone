

renderer.proj = function( p ){
	return {
		x : (this.u.x * p.x + this.v.x * p.y )*this.tileSize,
		y : (this.u.y * p.x + this.v.y * p.y + p.z )*this.tileSize
	}
}
renderer.poly = function( p ){
	
	this.ctx.moveTo( p[0].x , p[0].y )
	for( var i=p.length; i-- ; )
		this.ctx.lineTo( p[i].x , p[i].y )
}

renderer.cubePoly = function(x,y,h){
	h*=0.23
	x-=map.width/2
	y-=map.height/2

	var faces = []

	if( h>0 ){
		
		if( this.rotationClass >> 1 == 1 )

			faces.push([
				renderer.proj({x:x   , y:y  , z:-h  }),
				renderer.proj({x:x   , y:y+1, z:-h  }),
				renderer.proj({x:x   , y:y+1, z:0   }),
				renderer.proj({x:x   , y:y  , z:0   })
			])

		else

			faces.push([
				renderer.proj({x:x+1 , y:y  , z:-h  }),
				renderer.proj({x:x+1 , y:y+1, z:-h  }),
				renderer.proj({x:x+1 , y:y+1, z:0   }),
				renderer.proj({x:x+1 , y:y  , z:0   })
			])
		

		if( this.rotationClass == 1 || this.rotationClass == 2 )

			faces.push([
				renderer.proj({x:x   , y:y  , z:-h  }),
				renderer.proj({x:x+1 , y:y  , z:-h  }),
				renderer.proj({x:x+1 , y:y  , z:0  }),
				renderer.proj({x:x   , y:y  , z:0  })
			])

		else

			faces.push([
				renderer.proj({x:x   , y:y+1, z:-h  }),
				renderer.proj({x:x+1 , y:y+1, z:-h  }),
				renderer.proj({x:x+1 , y:y+1, z:0  }),
				renderer.proj({x:x   , y:y+1, z:0  })
			])
	}

	faces.unshift([
		renderer.proj({x:x  , y:y  , z:-h}),
		renderer.proj({x:x+1, y:y  , z:-h}),
		renderer.proj({x:x+1, y:y+1, z:-h}),
		renderer.proj({x:x  , y:y+1, z:-h})
	])



	return faces
}


renderer.renderCube = function(x,y,h,z){

	this.ctx.fillStyle= '#'+( 1221313 + (x*x*17%131)*12121 + (y*y*y%127)*123121  + x * 1231 + y * 421 ).toString(16).substr(0,6)
	this.ctx.fillStyle= '#'+( (h+1)*11111111111111 ).toString(16).substr(0,6)



	var v = ((1-z)*255)<<0
	this.ctx.strokeStyle= 'rgb('+ v + ','+ v + ','+ v + ')'
	this.ctx.lineWidth= 0.1
	this.ctx.lineCap= 'round'


	this.ctx.beginPath()

	var faces = this.cubePoly(x,y,h)

	for(var i=faces.length;i--;)
		this.poly( faces[i] )

	this.ctx.fill()
	this.ctx.stroke()

	if( map.get(x,y).hover ){
		this.ctx.fillStyle= h <= 1 ? 'rgb(163, 60, 28)' : 'rgb(12,123,200)'
		this.ctx.beginPath()
		this.poly( faces[0] )
		this.ctx.fill()
	}
	
}