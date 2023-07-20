var layer = require( "../layer" );
var Ucren = require( "../lib/ucren" );
var timeline = require( "../timeline" ).use( "fruit" ).init( 1 );
var timeline2 = require( "../timeline" ).use( "fruit-apart" ).init( 1 );
var tween = require( "../lib/tween" );
var message = require( "../message" );
var flame = require( "../object/flame" );
var flash = require( "../object/flash" );
var juice = require( "../factory/juice" );

var ie = Ucren.isIe;
var safari = Ucren.isSafari;

/**
 * 水果模块模型
 */

var zoomAnim = tween.exponential.co;
var rotateAnim = tween.circular;
var linearAnim = tween.linear;
var dropAnim = tween.quadratic.ci;
var fallOffAnim = tween.quadratic.co;

var random = Ucren.randomNumber;
var min = Math.min;
var average = function( a, b ){ return ( ( a + b ) / 2 ) >> 0; };

var dropTime = 1200, dropXScope = 200, shadowPos = 50;

var infos = {
	// type: [ imageSrc, width, height, radius, fixAngle, isReverse, juiceColor ]
	boom: [ "images/fruit/boom.png", 66, 68, 26, 0, 0, null ],
	peach: [ "images/fruit/peach.png", 62, 59, 37, -50, 0, "#e6c731" ],
	sandia: [ "images/fruit/sandia.png", 98, 85, 38, -100, 0, "#c00" ],
	apple: [ "images/fruit/apple.png", 66, 66, 31, -54, 0, "#c8e925" ],
	banana: [ "images/fruit/banana.png", 126, 50, 43, 90, 0, null ],
	basaha: [ "images/fruit/basaha.png", 68, 72, 32, -135, 0, "#c00" ]
};

// TODO: 是否水果全开？
var types = [ "peach", "sandia", "apple", "banana", "basaha" ];
// var types = [ "sandia", "boom" ];
var rotateSpeed = [ 60, 50, 40, -40, -50, -60 ];

var fruitCache = [];

function ClassFruit(conf){
    var info = infos[ conf.type ], radius = info[3];

	this.type = conf.type;
    this.originX = conf.originX;
    this.originY = conf.originY;
    this.radius = radius;
    this.startX = conf.originX;
    this.startY = conf.originY;
    this.radius = radius;

    this.anims = [];

    if( this.type === "boom" )
        this.flame = flame.create( this.startX - radius + 4, this.startY - radius + 5, conf.flameStart || 0 );
}

ClassFruit.prototype.set = function( hide ){
	var inf = infos[ this.type ], radius = this.radius;

	this.shadow = layer.createImage( "fruit", "images/shadow.png", this.startX - radius, this.startY - radius + shadowPos, 106, 77 );
	this.image = layer.createImage( "fruit", inf[0], this.startX - radius, this.startY - radius, inf[1], inf[2] );

	if( hide )
		this.image.hide(),
		this.shadow.hide();

	return this;
};

ClassFruit.prototype.pos = function( x, y ){
	if( x == this.originX && y == this.originY )
	    return ;

	var r = this.radius;

	this.originX = x;
	this.originY = y;

	this.image.attr({ x: x -= r, y: y -= r });
	this.shadow.attr({ x: x, y: y + shadowPos });

	if( this.type === "boom" )
	    this.flame.pos( x + 4, y + 5 );
};

ClassFruit.prototype.show = function( start ){
	timeline.createTask({ 
		start: start, duration: 500, data: [ 1e-5, 1, "show" ], 
		object: this, onTimeUpdate: this.onScaling, onTimeStart: this.onShowStart,
		recycle: this.anims
	});
};

ClassFruit.prototype.hide = function( start ){
	if( this.type !== "boom" ) // if it is not a boom, it can't to be hide.
	    return ;

	this.anims.clear();
	this.flame.remove();
	timeline.createTask({ 
		start: start, duration: 500, data: [ 1, 1e-5, "hide" ], 
		object: this, onTimeUpdate: this.onScaling, onTimeEnd: this.onHideEnd,
		recycle: this.anims
	});	
};

ClassFruit.prototype.rotate = function( start, speed ){
	this.rotateSpeed = speed || rotateSpeed[ random( 6 ) ];
	this.rotateAnim = timeline.createTask({
		start: start, duration: -1, 
		object: this, onTimeUpdate: this.onRotating,
		recycle: this.anims
	});
};

