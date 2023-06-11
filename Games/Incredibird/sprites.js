var Frame = (function(){
	function Frame(img,x,y,w,h){
		this.img = img;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	
	Frame.prototype.drawItself = function(ctx,x,y,scalex,scaley){
		// draw image: image, fromx, fromy, fromw, fromh, tox, toy, tow, toh
		/*ctx.save();
		ctx.translate(x+this.w/2,y+this.h/2);
		if (scalex || scaley) {
			scalex=scalex||1;
			scaley=scaley||1;
			ctx.scale(scalex,scaley);
			ctx.translate(-this.w/2*scalex,-this.h/2*scaley);
		} else {
			ctx.translate(-this.w/2,-this.h/2);
		}
		ctx.drawImage(this.img,this.x,this.y,this.w,this.h,0,0,this.w,this.h);
		ctx.restore();*/
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
	function SpriteSheet(image, key){
		if(typeof image=="string") this.url = image;
		else this.img = image;
		this.key = key || image.id || image;
		this.w = 0;
		this.h = 0;
		this.isReady = false;
		var spr = this;
	}
	
	SpriteSheet.prototype.getXYFor = function(frameCount, tileWidth, tileHeight, offsetxy){
		var totalx = frameCount*tileWidth+offsetxy[0], cw = this.width,
		startx = totalx%cw,
		starty = Math.floor(totalx/cw)*tileHeight;
		return [startx,starty+offsetxy[1]];
	};
		
	SpriteSheet.prototype.getFrameByXY = function(x,y,tileWidth,tileHeight,animwidth){
		var cw = (animwidth || this.width),
		totalx = cw*(y/tileHeight)+x;
		return totalx/tileWidth;
	};
	
	SpriteSheet.prototype.loadImage = function(callback, caller){
		if (this.img) {
			this.isReady = true;
			this.width = this.img.width;
			this.height = this.img.height;
			callback.apply(caller,[this]);
			return;
		}
		
		this.img = new Image();	
		var spr = this;
		this.img.onload = function(){
			spr.isReady = true;
			spr.width=this.width;
			spr.height=this.height;
			callback.apply(caller,[spr]);
		}
		this.img.src = this.url;
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

var SpriteSheetLoader = (function(){
	function SpriteSheetLoader(onLoadingReady){
		this.onLoadingReady = onLoadingReady;
		this.queue = {};
		this.spriteSheets = {};
		this.items = 0;
		this.loaded=0;
	}
	
	SpriteSheetLoader.prototype.addItem = function(sheet){
		this.items++;
		this.queue[sheet.key]=sheet;
	};
	
	SpriteSheetLoader.prototype.start = function(n){
		n = n||5;
		var ssl = this;
		this.intervalId = setInterval(function(){
			ssl.terminateIfReady();
		},100);
		this.startLoading(n);
	};
	
	SpriteSheetLoader.prototype.startLoading = function(n){
		var keys = Object.keys(this.queue);
		var key;
		for(var k=0; k<keys.length; k++){
			key = keys[k];
			if (keys.length<=0) return;
			this.queue[key].loadImage(this.imageLoaded, this);
		}
	};
	
	SpriteSheetLoader.prototype.imageLoaded = function(spriteSheet){
		var key = spriteSheet.key;
		this.spriteSheets[key] = this.queue[key];
		delete this.queue[key];
		this.loaded++;
	};
	
	SpriteSheetLoader.prototype.terminateIfReady = function(){
		if (this.loaded == this.items){
			clearInterval(this.intervalId);
			this.onLoadingReady(this);
		}
	};

	return SpriteSheetLoader;
})();

