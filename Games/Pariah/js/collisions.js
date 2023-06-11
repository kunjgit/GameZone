$.Collide = function() {
  var _ = this;
  _.rect = function(o1, o2) {
    if (Object.keys(o1.bounds).length === 0 || Object.keys(o2.bounds).length === 0) return false;
    return !((o1.bounds.b < o2.bounds.t) ||
        (o1.bounds.t > o2.bounds.b) ||
        (o1.bounds.l > o2.bounds.r) ||
        (o1.bounds.r < o2.bounds.l));
  };

  _.faces = function(o1, o2) {
    return {
      top: abs(o1.bounds.b - o2.bounds.t),
      bottom: abs(o1.bounds.t - o2.bounds.b),
      left: abs(o1.bounds.r - o2.bounds.l),
      right: abs(o1.bounds.l - o2.bounds.r)
    };
  };

  _.isTop = function(o1, o2) {
    var f = _.faces(o1, o2);
    return (f.top < f.bottom && f.top < f.left && f.top < f.right);
  };

  _.isBottom = function(o1, o2) {
    var f = _.faces(o1, o2);
    return (f.bottom < f.top && f.bottom < f.left && f.bottom < f.right);
  };

  _.isLeft = function(o1, o2) {
    var f = _.faces(o1, o2);
    return (f.left < f.bottom && f.left < f.top && f.left < f.right);
  };

  _.isRight = function(o1, o2) {
    var f = _.faces(o1, o2);
    return (f.right < f.bottom && f.right < f.left && f.right < f.top);
  };
};
