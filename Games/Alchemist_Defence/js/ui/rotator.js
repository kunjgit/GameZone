;(function(canvas){


var anchor,
	angleStart,
	angleTarget,
	velocity = 0.005,
	cancelCycle = false


var cycle = function(){

	if( cancelCycle ){
		cancelCycle = false
		return;
	}

	renderer.angle += ( angleTarget > renderer.angle ? 1 : -1 ) * Math.max( velocity , Math.abs( angleTarget - renderer.angle ) / 12 )

	if( Math.abs( angleTarget - renderer.angle ) > velocity )
		requestAnimationFrame( cycle )
	else
		renderer.angle = angleTarget
}

var mousemove = function(e){

	var delta = ( e.clientX - anchor ) / canvas.width

	renderer.angle = angleStart + delta * Math.PI*3/2
}
var mouseup = function(e){
	canvas.removeEventListener('mousemove',mousemove,false)
	canvas.removeEventListener('mouseup',mouseup,false)

	angleTarget = normalizeAngle( Math.round( ( renderer.angle - Math.PI/4 )/ (Math.PI/2) ) * (Math.PI/2) + Math.PI/4 )

	cancelCycle = false

	cycle()
}
canvas.addEventListener('mousedown',function(e){

	anchor = e.clientX

	angleStart = renderer.angle

	cancelCycle = true

	canvas.addEventListener('mousemove',mousemove,false)
	canvas.addEventListener('mouseup',mouseup,false)

},false)


})(document.getElementById('canvas'))