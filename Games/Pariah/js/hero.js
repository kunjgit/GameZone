$.Hero = function(_x, _y, o) {
  var _ = this;
  _.x = _x;
  _.y = _y;
  _.w = 16;
  _.h = 32;
  _.bounds = {};

  /* Max speed, max health, max mana, max cooldown, mana regen rate */
  _.maxS = 2.00;
  _.maxH = 100;
  _.maxM = 100;
  _.maxCD = 380;
  _.mRegen = 1.75; /* Per millisecond */
  _.ts = $.u.ts();

  _.s = 0.13; // Speed
  _.dx = 0;
  _.dy = 0;
  _.o = o || 'd'; // Orientation
  _.pows = []; // Available powers
  _.hurt = 0;
  _.he = _.maxH; // Health
  _.ma = _.maxM; // Mana
  _.shield = 0;
  _.ctime = $.n(); // Current time (for update)
  _.htime = $.n(); // Hurt time
  _.etimeH = 0; // Elapsed time for hurt
  _.itime = 1000; // Invincibility time (ms)
  _.blink = 0;
  _.bcount = 0; // Blinking count (to know if apply alpha during invincibility)
  _.cd = 0; // Cooldown
  _.rs = 0.15; // Resistance to attacks
  _.key = false;
  _.exit = false;
  _.dead = false;

  /* Animations */
  _.count = 0;
  _.frameDuration = 5;
  _.currFrame = 0;
  _.totalFrames = 2;
  _.anim = {
    'run': {
      'd': [{x:22, y:0},  {x:32, y:0} ],
      'u': [{x:22, y:16}, {x:32, y:16}],
      'r': [{x:22, y:32}, {x:32, y:32}],
      'l': [{x:22, y:48}, {x:32, y:48}],
    },
    'idle': {
      'd': {x:22, y:0},
      'u': {x:22, y:16},
      'r': {x:22, y:32},
      'l': {x:22, y:48}
    }
  };

  this.damage = function(e) {
    if (_.hurt || _.dead) return;
    var attack = floor(e.attack - (e.attack * $.u.rand(_.rs * 100, 0) / 100));
    _.he -= attack;
    _.hurt = 1;
    _.htime = $.n();
    _.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + attack, _.x + 7, _.y - 5, 'red'));
    if (_.he <= 0) {
      _.he = 0;
      _.dead = true;
      $.deco.push(new $.Blood(_.x, _.y));
      $.fadeOut.start(3000, '0,0,0');
    }
  };

  this.heal = function(v) {
    _.he += v;
    var m = (_.he > _.maxH) ? 'full' : '+' + v;
    _.he = $.u.range(_.he, 0, _.maxH);
    $.textPops.push(new $.TextPop(m, _.x + 7, _.y - 5, 'green'));
  };

  this.charge = function(v) {
    _.ma += v;
    var m = (_.ma > _.maxM) ? 'full' : '+' + v;
    _.ma = $.u.range(_.ma, 0, _.maxM);
    $.textPops.push(new $.TextPop(m, _.x + 7, _.y - 5, 'blue'));
  };

  this.gain = function(t) {
    if (t.c === false) {
      if (_.pows.indexOf(t.t.v) >= 0) return;
      if (t.t.v === $.PW.F.v) $.fow.radius = 6;
      _.pows.push(t.t.v);
      $.epow.push(t.t.v);
      $.u.i(['You now control the', t.t.n, 'element. Press', t.t.v, 'to use it'].join(' '));
    } else {
      if (t.t === 'k') {
        $.sco += 50;
        _.key = true;
        $.u.i('You got the key of this dungeon');
      } else if (t.t === 'h') {
        _.heal(20);
      } else if (t.t === 'm') {
        _.charge(20);
      }
    }
  };

  this.lose = function(e) {
    var i = _.pows.indexOf(e.v);
    _.pows.splice(i, 1);
  };

  this.update = function() {
    if (_.dead) return;
    _.exit = false;
    var now = $.n(),
        elapsed = now - _.ctime;
    _.ctime = now;

    if (_.hurt) {
      _.etimeH = $.n() - _.htime;

      var c = floor(_.etimeH / 100);
      if (c > _.bcount) {
        _.bcount = c;
        _.blink = !_.blink;
      }

      if (_.etimeH >= _.itime) {
        _.hurt = 0;
        _.bcount = 0;
        _.blink = 0;
      }
    }

    if ($.input.p(37)) {
      _.o = 'l';
      _.dx -= _.s;
    } else if ($.input.p(39)) {
      _.o = 'r';
      _.dx += _.s;
    }

    if ($.input.p(38)) {
      _.o = 'u';
      _.dy -= _.s;
    } else if ($.input.p(40)) {
      _.o = 'd';
      _.dy += _.s;
    }

    _.dx = $.u.range(_.dx, -_.maxS, _.maxS);
    _.dy = $.u.range(_.dy, -_.maxS, _.maxS);

    if (!$.input.p(37) && !$.input.p(39)) {
      _.dx = 0;
    }
    if (!$.input.p(38) && !$.input.p(40)) {
      _.dy = 0;
    }

    if (_.cd > 0) {
      _.cd -= elapsed;
      if (_.cd <= 0) {
        _.cd = 0;
      }
    }

    _.x += _.dx;
    _.y += _.dy;

    if ((_.x + _.w) > $.ww)
      _.x = $.ww - _.w;
    if ((_.y + _.h) > $.wh)
      _.y = $.wh - _.h;
    if (_.x < 0)
      _.x = 0;
    if (_.y < 0)
      _.y = 0;

    _.bounds = {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };

    /* Regeneration */
    if (_.shield) {
      _.ma -= elapsed * $.PW.W.m / 1000;
    } else {
      _.ma += elapsed * _.mRegen / 1000;
    }
    _.ma = $.u.range(_.ma, 0, _.maxM);
    _.he = $.u.range(_.he, 0, _.maxH);

    /* Summon elements */
    var cp = null;
    if ($.input.p(49) && _.pows.indexOf($.PW.F.v) >= 0) {
      cp = $.PW.F;
    } else if ($.input.p(50) && _.pows.indexOf($.PW.E.v) >= 0) {
      cp = $.PW.E;
    } else if ($.input.p(51) && _.pows.indexOf($.PW.W.v) >= 0) {
      cp = $.PW.W;
    } else if ($.input.p(52) && _.pows.indexOf($.PW.A.v) >= 0) {
      cp = $.PW.A;
    }
    if (_.cd === 0 && cp) {
      if (_.ma >= cp.m && !(cp.v === $.PW.W.v && _.shield)) {
        _.ma -= cp.m;
        _.cd = _.maxCD;
        if (cp.v === $.PW.F.v) {
          $.powers.push(new $.Fire(_.x, _.y, _.o));
        } else if (cp.v === $.PW.E.v) {
          $.powers.push(new $.Earth(_.x, _.y, _.o, 1));
        } else if (cp.v === $.PW.W.v) {
          [0, 120, 240].forEach(function(a) {
            $.powers.push(new $.Water(_.x, _.y, a));
          });
          _.shield = 1;
        } else if (cp.v === $.PW.A.v) {
          $.powers.push(new $.Air(_.x, _.y, _.o));
        }
      } else if (_.ma < cp.m) {
        $.u.i('You do not have enough mana to cast the ' + cp.n + ' element');
      }
    }

    // Check for collisions with walls
    $.walls.forEach(function(w) {
      if ($.collide.rect(_, w)) {
        if ($.collide.isTop(_, w)){
          _.y = w.bounds.t - _.h;
        } else if ($.collide.isBottom(_, w)) {
          _.y = w.bounds.b;
        } else if ($.collide.isLeft(_, w)) {
          _.x = w.bounds.l - _.w;
        } else if ($.collide.isRight(_, w)) {
          _.x = w.bounds.r;
        }
      }
    });

    // Check collision with enemies
    $.enemies.forEach(function(e) {
      if ($.collide.rect(_, e)) {
        _.damage(e);
      }
    });

    // Exit the level
    if ($.exit) {
      if ($.collide.rect(_, $.exit[0])) {
        _.exit = true;
      }
    }

    /* Calculate animation frame */
    _.count = (_.count + 1) % _.frameDuration;
    if (_.count === (_.frameDuration - 1)) {
      _.currFrame = (_.currFrame + 1) % _.totalFrames;
    }
  };

  this.render = function(tx, ty) {
    if (_.dead) return;
    $.x.s();
    $.x.sc(2, 2);
    var anim = (_.dx === 0 && _.dy === 0) ? _.anim.idle[_.o] : _.anim.run[_.o][_.currFrame];
    if (_.blink)
      $.x.globalAlpha = 0.3;
    $.x.d(_.ts, anim.x, anim.y, 8, 16, tx/2, ty/2, 8, 16);
    $.x.r();
  };
};
