var P =[ '#9bbc0f',  '#8bac0f',  '#306230',  '#0f380f'];
var F =[ "#FF6633", "#FF9933", "#FFCC33"];
var W =[ "#0099ff", "#0033cc", "#3366ff"];
var T =[ "#6633FF", "#0099cc", "#ffff33"];
var B =  ['#8bac0f',  '#306230', "#8A0808", "#B43104", "#FE2E2E"];


function ArcadeAudio() {
  this.sounds = {};
}

ArcadeAudio.prototype.add = function( key, count, settings ) {
  this.sounds[ key ] = [];
  settings.forEach( function( elem, index ) {
    this.sounds[ key ].push( {
      tick: 0,
      count: count,
      pool: []
    } );
    for( var i = 0; i < count; i++ ) {
      var audio = new Audio();
      audio.src = jsfxr( elem );
      this.sounds[ key ][ index ].pool.push( audio );
    }
  }, this );
};

ArcadeAudio.prototype.play = function( key ) {
  if (!window.mute){
	  var sound = this.sounds[ key ];
	  var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	  soundData.pool[ soundData.tick ].play();
	  soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
  }
};

var aa = new ArcadeAudio();

aa.add( 'coin', 5,
  [
    [0,,0.0116,0.3061,0.432,0.4097,,,,,,0.5982,0.6732,,,,,,1,,,,,0.5],
    [0,,0.0375,0.5038,0.3663,0.6874,,,,,,0.5943,0.5286,,,,,,1,,,,,0.5]
  ]
);

aa.add( 'shoot', 4,
  [
    [3,0.4699,0.211,0.7699,0.4133,0.1018,,-0.18,,,,,,,,,,,1,,,,,0.5],
    [3,0.4285,0.171,0.7738,0.4352,0.1018,,-0.1522,-0.008,0.0491,,,0.0013,0.0333,-0.0433,,-0.0242,,1,0.0351,0.0193,0.0468,0.0409,0.5],
    [3,0.4122,0.0712,0.864,0.5086,0.1269,0.0632,-0.1067,0.0362,0.0066,0.0432,-0.0515,0.0472,,-0.0953,0.031,0.0369,-0.0206,1,0.0859,0.1004,0.0517,0.0036,0.5]
  ]
);

aa.add( 'hit', 5,
  [
    [3,,0.1302,0.5325,0.4565,0.7702,,-0.395,,,,-0.608,0.8726,,,,,,1,,,,,0.5]
    ,[3,0.0715,0.0928,0.4473,0.4449,0.8587,,-0.3921,0.0103,0.0067,0.0994,-0.6284,0.9041,0.0273,-0.0337,0.0569,0.09,-0.1048,1,0.0013,0.0967,,0.0768,0.5],
    [3,,0.2697,0.3528,0.4129,0.1622,,0.0306,,,,,,,,,0.209,-0.2744,1,,,,,0.5]
  ]
);

aa.add( 'death', 5,
  [
    [0,0.07,0.2,0.4199,0.25,0.4158,,-0.4261,,0.25,0.0599,-0.34,0.6899,0.28,-0.1,,-0.0199,-0.0199,1,-0.0277,,0.05,-0.0199,0.5]
  ]
);

aa.add( 'slowmo', 5,
  [
    [0,0.1489,0.0657,0.0741,0.8508,0.6885,,,-0.171,,0.079,-0.6692,0.8491,0.0362,-0.0111,,0.0048,0.1977,0.6197,0.3364,0.3787,,-0.0113,0.5]
  ]
);

aa.add("start", 1,
  [[0,,0.044,0.4721,0.4696,0.7453,,,,,,0.3999,0.5163,,,,,,1,,,,,0.5]]
  );

window.cr = localStorage.getItem("cr")=="true";
window.mute = localStorage.getItem("mute") == "true";
crbutton.textContent = "Graphics: " + (window.cr?"Low":"High");
mutebutton.textContent = "Sounds: " + (window.mute?"Off":"On");

sanitize = function(args){
	for(var i=0;i<args.length;i++) args[i]=args[i]|0;
	return args;
}
CanvasRenderingContext2D.prototype.fr= function(){
	var args = Array.prototype.slice.apply(arguments);
	if (cr) sanitize(args);
	this.fillRect.apply(this,args);
}

CanvasRenderingContext2D.prototype.tr= function(){
	var args = Array.prototype.slice.apply(arguments);
	if (cr) sanitize(args);
	this.translate.apply(this,args);
}

randBetween = function(min,max,floorit){
	if (arguments.length==1){
		if (min instanceof Array){
			max = min[1];
			min = min[0];
		} else {
			return min;
		}
	} 
	var n = Math.random()*(max-min)+min;
	return floorit?Math.floor(n):n;
};

clamp = function(value,min,max){
	return Math.min(Math.max(value,min),max);
}

Array.prototype.maxInRange = function(from,to){
	if (from>=0 && to<=this.length && from<to) return Math.max.apply(null,this.slice(from,to));
	return NaN;
};

Array.prototype.random = function(){
	if (this.length<=1) return this[0] || null;
	return this[randBetween(0,this.length,1)];
};

Array.prototype.copy = function(){
	if (this.length==2) 
		return new Vector2d(this[0],this[1]);
	return this.slice();
}

noop = function(e){return e};

Object.prototype.mixin = function(what) {
  for (var k in what) 
  	if (what.hasOwnProperty(k) && !this.hasOwnProperty(k)) this[k] = what[k];
  return this;
}

Object.prototype.markForRemoval= function(){
	this.isVisible = false;
	this.isAlive = false;
	this.isMarked = true;
	if (this.onRemove) this.onRemove();
	if (this.resources) this.resources.length=0;
}

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

able = function(btns,en){
	for(var i=0;i<btns.length;i++) if (en) btns[i].classList.remove("d"); else btns[i].classList.add("d");
}

var body = document.body;
var allButtons = Array.prototype.slice.call(document.getElementsByClassName("button"));
var aspect = 228.5/154;

