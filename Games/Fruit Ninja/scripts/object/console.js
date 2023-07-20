var layer = require( "../layer" );

var x = 16, y = 0;
var texts = [];

exports.set = function(){
	
};

exports.clear = function(){
    for(var i = 0, l = texts.length; i < l; i ++)
    	texts[i].remove();
    texts.length = y = 0;
};

exports.log = function(text){
	y += 20;
    texts.push( layer.createText( "default", text, x, y ) );
};