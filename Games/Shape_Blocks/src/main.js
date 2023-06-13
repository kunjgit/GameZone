var ShapeBLocks = ( function() {

        var 
        //container = document.getElementsByTagName("body")[0],
        container = document.getElementById("game"),
        canvas = Helper.canvas,
        ctx = Helper.ctx,
        board = {
            level: document.getElementById("level"),
            score: document.getElementById("score"),
            timer: document.getElementById("timer")         
        },
        settings = {
            //canvasSize: [ 1024, 480 ],
            canvasSize: [ container.offsetWidth, container.offsetHeight ],
            numOfItems: 2,
            itemSize: null, // this will be defined on the end of constructor
            whiteSpace: 0.3, 
            scorePoints: 9,
            levelIncrementShape: 2,
            gameTimer: 30,
            dropColor: "#555"
        },
        gameStats = {},
        timer,
        shapeBlocks;
        
        var
        grid = new WorldGrid(),
        stage = new Stage(),
        dragger = new Draggable(),
        
        getItemSize = function( numberOfitems, bounds ) {
        
             return Helper.utils.getGridSize( 
                ( numberOfitems * 2 ) * ( 1 + settings.whiteSpace ),
                bounds 
             );
        
        },
    
        getCoords = function( e ) {
        
            var 
            _x = e.clientX - canvas.offsetLeft,
            _y = e.clientY - canvas.offsetTop;
                    
            return [ _x, _y ];
            
        },
        
        findAvailableSpot = function( itemSize, bounds ) {
        
                var 
                _loc = null,
                _maxX,
                _maxY,
                _x,
                _y,
                _pos,
                _cell;
                
                while( _loc === null ) {
                   
                   _maxX = bounds[0] - itemSize;
                   _maxY = bounds[1] - itemSize;
                   _x = Math.round( Math.random() * _maxX );
                   _y = Math.round( Math.random() * _maxY );
                   
                   _pos =  grid.getCellFromCoords( _x, _y );
                   _cell = grid.getCell( _pos[0], _pos[1] );
                       
                   // Break from loop if an empty cell is found
                   _loc = ( _cell.length ) === 0 ? true : null;
                    
                }
                
                return _pos;
        }, 
        
        addToSpot = function( obj, position ) {
            
            stage.addShape( obj );

            // add position to shape.            
            grid.addObject( obj, position[0], position[1] );
            obj.position = grid.getCoordsFromCell( position[1], position[0] );
            
        
        },
        
        addNewShape = function( option ) {
        
            var 
            bounds = option.bounds,
            size = option.size,
            num = option.num,
            shape, // draggable items
            hole; // droppable items

            // generate 5 shapes
            for( var i=0; i<num; i++ )
            {
                
                shape = new Shape({
                    size: size
                });
                hole = shape.clone();
                
                addToSpot( shape, findAvailableSpot( size, bounds ) );
                addToSpot( hole, findAvailableSpot( size, bounds ) );
                
                hole.matchId = shape.id;
                hole.color = settings.dropColor;                            
                hole.generateShape();                                
                
            }
        
        };
        
        canvas.width = settings.canvasSize[0];
        canvas.height = settings.canvasSize[1]; 
        
        canvas.addEventListener("mousedown", function( e ) {

                e.preventDefault();
                e.stopPropagation();
                
                if( !dragger.cachedShape ) {
                
                    var
                    _coords = getCoords(e),
                    _cell = grid.getCellFromCoords( _coords[0], _coords[1] ),                 
                    _objs = grid.getCell( _cell[0], _cell[1] ),
                    obj = ( _objs && _objs.length ) ? grid.getObject( _objs[0] ) : false;
                    
                    if( obj ) {
                    
                        if(  !obj.matchId && obj.visible ) {
                        
                            // if its not a drop point
                            obj.visible = false;
                            
                            dragger.matchId = obj.id;
                            dragger.show();
                            dragger.updateSize( obj.size );
                            dragger.updatePosition( [ _coords[0] - obj.size / 2, _coords[1] - obj.size / 2 ] );
                            dragger.updateShape( obj.cachedShape );                        
                            
                            
                        }
                        
                    }
                    
                }
                
                canvas.dragging = true;
                
            }, false);
            canvas.addEventListener("mouseup", function( e ) {

                e.preventDefault();
                e.stopPropagation();
                
                var
                _coords = getCoords(e),
                _cell = grid.getCellFromCoords( _coords[0], _coords[1] ),
                _objs = grid.getCell( _cell[0], _cell[1] ),
                obj = ( _objs && _objs.length ) ? grid.getObject( _objs[0] ) : false;
                
                if( obj && obj.matchId && obj.matchId === dragger.matchId ) {
                    
                        obj.visible = false;
                        gameStats.Shapes += 1;
                        gameStats.currentShapes +=1;
                        gameStats.score += settings.scorePoints;
                        
                        board.score.innerHTML = gameStats.score;
                        
                        if( gameStats.currentShapes === gameStats.TotalLevelShapes ) {
                        
                            shapeBlocks.levelUp();    
                        
                        }
                        

                        
                } else if( dragger.matchId ) {

                        grid.getObject( dragger.matchId ).visible = true; 
                        
                }    
       

                dragger.hide();
                dragger.matchId = false;
                canvas.dragging = false;
                
            }, false);            
            canvas.addEventListener("mousemove", function( e ) {
                
                if( canvas.dragging ) {
                    var
                    _size = dragger.getSize(),
                    _x = ( e.clientX - canvas.offsetLeft ) - _size / 2,
                    _y = ( e.clientY - canvas.offsetTop ) - _size / 2;
                    
                    dragger.updatePosition( [ _x, _y ] );
                    
                }
                
            }, false);
            
    shapeBlocks = {
        init: function() {            
              
            gameStats = {
                Shapes: 0,
                score: 0,
                level: 1,
                currentShapes: 0,
                TotalLevelShapes: settings.numOfItems
            };
            
            shapeBlocks.start();
            timer = global.setInterval(function() {
            
                var b = board.timer,
                    t = Helper.utils.getInt( b.innerHTML ) - 1;
                b.innerHTML = t;
                
                if( t <= 0 ) {
                    clearTimeout( timer );
                    timer = null;
                    shapeBlocks.gameOver();
                }
                
            }, 1000);
            stage.start(); // start main loop
                            
        },
        getStats: function() {
        
            return gameStats;
            
        },
        start: function( option ) { 
        
            var
            opt = option || {},
            n = opt.numOfItems || settings.numOfItems,
            b = opt.gridSize   || settings.canvasSize,
            s = getItemSize( n, b ),
            cachedItems = [];
            
            board.timer.innerHTML = settings.gameTimer;
                                   
            if( dragger.id ) {
            
                // if the dragger has been added before, remove it.
                stage.removeShape( dragger.id );
                
            }     
            
            // It means we already have some objects cached.
            if( stage.getPoolSum() !== 0 ) {
                                        
                while( stage.getPoolSum() ) {
                    
                    cachedItems.push( stage.removeShape() );

                }  
                                                
            }  
            
            grid.setboundSize( b ); // update bounds
            grid.setgridSize( s ); // update grid size
            grid.resetGrid(); // generates grid
                 
                     
            if( cachedItems.length ) {
            
                for( var k=0, klen=cachedItems.length, knum=2*n; k<knum && k<klen; k++ ) {        
                                       
                    cachedItems[ k ].visible = true; // reset all to visible
                    cachedItems[ k ].size = s;
                    
                    addToSpot( cachedItems[ k ], findAvailableSpot( s, b ) );
                    
                
                }
                            
            
            }

            
            var 
            _oldItems = cachedItems.length / 2,
            reminder = n - _oldItems;
            
            if( reminder > 0 ) {
                
                addNewShape({ 
                    bounds: b,
                    size: s, 
                    num: reminder 
                });
                
            }

            
            // dragger is last item on stage, needs to be drawn last
            stage.addShape( dragger );
              
    
        },
        newGame: function() {
        
            window.location = ""; // refresh browser
        
        },
        gameOver: function() {
        
            var s = this.getStats(); 
            
            stage.stopMainLoop();
            
            if( global.confirm( "Unfortunetely your time has run out.\nLevel: " + s.level +
                     "\nScore: " + s.score +"\n Would you like to play again ?"  ) ) {
            
                ShapeBLocks.newGame();
                
            }
        },     
        levelUp: function() {
        
            var 
            s = settings,
            g = gameStats;
            
            g.currentShapes = 0; // reset count for level
            g.level += 1;
            g.TotalLevelShapes += s.levelIncrementShape;
            
            board.level.innerHTML = g.level;
            board.timer.innerHTML = settings.gameTimer;
            
            shapeBlocks.start({
                numOfItems: g.TotalLevelShapes,
                gridSize: settings.canvasSize
            });
        
        }
        
    };
    
    return shapeBlocks;
    
}());
