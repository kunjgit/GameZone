 var WorldGrid = function() {
    
    var gridSize   = null, // number
        boundSize  = null; // [ number, number ]

    this.grid = [];
    this.childNodes = {};   
    
    this.getCoordsFromCell = function( row, col ) {
        
        // return coords from cell
        return [ row * gridSize, col * gridSize ];  
    
    };   
    
    this.getCellFromCoords = function( x, y ) {
          
        // returns cell from coords
        return [ Math.floor( y / gridSize ), Math.floor( x / gridSize ) ];  
    
    };
    
    this.setboundSize = function( arr ) {
    
        boundSize = arr;
    
    };
    
    this.setgridSize = function( num ) {
    
        gridSize = num;
    
    };
    
    this.resetGrid = function() {  
    
        this.generateGrid( gridSize, boundSize );
        
    };
    
};    
WorldGrid.prototype = {
    
    generateGrid: function( gridSize, boundSize ) {
        var 
        grid = [],
        cols = Math.floor( boundSize[0] / gridSize ),
        rows = Math.floor( boundSize[1] / gridSize );
        
        for( var i=0; i<rows; i++ ) {
        
            grid[i] = []; 
            
            for( var k=0; k<cols; k++ ) {
            
                grid[i][k] = {}; // will store object ids as hash.
                
            }
            
        }
        
        this.grid = grid;
        
    },
    addObject: function( obj, row, col ) {
    
        // if object doesnt exists, add it else update it.
        if( typeof( obj.id ) === "undefined" ) {
        
           throw new Error("WorldGrid.addObject: Object must have an ID.");
            
        }        
                 
        if( obj.id in this.childNodes ) {
                
            this.updateObject( obj.id, row, col );
        
        } else {

            this.childNodes[ obj.id ] = { row: row, col: col, node: obj };
            this.grid[ row ][ col ][ obj.id ] = this.getObject( obj.id );
                            
        }
    },
    updateObject: function( id, row, col ) {
                
        this.childNodes[ id ].col = col;
        this.childNodes[ id ].row = row;
        
         this.removeObject( id ); // just remove object from cell
        
        this.grid[ row ][ col ][ id ] = this.getObject( id );
        
    },
    // Can delete objects from a cell or completely.
    removeObject: function( id, completely ) {
        
        var obj = this.childNodes[ id ];
        
        delete this.grid[ obj.row ][ obj.col ][ id ];
        
        if( completely ) {
            // Want to delete the object reference
            delete this.childNodes[ id ];
            
        }
        
    },
    getObject: function( id ) {
    
        return this.childNodes[ id ].node;
        
    },        
    getCell: function( row, col ) {
    
        var ret = false;
        
        if( typeof this.grid[ row ] !== "undefined" &&
            typeof this.grid[ row ][ col ] !== "undefined" ) {
            
            ret = [];
            
            var cell = this.grid[ row ][ col ];
            
            
            for( var obj in cell ) {

                 if ( cell.hasOwnProperty(obj) ) {
                 
                    ret[ ret.length ] = obj;
                    
                 } 

            }       
            
        }
        
        return ret;
         
    }
};