function calculateCanvasDimensions() {
	var width = wrapper.offsetWidth;
	var height = wrapper.offsetHeight;
	var targetWidth = clamp(body.clientWidth * .95,228.5,1000);
	var targetHeight = clamp(body.clientHeight * .95,228.5/aspect,1000/aspect);
	var wDiff = width/targetWidth;
	var hDiff = height / targetHeight;
	var factor = Math.max(wDiff,hDiff);
	wrapper.style.width = width  / factor + "px";
	wrapper.style.height = width/aspect / factor + "px";
	veil.style.width = wrapper.style.width;
	veil.style.height = wrapper.style.height;
	document.body.style.fontSize = Math.round(16*(wrapper.offsetWidth-228.5)/800+8) + "px";
	
	clearTimeout(calculateCanvasDimensions.timeout);
	calculateCanvasDimensions.timeout = setTimeout(function(){
		for(var i = 0 ; i < allButtons.length; i++){
			var btn = allButtons[i];
				var ctx = btn.getContext("2d");
				ctx.fillStyle = P[3];
				ctx.fillRect(0,0,btn.width,btn.height);
				ctx.imageSmoothingEnabled = false;
				ctx.webkitImageSmoothingEnabled = false;
				var p = spritePosCache[btn.id];
				ctx.drawImage(imglol, p[0], p[1], p[2], p[3], 0,0,btn.width,btn.height);
		}
	},200);
}

var spritePosCache = {
	"72b": [0,12,15,16],
	"74b":[30,12,15,16],
	"75b":[60,12,15,16],
	"76b":[90,12,15,16],
	"87t" :[120,15,10,10],
	"83b":[130,15,10,10],
	"32s":[126,1,11,11]

}

calculateCanvasDimensions();

window.onresize = function(event) {
    calculateCanvasDimensions();
};

setTimeout(calculateCanvasDimensions,500);

document.body.addEventListener('touchmove',function(e){
      e.preventDefault();
});

