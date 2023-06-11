$.Item = function(x, y, t, c) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 16;
  _.h = 16;
  _.t = t; // Type
  _.c = c || false; // Consumible?
  _.ts = $.u.ts();
  _.bounds = {
    b: _.y + _.h,
    t: _.y,
    l: _.x,
    r: _.x + _.w
  };

  _.update = function(i) {
    if ($.collide.rect(_, $.hero)) {
      $.hero.gain(_);
      _.die(i);
    }
  };

  _.die = function(i) {
    $.items.splice(i, 1);
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.fillStyle = _.k;
    $.x.fr(tx, ty, _.w, _.h);
    $.x.sc(2, 2);
    $.x.d(_.ts, 0, 28, 8, 8, tx/2, ty/2, 8, 8);
    $.x.r();
  };
};

$.FireItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.F);
  _.k = $.C.o;
};

$.WaterItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.W);
  _.k = $.C.u;
};

$.EarthItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.E);
  _.k = $.C.e;
};

$.AirItem = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, $.PW.A);
  _.k = $.C.s;
};

$.Key = function(x, y) {
  var _ = this;
  $.Item.call(_, x, y, 'k', true);
  _.anim = {x:0, y:17};
  _.ts = $.u.ts();
  _.w = 6;
  _.h = 20;

  _.render = function(tx, ty) {
    $.x.s();
    //$.x.fillStyle = 'rgb(255,255,0)';
    //$.x.fr(tx, ty, _.w, _.h);
    $.x.sc(2, 2);
    $.x.d(_.ts, _.anim.x, _.anim.y, 5, 10, tx/2, ty/2, 5, 10);
    $.x.r();
  };
};

$.HealthPack = function(x, y) {
  $.Item.call(this, x, y, 'h', true);
  this.w = 10;

  this.render = function(tx, ty) {
    $.x.s();
    $.DrawBottle(tx, ty, $.HCOLOR);
    $.x.r();
  };
};

$.ManaPack = function(x, y) {
  $.Item.call(this, x, y, 'm', true);
  this.w = 10;

  this.render = function(tx, ty) {
    $.x.s();
    $.DrawBottle(tx, ty, $.MCOLOR);
    $.x.r();
  };
};

$.DrawBottle = function(tx, ty, color) {
    $.x.globalAlpha = 0.7;

    $.x.fillStyle = 'rgb(255,0,0)';
    $.x.fr(tx, ty, this.w, this.h);

    $.x.fillStyle = 'hsl(36,43%,59%)';
    $.x.fr(tx + 3, ty + 1, 3, 3);
    // Body of the bottle
    $.x.fillStyle = $.C.g;
    var p = [[2,7], [3,6], [3,6], [2,7], [1,8]];
    for (var i=2; i<=6; i++) {
      $.x.fr(tx + p[i - 2][0], ty + i, 1, 1);
      $.x.fr(tx + p[i - 2][1], ty + i, 1, 1);
    }
    $.x.fr(tx, ty + 7, 1, 11);
    $.x.fr(tx + 9, ty + 7, 1, 11);
    $.x.fr(tx, ty + 17, 10, 1);

    // Glow
    $.x.fillStyle = 'rgb(255,255,255)';
    $.x.fr(tx + 3, ty + 6, 1, 1);
    $.x.fr(tx + 2, ty + 7, 1, 1);

    // Liquid
    $.x.fillStyle = color;
    $.x.fr(tx + 7, ty + 7, 2, 1);
    $.x.fr(tx + 3, ty + 8, 6, 1);
    $.x.fr(tx + 1, ty + 9, 8, 8);
    $.x.fillStyle = 'hsl(208,50%,48%)';
    $.x.fr(tx + 6, ty + 10, 2, 2);
    $.x.fr(tx + 3, ty + 14, 1, 1);
  };
