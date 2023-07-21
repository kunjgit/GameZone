/**
 * game logic
 */
var timeline = require( "timeline" );
var Ucren = require( "lib/ucren" );
var sound = require( "lib/sound" );
var fruit = require( "factory/fruit" );
var score = require( "object/score" );
var message = require( "message" );
var state = require( "state" );
var lose = require( "object/lose" );
var gameOver = require( "object/game-over" );
var knife = require( "object/knife" );
// var sence = require( "sence" );
var background = require( "object/background" );
var light = require( "object/light" );

var scoreNumber = 0;

var random = Ucren.randomNumber;

var volleyNum = 2, volleyMultipleNumber = 5;
var fruits = [];
var gameInterval;

var snd;
var boomSnd;

// fruit barbette
var barbette = function(){
    if( fruits.length >= volleyNum )
        return ;

    var startX = random( 640 ), endX = random( 640 ), startY = 600;
    var f = fruit.create( startX, startY ).shotOut( 0, endX );

    fruits.push( f );
    snd.play();

    barbette();
};

// start game
exports.start = function(){
    snd = sound.create( "sound/throw" );
    boomSnd = sound.create( "sound/boom" );
    timeline.setTimeout(function(){
        state( "game-state" ).set( "playing" );
        gameInterval = timeline.setInterval( barbette, 1e3 );
    }, 500);
};

exports.gameOver = function(){
    state( "game-state" ).set( "over" );
    gameInterval.stop();

    gameOver.show();


    scoreNumber = 0;
    volleyNum = 2;
    fruits.length = 0;
};

exports.applyScore = function( score ){
    if( score > volleyNum * volleyMultipleNumber )
        volleyNum ++,
        volleyMultipleNumber += 50;
};

exports.sliceAt = function( fruit, angle ){
    var index;

    if( state( "game-state" ).isnot( "playing" ) )
        return;

    if( fruit.type != "boom" ){
        fruit.broken( angle );
        if( index = fruits.indexOf( fruit ) )
            fruits.splice( index, 1 );
        score.number( ++ scoreNumber );
        this.applyScore( scoreNumber );
    }else{
        boomSnd.play();
        this.pauseAllFruit();
        background.wobble();
        light.start( fruit );
    }
};

exports.pauseAllFruit = function(){
    gameInterval.stop();
    knife.pause();
    fruits.invoke( "pause" );
};

// message.addEventListener("fruit.fallOff", function( fruit ){
// 	var index;
// 	if( ( index = fruits.indexOf( fruit ) ) > -1 )
// 	    fruits.splice( index, 1 );
// });

message.addEventListener("fruit.remove", function( fruit ){
    var index;
    if( ( index = fruits.indexOf( fruit ) ) > -1 )
        fruits.splice( index, 1 );
});

var eventFruitFallOutOfViewer = function( fruit ){
    if( fruit.type != "boom" )
        lose.showLoseAt( fruit.originX );
};

state( "game-state" ).hook( function( value ){
    if( value == "playing" )
        message.addEventListener( "fruit.fallOutOfViewer", eventFruitFallOutOfViewer );
    else
        message.removeEventListener( "fruit.fallOutOfViewer", eventFruitFallOutOfViewer );
} );

message.addEventListener("game.over", function(){
    exports.gameOver();
    knife.switchOn();
});

message.addEventListener("overWhiteLight.show", function(){
    knife.endAll();
    for(var i = fruits.length - 1; i >= 0; i --)
        fruits[i].remove();
    background.stop();
});

message.addEventListener("click", function(){
    state( "click-enable" ).off();
    gameOver.hide();
    message.postMessage( "home-menu", "sence.switchSence" );
});