var Frame = (function(){
	function Frame(img,x,y,w,h){
		this.img = img;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	
	Frame.prototype.drawItself = function(ctx,x,y,scalex,scaley){
		if (Math.abs(x+translation)<200)
		 ctx.drawImage(this.img,this.x,this.y,this.w,this.h,x,y,this.w,this.h);
	};
	
	return Frame;
})();

var Animation = (function(){
	function Animation(img,tileWidth,tileHeight,frameLength){
		this.img = img;
		this.width = tileWidth;
		this.height = tileHeight;
		this.frames = [];
		this.length = 0;
		this.currentFrame =  0;
		this.isReady = false;
		this.frameLength = frameLength;
		this.remainder = 0;
	}
	
	Animation.prototype.init = function(){
		this.length = this.frames.length;
		this.isReady=true;
	};

	Animation.prototype.reset = function() {
		this.remainder = this.currentFrame = 0;
	};
	
	Animation.prototype.pushNewFrame = function(x,y){
		this.frames.push(new Frame(this.img,x,y,this.width,this.height));
	};
	
	// may be needed to offset the very first frame by -forTime not to skip it
	Animation.prototype.drawFrame = function(ctx,forTime,x,y,scalex,scaley){
		if(!this.isReady) this.init();
		var t=  (this.remainder+forTime);
		var frameStep = (t / this.frameLength)|0;
		this.remainder = t%this.frameLength;
		var frame = this.skip(frameStep);
		frame.drawItself(ctx,x,y,scalex,scaley);
	};
	
	Animation.prototype.skip = function(frames){
		this.currentFrame = (this.currentFrame+frames)%this.length;
		if (this.currentFrame<0) this.currentFrame = this.length+this.currentFrame;
		return this.frames[this.currentFrame];
	};
	
	return Animation;
})();

var SpriteSheet = (function(){
	function SpriteSheet(image, callback){
		this.img = image;
		this.callback = callback;
		var _this = this;
		this.img.onload = function(){
			_this.width = _this.img.width;
			_this.height = _this.img.height;
			_this.callback(_this);
		}
		if (this.img.width) this.img.onload();
	}
	
	SpriteSheet.prototype.getXYFor = function(frameCount, tileWidth, tileHeight, offsetxy){
		var totalx = frameCount*tileWidth+offsetxy[0], cw = this.width,
		startx = totalx%cw,
		starty = Math.floor(totalx/cw)*tileHeight;
		return [startx,starty+offsetxy[1]];
	};
		
/*	SpriteSheet.prototype.getFrameByXY = function(x,y,tileWidth,tileHeight,animwidth){
		var cw = (animwidth || this.width),
		totalx = cw*(y/tileHeight)+x;
		return totalx/tileWidth;
	};*/
	
	SpriteSheet.prototype.loadImage = function(callback, caller){
		this.isReady = true;
		callback.apply(caller,[this]);
	};
	
	SpriteSheet.prototype.getAnimation = function(tileWidth,tileHeight, frames, time, start, animwidth){
		var ft = time/(frames.length||frames);
		var a = new Animation(this.img,tileWidth,tileHeight,ft);
		
		var startx = 0;
		var starty = 0;
		var startxy = (typeof start === "number")? this.getXYFor(start,tileWidth,tileHeight, [0,0]) : start;
		
		if (typeof frames === "number"){
			var ar = [];
			for(var i = 0;i<frames;i++) ar.push(i);
			frames = ar;
		}
		
		for(var i =0; i<frames.length;i++){
			var xy = this.getXYFor(frames[i],tileWidth,tileHeight,startxy);
			a.pushNewFrame(xy[0],xy[1]);
		}

		return a;
	};
	
	return SpriteSheet;
})();

var Vector2d = (function () {
    function Vector2d(x, y) {
        this[0] = x || 0;
        this[1] = y || 0;
    }

    Vector2d.random = function(base){
    	base = base || 1;
    	var x = Math.random()*base-base/2;
    	var y = Math.random()*base-base/2;
    	var v = new Vector2d(x,y);
    	return v;
    };

    Vector2d.prototype.set = function(loc){
    	this[0]=loc[0];
    	this[1]=loc[1];
    };

    Vector2d.prototype.add = function (other) {
        return [this[0] + other[0], this[1] + other[1]];
    };

    Vector2d.prototype.doAdd = function (other) {
        this[0] += other[0];
        this[1] += other[1];
        return this;
    };

    Vector2d.prototype.substract = function (other) {
        return [this[0] - other[0], this[1] - other[1]];
    };

    Vector2d.prototype.doSubstract = function (other) {
        this[0] -= other[0];
        this[1] -= other[1];
        return this;
    };

    Vector2d.prototype.multiply = function (scalar) {
        return [this[0] * scalar, this[1] * scalar];
    };

    Vector2d.prototype.doMultiply = function (scalar) {
        this[0] *= scalar;
        this[1] *= scalar;
        return this;
    };

    Vector2d.prototype.getMagnitude = function () {
        return Math.sqrt(this[0] * this[0] + this[1] * this[1]);
    };

    Vector2d.prototype.copy = function(){
    	return new Vector2d(this[0],this[1]);
    };

    Array.prototype.mixin(Vector2d.prototype);

    return Vector2d;
})();

var PhysicsBody = (function () {
    function PhysicsBody(center,corner,speed,acceleration) {
		this.center = center || new Vector2d();
		this.corner = corner || new Vector2d();
		this.speed = speed || new Vector2d();
		this.acceleration = acceleration || new Vector2d();
		this.rotation = 0;
		this.angularSpeed=0;
		this.friction = 0.006;
    }

    PhysicsBody.EPSILON = 5e-3;
	PhysicsBody.XLIMIT = 0.5;
	PhysicsBody.YLIMIT = 0.5;

    PhysicsBody.prototype.tick = function (ms) {
        this.move(this.speed.multiply(ms));
		this.rotate(this.angularSpeed*ms);
        this.speed.doAdd(this.acceleration.multiply(ms));
        this.speed.doMultiply(1 - this.friction*ms);
        this.limitSpeed();
    };
	
	PhysicsBody.prototype.move = function (vector) {
        this.center.doAdd(vector);
        return this;
    };
	
	PhysicsBody.prototype.applyAcceleration  = function (vector,time){
		this.speed.doAdd(vector.multiply(time));
        this.limitSpeed();
	};
	
	PhysicsBody.prototype.limitSpeed = function(){
		var mag = this.speed.getMagnitude();
		if (mag!=0){
			if (mag < PhysicsBody.EPSILON) {
	            this.speed.doMultiply(0);
	        } else {
	        	if (Math.abs(this.speed[0]) > PhysicsBody.XLIMIT) {
	                this.speed[0] = clamp(this.speed[0], -PhysicsBody.XLIMIT, PhysicsBody.XLIMIT);
	            }
	            if (Math.abs(this.speed[1]) > PhysicsBody.YLIMIT) {
	                this.speed[1] = clamp(this.speed[1], -PhysicsBody.YLIMIT, PhysicsBody.YLIMIT);
	            }
	        }
    	}
		if (Math.abs(this.angularSpeed) < PhysicsBody.EPSILON) this.angularSpeed=0;
	};
	
	PhysicsBody.prototype.intersects = function (other) {
        if (Math.abs(this.center[0] - other.center[0]) > (this.corner[0] + other.corner[0])) {
			return false;
		}
        if (Math.abs(this.center[1] - other.center[1]) > (this.corner[1] + other.corner[1])) {
			return false;
		}
        return true;
    };
	
	PhysicsBody.prototype.getLTWH = function () {
        return [
			this.center[0] - this.corner[0],
			this.center[1] - this.corner[1],
			this.corner[0] * 2,
			this.corner[1] * 2];
    };
	
	PhysicsBody.prototype.rotate = function(angle){
		this.rotation+=angle;
	};

	PhysicsBody.prototype.gravitateTo = function (location,time){
		time = Math.max(time,16);
		this.speed = (location.substract(this.center).multiply(time/2000));
	};

    return PhysicsBody;
})();


var Entity = (function () {
	function Entity() {
		this.resources = [];
	}
	
	Entity.prototype.kind = -1;
	Entity.prototype.isVisible = true;
	Entity.prototype.isAlive = true;
	Entity.prototype.isOnGround = false;
	Entity.prototype.isMarked=false;
	Entity.prototype.life = Infinity;
	Entity.prototype.draw = noop;
	Entity.prototype.collideAction = noop;
	Entity.prototype.applyGravity = noop;
	Entity.prototype.collideGround = noop;
	Entity.prototype.onRemove = noop;
	
	Entity.prototype.animate = function(world,time) {
		if (!this.isAlive) return;
		this.body.tick(time);
		if (this.onAnimate) this.onAnimate(world,time);
		if (this.resources) this.resources.forEach(function(e){e.tick(world,time);});
		this.life-=time;
		if (this.life<0 || this.life > this._life) this.markForRemoval();
	};

	return Entity;
})();

var EntityKind = {
	// TARGETS
	FIRETARGET:0,
	WATERTARGET:1,
	POISONTARGET:2,
	LIGHTNINGTARGET:3,

	// REUSABLES
	PARTICLE : 92,
	BUBBLE: 91,
	COLLECTIBLE: 90,

	// PROJECTILES
	FIREBALL : 40,
	WATERBOLT: 41,
	POISONBALL: 42,
	LIGHTNINGBOLT : 43,

	// EMITTERS
	FIREEMITTER: 50,
	WATEREMITTER: 51,
	POISONEMITTER: 52,
	LIGHTNINGEMITTER: 53,

	// ETC
	PLAYER : 11,
	SPRITE : 10
}

var SpriteEntity = (function(_super){
	__extends(SpriteEntity, _super);

	function SpriteEntity(spritesheet,center,w,h,animations){	
		_super.call(this);
		this.kind = EntityKind.SPRITE;
		this.animations = [];
		this.currentAnimation = 0;
		this.body = new PhysicsBody(center.copy(), new Vector2d(w/2,h/2));
		this.spritesheet = spritesheet;
		this.scale = [1,1];
		this.loadAnimations(animations);
	}

	SpriteEntity.prototype.loadAnimations = function(animations){
		for(var i = 0 ; i < animations.length; i++){
			var animation = this.spritesheet.getAnimation.apply(this.spritesheet,animations[i]);
			this.animations.push(animation);
		}
	};

	SpriteEntity.prototype.reset = function(){
		this.currentAnimation = 0;
	};

	SpriteEntity.prototype.setAnimation = function(i){
		if (!this.animations[i]) return;
		this.animations[i].reset();
		this.currentAnimation = i;
	};

	SpriteEntity.prototype.draw = function(ctx, world, time) {
		var a = this.animations[this.currentAnimation];
		a.drawFrame(ctx,time,this.body.center[0]-this.body.corner[0],
			this.body.center[1]-this.body.corner[1],this.scale[0], this.scale[1]);
	};

	return SpriteEntity;
})(Entity);

var Particle = (function(_super) {
	__extends(Particle,_super);

	function Particle(center,size,color,life,shrink){
		this.fill.apply(this, arguments);
	}

	Particle.kind = EntityKind.PARTICLE;

	Particle.prototype.fill = function(center,size,color,life,shrink){
		_super.call(this);
		this.kind = EntityKind.PARTICLE;
		this.color = color;
		this.body = new PhysicsBody(center,new Vector2d(size/2,size/2));
		this.life = this._life = life || 300;
		this.gravityFactor = 1;
		this.restitution = .3;
		this.shrinkage = (shrink?(size/2)/this.life:0)*shrink;
	}
	
	Particle.prototype.draw = function(ctx, world, time) {
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2],h=ltwh[3];
		ctx.save();
		ctx.tr(l+w/2,t+h/2);
		ctx.rotate(this.body.rotation);
	    ctx.fillStyle = this.color;
		ctx.fr(-w/2,-h/2,w,h);
		ctx.restore();
	};
	
	Particle.prototype.onAnimate = function(world,time) {
			this.body.corner.doSubstract([this.shrinkage*time,this.shrinkage*time]);
	};

	Particle.prototype.applyGravity = function(gravityVector,time){
		this.body.applyAcceleration(gravityVector.multiply(this.gravityFactor),time);
	};

	Particle.prototype.collideGround = function (other){
		this.body.speed[1]*=-this.restitution;
		this.body.speed[0]*=this.restitution;
		this.body.angularSpeed*=-this.restitution;
		this.body.limitSpeed();
		if (this.body.speed.getMagnitude()==0) {this.isOnGround = true; this.body.angularSpeed=0;}
	};

	return Particle;
})(Entity);

