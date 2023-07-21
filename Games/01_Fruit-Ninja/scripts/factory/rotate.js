var layer = require( "../layer" );
var timeline = require( "../timeline" );
var Ucren = require( "../lib/ucren" );

/**
 * 旋转类模块模型
 */

exports.create = function( imageSrc, x, y, w, h, z, anim, animDur ){
	var module = {}, image;
	var rotateDire = [12, -12][Ucren.randomNumber(2)];
	var defaultAngle = Ucren.randomNumber(360);

	module.anims = [];

	module.set = function(){
	    image = layer.createImage( "default", imageSrc, x, y, w, h ).scale( z, z ).rotate( defaultAngle, true );
	};

	module.show = function(start){
		timeline.createTask({ 
			start: start, 
			duration: animDur, 
			object: this, 
			data: [z, 1], 
			onTimeUpdate: this.onZooming,
			onTimeEnd: this.onShowEnd,
			recycle: this.anims
		});
	};

	module.hide = function(start){
		this.anims.clear();
		timeline.createTask({ 
			start: start, 
			duration: animDur, 
			object: this, 
			data: [ 1, z ], 
			onTimeUpdate: this.onZooming,
			recycle: this.anims
		});
	};

	module.onShowEnd = function(name){
		this.anims.clear();
		timeline.createTask({ 
			start: 0, 
			duration: -1, 
			object: this, 
			onTimeUpdate: module.onRotating,
			recycle: this.anims
		});
	};

	module.onZooming = function(){
		var z;
		return function( time, a, b ){
		    image.scale( z = anim( time, a, b - a, animDur ), z );
		}
	}();

	module.onRotating = function(){
		var lastTime = 0, an = defaultAngle;
	    return function( time, name, a, b ){
	    	an = ( an + ( time - lastTime ) / 1e3 * rotateDire ) % 360;
	    	image.rotate( an, true );
	        lastTime = time;
		}
	}();

	return module;
}