var timeline = require( "../timeline" );
var layer = require( "../layer" ).getLayer( "knife" );
var Ucren = require( "../lib/ucren" );

/**
 * 刀光模块
 */

var lastX = null, lastY = null;
var abs = Math.abs;

var life = 200;
var stroke = 10;
var color = "#cbd3db";
var anims = [];
var switchState = true;
var knifes = [];

function ClassKnifePart( conf ){
    this.sx = conf.sx;
    this.sy = conf.sy;
    this.ex = conf.ex;
    this.ey = conf.ey;

    knifes.push( this );
}

ClassKnifePart.prototype.set = function(){
	var sx, sy, ex, ey, dx, dy, ax, ay;

	sx = this.sx;
	sy = this.sy;
	ex = this.ex;
	ey = this.ey;

	dx = sx - ex;
	dy = sy - ey;
	ax = abs(dx);
	ay = abs(dy);

	if(ax > ay)
	    sx += dx < 0 ? -1 : 1,
	    sy += dy < 0 ? -( 1 * ay / ax ) : 1 * ay / ax;
	else
	    sx += dx < 0 ? -( 1 * ax / ay ) : 1 * ax / ay,
	    sy += dy < 0 ? -1 : 1;

	this.line = layer.path( "M" + sx + "," + sy + "L" + ex + "," + ey ).attr({
		"stroke": color,
		"stroke-width": stroke + "px"
	});

	timeline.createTask({ start: 0, duration: life, object: this, onTimeUpdate: this.update, onTimeEnd: this.end, recycle: anims });
	return this;
};

ClassKnifePart.prototype.update = function( time ){
	this.line.attr( "stroke-width", stroke * (1 - time / life) + "px" );
};

ClassKnifePart.prototype.end = function(){
	this.line.remove();

	var index;
	if( index = knifes.indexOf( this ) )
	    knifes.splice( index, 1 );
};

exports.newKnife = function(){
    lastX = lastY = null;
};

exports.through = function( x, y ){
	if( !switchState )
		return ;
	var ret = null;
	if( lastX !== null && ( lastX != x || lastY != y ) )
	    new ClassKnifePart({ sx: lastX, sy: lastY, ex: x, ey: y }).set(),
		ret = [ lastX, lastY, x, y ];

	lastX = x;
	lastY = y;
	return ret;
};

exports.pause = function(){
    anims.clear();
    this.switchOff();
};

exports.switchOff = function(){
    switchState = false;
};

exports.switchOn = function(){
	switchState = true;
	this.endAll();
};

exports.endAll = function(){
    for(var i = knifes.length - 1; i >= 0; i --)
		knifes[i].end();
};