var Bubble = (function(_super) {
	__extends(Bubble,_super);

	function Bubble(center,size,color,life,shrink, fill){
		this.fill.apply(this, arguments);
		this.fillIt = fill;
	}

	Bubble.kind = EntityKind.BUBBLE;

	Bubble.prototype.fill = function(center,size,color,life,shrink){
		this.kind = EntityKind.BUBBLE;
		this.color = color;
		this.body = new PhysicsBody(center,new Vector2d(size/2,size/2));
		this.life = this._life = life || 300;
		this.gravityFactor = 1;
		this.shrinkage = (shrink?(size/2)/this.life:0)*shrink;
	}
	
	Bubble.prototype.draw = function(ctx, world, time) {
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2],h=ltwh[3];
		ctx.save();
		ctx.tr(l+w/2,t+h/2);
		ctx.beginPath();
		ctx.arc(0,0 ,this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
		if(this.fillIt){
			ctx.fillStyle = this.color;
			ctx.fill();
		} else {
		    ctx.strokeStyle = this.color;
			ctx.stroke();
		}
		ctx.restore();
	};
	
	Bubble.prototype.onAnimate = function(world,time) {
		if(time<this.life){
			this.body.corner.doAdd([this.shrinkage*time,this.shrinkage*time]);
		} else {
			this.collideGround();
		}
	};

	Bubble.prototype.applyGravity = function(gravityVector,time){
		this.body.applyAcceleration(gravityVector.multiply(this.gravityFactor),time);
	};

	Bubble.prototype.collideGround = function (other){
		this.markForRemoval();
		new Explosion({
			colors:[this.color],
			shrink:1,
			count:[5,7],
			strength:.15,
			offset: new Vector2d(0,-0.1),
			center: this.body.center,
			gravityFactor :1,
			life:200
		}).fire(this.body.center,World.instance);
	};

	return Bubble;
})(Entity);

var Collectible = (function(_super){
	__extends(Collectible,_super);

	function Collectible(center,size,color, particleType){
		this.fill.apply(this, arguments);
		this.fillIt = true;
	}

	Collectible.kind = EntityKind.COLLECTIBLE;

	Collectible.prototype.fill = function(center,size,color,particleType, draw){
		this.kind = EntityKind.COLLECTIBLE;
		this.color = color;
		this.body = new PhysicsBody(center,new Vector2d(size/2,size/2));
		this.gravityFactor = 0;
		this.shrinkage = 0;
		this.triggerDistance = 50;
		this.draw = draw || particleType.prototype.draw;
	};

	Collectible.prototype.onAnimate = function(world,time){
		var player = parrot;
		var dist = player.body.center.substract(this.body.center).getMagnitude();
		if (dist < 8){
			this.collideAction(player);
			this.markForRemoval();
		}
		else if (dist<this.triggerDistance){
			this.body.gravitateTo(parrot.body.center,time);
		} else if (dist>500 && this.kind!=-666){
			this.markForRemoval();
		}
	};

	Collectible.prototype.collideAction = function(){
		aa.play("coin");
        addPoints(5);
    }

	return Collectible;
})(Entity);

