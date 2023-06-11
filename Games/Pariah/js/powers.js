$.Power = function(x, y, w, h, o, t) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = w;
  _.h = h;
  _.t = t;
  _.u = 0;

  /* Determine direction */
  if (o === 'l') {
    _.dirX = -1;
    _.dirY = 0;
  } else if (o === 'r') {
    _.dirX = 1;
    _.dirY = 0;
  } else if (o === 'd') {
    _.dirX = 0;
    _.dirY = 1;
  } else if (o === 'u') {
    _.dirX = 0;
    _.dirY = -1;
  }

  _.getb = function() {
    return {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };
  };

  _.chk = function(i) {
    _.bounds = _.getb();

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e) && !_.u) {
        var g = e.damage(_);
        if (g !== null && g !== 0 && _.t == $.PW.W.v) $.hero.heal(g);
        if (_.t == $.PW.F.v) _.die(i);
      }
    });

    // Check wall collisions
    $.walls.forEach(function(w) {
      if ($.collide.rect(_, w) && (_.t == $.PW.F.v || _.t == $.PW.A.v)) _.die(i);
    });

    // Check world boundaries
    if ((_.x + _.w) > $.ww || _.x < 0)
      _.die(i);
    if ((_.y + _.h) > $.wh || _.y < 0)
      _.die(i);
  };

  _.die = function(i) {
    _.u = 1;
    $.powers.splice(i, 1);
    if (_.t == $.PW.W.v) $.hero.shield = false;
  };
};

$.Fire = function(x, y, o) {
  var _ = this;
  $.Power.call(_, x, y, 16, 16, o, $.PW.F.v);
  if (o === 'u' || o === 'd') {
    if ($.lvl.isWall(floor(x / 32) - 1, floor(y / 32))) {
      _.x += 4;
    } else if ($.lvl.isWall(floor(x / 32) + 1, floor(y / 32))) {
      _.x -= 3;
    } else {
      _.x += 1;
    }
  } else if (o === 'r' || o === 'l') {
    _.y += 4;
  }

  _.a = 0.55; /* Acceleration */
  _.maxS = 6.00; /* Max speed */
  _.dx = _.dy = 0;
  _.bounds = _.getb();
  _.anim = {x:18, y:17};
  _.ts = $.u.ts();
  _.angle = 0;
  _.attack = $.u.rand(8, 12);

  _.update = function(i) {
    _.angle = (_.angle + 15) % 360;
    _.dx += _.a * _.dirX;
    _.dy += _.a * _.dirY;
    _.dx = $.u.range(_.dx, -_.maxS, _.maxS);
    _.dy = $.u.range(_.dy, -_.maxS, _.maxS);

    _.x += _.dx;
    _.y += _.dy;

    _.chk(i);
  };

  _.render = function(tx, ty) {
    $.x.s();
    //$.x.translate(tx + (_.w/2), ty + (_.h/2));
    //$.x.rotate(_.angle / 180 * Math.PI);
    $.x.fillStyle = $.C.o;
    //$.x.fr(tx, ty, 16, 16);

    $.x.beginPath();
    $.x.arc(tx + 8, ty + 8, 8, 0, (2 * Math.PI), false);
    $.x.fill();
    $.x.sc(2, 2);
    $.x.d(_.ts, 0, 28, 8, 8, tx/2, ty/2, 8, 8);
    $.x.r();
  };
};


$.Earth = function(x, y, o, n) {
  var _ = this,
      d = 30;
  $.Power.call(_, x, y, 15, 25, o, $.PW.E.v);
  if (o === 'u') {
    _.y -= d;
    if (n === 1) _.x += 2;
  } else if (o === 'r') {
    _.x += d;
    if (n === 1) _.y += 6;
  } else if (o === 'd') {
    _.y += d;
    if (n === 1) _.x += 2;
  } else if (o === 'l') {
    _.x -= d;
    if (n === 1) _.y += 6;
  }
  _.n = n;
  _.o = o;
  _.bounds = _.getb();
  _.ltime = 400; // Lifetime
  _.stime = 350;
  _.ctime = $.n(); // Creation time
  _.attack = 0;
  _.anim = {x:5, y:17};
  _.ts = $.u.ts();
  _.summon = 0;

  _.update = function(i) {
    var e = $.n() - _.ctime;

    if (e > _.ltime) _.die(i);
    if (e > _.stime && !_.summon && _.n < 3) {
      _.summon = 1;
      $.powers.push(new $.Earth(_.x, _.y, _.o, _.n + 1));
    }

    _.chk(i);
  };

  _.render = function(tx, ty) {
    $.x.s();
    // Test rect
    //$.x.fillStyle = 'hsla(28, 65%, 42%, 1)';
    //$.x.fr(tx, ty, _.w, _.h);
    $.x.sc(3, 3);
    $.x.d(_.ts, _.anim.x, _.anim.y, 5, 10, tx/3, ty/3, 5, 10);
    $.x.r();
  };
};


