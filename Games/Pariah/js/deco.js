$.Blood = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 14;
  _.h = 14;
  _.t = $.u.ts();

  _.bounds = {
    b: _.y + _.h,
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.sc(2, 2);
    $.x.globalAlpha = 0.5;
    $.x.d(_.t, 15, 41, 7, 7, tx/2, ty/2 + 4, 7, 7);
    $.x.r();
  };
};