var Target = (function(_super){
	__extends(Target,_super);

	function Target(spritesheet,center,kind){
		var animations = [[15,16,2,1e3,[kind*30,12]]]
		 _super.call(this,spritesheet, center, 16,15,animations);
		 this.kind = kind;
		 this.color = [F,W,P,T][kind][2];
	}

	Target.prototype.onRemove = function(){
			var cx = new Collectible(this.body.center, 4, this.color || T[0], Bubble);
            world.addEntity(cx,World.NO_COLLISION, World.FOREGROUND);
		}

	return Target;
})(SpriteEntity);

var GroundEntity = (function(){
	function GroundEntity(groundheight,width,height){
		this.isVisible = true;
		this.isCollisionAware = true;
		this.groundheight = groundheight;
		this.color = P[2];
		this.width = width || 160;
		this.height = height || 144;
	}
	
	GroundEntity.prototype.draw = function(ctx, world) {		
		ctx.save();
	    ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(-300, this.height);
		ctx.lineTo(-300,this.height-this.groundheight);
		ctx.lineTo(this.width,this.height-this.groundheight);
		ctx.lineTo(this.width+1,this.height);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	};
	
	GroundEntity.prototype.animate = noop;

	GroundEntity.prototype.collidesWith = function(body){
		var ltwh = body.getLTWH();
		//var max = this.heightmap.maxInRange(clamp(ltwh[0],0,this.width), clamp(ltwh[0]+ltwh[2],0,this.width));
		var max = this.groundheight;
		if (max+ltwh[1]+ltwh[3]>this.height) return true;
		return false;
	};
	
	return GroundEntity;
})();

var World = (function () {

    function World() {
    	this.containers = ["nonCollidingEntities","collideAllEntities", "collideGroundEntities","backgroundEntities","entities","foregroundEntities"];
        this.entities = [];
		this.backgroundEntities=[];
		this.foregroundEntities=[];
		
        this.nonCollidingEntities = [];
        this.collideGroundEntities = [];
        this.collideAllEntities = [];

        this.player = null;
        this.gravity = [0,1e-3];
       	this.roundCount = 0;

       	this.pool = {};
       	this.pool[EntityKind.PARTICLE]=[];
       	this.pool[EntityKind.BUBBLE] = [];
       	this.pool[EntityKind.COLLECTIBLE] =[];
		World.instance = this;
    }
	
	World.prototype.render = function(ctx,time){
		var theWorld = this;
		if (this.roundCount%7==0) this.groundElement.draw(ctx,theWorld,time);
		this.containers.slice(3).forEach(function(egName){
			var entityGroup = theWorld[egName];
			for(var i=0;i<entityGroup.length;i++){
				if (entityGroup[i] && entityGroup[i].isVisible) 
					entityGroup[i].draw(ctx,theWorld,time);
			}
		});
	};
	
	World.prototype.animate = function(time){
		var theWorld = this;
		
		this.resolveCollisions(time);
		
		this.containers.slice(3).forEach(function(egName){
			var entityGroup = theWorld[egName];
			for(var i=0;i<entityGroup.length;i++){
				var E = entityGroup[i];
				if (E.body && E.body.center[0]-parrot.body.center[0]>300) continue;
				E.isAlive && E.animate(theWorld,time);
				E.isOnGround || (E.applyGravity && E.applyGravity(theWorld.gravity,time));
			}
		});

		if(this.roundCount++%30==0) this.clear();
	};
	

	World.prototype.clear = function(){
		var theWorld = this;
		var pool = theWorld.pool;

		this.containers.forEach(function(egName){
			var entityGroup = theWorld[egName];
			if (theWorld.containers.indexOf(egName)<3){
				theWorld[egName] = entityGroup.filter(function(en){
					if (en && en.isMarked){
						if (en.kind >= 90){
							pool[en.kind].push(en);
						}
						return false;
					}
					return true;
				});
			} else {
				theWorld[egName] = entityGroup.filter(function(en){
					if (en && en.isMarked){
						return false;
					}
					return true;
				});
			}
		});
	};

	World.prototype.resolveCollisions = function(time){
		var ents = this.collideGroundEntities,
		lt = ents.length,
		ej = this.groundElement,
		ei;
		for(var i =0 ; i < lt; i++){
			ei = ents[i];
			if (ei && !ei.isMarked && !ei.isOnGround && ej.collidesWith(ei.body)) ei.collideGround(ej);
		}

		ents = this.collideAllEntities;
		lt = ents.length;
		for(var i =0 ; i < lt; i++){
			ei = ents[i];
			if (!ei || ei.isMarked || !ei.isAlive) continue;
			for(j=i+1;j<lt;j++){
				ej = ents[j];
				if (!ej || ej.isMarked || !ej.isAlive || ej.body.center[0]-parrot.body.center[0]>300) continue;
				if(ei.body.intersects(ej.body)) {ei.collideAction(ej); ej.collideAction(ei); break;}
			}
		}
	};

	World.prototype.addEntity = function(e,collisionType,zIndex){
		switch (collisionType){
			case 0:
				this.nonCollidingEntities.push(e);
				break;
			case 1:
				this.collideGroundEntities.push(e);
				break;
			case 2:
				this.collideAllEntities.push(e);
				break;
			default:
				this.nonCollidingEntities.push(e);
				break;
		}
		
		switch (zIndex){
			case 1:
				this.backgroundEntities.push(e);
				break;
			case 0:
				this.entities.push(e);
				break;
			case 2:
				this.foregroundEntities.push(e);
				break;
			default:
				this.entities.push(e);
				break;
		}
	}
	
	World.NO_COLLISION = 0;
	World.COLLIDE_GROUND = 1;
	World.COLLIDE_ALL = 2;

	World.FOREGROUND = 2;
	World.CENTER = 0;
	World.BACKGROUND = 1;
	
    return World;
})();

