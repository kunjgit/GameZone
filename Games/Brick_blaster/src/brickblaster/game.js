var level1;
var ibombi;

var w = 32, h = 20; //width and hight of the level
var block;

engine.load = function(){
	engine.image.load("././assets/images/border1.png", "border1"); //border out
	engine.image.load("././assets/images/border2.png", "border2"); //border out
//	engine.image.load("././assets/images/ground.png", "ground"); //ground 
	engine.image.load("././assets/images/chest.png", "chest"); //destroyable chest
	engine.image.load("././assets/images/blaster.png", "ibomb"); //bomb character
	engine.image.load("././assets/images/bomb.png", "bomb"); //bomb timing 1
	engine.image.load("././assets/images/bomb1.png", "bomb1"); //bomb explosion 1

	level1 = new engine.map( "level1", w, h );

	var i = 0;
	var j = 0;
	for( ; i < w ; i++ ){
		for( ; j < h ; j++ ){
			//Border
			var key = ( i % 2 ? "border1" : "border2" );
			if( j > 0 && j < h - 1 ){
				key = ( j % 2 ? "border1" : "border2" );
			}
			
			if( ( i == 0 || i == w - 1 ) || ( j == 0 || j == h - 1 ) ){
				block = new engine.entity( key , i * 32 , j * 32 );
				block.tag = "border_out";
				
				level1.push( block );
			}else{
				//The ibomb hero
				if( i == 1 && j == 1 ){
					ibombi = new engine.entity( "ibomb", 33, 33 );
					ibombi.w = 26;
					ibombi.h = 30;
					ibombi.acceleration = 0.98;
				}else{
					//chests
					if( Math.random() < 0.4 ){
						block = new engine.entity( "chest" , i * 32 , j * 32 );
						block.tag = "border_d"
						
						level1.push( block );
					}else{
						// **** Ground Test
						//block = new engine.entity( "ground" , i * 32 , j * 32 );
						//block.tag = "block_ground";
					}
				}
			}
			//level1.push( block );
		}
		j = 0;
	}
	ibombi.bomb_count = 0;
	ibombi.bomb_alive = false;
	ibombi.daBomb = function(){
		if( ibombi.bomb_alive == false ){
			ibombi.bomb_alive = true
			
			var seconds_delay = 4 ;
			
			var bomb = new engine.entity("bomb", 0, 0);
			bomb.tag = "bomb";
			bomb.x = ibombi.x ;
			bomb.y = ibombi.y ;
			bomb.addFrame( "bomb", 500 );
			bomb.addFrame( "bomb1", 500 );
			bomb.explode = function(){
				bomb.visible = false;
				
				// destroy blocks
				level1.entity_list.forEach(
					function( entity ){
						var block_top = level1.getAt( bomb.x, bomb.y - 32 );
						var block_bottom = level1.getAt( bomb.x, bomb.y + 32 );
						var block_left = level1.getAt( bomb.x - 32, bomb.y );
						var block_right = level1.getAt( bomb.x + 32, bomb.y );
						
						if( block_top != null && block_top.tag == "border_d" ){
							block_top.visible = false;
						}
						if( block_bottom != null && block_bottom.tag == "border_d" ){
							block_bottom.visible = false;
						}
						if( block_left != null && block_left.tag == "border_d" ){
							block_left.visible = false;
						}
						if( block_right != null && block_right.tag == "border_d" ){
							block_right.visible = false;
						}
					}
				);
			};
			bomb.detonate = function(){
				setTimeout( function(){ 
						bomb.explode(); 
						engine.msg("explode!"); 
						ibombi.bomb_alive = false; 
					}, seconds_delay * 1000 );
			};
			
			bomb.detonate();
			
			level1.push( bomb );
		}
	};
	
	engine.current_map = level1;
	
	engine.viewport.enabled = true;
	engine.viewport.width = 300;
	engine.viewport.height = 300;
};

engine.draw = function(){
	engine.current_map.draw();
	ibombi.draw();
};
engine.update = function(){
	var ibomb_dx = 0.5, ibomb_dy = 0.5;
	var dx = 0, dy = 0;
	
	if( engine.events.iskeydown("down") ){
		dy = ibomb_dy;
		dx = 0;
	}
	if( engine.events.iskeydown("up") ){
		dy = -ibomb_dy;
		dx = 0;
	}
	if( engine.events.iskeydown("right") ){
		dy = 0;
		dx = ibomb_dx;
	}
	if( engine.events.iskeydown("left") ){
		dy = 0;
		dx = -ibomb_dx;
	}
	if( engine.events.iskeydown("a") ){
		ibombi.daBomb();
	}
	
	ibombi.dy = dy;
	ibombi.dx = dx;
	ibombi.update();
	
	var i = 0;
	for( ; i < level1.entity_list.length; i ++ ){
		entity = level1.entity_list[ i ];
		
		if( entity.tag == "border_d"
			|| entity.tag == "border_out" ){
			if( ibombi.collide( entity ) ){
				ibombi.x -= dx;
				ibombi.y -= dy;
				ibombi.dx = 0;
				ibombi.dy = 0;
			}
		}
	}
	
	engine.viewport.followTo( ibombi );
	engine.viewport.update();
};
