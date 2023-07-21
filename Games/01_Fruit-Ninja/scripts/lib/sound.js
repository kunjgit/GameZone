/**
 * 简易声效控制
 */

/**
 * 使用方法：
 * 
 * var sound = require( "sound/main" );
 * 
 * var snd = sound.create("sounds/myfile");
 * snd.play();
 */

var buzz = require( "buzz" );
var supported = buzz.isSupported();

var config = { 
	formats: [ "ogg", "mp3" ], 
	preload: true, 
	autoload: true, 
	loop: false 
};

function ClassBuzz( src ){
    this.sound = new buzz.sound( src, config );
}

ClassBuzz.prototype.play = function( s ){
	s = this.sound;
	s.setPercent( 0 );
	s.setVolume( 100 );
	s.play();
};

ClassBuzz.prototype.stop = function(){
	this.sound.fadeOut( 1e3, function(){
	    this.pause();
	} );
};


exports.create = function( src ){
	if( !supported )
	    return unSupported;
	else
    	return new ClassBuzz( src );
}

function unSupported(){
	// TODO: 
}

unSupported.play =
unSupported.stop = function(){
	// TODO: 
};