
renderer.renderSpartan = function(entity,z,t){
	

	if( !entity.stamp )
		entity.stamp = Math.random()

	var h = ( map.get(Math.floor(entity.x),Math.floor(entity.y)).h ||0 ) *0.23 

	h += Math.cos( t * Math.PI / 20 + entity.stamp * 100 ) / 20 + 0.2


	
	var tmp = this.proj({ x:entity.x-map.width/2 , y:entity.y-map.height/2 , z:0 })
	
	this.ctx.beginPath()
	this.ctx.arc( tmp.x , tmp.y , 3 , 0 ,  Math.PI*2 )
	this.ctx.fillStyle= 'rgba(100,100,100,0.4)'
	this.ctx.fill()

	var tmp = this.proj({ x:entity.x-map.width/2 , y:entity.y-map.height/2 , z:-h })
	
	
 	if( entity.shake > 0 )
 		entity.shake --


	this.ctx.beginPath()
	this.ctx.arc( tmp.x , tmp.y , 6 + entity.shake , 0 ,  Math.PI*2 )
	this.ctx.fillStyle= '#555'
	this.ctx.fill()

	this.ctx.beginPath()
	this.ctx.moveTo( tmp.x-2 ,  tmp.y - 4 )
	this.ctx.lineTo( tmp.x-5 ,  tmp.y - 16  )
	this.ctx.lineTo( tmp.x+5 ,  tmp.y - 16  )
	this.ctx.lineTo( tmp.x+2 ,  tmp.y - 4 )
	this.ctx.lineTo( tmp.x-2 ,  tmp.y - 4 )
	this.ctx.fillStyle= '#884AE5'
	this.ctx.fill()

}