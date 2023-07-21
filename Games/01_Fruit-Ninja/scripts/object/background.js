var Ucren = require( "../lib/ucren" );
var layer = require( "../layer" );
var timeline = require( "../timeline" );
var image, time;

var random = Ucren.randomNumber;

exports.set = function(){
	image = layer.createImage( "default", "images/background.jpg", 0, 0, 640, 480 );
};

exports.wobble = function(){
	time = timeline.setInterval( wobble, 50 );
};

exports.stop = function(){
    time.stop();
    image.attr({ x: 0, y: 0 });
};

function wobble(){
    var x, y;
    x = random( 12 ) - 6;
    y = random( 12 ) - 6;
    image.attr({ x: x, y: y });
};