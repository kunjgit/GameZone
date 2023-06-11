/**
	Micro Gaming Engine
	
	it's not perfect, maybe it have bugs, but it's something you could build on
*/
(function() {

var MGE = MGE || {};
var _root = this;
MGE.TextureCache = [];
MGE._hitList = [];

/**
*	---------------------------------------------------
*	MGE.Game
*	---------------------------------------------------
**/
MGE.Game = function(width, height, bgColor) {
	this.width   = width   || 320;
	this.height  = height  || 480;
	this.bgColor = bgColor || "#000000";
	this.__updateList = [];
	
	this._isTouch = false;
	// maybe we have mobile :)
	if ('ontouchstart' in window) {
		this._isTouch = true;
	}	
	
	this.createCanvas();
	
	this.context = this.getContext();
	this.setSmoothing(false);
	
	this.pointer = {
		x: -1,
		y: -1,
		isDown: false,
		isOut : true
	}
	this.canvasRect = this.canvas.getBoundingClientRect();
	
	this.stage = new MGE.Stage(this.width, this.height);
	this.render();
	
	this.bindEvents();
}

MGE.Game.prototype = {
	// ----------------------------------------
	// createCanvas
	// ----------------------------------------
	createCanvas: function() {
		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("width", this.width);
		this.canvas.setAttribute("height", this.height);
		this.canvas.style.backgroundColor = this.bgColor;
		this.canvas.style.cursor = "inherit";
		document.body.appendChild(this.canvas);	
		
		if (this._isTouch) {
			this.canvas.style.width = window.innerWidth + 'px';	
			this.canvas.style.height = window.innerHeight + 'px';		
		}
	},
	
	// ----------------------------------------
	// setSmoothing
	// ----------------------------------------
	setSmoothing: function(value) {
        this.context['imageSmoothingEnabled']       = value;
        this.context['mozImageSmoothingEnabled']    = value;
        this.context['oImageSmoothingEnabled']      = value;
        this.context['webkitImageSmoothingEnabled'] = value;
        this.context['msImageSmoothingEnabled']     = value;	
	},
	
	// ----------------------------------------
	// getContext
	// ----------------------------------------
	getContext: function() {
		return this.canvas.getContext("2d");
	},
	
	// ----------------------------------------
	// checkHits
	// ----------------------------------------
	checkHits: function() {	
		for (var i = MGE._hitList.length - 1; i >=0; i--) {
			if (MGE._hitList[i].active === false) {
				continue;
			}
			if (MGE._hitList[i].contains(this.pointer)) {
				if (MGE._hitList[i].onPointerDown) {
					MGE._hitList[i].onPointerDown(this.pointer);
				}
				break;
			}
		}	
	},
	
	// ----------------------------------------
	// bindEvents
	// ----------------------------------------
	bindEvents: function(evt) {
		var _self = this;
		var _pointerDown, _pointerMove, _pointerUp;
		
		if (this._isTouch) {
			_pointerDown = 'touchstart';
			_pointerMove = 'touchmove';
			_pointerUp   = 'touchend';
		} else {
			_pointerDown = 'mousedown';
			_pointerMove = 'mousemove';
			_pointerUp   = 'mouseup';        
		}

		this.canvas.addEventListener(_pointerMove, this.moveHandler.bind(this), false);
		this.canvas.addEventListener(_pointerDown, this.downHandler.bind(this), false);
		this.canvas.addEventListener(_pointerUp,   this.upHandler.bind(this)  , false);
		
		this.canvas.addEventListener('mouseout',  function() {
			_self.pointer.isDown = false;
			_self.pointer.isOut  = true;
		}, true);	
	},		
	
	// ----------------------------------------
	// getPointerPosition
	// ----------------------------------------
	getPointerPosition: function(evt) {
		var a = (this._isTouch ? evt.targetTouches[0] : evt);
		this.pointer.x = (a.clientX - this.canvasRect.left) * (this.width / this.canvasRect.width);
		this.pointer.y = (a.clientY - this.canvasRect.top)  * (this.height / this.canvasRect.height);
		
		for (var i = MGE._hitList.length - 1; i >=0; i--) {
			if (MGE._hitList[i].active === false) continue;
			if (MGE._hitList[i].contains(this.pointer)) {
				this.canvas.style.cursor = "pointer";
				break;
			} else {
				this.canvas.style.cursor = "inherit";
			}
		}		
	},	
	
	// ----------------------------------------
	// moveHandler
	// ----------------------------------------	
	moveHandler: function(evt) {
		evt.preventDefault();
		this.pointer.isOut = false;
		this.getPointerPosition(evt);	
	},
	
	// ----------------------------------------
	// downHandler
	// ----------------------------------------	
	downHandler: function(evt) {
		evt.preventDefault();
		this.getPointerPosition(evt);
		this.pointer.isDown = true;
		this.checkHits();	
	},	
	
	// ----------------------------------------
	// upHandler
	// ----------------------------------------	
	upHandler: function(evt) {
		evt.preventDefault();
		this.pointer.isDown = false;
	},		
	
	// ----------------------------------------
	// render
	// ----------------------------------------	
	render: function() {
		requestAnimFrame(this.render.bind(this));

		this.context.fillStyle = '#000000';
		this.context.fillRect(0, 0, this.width, this.height);	
		
		for (var i in this.__updateList) {
			this.__updateList[i]();
		}
	
		MGE.Tweener.update();
		
		for (i = 0; i < this.stage.children.length; i++) {  
			this.draw(this.stage.children[i]);
		}
	},
	
	// ----------------------------------------
	// draw
	// ----------------------------------------	
	draw: function(sprite) {
		if (sprite.visible === false || sprite.alpha <= 0 || sprite.parent === null) return;

		this.context.save();
		this.context.globalAlpha = sprite.alpha;
		this.context.translate(sprite.x, sprite.y);
		this.context.rotate(sprite.rotation);
		if (sprite.render) sprite.render(this.context);
		if (sprite._renderable && sprite._loaded == true) {
			if (sprite._crop === null) {
				this.context.drawImage(sprite.texture, - sprite.width * sprite.anchorX, - sprite.height * sprite.anchorY, sprite.width, sprite.height);
			} else {
				this.context.drawImage(sprite.texture, sprite._crop.cx, sprite._crop.cy, sprite._crop.cw, sprite._crop.ch, 0, 0, sprite._crop.cw, sprite._crop.ch);				
			}
		}

        if (sprite.children && sprite.children.length > 0) {
			for (var j = 0; j < sprite.children.length; j++) {  
				this.draw(sprite.children[j]);
			}
        }		
		this.context.restore();
	},
	
	// ----------------------------------------
	// addUpdate
	// ----------------------------------------	
	addUpdate: function(key, fn) {
		if (typeof(fn) == "function") {
			this.__updateList[key] = fn;
		}
	},
	
	// ----------------------------------------
	// removeUpdate
	// ----------------------------------------		
	removeUpdate: function(key) {
		this.__updateList[key] = null;
	},

	// ----------------------------------------
	// removeAllUpdates
	// ----------------------------------------		
	removeAllUpdates: function(key) {
		this.__updateList = [];	
	}
};

/**
*	---------------------------------------------------
*	MGE.createCanvas
*	---------------------------------------------------
**/
MGE.createCanvas = function(w, h) {
	var canvas           = document.createElement('canvas');
	canvas.width         = w;
	canvas.height        = h;
	canvas.style.display = 'none';
	document.body.appendChild(canvas);
	var context = canvas.getContext("2d");
	
	return {'canvas': canvas, 'context': context}
};

/**
*	---------------------------------------------------
*	MGE.imageFromCanvas
*	---------------------------------------------------
**/
MGE.imageFromCanvas = function(c) {
	var tmp = c.toDataURL("image/png");
	var img = new Image();
	img.src = tmp;
	return img;
};

/**
*	---------------------------------------------------
*	MGE.removeCanvas
*	---------------------------------------------------
**/
MGE.removeCanvas = function(c) {
	c.parentNode.removeChild(c);
};

/**
*	---------------------------------------------------
*	MGE.HitArea
*	---------------------------------------------------
**/
MGE.HitArea = function(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.active = true;
	
	this.onPointerDown = null;
	this.onPointerUp   = null;
	this.onPointerOut  = null;
	
	MGE._hitList.push(this);
}

MGE.HitArea.prototype.contains = function(p) {
	if (p.x >= this.x && p.x <= this.x + this.width) {
		if (p.y >= this.y && p.y <= this.y + this.height) {
			return true;
		}
	}
	return false;
}

MGE.HitArea.prototype.remove = function() {
	MGE._hitList.splice(MGE._hitList.indexOf(this), 1);
}

/**
*	---------------------------------------------------
*	MGE.DisplayObject
*	---------------------------------------------------
**/
MGE.DisplayObject = function() {
	this.stage = null;
	this.parent = null;
	this.visible = true;
	this._renderable = false;

	this.x = 0;
	this.y = 0;
	this.scaleX = 1;
	this.scaleY = 1;
	this.rotation = 0;
	this._alpha = 1;	
	this._width = null;
	this._height = null;
};


/**
*	---------------------------------------------------
*	defineProperties width, height, alpha
*	---------------------------------------------------
**/
Object.defineProperties(MGE.DisplayObject.prototype, {
	'width': {
		get: function() {
			return this._width * this.scaleX
		},
		set: function(value) {
			this._width = value;
		}
	},
	
	'height': {
		get: function() {
			return this._height * this.scaleY;
		},
		set: function(value) {
			this._height = value;
		}
	},
	
	'alpha': {
		get: function() {
			var tmp = this.parent._alpha * this._alpha;
			return tmp;
		},
		set: function(value) {
			this._alpha = value;
		}
	}
});

/**
*	---------------------------------------------------
*	MGE.DisplayObjectContainer
*	---------------------------------------------------
**/
MGE.DisplayObjectContainer = function() {
    MGE.DisplayObject.call(this);
    this.children = [];
};
MGE.DisplayObjectContainer.prototype = Object.create(MGE.DisplayObject.prototype );
MGE.DisplayObjectContainer.prototype.constructor = MGE.DisplayObjectContainer;

MGE.DisplayObjectContainer.prototype.addChild = function(child, index) {
	if (child.parent) {
		child.parent.removeChild(child);
	}
	child.parent = this;
	
	if (index === undefined) {
		this.children.push(child);
	} else {
		this.children.splice(index, 0, child);
	}
}

MGE.DisplayObjectContainer.prototype.removeChild = function(child) {
	if (child.parent === this) {
		return this.children.splice(this.children.indexOf(child), 1);
	}
}

MGE.DisplayObjectContainer.prototype.removeAll = function() {
	while(this.children.length) {
		this.removeChild(this.children[0]);
	}
}

MGE.DisplayObjectContainer.prototype.applyParams = function(params) {
	for (var i in params) {
		this[i] = params[i];
	}
	return this;
};

MGE.DisplayObjectContainer.prototype.addTo = function(where) {
	where.addChild(this);
	return this;
}

/**
*	---------------------------------------------------
*	MGE.Stage
*	---------------------------------------------------
**/
MGE.Stage = function(width, height) {
	MGE.DisplayObjectContainer.call(this);
	
	this.stage = true;
	this.parent = this;	
	this.width = width;
	this.height = height;
};
MGE.Stage.prototype = Object.create(MGE.DisplayObjectContainer.prototype);
MGE.Stage.prototype.constructor = MGE.Stage;

/**
*	---------------------------------------------------
*	MGE.Sprite
*	---------------------------------------------------
**/
MGE.Sprite = function(texture, crop) {
	var _self = this;
    MGE.DisplayObjectContainer.call(this);
	this._renderable = true;
	
	this.anchorX = 0.5;
	this.anchorY = 0.5;
	this.width = null;
	this.height = null;
	this._crop = null;
	this._loaded = false;
	
	if (MGE.TextureCache[texture] !== undefined) {
		this.texture = MGE.TextureCache[texture];
		this.width  = MGE.TextureCache[texture].width;
		this.height = MGE.TextureCache[texture].height;	
		if (crop != undefined && this._crop == null) {
			this._crop = crop;
		}
		this._loaded = true;
	} else {
		var img = new Image();
		MGE.TextureCache[texture] = img;
		
		img.onload = function() {
			_self.texture = this;
			_self.width = this.width;
			_self.height = this.height;	
			if (crop != undefined && _self._crop == null) {
				_self._crop = crop;
			}
			_self._loaded = true;
		}
		
		img.src = texture;		
	}
};
MGE.Sprite.prototype = Object.create(MGE.DisplayObjectContainer.prototype );
MGE.Sprite.prototype.constructor = MGE.Sprite;

MGE.Sprite.prototype.setCrop = function(crop) {
	this._crop = crop;
}

/**
*	---------------------------------------------------
*	MGE.Rectangle
*	---------------------------------------------------
**/
MGE.Rectangle = function(width, height) {
	MGE.DisplayObjectContainer.call(this);

	this._width = width;
	this._height = height;
	this.fillStyle = '#DD6020';
	this.anchorX = 0.5;
	this.anchorY = 0.5;
};
MGE.Rectangle.prototype = Object.create(MGE.DisplayObjectContainer.prototype);
MGE.Rectangle.prototype.constructor = MGE.Rectangle;

MGE.Rectangle.prototype.render = function(ctx) {
	  ctx.fillStyle = this.fillStyle;
      ctx.fillRect(-this.width * this.anchorX, -this.height * this.anchorY, this.width, this.height);
}

/**
*	---------------------------------------------------
*	MGE.Line
*	---------------------------------------------------
**/
MGE.Line = function(x1, y1, x2, y2) {
	MGE.DisplayObject.call(this);

	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.strokeStyle = '#FFFFFF';
	this.lineWidth = 1;
};
MGE.Line.prototype = Object.create(MGE.DisplayObject.prototype);
MGE.Line.prototype.constructor = MGE.Line;

MGE.Line.prototype.render = function(ctx) {
	  ctx.strokeStyle = this.strokeStyle;
	  ctx.lineWidth = this.lineWidth;
	  ctx.beginPath();
	  ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
	  ctx.stroke();
}

/**
*	---------------------------------------------------
*	MGE.BitmapText
*	---------------------------------------------------
**/
MGE.BitmapText = function(text, font) {
    MGE.DisplayObjectContainer.call(this);
	this._pool = [];
	this.font = font;
	this.xAdvance = this.font.texture.data['0'].width;
	this.yAdvance = this.font.texture.data['0'].height;
	this.spacing = this.font.size;
	this.setText(text);
};
MGE.BitmapText.prototype = Object.create(MGE.DisplayObjectContainer.prototype );
MGE.BitmapText.prototype.constructor = MGE.BitmapText;

MGE.BitmapText.prototype.setText = function(text) {
	this.text = text;
	this.updateText();	
}

MGE.BitmapText.prototype.updateText = function() {
	var charCode, charSprite, crop;
	this.oldChilds = this.children.length;

	for (var i = 0; i < this.text.length; i++) {
		charCode = this.text[i];
		charSprite = (i < this.oldChilds) ? this.children[i] : this._pool.pop();
		
		crop = {
			'cx': this.font.texture.data[charCode].x,
			'cy': this.font.texture.data[charCode].y,
			'cw': this.font.texture.data[charCode].width,
			'ch': this.font.texture.data[charCode].height
		}
		
		if (charSprite) {
			charSprite.setCrop(crop);
		} else {
			charSprite = new MGE.Sprite(this.font.texture.img.src, crop);
		}
		charSprite.x = i * (this.xAdvance + this.spacing);
		if (!charSprite.parent) this.addChild(charSprite);
	}

    while(this.children.length > this.text.length) {
        var child = this.children[this.children.length - 1];
        this._pool.push(child);
        this.removeChild(child);
		this._pool[this._pool.length - 1].parent = undefined;		
    }
	
	this.textWidth = this.text.length * (this.xAdvance + this.spacing);
	this.textHeight = this.font.size * 5;
}

/**
*	---------------------------------------------------
*	MGE.Tweener
*   based on Sole's Tweener
*	---------------------------------------------------
**/
MGE.Tweener = MGE.Tweener || ( function () {
	var _tweenList = [];
	
	return {
		add: function (t) {
			_tweenList.push(t);
		},

		getAll: function () {
			return _tweenList;
		},

		update: function () {	
			if (_tweenList.length === 0) return;
			for (i = 0; i < _tweenList.length; i++) {
				_tweenList[i].update();
			}
		},
		
		remove: function (t) {
			var i = _tweenList.indexOf(t);
			if (i !== -1) {
				_tweenList.splice(i, 1);
			}
		},
		
		removeAll: function () {
			_tweenList = [];
		}
	}
} )();

MGE.Tweener.Tween = function (object) {
	var _object        = object;
	var _duration      = 1000;
	var _startValues   = {};
	var _endValues     = {};
	
	var _delay       = 0;
	var _repeat      = 0;
	var _yoyo        = false;
	var _repeatDelay = 0;
	var _startTime   = null;
	var _onYoyo      = null;
	var _onUpdate    = null;
	var _onComplete  = null;
	var _easing      = 'Cubic';
	
	for (var property in _object) {
		_startValues[property] = _object[property];
	}
	
	this.playing = false;
	
	this.start = function() {
		this.playing = true;
		_startTime = Date.now() + _delay;
		MGE.Tweener.add(this);
		
		return this;
	}
	
	this.to = function (properties, duration) {
		_endValues = properties;
		_duration  = duration;
		
		return this;
	};	
	
	this.update = function() {
		if (this.playing === true) {
			var now = Date.now();
			if (now < _startTime) return;
			
			var elapsed = (now - _startTime) / _duration;

			if (elapsed > 1) {
				// tween end
				for (var property in _endValues) {
					_object[property] = _endValues[property];
				}

				
				if (_repeat > 0) {
					if (isFinite(_repeat)) {
						_repeat --;
					}
					
					// exchange start and end value
					if (_yoyo) {
						for (var property in _endValues) {
							var tmp = _startValues[property];
							_startValues[property] = _endValues[property];
							_endValues[property] = tmp;
						}
						if (_onYoyo !== null) {
							_onYoyo.call();
						}	
					}
					
					// restart all
					_startTime = Date.now() + _repeatDelay;

				} else {
					this.stop();

					if (_onComplete !== null) {
						_onComplete();
					}
				}
			} else {
				// tween is still active
				var value = MGE.Easing[_easing](elapsed);

				for (var property in _endValues) {
					_object[property] = _startValues[property] * (1 - value) + _endValues[property] * value;
				}
			}
			
			if (_onUpdate !== null) {
				_onUpdate.call();
			}			
		}
	}

	this.easing = function (val) {
		_easing = val;
		return this;
	};	
	
	this.delay = function (val) {
		_delay = val;
		return this;
	};	
	
	this.repeat = function (val, delay) {
		_repeat = val;
		if (delay !== undefined) {
			_repeatDelay = delay;
		}
		return this;
	};
	
	this.yoyo = function(val, delay) {
		_yoyo = val;
		return this;
	};

	this.onYoyo = function(callback) {
		_onYoyo = callback;
		return this;
	}
	
	this.onUpdate = function(callback) {
		_onUpdate = callback;
		return this;
	}
	
	this.onComplete = function(callback) {
		_onComplete = callback;
		return this;
	}
	
	this.stop = function() {
		this.playing = false;
		MGE.Tweener.remove(this);
	}

	return this;
}

MGE.Easing = {
	Linear: function (k) {
		return k;
	},
	
	Cubic: function (k) {
		// cubic InOut
		if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
		return 0.5 * ( ( k -= 2 ) * k * k + 2 );	
	}
}

/**
*	---------------------------------------------------
*	requestAnimFrame
*	---------------------------------------------------
**/
if (window.requestAnimFrame == null) window.requestAnimFrame = (function() {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000/60);
	};
})();

if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
		exports = module.exports = MGE;
	}
	exports.MGE = MGE;
} else {
	_root.MGE = MGE;
}

}).call(this);