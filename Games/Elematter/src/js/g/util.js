/*==============================================================================

Utilities

==============================================================================*/

/*==============================================================================

Math

==============================================================================*/

g.rand = function( min, max ) {
	return Math.random() * ( max - min ) + min;
};

/*==============================================================================

DOM

==============================================================================*/

g.qS = function( q ) {
	var query = document.querySelectorAll( q );
	if( query.length > 1 ) {
		return query;
	} else {
		return query[ 0 ];
	}
};

g.cE = function( appendParent, classes ) {
	var elem = document.createElement( 'div' );
	if( appendParent ) {
		appendParent.appendChild( elem );
	}
	if( classes ) {
		g.addClass( elem, classes );
	}
	return elem;
};

g.on = function( elem, e, cb, ctx ) {
	ctx = ctx || window;
	elem.addEventListener( e, cb.bind( ctx ) );
};

g.text = function( elem, content ) {
	elem.firstChild.nodeValue = content;
};

g.resetAnim = function( elem ) {
	g.removeClass( elem, 'anim' );
	elem.offsetWidth = elem.offsetWidth;
	g.addClass( elem, 'anim' );
};

// credit: Julian Shapiro - http://julian.com/research/velocity/
g.prefixElement = g.cE();
g.prefixMatches = {};
g.prefixCheck = function (property) {
	if (g.prefixMatches[property]) {
		return [ g.prefixMatches[property], true ];
	} else {
		var vendors = [ "", "Webkit", "Moz", "ms", "O" ],
			cb = function(match) { return match.toUpperCase(); };
		for (var i = 0, vendorsLength = vendors.length; i < vendorsLength; i++) {
			var propertyPrefixed;
			if (i === 0) {
				propertyPrefixed = property;
			} else {
				propertyPrefixed = vendors[i] + property.replace(/^\w/, cb);
			}
			if (g.isString(g.prefixElement.style[propertyPrefixed])) {
				g.prefixMatches[property] = propertyPrefixed;
				return [ propertyPrefixed, true ];
			}
		}
		return [ property, false ];
	}
};

g.css = function( elem, prop, val ) {
	if( g.isObject( prop ) ) {
		var cssProps = prop;
		for( prop in cssProps ) {
			if( cssProps.hasOwnProperty( prop ) ) {
				g.css( elem, prop, cssProps[ prop ] );
			}
		}
	} else {
		prop = g.prefixCheck( prop );
		if( prop[ 1 ] ) {
			elem.style[ prop[ 0 ] ] = val;
		}
	}
};

// credit: Todd Motto - https://github.com/toddmotto/apollo
g.hasClass = function ( elem, className ) {
	if( className ) {
		return elem.classList.contains( className );
	}
};

g.addClass = function ( elem, className ) {
	if( className.length ) {
		if( className.indexOf( ' ' ) != -1 ) {
			classes = className.split( ' ' );
			classes.forEach( function( className ) {
				if( !g.hasClass( elem, className ) ) {
					g.addClass( elem, className );
				}
			});
		} else {
			elem.classList.add( className );
		}
	}
};

g.removeClass = function ( elem, className ) {
	if( className.indexOf( ' ' ) != -1 ) {
		classes = className.split( ' ' );
		classes.forEach( function( className ) {
			if( g.hasClass( elem, className ) ) {
				g.removeClass( elem, className );
			}
		});
	} else {
		elem.classList.remove( className );
	}
};

g.attr = function( elem, attr ) {
	return elem.getAttribute( attr );
};

/*==============================================================================

Collision

==============================================================================*/

g.distance = function( p1x, p1y, p2x, p2y ) {
	var dx = p1x - p2x,
		dy = p1y - p2y;
	return Math.sqrt( dx * dx + dy * dy );
};

/*==============================================================================

Formatting

==============================================================================*/

g.formatCommas = function( n ) {
	n = Math.round( n );
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

/*==============================================================================

Miscellaneous

==============================================================================*/

g.isString = function( variable ) {
	return typeof variable === 'string';
};

g.isObject = function( variable ) {
	return typeof variable === 'object';
};

g.isSet = function( prop ) {
	return typeof prop != 'undefined';
};

g.isObjEmpty = function( obj ) {
	for( var prop in obj ) {
		if( obj.hasOwnProperty( prop ) ) {
			return false;
		}
	}
	return true;
};

g.merge = function( obj1, obj2 ) {
	for( var prop in obj2 ) {
		obj1[ prop ] = obj2[ prop ];
	}
};