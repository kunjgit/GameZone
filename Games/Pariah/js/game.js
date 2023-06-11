$.init = function() {
  $.input = $.Input;
  $.input.bind([13, 65, 37, 38, 39, 40, 49, 50, 51, 52]);
  $.cfg = $.u.byId('fg');
  $.cv1 = document.createElement("canvas");
  $.cv2 = document.createElement("canvas");
  $.x = $.cfg.getContext('2d');
  $.x.s = $.x.save;
  $.x.r = $.x.restore;
  $.x.fr = $.x.fillRect;
  $.x.ft = $.x.fillText;
  $.x.d = $.x.drawImage;
  $.x.sc = $.x.scale;
  $.ctx1 = $.cv1.getContext('2d');
  $.ctx2 = $.cv2.getContext('2d');
  $.vw = $.cfg.width = $.cv1.width = $.cv2.width = 640;
  $.vh = $.cfg.height = $.cv1.height = $.cv2.height = 480;
  $.s = new $.Scene();
  $.animId = 0;
  $.lv = 1;
  $.he = 0;
  $.ma = 0;
  $.sco = 0; // Score
  $.ended = 0;
  $.epow = []; // Earned powers
  $.fadeIn = new $.FadeIn();
  $.fadeOut = new $.FadeOut();
  // Array of in-game messages
  // t: Text of message, s: showed
  $.msg = {
    'nokey': {
      t: 'You need the key to exit the dungeon',
      s: 0,
    },
    'noelem': {
      t: 'Find the element before leaving',
      s: 0
    }
  };
  $.s.l($.welcome, $.welcomeLoop);
};

$.welcome = function() {
  $.lv = 1;
  $.sco = 0;
  $.epow = [];
  $.u.v('s', 1);
};

$.intro = function() {
  $.u.v('i', 1);
  $.u.show('i0');
};

$.gameover = function() {
  $.lv = 1;
  $.sco = 0;
  $.epow = [];
  $.fadeOut.quit = true;
  $.u.v('g', 1);
};

$.end = function() {
  $.lv = 1;
  $.ended = 0;
  $.epow = [];
  $.fadeOut.quit = true;
  $.u.show('e0');
  $.u.v('e', 1);
};

$.welcomeLoop = function() {
  if ($.input.r(13)) return $.s.l($.intro, $.introLoop);
  $.s.u();

  if ($.s.e > 400) {
    $.s.t = $.n();
    $.s.e = 0;
    if ($.s.s === 0) {
      $.s.s = 1;
      $.u.v('s1', 0);
    } else {
      $.s.s = 0;
      $.u.v('s1', 1);
    }
  }
  raf($.welcomeLoop);
};

$.introLoop = function() {
  if ($.input.r(13)) return $.start();
  $.s.u();

  if ($.s.e >= 1800 && !$.s.f && $.s.s < 5) {
    $.s.f = 1;
    $.u.fadeOut('i' + $.s.s, function() {
      $.s.n();
      $.u.show('i' + $.s.s);
    });
  } else if ($.s.e >= 5000 && $.s.s === 5) {
    $.u.hide('i5');
    return $.start();
  }

  raf($.introLoop);
};

$.gameOverLoop = function() {
  if ($.input.r(13)) return $.start();
  $.s.u();
  raf($.gameOverLoop);
};

$.endLoop = function() {
  if ($.input.r(13) && $.s.e > 5000) return $.s.l($.welcome, $.welcomeLoop);
  $.s.u();

  if ($.s.e >= 2000 && !$.s.f && $.s.s < 2) {
    $.s.f = 1;
    $.u.fadeOut('e' + $.s.s, function() {
      $.s.n();
      $.u.show('e' + $.s.s);
    });
  } else if ($.s.e >= 5000 && !$.s.f) {
    $.s.f = 1;
    $.u.show('ei');
  }

  raf($.endLoop);
};

$.start = function() {
  $.s.r(1);

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.textPops = [];
  $.deco = [];
  $.powers = [];
  $.ai = new $.Ai();
  $.sws = [];

  // Load level
  var lf = 20,
      en = 0,
      a = 0,
      b = 0;
    a = $.u.rand(15 + (6 * $.lv), 20 + (6 * $.lv));
    b = $.u.rand(15 + (6 * $.lv), 20 + (6 * $.lv));
    //lf = 10 + (7 * $.lv);
  if ($.lv === 1) {
    $.u.i('Use the arrow keys to move and escape the dungeon', 4500);
  } else {
    en = $.lv * 3;
  }
  $.ww = a * 32;
  $.wh = b * 32;
  // Array of items to be placed on each level
  var i = [0, [$.Key, $.FireItem], [$.EarthItem], [$.WaterItem], [$.AirItem], []];
  $.lvl = new $.Level($.lv, $.ww / 32, $.wh / 32, en, i[$.lv], lf);

  $.fow = new $.FoW(3);
  $.cam = new $.Camera(640, 480, $.ww, $.wh);
  $.cam.setTarget($.hero);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  if ($.lv > 1) {
    $.fow.radius = 6;
    $.hero.he = $.he;
    $.hero.ma = $.ma;
  }
  for (i in $.epow) $.hero.pows[i] = $.epow[i];

  // Load the walls
  for (var v=0; v<$.lvl.h; v++) {
    for (i=0; i<$.lvl.w; i++) {
      if ($.lvl.isWall(i, v)) {
        $.walls.push(new $.Wall(i*32, v*32, 0));
      }
    }
  }

  $.fadeIn.start(1000);
  $.animId = raf($.loop);
};

