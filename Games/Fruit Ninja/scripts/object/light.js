/**
 * 炸弹爆炸时的光线
 */

var layer = require( "../layer" );

var maskLayer = layer.getLayer( "mask" );
	layer = layer.getLayer( "light" );

var Ucren = require( "../lib/ucren" );
var timeline = require( "../timeline" );
var message = require( "../message" );

var random = Ucren.randomNumber;
var pi = Math.PI;
var sin = Math.sin;
var cos = Math.cos;

var lights = [];
var indexs = [];
var lightsNum = 10;

for(var i = 0; i < lightsNum; i ++)
	indexs[i] = i;

exports.start = function( boom ){
	var x = boom.originX, y = boom.originY, time = 0, idx = indexs.random();

	var i = lightsNum, b = function(){
	    build( x, y, idx[ this ] );
	};

	while( i -- )
		timeline.setTimeout( b.bind( i ), time += 100 );

	timeline.setTimeout(function(){
	    this.overWhiteLight();
	}.bind( this ), time + 100);
};

exports.overWhiteLight = function(){
    message.postMessage( "overWhiteLight.show" );
    this.removeLights();

    var dur = 4e3;
    var mask = maskLayer.rect( 0, 0, 640, 480 ).attr({ fill: "#fff", stroke: "none" });
    var control = {
    	onTimeUpdate: function( time ){
    		mask.attr( "opacity", 1 - time / dur );
    	},

    	onTimeEnd: function(){
    	    mask.remove();
    	    message.postMessage( "game.over" );
    	}
    };

    timeline.createTask({
		start: 0, duration: dur,
		object: control, onTimeUpdate: control.onTimeUpdate, onTimeEnd: control.onTimeEnd
	});

};

exports.removeLights = function(){
    for(var i = 0, l = lights.length; i < l; i ++)
    	lights[i].remove();
    lights.length = 0;
};



function build( x, y, r ){
    var a1, a2, x1, y1, x2, y2;
    
    a1 = r * 36 + random( 10 );
    a2 = a1 + 5;

    a1 = pi * a1 / 180;
    a2 = pi * a2 / 180;
    
    x1 = x + 640 * cos( a1 );
    y1 = y + 640 * sin( a1 );

    x2 = x + 640 * cos( a2 );
    y2 = y + 640 * sin( a2 );

    var light = layer.path( [ "M", x, y, "L", x1, y1, "L", x2, y2, "Z" ] ).attr({
    	stroke: "none",
    	fill: "#fff"
    });

    lights.push( light );
}