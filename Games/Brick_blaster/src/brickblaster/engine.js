engine = {};
engine.canvas = null;
engine.runtime = null;
engine.draw = function(){};
engine.update = function(){};
engine.load = function(){
	
};

engine.msg = function( value ){
	console.log( "[engine-ibomb] " + value );
};

engine.clear = function(){
	engine.canvas.width ++;
	engine.canvas.width --;
}

engine.events = {};
engine.events.K_UP = 38;
engine.events.K_DOWN = 40;
engine.events.K_LEFT = 37;
engine.events.K_RIGHT = 39;
engine.events.K_A = 65;
engine.events.key_down = -1;
engine.events.key_up = -1;
document.onkeydown = key_down;
document.onkeyup = key_up;
function key_down( event ){
	event = event || window.event;
	engine.events.key_down = event.keyCode;
	engine.events.key_up = -1;
	
	//event.preventDefault();
};
function key_up( event ){
	event = event || window.event;
	engine.events.key_up = event.keyCode;
	if( engine.events.key_toogle == false ){
		engine.events.key_down = -1;
	}
	//event.preventDefault();
}
engine.events.key_toogle = false;
engine.events.iskeydown = function( key ){
	if( key == "up" && engine.events.key_down == engine.events.K_UP ){
		return true;
	}else if( key == "down" && engine.events.key_down == engine.events.K_DOWN ){
		return true;
	}else if( key == "left" && engine.events.key_down == engine.events.K_LEFT ){
		return true;
	}else if( key == "right" && engine.events.key_down == engine.events.K_RIGHT ){
		return true;
	}else if( key == "a"  && engine.events.key_down == engine.events.K_A ){
		return true
	}
	
	return false;
};

engine.map = function( name, width, height ){
	this.width = width;
	this.height = height;
	this.name = name;
	
	this.entity_list = [];
	this.push = function( item ){
		this.entity_list.push( item );
	};
	this.getAt = function( x, y ){
		var i = 0;
		for( ; i < this.entity_list.length; i++ ){
			var entity = this.entity_list[i];
			if( x >= entity.x && x <= entity.x + entity.w
				&& y >= entity.y && y <= entity.y + entity.h ){
				return entity;
			}
		}
		
		return null;
	};
	
	this.draw = function(){
		this.entity_list.forEach(
			function( item ){
				item.draw();
			}
		);
		
	};
	this.update = function(){
	};
};
engine.current_map = null;

engine.viewport = {};
engine.viewport.enabled = false;
engine.viewport.width = 10;
engine.viewport.height = 10;
engine.viewport.x = 0;
engine.viewport.y = 0;
engine.viewport.dx = 1;
engine.viewport.dy = 1;
engine.viewport.acceleration = 0;
engine.viewport.update = function(){
	engine.viewport.x += engine.viewport.dx;
	engine.viewport.y += engine.viewport.dy;
	
	engine.viewport.dx *= engine.viewport.acceleration;
	engine.viewport.dy *= engine.viewport.acceleration;
}
engine.viewport.moveTo = function( x, y ){
	engine.viewport.x = x;
	engine.viewport.y = y;
};
engine.viewport.followTo = function( entity ){
	engine.viewport.x = entity.x;
	engine.viewport.y = entity.y;
	engine.viewport.x -= engine.viewport.width / 2;
	engine.viewport.y -= engine.viewport.height / 2;
	
	engine.viewport.dx = entity.dx;
	engine.viewport.dy = entity.dy;
	engine.viewport.acceleration = entity.acceleration;
};

engine.image = {};
engine.image.draw = function( key, x, y){
	var img = engine.image.get(key);	

	engine.canvas.getContext("2d").drawImage( img.img, parseInt(x), parseInt(y) );
};
engine.image.sprites = [];
engine.image.sprites_loaded = 0;
engine.image.load_status = function(){
	engine.image.sprites_loaded ++;
	return "["+engine.image.sprites_loaded + "/" + engine.image.sprites.length+"]";
};
engine.image.load_them = function(){
	// loading
	engine.image.sprites.forEach(
		function( item ){
			var img = new Image();
			img.src = item.src;
			img.onload = function(){
							item.loaded = true;	
							engine.msg( engine.image.load_status() + " " + item.src+" loaded. " );
							};
			item.img = img;
		}
	);
};

engine.image.get = function( key ){
	var i = 0;
	for( ; i < engine.image.sprites.length ; i ++ ){
		var item = engine.image.sprites[ i ];
		if( item.key == key ){
			// console.log("found "+key);
			return item;
		}
	}
	
	return null;
}

engine.image.load = function( src, key ){
	engine.image.sprites.push( { "src": src, "key": key, "img": new Image(), "loaded": false } );
};

engine.entity = function Entity(key, x, y){
	this.x = x;
	this.y = y;
	this.w = 32;
	this.h = 32;
	this.key = key;
	this.tag = "";
	
	this.dx = 0;
	this.dy = 0;
	this.friction = 0.05;
	this.acceleration = 0;
	this.visible = true;
	
	this.animation_frames = [];
	this.animation_dt = 0;
	this.animation_index = 0;
	this.animation_loop = -1;
	this.animation_running = false;
	
	this.addFrame = function( frame_key, dt ){
		if( this.animation_frames.length == 0 ){
			this.key = frame_key;
			this.animation_dt = dt;
			this.animation_index = 0;
			this.animation_running = false;
		}
		this.animation_frames.push({ "key":frame_key, "dt": dt });
	};
	
	this.draw = function(){
		if( this.visible == false ) return;
		
		if( engine.viewport.enabled == true ){
			var key = this.key;
			
			if( this.animation_frames.length > 0 ){
			
				engine.image.draw( this.key, this.x - engine.viewport.x, this.y - engine.viewport.y );
				if( this.animation_running == false ){
					var animation_index = this.animation_index + 1;
					if( animation_index >= this.animation_frames.length ){
						this.animation_index = -1;
						animation_index = 0;
					}
					var animation_frames = this.animation_frames[ animation_index ];
					var next_key = animation_frames.key;
					var self = this;
					
					setTimeout( function(){
						self.key = next_key;
						self.animation_index ++ ;
						
						self.animation_running = false;
					}, this.animation_dt );
					
					this.animation_running = true;
				}
			}else{
				engine.image.draw( key, this.x - engine.viewport.x, this.y - engine.viewport.y );
			}
		}else{
			engine.image.draw( this.key, this.x, this.y);
		}
	};
	this.update = function(){
		this.x += this.dx;
		this.y += this.dy;
		
		this.dx *= this.acceleration;
		this.dy *= this.acceleration;
	};
	this.collide = function( entity ){
		if( entity.visible == false ){	
			return false;
		}
		
		var x_axis = false, y_axis = false;
		if( this.x >= entity.x && this.x <= ( entity.x + entity.w )
			|| ( this.x + this.w ) >= entity.x && ( this.x + this.w ) <= ( entity.x + entity.w ) ){
			x_axis = true;
		}
		if( this.y >= entity.y && this.y <= ( entity.y + entity.h )
			|| ( this.y + this.h ) >= entity.y && ( this.y + this.h ) <= ( entity.y + entity.h ) ){
			y_axis = true;
		}
		
		return ( x_axis && y_axis );
	}
}

engine.start = function(){
	engine.canvas = document.getElementById( "screen" );
	engine.load();
	engine.image.load_them();
	
	engine.runtime = setInterval( function(){
		engine.clear();
		engine.update();
		engine.draw();
		//console.log("test");
	}, 60/1000 );
	engine.msg("engine loaded");
};
