/**
 * layer manager
 */

var Raphael = require( "lib/raphael" );
var Ucren = require( "lib/ucren" );

var layers = {};
var zindexs = {
	"default": zi(),
	"light": zi(),
	"knife": zi(),
	"fruit": zi(),
	"juice": zi(),
	"flash": zi(),
	"mask": zi()
};

exports.createImage = function( layer, src, x, y, w, h ){
	layer = this.getLayer( layer );
    return layer.image( src, x, y, w, h );
};

exports.createText = function( layer, text, x, y, fill, size ){
	layer = this.getLayer( layer );

	if( Ucren.isIe )
		y += 2;

	return layer.text(x, y, text).attr({
		fill: fill || "#fff",
		"font-size": size || "14px",
		"font-family": "黑体",
		"text-anchor": "start"
	});
};

exports.getLayer = function( name ){
	var p, layer;
	name = name || "default";
	
	if( p = layers[name] ){
	    return p;
	}else{
		layer = Ucren.makeElement( "div", { "class": "layer", "style": "z-index: " + ( zindexs[name] || 0 ) + ";" } );
		Ucren.Element( "extra" ).add( layer );
		p = layers[name] = Raphael( layer, 640, 480 );
		// if( Ucren.isSafari )
		//     p.safari();
		return p;
	}
};

function zi(){
    return zi.num = ++ zi.num || 2;
}