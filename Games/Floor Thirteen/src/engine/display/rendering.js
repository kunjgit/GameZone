function createCanvas() {
  return document.createElement('canvas');
}

function Renderer(width, height) {
  var that = this; // Ugly minification trick

  var canvas = that.c = createCanvas();
  var ctx = canvas.getContext('2d');

  that.w = canvas.width = width;
  that.h = canvas.height = height;

  __mixin(that, {
    r: function render(stage) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      stage._t();
      that.o(stage);
    },
    o: function renderObject(object) {
      if (!object.v) {
        return;
      }

      if (object instanceof DisplayObjectContainer) {
        var children = object._c, i = 0, n = children.length;
        for (; i < n; i++) {
          that.o(children[i]);
        }

        return;
      }

      ctx.save();
      ctx.globalAlpha = object.o;

      if (object instanceof Sprite) {
        if (object.tx instanceof RenderTexture) {
          ctx.setTransform(1, 0, 0, 1, 0, 0);
          ctx.drawImage(object.tx.s, -object._x, -object._y, width, height, 0, 0, width, height);
        } else {
          var frame = object.tx.f;
          ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
          ctx.drawImage(object.tx.s, frame.x, frame.y, frame.w, frame.h, -object.c.x * frame.w | 0, -object.c.y * frame.h | 0, frame.w, frame.h);
        }
      } else if (object instanceof Graphics) {
        ctx.setTransform(object.sx, 0, 0, object.sy, object._x, object._y);
        object._batch(ctx, object._color);
      }

      ctx.restore();
    }
  });
}

function DisplayObject() {
  var that = this;

  that.x = that.y = 0;
  that.o = 1;
  that.v = 1;
  that.sx = that.sy = 1;

  that._x = that._y = 0;
  that._o = 1;
  that._p = null;
}

__define(DisplayObject, {
  _t: function _transform() {
    var that = this;
    var parent = that._p;

    // Calculate effective position
    that._x = parent._x + that.x;
    that._y = parent._y + that.y;

    // Calculate effective alpha
    that._o = parent._o * that.o;
  }
});

function Graphics(batch, color) {
  var that = this;
  DisplayObject.call(that);
  that._batch = batch;
  that._color = color;
}

__extend(Graphics, DisplayObject);

function Sprite(textures, c, f) {
  var that = this;
  DisplayObject.call(that);
  that.tx = textures[f || 0];
  that.c = c || {x: 0, y: 0};
}

__extend(Sprite, DisplayObject);

function AnimatedSprite(textures, animations, defaultAnimation, c) {
  var that = this;
  Sprite.call(that, textures, c, 0);
  that.t = textures;
  that.a = animations;
  that.p(defaultAnimation);
}

__extend(AnimatedSprite, Sprite, {
  p: function play(anim) {
    var that = this;
    if (that.an != anim) {
      that.tx = that.t[that.a[that.an = anim].f[that.f = that.d = 0]];
    }
  },
  pt: function advancePlayTime(elapsed) {
    var that = this;
    if (that.an) {
      var frames = that.a[that.an].f;
      var duration = that.a[that.an].d;

      // Go to the next frame
      that.d += elapsed;
      while (that.d >= duration) {
        that.d -= duration;
        that.f = (that.f + 1) % frames.length;
        that.tx = that.t[frames[that.f]];
      }
    }
  }
});

function DisplayObjectContainer() {
  DisplayObject.call(this);
  this._c = [];
}

__extend(DisplayObjectContainer, DisplayObject, {
  a: function addChild(child) {
    if (child._p) {
      child._p.r(child);
    }

    this._c.push(child);
    child._p = this;
    return child;
  },
  r: function removeChild(child) {
    var children = this._c;
    var i = children.indexOf(child);
    if (i >= 0) {
      children.splice(i, 1);
      child._p = null;
    }
    return child;
  },
  _t: function _transform() {
    DisplayObject.prototype._t.call(this);

    var children = this._c;
    var i = children.length;

    while (i--) {
      children[i]._t();
    }
  }
});

function Stage() {
  DisplayObjectContainer.call(this);
}

__extend(Stage, DisplayObjectContainer, {
  _t: function _transform() {
    var children = this._c;
    var i = children.length;

    while (i--) {
      children[i]._t();
    }
  }
});

function RenderTexture(width, height) {
  var that = this;
  var renderer = new Renderer(width, height);

  that.s = renderer.c;
  that.frame = {
    x: 0,
    y: 0,
    w: width,
    h: height
  };

  __mixin(that, {
    r: function render(object, position) {
      if (position) {
        object._x = position.x;
        object._y = position.y;
      }

      renderer.o(object);
    }
  });
}
