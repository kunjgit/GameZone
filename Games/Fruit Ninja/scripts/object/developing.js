var layer = require( "../layer" );
var tween = require( "../lib/tween" );
var timeline = require( "../timeline" );
var message = require( "../message" );

var exponential = tween.exponential.co;

/**
 * "coming soon" 模块
 */

exports.anims = [];

exports.set = function(){
	this.image = layer.createImage( "default", "images/developing.png", 103, 218, 429, 53 ).hide().scale( 1e-5, 1e-5 );
};

exports.show = function( start ){
    timeline.createTask({
		start: start, duration: 500, data: [ 1e-5, 1, "show" ],
		object: this, onTimeUpdate: this.onZooming, onTimeStart: this.onZoomStart, onTimeEnd: this.onZoomEnd,
		recycle: this.anims
	});

	this.hide( 2000 );
};

exports.hide = function( start ){
    timeline.createTask({
		start: start, duration: 500, data: [ 1, 1e-5, "hide" ],
		object: this, onTimeUpdate: this.onZooming, onTimeStart: this.onZoomStart, onTimeEnd: this.onZoomEnd,
		recycle: this.anims
	});
};

// 显示/隐藏 相关

exports.onZoomStart = function(){
	this.image.show();
};

exports.onZooming = function( time, sz, ez, z ){
	this.image.scale( z = exponential( time, sz, ez - sz, 500 ), z );
};

exports.onZoomEnd = function( sz, ez, mode ){
    if( mode === "hide" )
        this.image.hide();
};