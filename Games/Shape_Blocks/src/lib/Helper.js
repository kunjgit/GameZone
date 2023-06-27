/*
 * Paul irish request animation frame magic :) 
 */
var requestAnimFrame = (function(){
  return  global.requestAnimationFrame       || 
          global.webkitRequestAnimationFrame || 
          global.mozRequestAnimationFrame    || 
          global.oRequestAnimationFrame      || 
          global.msRequestAnimationFrame     || 
          function( callback ){
            global.setTimeout(callback, 1000 / 60);
          };
}());
global.requestAnimFrame = requestAnimFrame;

var Helper = ( function() {
    var 
    canvas = document.getElementsByTagName("canvas")[ 0 ],
    context = canvas.getContext("2d"),
    PI = Math.PI,
    RADIANS = ( PI / 180 );
    
    return {
        canvas: canvas,
        ctx: context,
        cleanCanvas: function() {
        
            canvas.width = canvas.width;  
            
        },
        utils: { // General util helpers for the game
            
            getGridSize: function( numOfItems, gridSize ) {
                // return the grid size based on the amount of desired square blocks            
            
                var
                max = gridSize[0] > gridSize[1] ? gridSize[0] : gridSize[1]; 
                
                return Math.floor( max / Math.ceil( max / Math.floor( Math.sqrt( ( gridSize[0] * gridSize[1] ) / numOfItems ) ) ) );
                //return Math.floor( Math.sqrt( (gridSize[0] * gridSize[1]) / numOfItems ) );
            
            },
            
            // Greatest common divider - http://en.wikipedia.org/wiki/Euclidean_algorithm
            gcd: function( a, b ) {
            
                var
                gcd = Helper.utils.gcd,
                ret;
                
                 if ( b === 0 ) {
                 
                    ret = a;
                    
                 }
                 else {
                 
                    ret = gcd( b, a % b );
                    
                 }
                 
                return ret;
            },
            // least common divider - http://en.wikipedia.org/wiki/Least_common_multiple
            lcd: function( a, b ) {
                           
                return ( a * b ) / Helper.utils.gcd( a, b );
            
            },
            // Return a rgb random color that is not black or grey or too white.
            getRandomColor: function() {
                var 
                rgb = [],
                colorMix = [ 255, 255, 255 ]; // mix with white 

                for( var i=0; i<3; i++ ) {
                    
                    // get a random color and mix with white to get better colors
                    rgb[ i ] = Math.round( ( Math.floor( Math.random() *  256 ) + colorMix[i] ) / 2 );

                }

                return "rgb(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ")";

            },
            // return a tuple of X, Y points on the circle line
            getRandomPoints: function( centerCoords, degree, radius ) {
                var
                x = Math.floor( Math.cos( degree * RADIANS ) * radius ),
                y = Math.floor( Math.sin( degree * RADIANS ) * radius );

                x = centerCoords[0] + x;
                y = centerCoords[1] + y;

                return [ x, y ];
            },
            // return array of tuples of X, Y points on the circle line on 
            // Clockwise order
            getRandomPolygonPoints: function( centerCoords, radius, quantity ) {

                var 
                degree = [],
                points = [];

                for( var i=0; i<quantity; i++ ) {
                
                    degree[ degree.length ] = Math.floor( ( Math.random() * 361 )  ); 

                }

                degree.sort( function(a,b) { return a - b;  } ); // sort points by degree


                for( var k=0, len=degree.length; k<len; k++ ) {
                
                    points[ points.length ] = Helper.utils.getRandomPoints( centerCoords, degree[ k ], radius );

                }


                return points;

            },
            getFullScreen: function() {
                
                //Returns width and height to fill the screen as an array.
                
            },            
            matchProbability: function( percentage ) { 
                var 
                p = percentage,
                r = Math.random,
                c = Math.ceil;
                
                // Returns true or false based on the percentage probability
                return c( r() * c( 100/p ) ) === c( 100/p ); 
                
            },
            getInt: function( str ) {
            
                return parseInt( str, 10 );
                
            }
            
        }
    };

}());
