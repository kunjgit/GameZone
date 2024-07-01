var Shape = function( obj ) {
    
    this.color = obj.color || Helper.utils.getRandomColor(); 
    this.position = obj.position || [0, 0];
    this.size = obj.size;

    this.shape = null; // shape blueprint
    this.cachedShape = null; // cached built shape
    
    this.visible = true; // showing by default
    
    this.generateShape();
    
};
Shape.prototype = {
    clone: function() {
        
        var 
        _obj = {},
        prop;
        
        for( prop in this ) {

            _obj[ prop ] = this[ prop ];

        }

        return  _obj;

    },
    generateShape: function() {
        
         var
         _c = document.createElement("canvas"),
         _t = _c.getContext("2d"),
         size = this.size,
         radius = size/2;
         
         if( this.shape === null )
         {
            // generate polygon with random number of points between 4 and 12.
            this.shape = Helper.utils.getRandomPolygonPoints( [ radius, radius ], radius, Math.floor( Math.random() * 6 ) + 5 );
         }
            
         _c.height = size;
         _c.width = size;

         _t.fillStyle = this.color;
         _t.strokeStyle = this.color;
         _t.beginPath();

         _t.moveTo( this.shape[0][0], this.shape[0][1] );

         for( var i=1, len=this.shape.length; i<len; i++ )
         {

            _t.lineTo( this.shape[i][0], this.shape[i][1] );

         } 
            
         _t.closePath();
         _t.stroke();
         _t.fill();

         this.cachedShape = _c;  // the drawn element to cache it.
    },
    draw: function() {
        
        if( this.visible ) {
        
            Helper.ctx.drawImage( this.cachedShape, this.position[0], this.position[1], this.size, this.size );
        
        }
       
    }
};