var Explosion = (function(){
	function Explosion(params, timeFactor){
		var tf = (timeFactor / 16.666)||1;
		var o = this;
		this.params = params || {};
		this.params.mixin({
			count:[15,35],
			size:[1,4],
			strength:.3,
			offset:new Vector2d(0,0),
			colors: P,
			center: (o.center = new Vector2d(0,0)),
			life: [400,800],
			collisionType: World.NO_COLLISION,
			zIndex: World.BACKGROUND,
			gravityFactor: 1,
			shrink:false,
			particleType: Particle
		});

		this.zIndex = params.zIndex;
		this.collisionType = params.collisionType;
		var count = params.count;
		if (count instanceof Array) count = randBetween(count[0],count[1]);
		count = Math.ceil(count * tf);
		this.count = count;
	}

	Explosion.prototype.fire = function(xy,world){
		var pm = this.params, kind = pm.particleType.kind;
		var particles = [];
		for(var i = 0 ; i < this.count; i++){
			if (kind>=90 && world.pool[kind].length){
				var part = world.pool[kind].pop();
				part.isAlive = part.isVisible = !(part.isMarked=false);
				part.fill(xy.copy(),
				randBetween(pm.size),
				pm.colors.random(),
				randBetween(pm.life),
				pm.shrink);
			} else {
				var part = new pm.particleType(xy.copy(),
					randBetween(pm.size),
					pm.colors.random(),
					randBetween(pm.life),
					pm.shrink);
			}
			particles.push(part);
			part.isOnGround = false;
			part.body.speed = Vector2d.random(pm.strength).doAdd(pm.offset);
			part.gravityFactor = randBetween(pm.gravityFactor);
			world.addEntity(part,this.collisionType,this.zIndex);
		}
		return particles;
	};

	return Explosion;
})();

var Emitters = (function(){
	function FireEmitter(entity, world){
		this.kind = EntityKind.FIREEMITTER;
		this.entity = entity;
		this.world = world;
		this.params = {
            gravityFactor: [-0.4,-0.1],
            collisionType: World.NO_COLLISION,
			life:[600,1000],
			count:[0,2],
			strength: 0.1,
			size:8,
			shrink:1,
			colors: F,
			particleType: Particle
        };
        this.exploder = new Explosion(this.params);
	}
	
	function PoisonEmitter(entity, world){
		this.kind = EntityKind.POISONEMITTER;
		this.entity = entity;
		this.world = world;
		this.params = {
            gravityFactor: [-0.2,-0.4],
            collisionType: World.NO_COLLISION,
			life:[600,800],
			count:[0,1],
			strength: 0.1,
			size:2,
			shrink:2,
			colors: P,
			particleType: Bubble
        };
        this.exploder = new Explosion(this.params);
	}

    function WaterEmitter(entity,world){
		this.entity = entity;
		this.kind = EntityKind.WATEREMITTER;
		this.world = world;
		this.params = {
            gravityFactor: [0.1,0.4],
            collisionType: World.COLLIDE_GROUND,
			life:[600,1000],
			count:[0,2],
			offset: new Vector2d(0.1,0),
			strength: 0.01,
			size:4,
			shrink:0.3,
			colors: W
        };
        this.exploder = new Explosion(this.params);
    }

    function LightningEmitter(entity,world){
		this.entity = entity;
		this.kind = EntityKind.LIGHTNINGEMITTER;
		this.world = world;
        this.tracer = new Explosion({
            gravityFactor: 0,
            collisionType: World.NO_COLLISION,
			life:[200,500],
			count:[0,2],
			strength: 0.01,
			size:1,
			shrink:0,
			colors: T
        });
        this.exploder = new Explosion({
            gravityFactor: [-.1,.1],
            collisionType: World.COLLIDE_GROUND,
			life:[400,700],
			count:[0,1],
			strength: 0.1,
			size:[1,2],
			shrink:0,
			colors: T
        });
    }

    LightningEmitter.prototype.tick = function(){
        this.exploder.fire(this.entity.body.center,this.world);
        this.tracer.fire(this.entity.body.center,this.world);
    };
	
	PoisonEmitter.prototype.tick = FireEmitter.prototype.tick = WaterEmitter.prototype.tick = function(world,time){
        this.exploder.fire(this.entity.body.center,this.world);
    };

	return {
		FireEmitter:FireEmitter,
		WaterEmitter:WaterEmitter,
		PoisonEmitter:PoisonEmitter,
		LightningEmitter: LightningEmitter
	}
})();

