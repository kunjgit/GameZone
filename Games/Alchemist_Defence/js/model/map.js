var manhattan = function( a, b){
	return Math.abs( b.x - a.x ) + Math.abs( b.y - a.y )
}
var map=new (function(){

	var w = this.width = 14
	var h = this.height = 14

	var tiles = []

	this.get = function(x,y){
		return tiles[ x + w * y ]
	}

	this.outOfBound = function(x,y){
		return x<0 || x>=w || y<0 || y>= h
	}

	this.copyFrom = function(d){
		for(var i=w*h;i--;)
			tiles[i]={h:d?+(d[i]||0):0,o:null}
	}

	this.setH = function(x,y,h){
		tiles[ x + w * y ].h=h
	}

	var inList = function( list , pos ){
		for( var i=list.length;i--;)
			if( list[i].pos.x == pos.x && list[i].pos.y == pos.y )
				return i
		return false
	}

	this.aStar = function( a , b ){
		var openList = [{
			pos : {x:a.x,y:a.y},
			f : manhattan( a , b ),
			parent : null
		}],
			closeList = []

		while( openList.length ){

			var c = openList.shift()

			if( c.pos.x == b.x && c.pos.y == b.y )
				break

			for( var k=4;k--;){
				var d = (k%2)*2-1
				var npos = {
					x : c.pos.x + ( k>>1 ) * d,
					y : c.pos.y + (+( !(k>>1) )) * d,
				}

				var cell;
				if( this.outOfBound( npos.x , npos.y) || ( cell = this.get( npos.x , npos.y ) ).h > 1 || inList( closeList , npos ) !== false )
					continue

				var i = inList( openList , npos )
				var f = manhattan( npos , b ) + c.p+1

				if( i === false )
					openList.push({
						pos : npos,
						f : f,
						parent : c
					})
				else
					if( openList[i].f > f ){
						openList[i].f = f
						openList[i].parent = c
					}
			}

			closeList.push( c )

			c = null
		}

		if( !c )
			return null

		var path = [c.pos]
		while( c.parent ){
			c = c.parent
			path.unshift( c.pos )
		}

		return path
	}
})();