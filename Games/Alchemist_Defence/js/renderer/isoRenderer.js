var normalizeAngle = function(a){
	return ( ( a % (Math.PI*2) ) + (Math.PI*2) ) % (Math.PI*2)
}

var renderer = new (function( canvas ){

	this.zoom = 1
	this.focus = {
		x:0,
		y:0
	}
	this.angle = Math.PI/4

	this.ctx = canvas.getContext('2d')

	this.tileSize = 64

	var incl = Math.PI/2.8;


	



	this.u = {}
	this.v = {}

	var vx,vy,ux,uy=0

	var tShake,
		shakeLvl
	this.shake = function( level ){
		shakeLvl = level
		tShake = 25
	}

	this.render = function( t ){

		// recomute u and v

		// rotate in the xOy plan

		ux = vy = Math.cos( this.angle )
		uy = vx = Math.sin( this.angle )
		
		ux = -ux

		// rotate the vectors

		var c=Math.cos( incl ),s=Math.sin( incl )

		this.u.x = ux
		this.u.y = uy * c
		this.u.z = uy * s

		this.v.x = vx
		this.v.y = vy * c
		this.v.z = vy * s


		// rotation type

		this.angle = normalizeAngle( this.angle )

		this.rotationClass = ( this.angle / (Math.PI/2) ) | 0

		///// z buffer

		var zbuffer = []
		this.zbuffer = zbuffer

		// fill with tiles
		for(var x=map.width;x--;)
		for(var y=map.height;y--;)
			zbuffer.push({
				z : (x+0.5) * this.u.z + (y+0.5) * this.v.z,
				type : 'tile',
				entity : map.get(x,y),
				x : x,
				y : y
			})

		// fill with spartans
		for(var i=spartanPool.spartans.length;i--;)
			zbuffer.push({
				z : (Math.floor(spartanPool.spartans[i].x)+0.5) * this.u.z + (Math.floor(spartanPool.spartans[i].y)+0.5) * this.v.z,
				trueZ : spartanPool.spartans[i].x * this.u.z + spartanPool.spartans[i].y * this.v.z,
				type : 'spartan',
				entity : spartanPool.spartans[i]
			})

		// fill with towers
		for(var i=towerPool.towers.length;i--;)
			zbuffer.push({
				z : (Math.floor(towerPool.towers[i].x)+0.5) * this.u.z + (Math.floor(towerPool.towers[i].y)+0.5) * this.v.z + 0.1,
				trueZ : towerPool.towers[i].x * this.u.z + towerPool.towers[i].y * this.v.z,
				type : 'tower',
				entity : towerPool.towers[i]
			})

		// fill with particules
		for(var i=particulePool.particules.length;i--;)
			zbuffer.push({
				z : (Math.floor(particulePool.particules[i].x)+0.5) * this.u.z + (Math.floor(particulePool.particules[i].y)+0.5) * this.v.z + 0.3,//particulePool.particules[i].h,
				trueZ : particulePool.particules[i].x * this.u.z + particulePool.particules[i].y * this.v.z,
				type : 'particule',
				entity : particulePool.particules[i]
			})


		// sort
		zbuffer = zbuffer.sort(function(a,b){
			if( a.z != b.z )
				return a.z < b.z ? 1 : -1
			
			if( a.type !== 'tile' )
				if( b.type !== 'tile' )
					return a.trueZ < b.trueZ ? 1 : -1
				else
					return -1
			return 1
		})

		// clear

		this.ctx.clearRect(0,0,canvas.width,canvas.height)


		// draw

		this.ctx.save()

		this.ctx.translate( canvas.width/2 , canvas.height/2 )

		// shake

		if( shakeLvl ){
			var g = ( tShake -- ) / 25
			this.ctx.translate( Math.sin( g * Math.PI * 5 + 4 ) * g * shakeLvl , Math.sin( g * Math.PI * 5 ) * g * shakeLvl  )
			if( g < 0 )
				shakeLvl = 0
		}

		var max = zbuffer[zbuffer.length-1].z,
			min = zbuffer[0].z

		for( var i=zbuffer.length;i--;)
			switch( zbuffer[i].type ){
				case 'tile' :
					this.renderCube( zbuffer[i].x , zbuffer[i].y , zbuffer[i].entity.h , ( zbuffer[i].z - min )/( max - min ) );
				break;

				case 'tower' :
					this.renderTower( zbuffer[i].entity.x ,  zbuffer[i].entity.y , map.get( zbuffer[i].entity.x ,  zbuffer[i].entity.y ).h , zbuffer[i].entity , ( zbuffer[i].z - min )/( max - min ) );
				break;

				case 'spartan' :
					this.renderSpartan( zbuffer[i].entity , ( zbuffer[i].trueZ - min )/( max - min ) , t );
				break;

				case 'particule' :
					this.renderParticule( zbuffer[i].entity , ( zbuffer[i].trueZ - min )/( max - min ) , t );
				break;
			}

		this.ctx.restore()
	}

})( document.getElementById('canvas'))