renderer.renderParticule = function( entity , z , t ){

	var tmp1 = this.proj({ x:entity.x-map.width/2 , y:entity.y-map.height/2 , z:-entity.h*0.23  }),
		tmp


	for( var i=1;i<entity.traine.length;i++ ){

		this.ctx.beginPath()


		tmp = this.proj({ x:entity.traine[i-1].x-map.width/2 , y:entity.traine[i-1].y-map.height/2 , z:-entity.traine[i-1].h*0.23  })
		this.ctx.moveTo(tmp.x,tmp.y)

		tmp = this.proj({ x:entity.traine[i].x-map.width/2 , y:entity.traine[i].y-map.height/2 , z:-entity.traine[i].h*0.23  })
		this.ctx.lineTo(tmp.x,tmp.y)

		this.ctx.strokeStyle= entity.type[0] == 'f' ? 'red' : '#A25713'
		this.ctx.lineWidth= entity.traine.length - i
		if( entity.type[0] == 'e' && i > 3)
			break
		this.ctx.stroke()
	}

}