var Projectiles = (function(_super){
	__extends(Fireball,_super);
	__extends(Waterbolt,_super);
	__extends(Poisonball,_super);
	__extends(Lightningbolt,_super);
	
	function _proj(center,speed,size,color){
		this.life = this._life = 1500;
		this.body = new PhysicsBody(center.copy(),new Vector2d(size,size));
		this.body.speed.doAdd(speed);
		this.body.friction = 0;
		this.color = color;
	}
	
	function Fireball(center,world) {
		_super.call(this);
		_proj.call(this, center, [0.2,0], 3, F.random());
		this.kind = EntityKind.FIREBALL;
		this.emitter = new Emitters.FireEmitter(this,world);
		this.emitter.params.gravityFactor = [-0.2,0.1];
		this.emitter.params.strength = 0.05;
		this.emitter.params.count = [0,1];

		this.resources.push(this.emitter);
	}

	Fireball.prototype.draw = function(ctx, world, time) {
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2];
		ctx.save();
		ctx.tr(l+w/2,t+w/2);
	    ctx.fillStyle = this.color;
		ctx.fr(-w/2,-w/2,w,w);
		ctx.restore();
	};

	Fireball.prototype.collideAction = function(other){
		if (other.kind < 10){
			this.markForRemoval();
			var exp = new Explosion({gravityFactor:.7,colors:F,offset:this.body.speed.multiply(.5),zIndex:World.FOREGROUND, collisionType: World.COLLIDE_GROUND, shrink:.6});
			exp.fire(this.body.center,world);
			aa.play("hit");
		}
	};
	
	function Waterbolt(center, world){
		_super.call(this);
		_proj.call(this, center, [0.2,0], 3, W.random());
		this.kind = EntityKind.WATERBOLT;
		
		this.emitter = new Emitters.WaterEmitter(this,world);
		this.emitter.params.count = [-1,1];

		this.resources.push(this.emitter);
	}
	
	Waterbolt.prototype.collideAction = function(other){
		if (other.kind< 10) {
			this.markForRemoval();
			var exp = new Explosion({gravityFactor:.8,colors:W,offset:this.body.speed.multiply(.25),zIndex:World.FOREGROUND, collisionType: World.COLLIDE_GROUND, shrink:.8});
			exp.fire(this.body.center,world);
			aa.play("hit");
		}
	};
	
	Waterbolt.prototype.draw = function(ctx, world, time) {		
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2],h=ltwh[3];
		ctx.save();
		ctx.tr(l+w/2,t+h/2);
		ctx.rotate(this.body.rotation);
	    ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.arc(0,0 ,this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
		ctx.stroke();
		ctx.restore();
	};

	function Poisonball(center,world) {
		_super.call(this);
		_proj.call(this, center, [0.2,0], 2, P[3]);
		this.kind = EntityKind.POISONBALL;
		this.emitter = new Emitters.PoisonEmitter(this,world);
		this.resources.push(this.emitter);
	}
	
	Poisonball.prototype.collideAction = function(other){
		if (other.kind < 10) { 
			this.markForRemoval();
			var exp = new Explosion({gravityFactor:-.3,colors:P,zIndex:World.FOREGROUND, collisionType: World.NO_COLLISION, shrink:2, particleType:Bubble, life:[150,500], strength:0.3, count:[4,10]});
			exp.fire(this.body.center,world);
			aa.play("hit");
		}
	};
	
	Poisonball.prototype.draw = function(ctx, world, time) {		
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2],h=ltwh[3];
		ctx.save();
		ctx.tr(l+w/2,t+h/2);
		ctx.rotate(this.body.rotation);
	    ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(0,0 ,this.body.corner.getMagnitude(), 0, 2 * Math.PI, false);
		ctx.fill();
		ctx.restore();
	};

	function Lightningbolt(center, world) {
		_super.call(this);
		_proj.call(this,center,[.2,0],2,T.random());
		this.kind = EntityKind.LIGHTNINGBOLT;
		
		this.emitter = new Emitters.LightningEmitter(this,world);
		this.resources.push(this.emitter);
	}
	
	Lightningbolt.prototype.collideAction = function(other){
		if (other.kind< 10){
			this.markForRemoval();
			var exp = new Explosion({size:1, gravityFactor:[-.3,.3],colors:T,zIndex:World.FOREGROUND, collisionType: World.COLLIDE_GROUND, shrink:0, life:[150,500], strength:0.3, count:[4,10]});
			exp.fire(this.body.center,world);
			aa.play("hit");
		}
	};

	Lightningbolt.prototype.onAnimate = function(world,time){
		this.body.center[1]+=(Math.random()-0.5)/1300*time*155;
	};
	
	Lightningbolt.prototype.draw = function(ctx, world, time) {		
		var ltwh=this.body.getLTWH(),l=ltwh[0],t=ltwh[1],w=ltwh[2];
		ctx.save();
		ctx.tr(l+w/2,t+w/2);
	    ctx.fillStyle = this.color;
		ctx.fr(-w/2,-w/2,w,w);
		ctx.restore();
	};
	
	return {
		Fireball : Fireball,
		Waterbolt : Waterbolt,
		Poisonball: Poisonball,
		Lightningbolt : Lightningbolt
	}
})(Entity);


var r = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60,  1000 / 60);
    };
})();

(screen.msLockOrientation&& screen.msLockOrientation("landscape-primary"))||(screen.mozLockOrientation&& screen.mozLockOrientation("landscape-primary"));

/// SETUP ONCE
window.smb = document.getElementById("32s");
var driveVector= new Vector2d(0,0), topV = new Vector2d(30,24), mid = new Vector2d(30,73), bottom = new Vector2d(30,118), slots=[topV,mid,bottom];

var shoot = function(kind){
	if (parrot.isAlive)	{
        world.addEntity(new kind(parrot.body.center,world), World.COLLIDE_ALL, World.CENTER)
        addPoints(-1);
        aa.play("shoot");
    };
}
CMD = {
	//up
	87:Function("targetVector=targetVector==bottom?mid:topV;"),
	//down
	83:Function("targetVector=targetVector==topV?mid:bottom"),
	// fire
	72:Function("shoot(Projectiles.Fireball)"),
	// water
	74:Function("shoot(Projectiles.Waterbolt)"),
	// poison
	75:Function("shoot(Projectiles.Poisonball)"),
	// lightning
	76:Function("shoot(Projectiles.Lightningbolt)"),
	// slowmo
	32:Function("able([window.smb],false); aa.play('slowmo'); window.timeout = setTimeout(function(){CMD[7](window.smb)},10e3);timefactor=.25"),
	// normalmo
	7:Function("btn","timefactor=1;window.timeout = setTimeout(function(){able([btn],true)},10e3)")
},
command = function(id,caller){
	if (window.gamerunning){
	 if (caller && (!caller.classList || !caller.classList.contains("d"))) CMD[id](caller);
	}
	else startGame();
}

allButtons.forEach(function(button){
    button.onmousedown = button.ontouchstart = function(evt){
        command(parseInt(this.id),this);
        evt.preventDefault();
        evt.handled = true;
        return false;
    }
});

