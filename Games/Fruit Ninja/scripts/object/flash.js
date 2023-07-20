/**
 *
 */

var layer = require( "../layer" );
var timeline = require( "../timeline" ).use( "flash" ).init( 10 );
var tween = require( "../lib/tween" );
var sound = require( "../lib/sound" );

var image, snd, xDiff = 0, yDiff = 0;

var anim = tween.quadratic.cio;
var anims = [];
var dur = 100;

exports.set = function(){
	image = layer.createImage( "flash", "images/flash.png", 0, 0, 358, 20 ).hide();
	snd = sound.create( "sound/splatter" );
};

exports.showAt = function( x, y, an ){
    image.rotate( an, true ).scale( 1e-5, 1e-5 ).attr({
        x: x + xDiff,
        y: y + yDiff
    }).show();

    anims.clear && anims.clear();

    snd.play();

    timeline.createTask({
        start: 0, duration: dur, data: [ 1e-5, 1 ],
        object: this, onTimeUpdate: this.onTimeUpdate,
        recycle: anims
    });

    timeline.createTask({
        start: dur, duration: dur, data: [ 1, 1e-5 ],
        object: this, onTimeUpdate: this.onTimeUpdate,
        recycle: anims
    });
};

exports.onTimeUpdate = function( time, a, b, z ){
    image.scale( z = anim( time, a, b - a, dur ), z );
};