ClassFruit.prototype.broken = function( angle ){
	if( this.brokend )return;
	this.brokend = true;

	var index;
	if( ( index = fruitCache.indexOf( this ) ) > -1 )
	    fruitCache.splice( index, 1 );

	if( this.type !== "boom" )
		flash.showAt( this.originX, this.originY, angle ),
		juice.create( this.originX, this.originY, infos[ this.type ][6] ),
	    this.apart( angle );
	else
		this.hide();
};

ClassFruit.prototype.pause = function(){
	if( this.brokend )
	    return;
	this.anims.clear();
	if( this.type == "boom" )
	    this.flame.remove();
};

// 分开
ClassFruit.prototype.apart = function( angle ){
	this.anims.clear();
	this.image.hide();
	this.shadow.hide();
	this.aparted = true;

	var inf = infos[ this.type ], preSrc = inf[0].replace( ".png", "" ), radius = this.radius;
	var create = layer.createImage.saturate( layer, this.startX - radius, this.startY - radius, inf[1], inf[2] );

	angle = ( ( angle % 180 ) + 360 + inf[4] ) % 360;

	this.bImage1 = create( "fruit", preSrc + "-1.png" );
	this.bImage2 = create( "fruit", preSrc + "-2.png" );

	[ this.bImage1, this.bImage2 ].invoke( "rotate", angle );

	this.apartAngle = angle;
	timeline2.createTask({ 
		start: 0, duration: dropTime, object: this, 
		onTimeUpdate: this.onBrokenDropUpdate, onTimeStart: this.onBrokenDropStart, onTimeEnd: this.onBrokenDropEnd,
		recycle: this.anims
	});
};

// 抛出
ClassFruit.prototype.shotOut = function(){
	var sign = [ -1, 1 ];
    return function( start, endX ){

		this.shotOutStartX = this.originX;
		this.shotOutStartY = this.originY;
		this.shotOutEndX = average( this.originX, endX );
		this.shotOutEndY = min( this.startY - random( this.startY - 100 ), 200 );
		this.fallOffToX = endX;

		timeline.createTask({
			start: start, duration: dropTime, object: this,
			onTimeUpdate: this.onShotOuting, onTimeStart: this.onShotOutStart, onTimeEnd: this.onShotOutEnd,
			recycle: this.anims
		});

		if( this.type != "boom" )
		 	this.rotate( 0, ( random( 180 ) + 90 ) * sign[ random( 2 ) ] );

		return this;
	};
}();

// 掉落
ClassFruit.prototype.fallOff = function(){
	var sign = [ -1, 1 ];
	var signIndex = 0;
    return function( start, x ){

		if( this.aparted || this.brokend )
			return ;

		var y = 600;

		if( typeof x !== "number" )
		    x = this.originX + random( dropXScope ) * sign[ ( signIndex ++ ) % 2 ];

		this.fallTargetX = x;
		this.fallTargetY = y;

		timeline.createTask({
			start: start, duration: dropTime, object: this,
			onTimeUpdate: this.onFalling, onTimeStart: this.onFallStart, onTimeEnd: this.onFallEnd,
			recycle: this.anims
		});
	}
}();

ClassFruit.prototype.remove = function(){
	var index;

	this.anims.clear();

	if( this.image )
		this.image.remove(),
		this.shadow.remove();

	if( this.bImage1 )
		this.bImage1.remove(),
		this.bImage2.remove();

	if( this.type === "boom" )
	    this.flame.remove();
	
	if( ( index = fruitCache.indexOf( this ) ) > -1 )
	    fruitCache.splice( index, 1 );

	for(var name in this)
		if( typeof this[name] === "function" )
			this[name] = function( name ){
			    return function(){
				    throw new Error( "method " + name + " has been removed" );
				};
			}( name );
		else delete this[name];

	message.postMessage( this, "fruit.remove" );
};

// 显示/隐藏 相关

ClassFruit.prototype.onShowStart = function(){
	this.image.show();
	// this.shadow.show();
};

ClassFruit.prototype.onScaling = function( time, a, b, z ){
	this.image.scale( z = zoomAnim( time, a, b - a, 500 ), z );
	this.shadow.scale( z, z );
};