$.Water = function(x ,y, a) {
  var _ = this;
  $.Power.call(_, x, y, 20, 20, null, $.PW.W.v);

  _.vw = 2 * Math.PI;
  _.a = a * Math.PI / 180;
  _.d = 35;
  _.r = 10; /* Radius */
  _.ltime = 6000; /* Lifetime in milliseconds */
  _.ctime = $.n();
  _.bounds = _.getb();
  _.attack = $.u.rand(3, 6);

  _.update = function(i) {
    var e = $.n() - _.ctime;
    _.ctime = $.n();
    _.ltime -= e;

    if (_.ltime <= 0) _.die(i);

    _.cx = $.hero.x + ($.hero.w / 2);
    _.cy = $.hero.y + ($.hero.h / 2);
    _.a += _.vw * e / 1000;
    _.x = _.cx + (_.d * cos(_.a));
    _.y = _.cy + (_.d * sin(_.a));

    _.chk(i);
  };

  _.render = function(tx, ty) {
    $.x.s();
    // Test arc
    //$.x.fillStyle = 'rgba(0, 115, 255, 0.3)';
    //$.x.beginPath();
    //$.x.arc(tx, ty, _.r, 0, (2 * Math.PI), false);
    //$.x.fill();
    var x_ = tx - 11,
        y_ = ty - 11;
    $.x.fillStyle = 'hsla(190,90%,76%,0.59)';
    $.x.fr(x_ + 7, y_ + 7, 8, 8);
    $.x.fillStyle = 'hsl(190,90%,76%)';
    $.x.fr(x_ + 4, y_ + 10, 14, 2);
    $.x.fr(x_ + 10, y_ + 4, 2, 14);
    $.x.fr(x_ + 10, y_, 2, 2);
    $.x.fr(x_ + 3, y_ + 3, 2, 2);
    $.x.fr(x_ + 17, y_ + 3, 2, 2);
    $.x.fr(x_, y_ + 10, 2, 2);
    $.x.fr(x_ + 20, y_ + 10, 2, 2);
    $.x.fr(x_ + 3, y_ + 17, 2, 2);
    $.x.fr(x_ + 17, y_ + 17, 2, 2);
    $.x.fr(x_ + 10, y_ + 20, 2, 2);
    $.x.r();
  };
};

$.Air = function(x, y, o) {
  var _ = this;
  $.Power.call(_, x, y, 12, 24, o, $.PW.A.v);

  if (o === 'u' || o === 'd')
    _.x += 6;

  _.a = 0.65; /* Acceleration */
  _.maxS = 7.00; /* Max speed */
  _.dx = _.dy = 0;
  _.bounds = _.getb();
  _.attack = $.u.rand(7, 10);
  _.anim = {x:11, y:17};
  _.ts = $.u.ts();
  _.blink = 0;
  _.bcount = 0;
  _.ctime = $.n();

  _.update = function(i) {
    _.dx += _.a * _.dirX;
    _.dy += _.a * _.dirY;
    _.dx = $.u.range(_.dx, -_.maxS, _.maxS);
    _.dy = $.u.range(_.dy, -_.maxS, _.maxS);

    _.x += _.dx;
    _.y += _.dy;

    var e = $.n() - _.ctime,
        c = floor(e / 100);
    if (c > _.bcount) {
      _.bcount = c;
      _.blink = !_.blink;
    }

    _.chk(i);
  };

  _.render = function(tx, ty) {
    $.x.s();
    $.x.fillStyle = 'hsla(207,100%,83%,0.1)';
    $.x.fr(tx, ty, _.w, _.h);
    $.x.globalAlpha = 0.7;
    if (_.blink) {
      $.x.translate(tx + (_.w/2) - 6, ty + _.h/2);
      $.x.sc(-2, 2);
    } else {
      $.x.translate(tx + (_.w/2) + 6, ty + _.h/2);
      $.x.sc(2, 2);
    }
    $.x.d(_.ts, _.anim.x, _.anim.y, _.w/2, _.h/2, -_.w/4, -_.h/4, 6, 12);
    $.x.r();
  };
};
