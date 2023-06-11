var touch = new (function(canvas){


// poly oritend clock
var contains = function( poly , p ){

	var ref = ( poly[0].x - poly[1].x ) * ( poly[2].y - poly[1].y ) - ( poly[0].y - poly[1].y ) * ( poly[2].x - poly[1].x )

	var a = poly[0],b

	for(var i=poly.length;i--;){
		b = a
		a = poly[i]


		var dot = ( a.y - b.y ) * ( p.x - a.x ) + ( b.x - a.x ) * ( p.y - a.y )
		
		if( Math.abs( dot ) > 0.0000001 && dot * ref > 0 )
			return false
	}

	return true
}



this.collide = function(p){

	// TODO dichotomy this stuff up 
	// is this event possible?
	// I dont think so tim

	
	for(var i=0;i<renderer.zbuffer.length;i++){

		if( renderer.zbuffer[i].type != 'tile' )
			continue

		var h = map.get(  renderer.zbuffer[i].x , renderer.zbuffer[i].y ).h
		var faces = renderer.cubePoly( renderer.zbuffer[i].x , renderer.zbuffer[i].y , h )

		if( contains( faces[0] , p ) )
			return renderer.zbuffer[i]

		
		for(var j=1;j<faces.length;j++)
			if( contains( faces[j] , p ) )
				return	
		
	}
}


})(document.getElementById('canvas'))