ClassFruit.prototype.onHideEnd = function(){
	this.remove();
};

// 旋转相关

ClassFruit.prototype.onRotateStart = function(){
	
};

ClassFruit.prototype.onRotating = function( time ){
	this.image.rotate( ( this.rotateSpeed * time / 1e3 ) % 360, true );
};

// 裂开相关

ClassFruit.prototype.onBrokenDropUpdate = function( time ){
	var radius = this.radius;
	this.bImage1.attr({ 
		x: linearAnim( time, this.brokenPosX - radius, this.brokenTargetX1, dropTime ), 
		y: dropAnim( time, this.brokenPosY - radius, this.brokenTargetY1 - this.brokenPosY + radius, dropTime ) 
	}).rotate( linearAnim( time, this.apartAngle, this.bImage1RotateAngle, dropTime ), true );
	this.bImage2.attr({ 
		x: linearAnim( time, this.brokenPosX - radius, this.brokenTargetX2, dropTime ), 
		y: dropAnim( time, this.brokenPosY - radius, this.brokenTargetY2 - this.brokenPosY + radius, dropTime ) 
	}).rotate( linearAnim( time, this.apartAngle, this.bImage2RotateAngle, dropTime ), true );
};

ClassFruit.prototype.onBrokenDropStart = function(){
	this.brokenTargetX1 = -( random( dropXScope ) + 75 );
	this.brokenTargetX2 = random( dropXScope + 75 );
	this.brokenTargetY1 = 600;
	this.brokenTargetY2 = 600;
	this.brokenPosX = this.originX;
	this.brokenPosY = this.originY;
	this.bImage1RotateAngle = - random( 150 ) - 50;
	this.bImage2RotateAngle = random( 150 ) + 50;

	for(var f, i = fruitCache.length - 1; i >= 0; i --)
		if( fruitCache[i] === this )
			fruitCache.splice( i, 1 );
};

ClassFruit.prototype.onBrokenDropEnd = function(){
	this.remove();
};

// 抛出相关

ClassFruit.prototype.onShotOuting = function( time ){
	this.pos(
		linearAnim( time, this.shotOutStartX, this.shotOutEndX - this.shotOutStartX, dropTime ),
		fallOffAnim( time, this.shotOutStartY, this.shotOutEndY - this.shotOutStartY, dropTime )
	);
};

ClassFruit.prototype.onShotOutStart = function(){
	// body...
};

ClassFruit.prototype.onShotOutEnd = function(){
	this.fallOff( 0, this.fallOffToX );
};

// 掉落相关

ClassFruit.prototype.onFalling = function( time ){
	var y;
	this.pos( 
		linearAnim( time, this.brokenPosX, this.fallTargetX - this.brokenPosX, dropTime ), 
		y = dropAnim( time, this.brokenPosY, this.fallTargetY - this.brokenPosY, dropTime ) 
	);
	this.checkForFallOutOfViewer( y );
};

ClassFruit.prototype.onFallStart = function(){
	this.brokenPosX = this.originX;
	this.brokenPosY = this.originY;
};

ClassFruit.prototype.onFallEnd = function(){
	message.postMessage( this, "fruit.fallOff" );
	this.remove();
};

// privates

ClassFruit.prototype.checkForFallOutOfViewer = function( y ){
	if( y > 480 + this.radius )
		this.checkForFallOutOfViewer = Ucren.nul,
		this.rotateAnim && this.rotateAnim.stop(),
	    message.postMessage( this, "fruit.fallOutOfViewer" );
};

exports.create = function( type, originX, originY, isHide, flameStart ){
	if( typeof type == "number" ) // 缺省 type
		isHide = originY,
		originY = originX,
	    originX = type,
	    type = getType();

	var fruit = new ClassFruit({ type: type, originX: originX, originY: originY, flameStart: flameStart }).set( isHide );
	fruitCache.unshift( fruit );

	return fruit;
};

exports.getFruitInView = function(){
    return fruitCache;
};

exports.getDropTimeSetting = function(){
	return dropTime;
};

function getType(){
	if( random( 8 ) == 4 )
	    return "boom";
	else
    	return types[ random( 5 ) ];
}