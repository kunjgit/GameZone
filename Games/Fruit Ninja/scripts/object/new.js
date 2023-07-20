var layer = require( "../layer" );
var tween = require( "../lib/tween" );
var timeline = require( "../timeline" );
var Ucren = require( "../lib/ucren" );

var image;
var cycleTime = 300;

var sx = 129, sy = 328, ex = 170, ey = 221, sw = 0, sh = 0, ew = 70, eh = 42, dy = 8;

var showAnim = tween.exponential.co;
var jumpAnim = tween.quadratic.ci;

exports.anims = [];

exports.set = function(){
    image = layer.createImage( "default", "images/new.png", sx, sy, sw, sh );
};

exports.unset = function(){
    
};

exports.show = function( start ){
	timeline.createTask({ 
        start: start, duration: 500,
        data: [ sx, ex, sy, ey, sw, ew, sh, eh ],
        object: this, onTimeUpdate: this.onShowing, onTimeStart: this.onShowStart, onTimeEnd: this.onShowEnd, 
        recycle: this.anims 
    });
};

exports.hide = function( start ){
    this.anims.clear();
    timeline.createTask({ 
        start: start, duration: 500,
        data: [ ex, sx, ey, sy, ew, sw, eh, sh ],
        object: this, onTimeUpdate: this.onShowing, 
        recycle: this.anims 
    });
};

exports.jump = function(){
    this.anims.clear();
    timeline.createTask({ start: 0, duration: -1, object: this, onTimeUpdate: this.onJumping, recycle: this.anims });
};

// 显示相关

exports.onShowStart = function(){
};

exports.onShowing = function( time, sx, ex, sy, ey, sw, ew, sh, eh ){
    image.attr({ 
    	x: showAnim( time, sx, ex - sx, 500 ), 
    	y: showAnim( time, sy, ey - sy, 500 ),
    	width: showAnim( time, sw, ew - sw, 500 ),
    	height: showAnim( time, sh, eh - sh, 500 )
    });
};

exports.onShowEnd = function(){
    this.jump();
};

// 跳跃相关

exports.onJumping = function(time){
	var t = parseInt(time / cycleTime);

	time = time % cycleTime;
	if( t % 2 ) time = cycleTime - time;
	
	image.attr("y", jumpAnim( time, ey, dy, cycleTime ));
};