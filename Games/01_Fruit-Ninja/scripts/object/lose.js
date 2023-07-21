var layer = require( "../layer" );
var tween = require( "../lib/tween" );
var timeline = require( "../timeline" );
var Ucren = require( "../lib/ucren" );
var message = require( "../message" );

var anim = tween.exponential.co;
var back = tween.back.co;

/**
 * 
 */

var o1, o2, o3, animLength = 500;

var conf1 = { src: "images/x.png", sx: 650, ex: 561, y: 5, w: 22, h: 19 };
var conf2 = { src: "images/xx.png", sx: 671, ex: 582, y: 5, w: 27, h: 26 };
var conf3 = { src: "images/xxx.png", sx: 697, ex: 608, y: 6, w: 31, h: 32 };

var number = 0;

exports.anims = [];

exports.set = function(){
    o1 = layer.createImage( "default", conf1.src, conf1.sx, conf1.y, conf1.w, conf1.h ).hide();
    o2 = layer.createImage( "default", conf2.src, conf2.sx, conf2.y, conf2.w, conf2.h ).hide();
    o3 = layer.createImage( "default", conf3.src, conf3.sx, conf3.y, conf3.w, conf3.h ).hide();
};

exports.reset = function(){
    number = 0;
    [ [ o1, conf1 ], [ o2, conf2 ], [ o3, conf3 ] ].forEach(function( infx ){
        infx[0].attr( "src", infx[1].src.replace( "xf.png", "x.png" ) );
    })
};

exports.show = function( start ){
    timeline.createTask({
		start: start, duration: animLength, data: [ "show", conf1.sx, conf1.ex, conf2.sx, conf2.ex, conf3.sx, conf3.ex ],
		object: this, onTimeUpdate: this.onTimeUpdate, onTimeStart: this.onTimeStart, onTimeEnd: this.onTimeEnd,
		recycle: this.anims
	});
};

exports.hide = function( start ){
    timeline.createTask({
		start: start, duration: animLength, data: [ "hide", conf1.ex, conf1.sx, conf2.ex, conf2.sx, conf3.ex, conf3.sx ],
		object: this, onTimeUpdate: this.onTimeUpdate, onTimeStart: this.onTimeStart, onTimeEnd: this.onTimeEnd,
		recycle: this.anims
	});  
};

exports.showLoseAt = function( x ){

    var infx, inf = [
        [ o1, conf1 ],
        [ o2, conf2 ],
        [ o3, conf3 ]
    ];
    
    createPosShow( x );

    infx = inf[ ( ++ number ) - 1 ];
    infx[0].attr( "src", infx[1].src.replace( "x.png", "xf.png" ) ).scale( 1e-5, 1e-5 );
    this.scaleImage( infx[0] );
    
    if( number == 3 )
        message.postMessage( "game.over" );
};

exports.scaleImage = function( image ){
    var dur = 500;

    image.myOnScaling = image.myOnScaling || function( time, z ){
        this.scale( z = back( time, 1e-5, 1 - 1e-5, dur ), z );
    };

    image.myOnScaleEnd = image.myOnScaleEnd || function(){
        this.scale( 1, 1 );
    };

    timeline.createTask({
        start: 0, duration: dur,
        object: image, onTimeUpdate: image.myOnScaling, onTimeEnd: image.myOnScaleEnd,
        recycle: this.anims
    });
};

// 显示/隐藏 相关

exports.onTimeUpdate = function( time, mode, x1s, x1e, x2s, x2e, x3s, x3e ){
    o1.attr( "x", anim( time, x1s, x1e - x1s, animLength ) );
    o2.attr( "x", anim( time, x2s, x2e - x2s, animLength ) );
    o3.attr( "x", anim( time, x3s, x3e - x3s, animLength ) );
};

exports.onTimeStart = function( mode ){
    if( mode == "show" )
        [ o1, o2, o3 ].invoke( "show" );
};

exports.onTimeEnd = function( mode ){
    if( mode == "hide" )
        [ o1, o2, o3 ].invoke( "hide" ),
        this.reset();
};

function createPosShow( x ){
    var image = layer.createImage( "default", "images/lose.png", x - 27, 406, 54, 50 ).scale( 1e-5, 1e-5 );
    var duration = 500;

    var control = {
        show: function( start ){
            timeline.createTask({
                start: start, duration: duration, data: [ tween.back.co, 1e-5, 1 ],
                object: this, onTimeUpdate: this.onScaling, onTimeEnd: this.onShowEnd
                // recycle: anims
            });
        },

        hide: function( start ){
            timeline.createTask({
                start: start, duration: duration, data: [ tween.back.ci, 1, 1e-5 ],
                object: this, onTimeUpdate: this.onScaling, onTimeEnd: this.onHideEnd
                // recycle: anims
            });
        },

        onScaling: function( time, anim, a, b, z ){
            image.scale( z = anim( time, a, b - a, duration ), z );
        },

        onShowEnd: function(){
            this.hide( 1500 );
        },

        onHideEnd: function(){
            image.remove();
        }
    };

    control.show( 200 );
}