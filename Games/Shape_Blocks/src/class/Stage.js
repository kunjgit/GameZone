var Stage = function() {

    var 
    pool = [], // item ids will be stored in here and reflects drawing order
    objs = {},
    prefix = "ID_",
    counter = 0; // used to create ids;
    
    this.running = false;
    
    this.getPoolSum = function() {
    
        return pool.length;
    
    };
      
    this.addShape = function( obj, position ) {
        
        obj.id = obj.id || prefix + ( ++counter );

        if( position ) {

            pool.splice( position, 1, obj.id );
    
        } else {

            pool[ pool.length ] = obj.id;

        }
        
        objs[ obj.id ] = obj;

        return obj.id;

    };
    
    this.removeShape = function( shapeid ) {    
       
        // Only remove item id. 
        var ret = false,
            id = shapeid;
        
       if( id ) {
            
            for( var i=pool.length; i>=0; i-- ) {
                
                 if( pool[ i ] === objs[ id ].id ) {
                 
                    ret = objs[ pool[ i ] ];
                    pool.splice( i, 1 );
                    break;
                    
                 }
                 
            }
            
        } else {
        
            ret = objs[ pool.pop() ];
        
        } 
  
        return ret;
        
    };
    
    this.mainloop = function() {
        
       // Clean canvas before drawing 
       Helper.cleanCanvas(); 
        
       for( var i=0, len=pool.length; i<len; i++ ) {
            
            // all objects must implement the draw interface 
            objs[ pool[ i ] ].draw();  
            
       }

    };
    
    this.stopMainLoop = function() {
    
        this.running = false;
    
    };

    // This are the objects which has that id
    this.start =  function() {
        
        this.running = true;
        
        var that = this;
        (function animloop(){
          requestAnimFrame(animloop);
          
          if( that.running ) {
          
            that.mainloop();
            
          }
          
        }());

    };

};
