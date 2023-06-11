$.Camera = function(vw, vh, ww, wh) {
  var _ = this;
  _.w = vw; // Viewport width
  _.h = vh; // Viewport height
  _.ww = ww; // World width
  _.wh = wh; // World height
  _.ofx = 0;
  _.ofy = 0;
  _.tg = 0;

  _.setTarget = function(t) {
    _.tg = t;
  };

  _.transCoord = function(o) {
    return {
      x: o.x - _.ofx,
      y: o.y - _.ofy,
      r: o.bounds.r - _.ofx,
      b: o.bounds.b - _.ofy
    };
  };

  _.inView = function(o) {
    var t = _.transCoord(o);
    return ((t.r >= 0 && t.r <= _.w) || (t.x >= 0 && t.x <= _.w)) &&
           ((t.b >= 0 && t.b <= _.h) || (t.y >= 0 && t.y <= _.h));
  };

  _.update = function() {
    if (!_.tg) return;
    // Update offset according the target
    var tx, ty = 0;
    var mw = _.w / 2;
    var mh = _.h / 2;
    if (_.ww <= _.w) {
      tx = _.tg.x;
    } else if (_.tg.x <= (mw)) {
      tx = _.tg.x;
    } else if ((_.tg.x > mw) && (_.tg.x + mw <= _.ww)) {
      tx = mw;
    } else if ((_.tg.x > mw) && (_.tg.x + mw > _.ww)) {
      tx = _.w - (_.ww - _.tg.x);
    }

    if (_.wh <= _.h) {
      tx = _.tg.y;
    } else if (_.tg.y <= (mh)) {
      ty = _.tg.y;
    } else if ((_.tg.y > mh) && (_.tg.y + mh <= _.wh)) {
      ty = mh;
    } else if ((_.tg.y > mh) && (_.tg.y + mh > _.wh)) {
      ty = _.h - (_.wh - _.tg.y);
    }
    _.ofx = _.tg.x - tx;
    _.ofy = _.tg.y - ty;
  };

  _.render = function(objs) {
    if (!objs) return;
    objs.forEach(function(o) {
      if (_.inView(o)) {
        var t = _.transCoord(o);
        o.render(t.x, t.y);
      }
    });
  };
};
