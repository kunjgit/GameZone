$.Zombie = function(x, y) {
  var _ = this;
  _.x = x;
  _.y = y;
  _.w = 16;
  _.h = 32;
  _.he = 35;
  _.maxH = 35;
  _.miss = 0.05;
  _.ptime = 4000; // Planted time
  _.itime = 300; // Invincibility time
  _.ts = $.u.ts();

  _.dx = 0;
  _.dy = 0;
  _.o = 'd';
  _.hurt = false;
  _.planted = 0;
  _.blink = 0;
  _.ctimeH = 0; // Current time for hurt
  _.ctimeP = 0; // Current time for planted
  _.etimeH = 0; // Elapsed time for hurt
  _.etimeP = 0; // Elapsed time for planted
  _.bcount = 0;
  _.minD = 300; // Min distance to start chasing hero
  _.hasRoute = 0; // Has a valid route returned by AI
  _.route = []; // Points of route
  _.nextPt = [];
  _.lastPt = [];
  _.speed = 0.7;
  _.attack = $.u.rand(40, 50);

  /* Animations */
  _.count = 0;
  _.frameDuration = 10;
  _.currFrame = 0;
  _.totalFrames = 2;
  _.anim = {
    'run': {
      'd': [{x:42, y:0},  {x:52, y:0} ],
      'u': [{x:42, y:16}, {x:52, y:16}],
      'r': [{x:42, y:32}, {x:52, y:32}],
      'l': [{x:42, y:48}, {x:52, y:48}],
    },
    'idle': {
      'd': {x:42, y:0},
      'u': {x:42, y:16},
      'r': {x:42, y:32},
      'l': {x:42, y:48}
    }
  };

  _.getb = function() {
    return {
      b: _.y + _.h,
      t: _.y,
      l: _.x,
      r: _.x + _.w
    };
  };

  _.bounds = _.getb();

  _.damage = function(p) {
    if (_.hurt) return null;

    if (p.t === $.PW.E.v) {
      if (!_.planted) {
        _.planted = true;
        _.ctimeP = $.n();
        _.etimeP = 0;
        $.textPops.push(new $.TextPop('bounded', _.x + 2, _.y - 5, $.C.w));
      }
      return;
    }

    if ($.u.canMiss(_.miss)) {
      $.textPops.push(new $.TextPop('miss', _.x, _.y - 5, $.C.w));
      return 0;
    }

    var atk = p.attack;
    _.he -= atk;
    _.hurt = true;
    _.ctimeH = $.n();
    _.etimeH = 0;
    $.textPops.push(new $.TextPop('-' + atk, _.x + 7, _.y - 5, $.C.yw));
    return atk;
  };


  _.die = function(i) {
    $.enemies.splice(i, 1);
    // If _ is the last enemy, drop the key, otherwise drop
    // something according probability
    if ($.enemies.length === 0) {
      $.items.push(new $.Key(_.x + (_.w)/2, _.y + 4));
    } else {
      if ($.u.rand(0, 10) > 6) {
        var items = [$.HealthPack, $.ManaPack],
            k = $.u.rand(0, 2);
        $.items.push(new items[k](_.x + (_.w)/2, _.y + 4));
      }
    }

    $.deco.push(new $.Blood(_.x, _.y));
    $.sco += _.attack * 10;
  };

  _.update = function(i) {
    _.bounds = _.getb();
    _.dx = 0;
    _.dy = 0;

    // Planting
    if (_.planted) {
      _.etimeP = $.n() - _.ctimeP;

      if (_.etimeP >= _.ptime)
        _.planted = 0;
    }

    // Blinking
    if (_.hurt) {
      _.etimeH = $.n() - _.ctimeH;

      var c = floor(_.etimeH / 100);
      if (c > _.bcount) {
        _.bcount = c;
        _.blink = !_.blink;
      }

      if (_.etimeH >= _.itime) {
        _.hurt = false;
        _.bcount = 0;
        _.blink = 0;
      }
    }

    if (_.he <= 0)
      _.die(i);



    if(!_.hasRoute) {
       var d = $.ai.getd({x:_.x, y:_.y}, {x:$.hero.x, y:$.hero.y});
       if((d <= _.minD) && (round(d) > 40)) {
          _.route = $.ai.cPath([floor(_.x / 32), floor(_.y / 32)], [floor($.hero.x / 32), floor($.hero.y / 32)]);
          if(_.route.length > 0) {
            _.hasRoute = 1;
            _.lastPt = _.route[_.route.length - 1];
            _.nextPt = _.route.shift();
          }
       }
    } else {
      if((floor(_.x / 32) == _.nextPt[0]) && (floor(_.y / 32) == _.nextPt[1])) {
        if(_.route.length > 0) {
          _.nextPt = _.route.shift();
        } else {
          _.hasRoute = 0;
          _.route = [];
          _.nextPt = [];
          _.lastPt = [];
        }
      } else {
        if ((floor(_.x / 32) < _.nextPt[0]) && !_.planted) {
          _.dx = _.speed;
          _.o = 'r';
        } else if((floor(_.x / 32) > _.nextPt[0]) && !_.planted) {
          _.dx = -_.speed;
          _.o = 'l';
        } 

        if((floor(_.y / 32) < _.nextPt[1]) && !_.planted) {
          _.dy = _.speed;
          _.o = 'd';
        } else if((floor(_.y / 32) > _.nextPt[1]) && !_.planted) {
          _.dy = -_.speed;
          _.o = 'u';
        }


        if((floor($.hero.x / 32) != _.lastPt[0]) || (floor($.hero.y / 32) != _.lastPt[1])) {
          _.hasRoute = 0;
          _.route = [];
          _.nextPt = [];
          _.lastPt = [];
        }
      }
    }
    if(_.route.length == 0 && d < 40 && !_.planted) {
      if(_.x > $.hero.x) {
        _.dx = -_.speed;
        _.o = 'l';
      } else if(_.x < $.hero.x) {
        _.dx = _.speed;
        _.o = 'r';
      }
      if(_.y > $.hero.y) {
        _.dy = -_.speed;
        _.o = 'd';
      } else if(_.y < $.hero.y) {
        _.dy = _.speed;
        _.o = 'u';
      } 
    }
    
    _.x += _.dx;
    _.y += _.dy;

    // Check for collisions with walls
    $.walls.forEach(function(w) {
      if ($.collide.rect(_, w)) {
        if ($.collide.isTop(_, w)){
          _.y = w.bounds.t - _.h -1;
        } else if ($.collide.isBottom(_, w)) {
          _.y = w.bounds.b + 1;
        } else if ($.collide.isLeft(_, w)) {
          _.x = w.bounds.l - _.w - 1;
        } else if ($.collide.isRight(_, w)) {
          _.x = w.bounds.r + 1;
        }
      }
    });

    /* Calculate animation frame */
    _.count = (_.count + 1) % _.frameDuration;
    if (_.count === (_.frameDuration - 1)) {
      _.currFrame = (_.currFrame + 1) % _.totalFrames;
    }

  };

  _.render = function(tx, ty) {
    var anim = (_.dx === 0 && _.dy === 0) ? _.anim.idle[_.o] : _.anim.run[_.o][_.currFrame];

    $.x.s();
    $.x.sc(2, 2);
    if (_.blink)
      $.x.globalAlpha = 0.3;
    $.x.d(_.ts, anim.x, anim.y, 8, 16, tx/2, ty/2, 8, 16);
    $.x.r();

    // Render health bar
    $.x.s();
    $.x.fillStyle = 'rgb(0,0,0)';
    $.x.fr(tx - 8, ty - 10, 32, 5);
    $.x.fillStyle = 'rgb(255,0,0)';
    $.x.fr(tx - 8, ty - 10, (_.he * 32) / _.maxH, 5);
    $.x.r();
  };
};
