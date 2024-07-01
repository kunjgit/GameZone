/*
 * Draggable class will assume the cached shape img
 * and will store its ID in order to search for the
 * matching hole.
 */ 
var Draggable = function() {
    
    var 
    cachedShape = false, 
    visible = false,
    size = 0,
    position = [ 0, 0 ];
    
    this.matchId = false; // will be the id of the item 
    
    this.show = function() {
        
            visible = true;
        
    };
    this.hide = function() {
        
            visible = false;   
            
    };
    this.updateSize = function( bitmapSize ) {
    
        size = bitmapSize;
    
    };
    this.getSize = function() {
    
        return size;
        
    };
    this.updateShape = function( cachedBitmap ) {
        
            cachedShape = cachedBitmap;
            
    };
    this.updatePosition = function( pos ) {
        
            position = pos;
        
    };
    this.draw = function() {
           
           
            if( visible && cachedShape ) {
            
                Helper.ctx.drawImage( cachedShape, position[0], position[1], size, size );
            
            }        
    };

};