var ableAll = function(en){able(allButtons,en)};
window.pts = 0;
window.hiscore = parseInt(localStorage.getItem("hiscore")) || 0;
points.textContent = "High score: " + window.hiscore;
window.postfix = "";
var addPoints = function(pts){
    window.pts+=pts;
    switch(Math.floor(window.pts/50)){
        case 0: window.postfix = ""; break;
        case 1: window.postfix = "!"; break;
        case 2: window.postfix = "!!"; break;
        case 3: window.postfix = "!1"; break;
        case 4: window.postfix = ", holy sh1t!"; break;
        default: window.postfix = ", ERMAGHERD!!2"; break;
    }
    points.textContent = "Points: " + window.pts + postfix;
},
toggleVeil = function(onoff){
    veil.style.display = onoff?"block":"none";
},
switchGraphics = function(){
    window.cr = !window.cr;
    localStorage.setItem("cr",window.cr);
    crbutton.textContent = "Graphics: " + (window.cr?"Low":"High");
},
soundOnOff = function(){
    window.mute = !window.mute;
    localStorage.setItem("mute",window.cr);
    mutebutton.textContent = "Sounds: " + (window.mute?"Off":"On");	
},
readInputs = function(){
	for(var i  in readInputs.keys){
		if (+i && (i in CMD)){
			command(+i,readInputs.keys[i]);
			delete readInputs.keys[i];
		}
	}
},
gameOver = function(){
	window.gamerunning = false;
    window.hiscore = Math.max(window.hiscore,window.pts);
    localStorage.setItem("hiscore",window.hiscore);
    points.textContent = "High score: " + window.hiscore;
    animate = noop;
    loadGameEntities(s);
    toggleVeil(true);
},
startGame = function(){
	window.gamerunning = true;
	aa.play("start");
    if(window.timeout) clearTimeout(window.timeout);
    window.pts = 0;
    toggleVeil(false);
    ableAll(true);
    timefactor = 1;
    animate = function(time) {
    parrot.body.speed[1] = (targetVector[1]-parrot.body.center[1])*Math.max(time,16)/3000;
    parrot.body.speed[0]= 0.05;
    world.animate(time);
    parrot.body.center[1] = clamp(parrot.body.center[1],topV[1],bottom[1]);
    };
};
startbutton.onclick = startGame;
crbutton.onclick = switchGraphics;
mutebutton.onclick = soundOnOff;
readInputs.keys = {};
document.body.addEventListener("keydown", function (e) {
    readInputs.keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    readInputs.keys[e.keyCode] = false;
});

/// SETUP EVERYTIME

var parrot, world, atlas, ground,targetVector;
var tree,enemy;
var loadGameEntities = function(sheet){
	world = new World();
	ground = new GroundEntity(15,3000);
	world.groundElement=ground;
    parrot = new SpriteEntity(sheet,new Vector2d(0,73),16,12,[
        [16,12,6,400,[27,0]]
        ]);
	parrot.collideAction = function(other){
		if (other.kind<10){
			aa.play("death");
			this.markForRemoval();
		}
	}
	parrot.onRemove = function(){	
		var chunks = new Explosion({
			colors: B,
			size: [1,5],
			count: [10,20],
			strength: .5,
			offset: this.body.speed.multiply(2),
			center: this.body.center,
			collisionType: World.COLLIDE_GROUND,
			zIndex: World.FOREGROUND
		}).fire(this.body.center, world);
		chunks = chunks.filter(function(EL){return EL.body.corner[0]>1.5});
		for(var i =0; i< chunks.length; i++){
			var chunk  = chunks[i];
			chunk.restitution = .9;
			chunk.tracer = new Explosion({
            gravityFactor: 0,
            collisionType: World.NO_COLLISION,
			life:[200,500],
			count:[0,2],
			strength: 0.01,
			size:1,
			shrink:0,
			colors: B.slice(2)
			});
			chunk.onAnimate = function(){
				this.tracer.fire(this.body.center,world);
			}
		}
		var checkDead = function(){
			setTimeout(function(){
				if(chunks.every(function(e){return !e.isAlive;})) gameOver();
				else checkDead();
			},100);
		}
		checkDead();
	}
	
	targetVector=mid;

	
	var enemyCollideAction = function(other){
		if(other.kind-40==this.kind){
			this.markForRemoval();
		}
	};

	var addEnemyTo = function(x,y){
		enemy = new Target(sheet,[x,y[1]],randBetween(0,4,true));
        enemy.collideAction = enemyCollideAction;
		world.addEntity(enemy,World.COLLIDE_ALL, World.CENTER);
	};
	
	// populate enemigos
	for(var i =0, inc = 100, intensity=1; intensity<5;){
		switch(intensity){
			case 1:
				addEnemyTo(100+i,slots.random());
				if (i>=1000) intensity++;
			break;
			case 2:
				var p1 = randBetween(0,3,true);
				var p2 = (p1+1)%3;
				addEnemyTo(100+i,slots[p1]);
				addEnemyTo(100+i,slots[p2]);
				if (i>=2000) intensity++;
			break;
			case 3:
				addEnemyTo(100+i,slots[0]);
				addEnemyTo(100+i,slots[1]);
				addEnemyTo(100+i,slots[2]);
				inc = Math.max(10,inc-5);
				if (i>=3000) intensity++;
			break;
			default:
				var cx = new Collectible([i+500,mid[1]], 6, B[4], Bubble);
				cx.kind = -666;
			    cx.collideAction = function(other){addPoints(50); other.markForRemoval()};
			    world.addEntity(cx,World.NO_COLLISION, World.FOREGROUND);
			    intensity++;
		}
		
		i+=inc;
	}
	
	world.addEntity(parrot,World.COLLIDE_ALL, World.CENTER);
}

var s = new SpriteSheet(imglol,loadGameEntities);

// SETUP LOOP+FUNCTIONS
var animate = noop;

var ctx = miniCanvas.getContext("2d");
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
translation = 0;
var render = function(time) {
	if (parrot && world){
	translation = -parrot.body.center[0]+30;
	ctx.save();
	ctx.tr(translation,0);
	if (timefactor>0.9){
		ctx.fillStyle = P[0];
	    ctx.fr(-translation,0,miniCanvas.width,miniCanvas.height-15);
	}
	
	world.render(ctx,time);
	ctx.restore();
	}
};

var timefactor = 1;
var gameLoop = function(n) {
    n=n || (gameLoop.lastTime||0)+1000/60; 
    if (!gameLoop.lastTime) {
        gameLoop.lastTime = n;
        r(gameLoop);
        return;
    }
    var time = Math.min((n-gameLoop.lastTime),70)*timefactor;
    r(gameLoop);
    readInputs(time);
    animate(time);
    render(time);
    gameLoop.lastTime = n;
};

gameLoop();