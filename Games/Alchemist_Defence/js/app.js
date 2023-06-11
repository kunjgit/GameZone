
var s = [

0 , 4 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 ,
0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , 0 , 0 , 0 , 0 , 0 ,
0 , 0 , 0 , 2 , 0 , 0 , 2 , 2 , 2 , 2 , 2 , 6 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 0 , 2 , 0 , 0 , 0 , 0 , 4 , 0 , 0 ,
0 , 0 , 1 , 0 , 0 , 0 , 2 , 0 , 4 , 0 , 0 , 2 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 0 , 2 , 4 , 6 , 2 , 0 , 2 , 0 , 0 ,
0 , 0 , 2 , 4 , 4 , 0 , 2 , 0 , 0 , 0 , 0 , 2 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 0 , 2 , 0 , 2 , 0 , 0 , 2 , 0 , 0 ,
0 , 1 , 2 , 0 , 0 , 0 , 2 , 6 , 4 , 0 , 0 , 2 , 0 , 0 ,
0 , 1 , 2 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 2 , 2 , 0 , 2 , 4 , 2 , 2 , 0 , 0 ,
0 , 0 , 2 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 0 , 2 ,
0 , 0 , 2 , 0 , 4 , 0 , 2 , 0 , 2 , 3 , 2 , 2 , 0 , 2 ,



].join('')


var launch = function(){

	document.getElementById('canvas').style.display = 'block'

	map.copyFrom( s )

	renderer.render()

	towerPicker.init( dataTower )


	var t = 0;

	;(function cycle(){
		
		spartanPool.tick( t++ )
		towerPool.tick( t )
		particulePool.tick( t )

		renderer.render( t )
		requestAnimationFrame( cycle )
	})()
}