var Ucren = require( "lib/ucren" );
var knife = require( "object/knife" );
var message = require( "message" );
var state = require( "state" );

var canvasLeft, canvasTop;

canvasLeft = canvasTop = 0;

exports.init = function(){
	this.fixCanvasPos();
	this.installDragger();
	this.installClicker();
};

exports.installDragger = function(){
    var dragger = new Ucren.BasicDrag({ type: "calc" });

    dragger.on( "returnValue", function( dx, dy, x, y, kf ){
    	if( kf = knife.through( x - canvasLeft, y - canvasTop ) )
            message.postMessage( kf, "slice" );
    });

    dragger.on( "startDrag", function(){
        knife.newKnife();
    });

    dragger.bind( document.documentElement );
};

exports.installClicker = function(){
    Ucren.addEvent( document, "click", function(){
        if( state( "click-enable" ).ison() )
        	message.postMessage( "click" );
    });
};

exports.fixCanvasPos = function(){
	var de = document.documentElement;

	var fix = function( e ){
	    canvasLeft = ( de.clientWidth - 640 ) / 2;
	    canvasTop = ( de.clientHeight - 480 ) / 2 - 40;
	};

	fix();

	Ucren.addEvent( window, "resize", fix );
};