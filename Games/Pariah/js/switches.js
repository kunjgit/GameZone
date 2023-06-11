$.Sw= function(x, y, t) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 32;
  _.h = 32;
  _.t = t; // Type
  _.filled = 0;
  _.ts = $.u.ts();
  _.bounds = {
    b: _.y + _.h,
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.update = function(i) {
    if (!_.filled) {
      if ($.collide.rect(_, $.hero)) {
        $.hero.lose(_.t);
        _.fill();
        var s = $.sws;
        if (s[0].filled && s[1].filled && s[2].filled && s[3].filled && s.length === 4) {
          $.sws.push(new $.LifeSw(304,100));
          $.u.i('You can only create life from life, now go and make the ultimate offer', 7000);
        }
      }
    }
  };

  _.fill = function() {
    _.filled = 1;
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.fillStyle = $.C.gd;
    $.x.fr(tx, ty, 32, 32);
    if (_.filled)
      $.x.fillStyle = $.C.gy;
    else
      $.x.fillStyle = _.k;
    $.x.fr(tx + 8, ty + 8, 16, 16);
    $.x.r();
  };
};

$.FireSw = function(x, y) {
  var _ = this;
  $.Sw.call(_, x, y, $.PW.F);
  _.k = $.C.o;
};

$.EarthSw = function(x, y) {
  var _ = this;
  $.Sw.call(_, x, y, $.PW.E);
  _.k = $.C.e;
};

$.WaterSw = function(x, y) {
  var _ = this;
  $.Sw.call(_, x, y, $.PW.W);
  _.k = $.C.u;
};

$.AirSw = function(x, y) {
  var _ = this;
  $.Sw.call(_, x, y, $.PW.A);
  _.k = $.C.s;
};

$.LifeSw = function(x, y) {
  var _ = this;
  $.Sw.call(_, x, y);
  _.k = $.C.rd;
  _.bounds = {
    b: _.y + 8,
    t: _.y,
    l: _.x + 12,
    r: _.x  + _.w - 12
  };

  _.update = function(i) {
    if (!_.filled) {
      if ($.collide.rect(_, $.hero)) {
        _.filled = 1;
        $.ended = 1;
        $.fadeOut.start(4000, '255,255,255');
      }
    }
  };
};
