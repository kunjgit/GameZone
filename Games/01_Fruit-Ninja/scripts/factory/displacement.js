var layer = require( "../layer" );
var timeline = require( "../timeline" );
var tween = require( "../lib/tween" );

/**
 * 位移类模块模型
 */

exports.create = function( imageSrc, width, height, origX, origY, targetX, targetY, animMap, animDur ){
	var module = {};
	var image;
	
	var anim = {};

	if( typeof animMap === "function" )
	    anim.show = anim.hide = animMap;
	else
		anim = animMap;

	var createTask = function( start, duration, sx, sy, ex, ey, anim, mode ){
		timeline.createTask({
			start: start,
			duration: duration,
			object: module, data: [ sx, sy, ex, ey, anim, mode ],
			onTimeUpdate: module.onTimeUpdate, onTimeStart: module.onTimeStart, onTimeEnd: module.onTimeEnd,
			recycle: module.anims
		});
	};

	module.anims = [];

	module.set = function(){
		image = layer.createImage( "default", imageSrc, origX, origY, width, height );
	};

	module.show = function( start ){
		createTask(  start, animDur, origX, origY, targetX, targetY, anim.show, "show" );
	};

	module.hide = function(){
		this.anims.clear();
		createTask( 0, animDur, targetX, targetY, origX, origY, anim.hide, "hide" );
	};

	module.onTimeUpdate = function( time, sx, sy, ex, ey, anim ){
	    image.attr( {
	    	x: anim( time, sx, ex - sx, animDur ),
	    	y: anim( time, sy, ey - sy, animDur )
	    } );
	};

	module.onTimeStart = function(){
	    
	};

	module.onTimeEnd = function( sx, sy, ex, ey, anim ){
	    if( anim === "hide" )
	    	image.hide();
	};

	return module;
};