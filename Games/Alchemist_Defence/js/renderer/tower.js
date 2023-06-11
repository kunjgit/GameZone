renderer.renderTower = function(x,y,h,entity,z){


	switch( entity.type ){
		case "f" :
			this.ctx.fillStyle= '#DD5616'
		break
		case "ff" :
			this.ctx.fillStyle= '#DD1D15'
		break
		case "e" :
			this.ctx.fillStyle= '#94330D'
		break
		case "ee" :
			this.ctx.fillStyle= '#57230F'
		break
	}

	
	var v = ((1-z)*255)<<0
	this.ctx.strokeStyle= 'rgb('+ v + ','+ v + ','+ v + ')'
	this.ctx.lineWidth= 0.1
	this.ctx.lineCap= 'round'

	h*=0.23
	x-=map.width/2
	y-=map.height/2
	var d=0.2 * ( 0.6 + 0.4 * Math.sin( (1-Math.min(   dataTower[entity.type].reload - entity.r  , 8 )/8)  * Math.PI * 2 + Math.PI/2 ) )  ,
		k=0.6

	var faces = []

	if( this.rotationClass >> 1 == 1 )

			faces.push([
				renderer.proj({x:x+d , y:y+d, z:-h  }),
				renderer.proj({x:x+d , y:y+1-d, z:-h  }),
				renderer.proj({x:x+d , y:y+1-d, z:-h-k   }),
				renderer.proj({x:x+d , y:y+d, z:-h-k   })
			])

	else

			faces.push([
				renderer.proj({x:x+1-d , y:y+d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+1-d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+1-d, z:-h-k   }),
				renderer.proj({x:x+1-d , y:y+d, z:-h-k   })
			])
		

	if( this.rotationClass == 1 || this.rotationClass == 2 )

			faces.push([
				renderer.proj({x:x+d , y:y+d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+d, z:-h-k  }),
				renderer.proj({x:x+d , y:y+d, z:-h-k  })
			])

	else

			faces.push([
				renderer.proj({x:x+d , y:y+1-d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+1-d, z:-h  }),
				renderer.proj({x:x+1-d , y:y+1-d, z:-h-k  }),
				renderer.proj({x:x+d , y:y+1-d, z:-h-k  })
			])
	

	faces.unshift([
		renderer.proj({x:x+d, y:y+d, z:-h-k}),
		renderer.proj({x:x+1-d, y:y+d, z:-h-k}),
		renderer.proj({x:x+1-d, y:y+1-d, z:-h-k}),
		renderer.proj({x:x+d, y:y+1-d, z:-h-k})
	])

	this.ctx.beginPath()

	
	for(var i=faces.length;i--;)
		this.poly( faces[i] )

	this.ctx.fill()
	this.ctx.stroke()

}