$.finalRoom = function() {
  $.s.r(1);

  $.walls = [];
  $.enemies = [];
  $.items = [];
  $.exit = [];
  $.deco = [];
  $.textPops = [];
  $.powers = [];
  $.sws = [];

  // Load custom level
  $.ww = 640;
  $.wh = 480;
  // Make map
  var map = [];
  for (var i=0; i<$.ww/32; i++) {
    map[i] = [];
    for (var j=0; j<$.wh/32; j++){
      if (j === 0 || i === 0 || j === ($.wh / 32 - 1) || i === ($.ww / 32 - 1))
        map[i][j] = '#';
      else
        map[i][j] = '.';
    }
  }
  lvl = function(){
    var _ = this;
    _.w = $.ww / 32;
    _.h = $.wh / 32;
    _.map = map;
    _.isWall = function(x, y) {
      return _.map[x][y] === '#';
    };
  };
  $.lvl = new lvl();

  $.hero = new $.Hero(310, 360, 'u');
  $.exit = 0;
  $.fow = new $.FoW(8);
  $.cam = new $.Camera(640, 480, $.ww, $.wh);
  $.collide = new $.Collide();
  $.hud = new $.Hud();

  $.hero.pows = $.epow;

  // Load the walls
  for (var v=0; v<$.lvl.h; v++) {
    for (i=0; i<$.lvl.w; i++) {
      if ($.lvl.isWall(i, v)) {
        var hf = ($.lvl.isWall(i, v + 1)) ? 0 : 1;
        $.walls.push(new $.Wall(i*32, v*32, hf));
      }
    }
  }
  $.sws.push(new $.FireSw(112, 256));
  $.sws.push(new $.EarthSw(240, 256));
  $.sws.push(new $.WaterSw(368, 256));
  $.sws.push(new $.AirSw(496, 256));

  $.fadeIn.start(1000);
  $.u.i('Step on the altars and offer each element to start the ritual', 4500);
  $.animId = raf($.loop);
};

$.nextLevel = function() {
  caf($.animId);
  $.lv += 1;
  $.sco += 100;
  if ($.lv < 5) {
    $.he = $.hero.he;
    $.ma = $.hero.ma;
    $.start();
  } else {
    $.finalRoom();
  }
};

$.cleanMsg = function() {
  $.msg.nokey.s = 0;
  $.msg.noelem.s = 0;
};

$.clr = function(c) {
  c = c || $.C.b;
  $.x.clearRect(0, 0, $.vw, $.vh);
  $.x.fillStyle = c;
  $.x.fr(0, 0, $.vw, $.vh);
};

$.loop = function() {
  $.clr($.C.f);

  // Update only when not fading
  if ($.fadeIn.done && $.fadeOut.done && !$.ended) {
    $.hero.update();
    $.powers.forEach(function(p, i) {
      p.update(i);
    });
    $.enemies.forEach(function(e, i) {
      e.update(i);
    });
    $.textPops.forEach(function(t, i) {
      t.update(i);
    });
    $.items.forEach(function(t, i) {
      t.update(i);
    });
    $.sws.forEach(function(t, i) {
      t.update(i);
    });
  }

  var fow = $.fow.update();
  $.cam.update(); // Always the last to be updated

  // Check is conditions are ready for the next level
  if ($.hero.exit) {
    if ($.hero.key && $.hero.pows.indexOf($.lv) >= 0) {
      return $.nextLevel();
    } else {
      var k = 0;
      if (!$.hero.key) {
        k = 'nokey';
      } else if ($.hero.pows.indexOf($.lv) < 0) {
        k = 'noelem';
      }
      if (!$.msg[k].s) {
        $.msg[k].s = 1;
        $.u.i($.msg[k].t);
      }
    }
  }

  // Check conditions to win the game
  if ($.ended && $.fadeOut.done) {
    return $.s.l($.end, $.endLoop);
  }

  // Check if hero is dead
  if ($.hero.dead && $.fadeOut.done) {
    return $.s.l($.gameover, $.gameOverLoop);
  }

  /* Render */
  $.cam.render($.walls);
  $.cam.render($.exit);
  $.cam.render($.deco);
  $.cam.render($.enemies);
  $.cam.render($.items);
  $.cam.render($.sws);
  $.cam.render([$.hero]);
  $.cam.render($.powers);
  if ($.lv < 5)
    $.fow.render();
  $.cam.render($.textPops);
  $.hud.render();

  $.fadeIn.render();
  $.fadeOut.render();

  raf($.loop);
};

/* Start game on load */
window.addEventListener('load', function() {
  $.init();
});
