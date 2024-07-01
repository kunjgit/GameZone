(function () {
  var a = !1,
    b = /xyz/.test(function () {
      xyz;
    })
      ? /\b_super\b/
      : /.*/;
  this.Class = function () {};
  Class.extend = function (c) {
    function d() {
      !a && this.init && this.init.apply(this, arguments);
    }
    var e = this.prototype;
    a = !0;
    var g = new this();
    a = !1;
    for (var f in c)
      g[f] =
        "function" == typeof c[f] && "function" == typeof e[f] && b.test(c[f])
          ? (function (a, b) {
              return function () {
                var c = this._super;
                this._super = e[a];
                var d = b.apply(this, arguments);
                this._super = c;
                return d;
              };
            })(f, c[f])
          : c[f];
    d.prototype = g;
    d.prototype.constructor = d;
    d.extend = arguments.callee;
    return d;
  };
})();
("use strict");
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (a) {
      window.setTimeout(a, 1e3 / 60);
    }
  );
})();
var SF = {
  game: null,
  W: 480,
  H: 320,
  scale: 1,
  entities: [],
  distance: 0,
  score: 0,
  hiScore: localStorage.hiScore || 1024,
  newHiScore: !1,
  RATIO: null,
  currentWidth: null,
  currentHeight: null,
  canvas: null,
  ctx: null,
  ua: null,
  android: null,
  ios: null,
  lastTick: 0,
  tick: 0,
  time: 0,
  fps: 0,
  state: "intro",
  action: "Tap",
  fadeText: 0,
  font: "Rammetto One, Verdana",
  gradients: {},
  debug: !1,
  pause: !1,
  tapped: !1,
  m: { x: null, y: null },
  offset: { top: 0, left: 0 },
  preload: { img: ["b.png", "t.png"], loaded: 0 },
  plays: 0,
  init: function () {
    var a, b;
    SF.RATIO = SF.W / SF.H;
    SF.currentWidth = SF.W;
    SF.currentHeight = SF.H;
    SF.canvas = document.getElementsByTagName("canvas")[0];
    SF.canvas.width = SF.W;
    SF.canvas.height = SF.H;
    SF.ctx = SF.canvas.getContext("2d");
    SF.ua = navigator.userAgent.toLowerCase();
    SF.android = -1 < SF.ua.indexOf("android") ? !0 : !1;
    SF.ios =
      -1 < SF.ua.indexOf("iphone") || -1 < SF.ua.indexOf("ipad") ? !0 : !1;
    SF.action = SF.android || SF.ios ? "Tap" : "Click";
    a = SF.ctx.createLinearGradient(0, 0, 0, SF.H);
    a.addColorStop(0, "#036");
    a.addColorStop(0.5, "#69a");
    a.addColorStop(1, "yellow");
    SF.gradients.dawn = a;
    a = SF.ctx.createLinearGradient(0, 0, 0, SF.H);
    a.addColorStop(0, "#69a");
    a.addColorStop(0.5, "#9cd");
    a.addColorStop(1, "#fff");
    SF.gradients.day = a;
    a = SF.ctx.createLinearGradient(0, 0, 0, SF.H);
    a.addColorStop(0, "#036");
    a.addColorStop(0.3, "#69a");
    a.addColorStop(1, "pink");
    SF.gradients.dusk = a;
    a = SF.ctx.createLinearGradient(0, 0, 0, SF.H);
    a.addColorStop(0, "#036");
    a.addColorStop(1, "black");
    SF.gradients.night = a;
    window.addEventListener(
      "click",
      function (a) {
        a.preventDefault();
        SF.tapped = !0;
        SF.m.x = (a.pageX - SF.offset.left) / SF.scale;
        SF.m.y = (a.pageY - SF.offset.top) / SF.scale;
      },
      !1
    );
    window.addEventListener(
      "touchstart",
      function (a) {
        a.preventDefault();
        SF.tapped = !0;
        a = a.touches[0];
        SF.m.x = (a.pageX - SF.offset.left) / SF.scale;
        SF.m.y = (a.pageY - SF.offset.top) / SF.scale;
      },
      !1
    );
    window.addEventListener(
      "touchmove",
      function (a) {
        a.preventDefault();
      },
      !1
    );
    window.addEventListener(
      "touchend",
      function (a) {
        a.preventDefault();
      },
      !1
    );
    window.addEventListener(
      "keyup",
      function (a) {
        a.preventDefault();
        32 === a.keyCode && (SF.pause = !SF.pause);
        return !1;
      },
      !1
    );
    for (a = 0; a < SF.preload.img.length; a += 1)
      (b = new Image()),
        (b.src = SF.preload.img[a]),
        (b.onload = SF.preload.loaded += 1);
    SF.resize();
    SF.changeState(SF.state);
    SF.loop();
    SF.reset();
  },
  resize: function () {
    var a = document.getElementById("o"),
      b = SF.canvas;
    SF.currentHeight = "Tap" === SF.action ? window.innerHeight : 450;
    SF.currentWidth = SF.currentHeight * SF.RATIO;
    if (SF.android || SF.ios)
      document.body.style.height = window.innerHeight + 50 + "px";
    SF.canvas.style.width = SF.currentWidth + "px";
    SF.canvas.style.height = SF.currentHeight + "px";
    SF.scale = SF.currentWidth / SF.W;
    SF.offset.top = SF.canvas.offsetTop;
    SF.offset.left = SF.canvas.offsetLeft;
    window.innerWidth < window.innerHeight
      ? ((b.style.display = "none"), (a.style.display = "block"))
      : ((b.style.display = "block"), (a.style.display = "none"));
    window.setTimeout(function () {
      window.scrollTo(0, 1);
    }, 1);
  },
  loop: function () {
    requestAnimFrame(SF.loop);
    SF.game.update();
    SF.game.render();
    SF.tapped = !1;
    SF.tick += 1;
    SF.time = 0.02 * new Date().getTime();
    SF.fadeText = Math.sin(0.2 * SF.time) + 1;
    SF.fps = ~~(1e3 / (new Date().getTime() - SF.lastTick));
    SF.lastTick = new Date().getTime();
  },
  changeState: function (a) {
    SF.reset();
    SF.game = new window["SF_" + a]({});
  },
  reset: function () {
    SF.entities = [];
    SF.level = 0;
    SF.pause = !1;
    SF.tapped = !1;
    SF._t = 0;
  },
};
window.addEventListener("load", SF.init, !1);
window.addEventListener("resize", SF.resize, !1);
SF.Draw = {
  clear: function () {
    SF.ctx.clearRect(0, 0, SF.W, SF.H);
  },
  rect: function (a, b, c, d, e) {
    SF.ctx.fillStyle = e;
    SF.ctx.fillRect(a, b, c, d);
  },
  circle: function (a, b, c, d, e) {
    e && ((SF.ctx.strokeStyle = e), (SF.ctx.lineWidth = 3));
    SF.ctx.fillStyle = d;
    SF.ctx.beginPath();
    SF.ctx.arc(a + 5, b + 5, c, 0, 2 * Math.PI, !0);
    SF.ctx.closePath();
    e && SF.ctx.stroke();
    SF.ctx.fill();
  },
  star: function (a, b, c) {
    var d = 0,
      e = 3 * (Math.PI / 2),
      g = a,
      f = b,
      h = Math.PI / 5;
    SF.ctx.save();
    SF.ctx.beginPath();
    SF.ctx.moveTo(a, b - 5);
    for (d = 0; 5 > d; d++)
      (g = a + 5 * Math.cos(e)),
        (f = b + 5 * Math.sin(e)),
        SF.ctx.lineTo(g, f),
        (e += h),
        (g = a + 8 * Math.cos(e)),
        (f = b + 8 * Math.sin(e)),
        SF.ctx.lineTo(g, f),
        (e += h);
    SF.ctx.lineTo(a, b - 5);
    SF.ctx.fillStyle = c;
    SF.ctx.fill();
    SF.ctx.closePath();
    SF.ctx.restore();
  },
  text: function (a, b, c, d, e, g) {
    SF.ctx.font = "bold " + d + "px " + SF.font;
    b = b || SF.W / 2 - SF.ctx.measureText(a).width / 2;
    g && ((SF.ctx.fillStyle = g), SF.ctx.fillText(a, b - 2, c + 2));
    SF.ctx.fillStyle = e;
    SF.ctx.fillText(a, b, c);
  },
};
SF.Game = Class.extend({
  init: function () {},
  update: function () {
    for (i = 0; i < SF.entities.length; i += 1)
      SF.entities[i].update(),
        SF.entities[i].checkCollision &&
          SF.entities[i].collides(SF.entities[0]) &&
          (SF.entities[i].hit(),
          SF.entities[0].hit(SF.entities[i].strength, SF.entities[i].name)),
        SF.entities[i].remove && SF.entities.splice(i, 1);
  },
  render: function () {
    for (i = 0; i < SF.entities.length; i += 1) SF.entities[i].render();
  },
});
SF.Anim = function (a) {
  a = a || {};
  this.xOff = a.xOff || 0;
  this.yOff = a.yOff || 0;
  this.frames = a.frames || 0;
  this.currentFrame = a.currentFrame || 0;
  this.nextAnim = a.nextAnim || !1;
  this.frameSpeed = a.frameSpeed || 3;
};
SF.Particle = function (a, b, c, d, e) {
  this.x = a;
  this.y = b;
  this.r = c;
  this.col = d;
  this.type = e || "circle";
  this.name = "particle";
  this.dir = 1 < 2 * Math.random() ? 1 : -1;
  this.vx = ~~(4 * Math.random()) * this.dir;
  this.vy = ~~(7 * Math.random());
  this.remove = !1;
  this.update = function () {
    this.x += this.vx;
    this.y -= this.vy;
    this.vx *= 0.99;
    this.vy *= 0.99;
    this.vy -= 0.35;
    this.y > SF.H && (this.remove = !0);
  };
  this.render = function () {
    "star" === this.type
      ? SF.Draw.star(this.x, this.y, this.col)
      : SF.Draw.circle(this.x, this.y, this.r, this.col);
  };
};
SF.Sprite = Class.extend({
  init: function (a) {
    this.x = a.x;
    this.y = a.y;
    this.w = a.w;
    this.h = a.h;
    this.vx = a.vx;
    this.vy = a.vy;
    this.xOff = a.xOff || 0;
    this.yOff = a.yOff || 0;
    this.anims = [];
    this.checkCollision = this.killOnRespawn = this.remove = !1;
    this.strength = -1;
    this.r = this.w / 2;
    this.q = this.r / 2;
  },
  update: function () {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.99;
    this.vy && ((this.vy *= 0.99), (this.vy += 0.04));
  },
  render: function () {
    if (this.img.src) {
      this.animate();
      try {
        SF.ctx.drawImage(
          this.img,
          this.xOff,
          this.yOff,
          this.w,
          this.h,
          ~~this.x,
          ~~this.y,
          this.w,
          this.h
        );
      } catch (a) {
        console.log(a);
      }
    } else SF.Draw.rect(this.x, this.y, this.w, this.h, this.col);
  },
  animate: function () {
    SF.pause ||
      (0 === SF.tick % this.anims[this.anim].frameSpeed &&
        (this.anims[this.anim].currentFrame += 1),
      this.anims[this.anim].currentFrame > this.anims[this.anim].frames &&
        ((this.anims[this.anim].currentFrame = 0),
        this.anims[this.anim].nextAnim &&
          this.changeAnim(this.anims[this.anim].nextAnim)),
      (this.xOff =
        this.anims[this.anim].xOff +
        this.anims[this.anim].currentFrame * this.w));
  },
  changeAnim: function (a) {
    this.anim = a;
    this.anims[this.anim].currentFrame = 0;
  },
  collides: function (a) {
    this.left = this.x;
    this.right = this.x + this.w;
    this.top = this.y;
    this.bottom = this.y + this.h;
    a.left = a.x;
    a.right = a.x + a.w;
    a.top = a.y;
    a.bottom = a.y + a.h;
    return this.bottom < a.top ||
      this.top > a.bottom ||
      this.right < a.left ||
      this.left > a.right
      ? !1
      : !0;
  },
  respawn: function () {
    this.killOnRespawn && (this.remove = !0);
  },
  hit: function () {},
});
SF.levels = [];
SF.levels[1] = {
  bg: { grad: "day", type: "hills", col: "#002000" },
  entities: { Coin: 1, Tree: 2, Fly: 2 },
};
SF.levels[2] = {
  bg: { grad: "day", type: "hills", col: "#003000" },
  entities: { Coin: 1, Tree: 3, Fly: 2 },
};
SF.levels[3] = {
  bg: { grad: "day", type: "hills", col: "#004000" },
  entities: { Coin: 1, Tree: 2, Fly: 2, Hornet: 2, Powerup: 1 },
};
SF.levels[4] = {
  bg: { grad: "dusk", type: "hills", col: "#001000" },
  entities: { Coin: 2, Tree: 2, Hornet: 2, Mozzie: 1 },
};
SF.levels[5] = {
  bg: { grad: "dusk", type: "hills", col: "#001000" },
  entities: { Coin: 2, Hornet: 2, Tree: 2, Mozzie: 1, Powerup: 1 },
};
SF.levels[6] = {
  bg: { grad: "night", type: "stars", col: "#fff" },
  entities: { Coin: 2, Tree: 2, Hornet: 2, Snapper: 2 },
};
SF.levels[7] = {
  bg: { grad: "night", type: "stars", col: "#fff" },
  entities: { Coin: 2, Tree: 2, Mozzie: 2, Vamp: 1, Powerup: 1 },
};
SF.levels[8] = {
  bg: { grad: "dawn", type: "city", col: "#222" },
  entities: { Coin: 2, Snapper: 1, Vamp: 1, Mozzie: 1 },
};
SF.levels[9] = {
  bg: { grad: "day", type: "city", col: "#444" },
  entities: { Coin: 2, Tree: 2, Hornet: 4, Powerup: 1 },
};
SF.levels[10] = {
  bg: { grad: "day", type: "city", col: "#444" },
  entities: { Coin: 2, Tree: 1, Vamp: 1, Mozzie: 1, Hornet: 2 },
};
SF.levels[11] = {
  bg: { grad: "dusk", type: "city", col: "#444" },
  entities: { Coin: 2, Hornet: 4, Vamp: 2 },
};
SF.levels[12] = {
  bg: { grad: "night", type: "stars", col: "#fff" },
  entities: { Coin: 3, Tree: 4, Hornet: 4, Snapper: 2 },
};
SF.levels[13] = {
  bg: { grad: "dawn", type: "rainbow", col: "#444" },
  entities: {
    Coin: 3,
    Tree: 1,
    Fly: 1,
    Hornet: 1,
    Mozzie: 1,
    Snapper: 1,
    Vamp: 1,
    Powerup: 1,
  },
};
SF.Bg = {
  hills: function (a) {
    SF.Draw.circle(0, SF.H + 30, 100, a);
    SF.Draw.circle(160, SF.H + 30, 120, a);
    SF.Draw.circle(300, SF.H + 30, 90, a);
    SF.Draw.circle(420, SF.H + 30, 140, a);
  },
  stars: function () {
    SF.Draw.circle(100, 100, 1, "#fff");
    SF.Draw.circle(150, 30, 1, "#fff");
    SF.Draw.circle(220, 60, 1, "#fff");
    SF.Draw.circle(300, 50, 1, "#fff");
    SF.Draw.circle(430, 70, 30, "#fff");
    SF.Draw.circle(415, 70, 30, "#012");
  },
  city: function (a) {
    SF.Draw.rect(0, SF.H - 30, SF.W, 100, a);
    SF.Draw.rect(30, SF.H - 100, 30, 100, a);
    SF.Draw.rect(70, SF.H - 140, 50, 140, a);
    SF.Draw.rect(90, SF.H - 50, 90, 140, a);
    SF.Draw.rect(160, SF.H - 140, 40, 140, a);
    SF.Draw.rect(160, SF.H - 80, 100, 100, a);
    SF.Draw.rect(220, SF.H - 130, 20, 140, a);
    SF.Draw.rect(300, SF.H - 170, 40, 140, a);
    SF.Draw.rect(350, SF.H - 120, 60, 100, a);
    SF.Draw.rect(410, SF.H - 140, 40, 140, a);
  },
};
SF_intro = SF.Game.extend({
  init: function (a) {
    this._super(a);
  },
  update: function () {},
  render: function () {
    SF._t = SF._t || 1;
    SF._d = SF._d || -1;
    SF._r = SF._r || 0.01;
    SF._t += SF._r * SF._d;
    0.01 >= SF._t && ((SF._d *= -1), (SF._r = 0.01));
    SF.Draw.rect(0, 0, SF.W, SF.H, "#333");
    SF.Draw.text("Starfish Arcade", !1, 100, 34, "green");
    SF.Draw.text("presents...", !1, 150, 24, "green");
    SF.Draw.rect(0, 0, SF.W, SF.H, "rgba(0,0,0," + SF._t + ")");
    if (1 <= SF._t || SF.tapped) SF.Draw.clear(), SF.changeState("splash");
  },
});
SF.intro = function () {};
SF_splash = SF.Game.extend({
  init: function (a) {
    this._super(a);
    this.level = SF.levels[1];
    this.bird = new Image();
    this.bird.src = "b.png";
  },
  update: function () {
    SF._t -= 0.02;
    SF.tapped && (SF.changeState("tutorial"), (SF.tapped = !1));
    this._super();
  },
  render: function () {
    SF.Draw.clear();
    SF.Draw.rect(0, 0, SF.W, SF.H, SF.gradients.day);
    SF.Bg.hills("#001000");
    SF.Draw.text("Freebird", !1, 100, 44, "#fff", "#000");
    SF.Draw.text("100 miles to freedom!", !1, 130, 20, "#fff", "rgba(0,0,0,0.5)");
    SF.Draw.text(
      SF.action + " to Start",
      !1,
      180,
      14,
      "rgba(255,0,255," + SF.fadeText + ")"
    );
    try {
      SF.ctx.drawImage(this.bird, 128, 0, 32, 32, 130, SF.H - 32, 32, 32);
    } catch (a) {}
    SF.Draw.text("HiScore:  " + SF.hiScore, !1, 30, 14, "rgba(255,255,255,1)");
    SF.Draw.text("", 390, SF.H - 20, 10, "rgba(255,255,255,1)");
    this._super();
  },
});
SF_tutorial = SF.Game.extend({
  init: function (a) {
    this._super(a);
    this.level = SF.levels[1];
    this.bird = new Image();
    this.bird.src = "b.png";
    this.coin = new SF.Coin({});
    this.coin.x = 200;
    this.coin.y = SF.H - 140;
    this.baddie = new SF.Fly({});
    this.baddie.x = 300;
    this.baddie.y = SF.H - 140;
  },
  update: function () {
    SF._t -= 0.02;
    if (SF.tapped || -8 > SF._t || 2 <= SF.plays)
      SF.changeState("play"), (SF.tapped = !1);
    this._super();
  },
  render: function () {
    SF.Draw.clear();
    SF.Draw.rect(0, 0, SF.W, SF.H, SF.gradients.day);
    SF.Bg.hills("#001000");
    -0.5 > SF._t
      ? this.step_1.apply(this)
      : SF.ctx.drawImage(this.bird, 128, 0, 32, 32, 130, SF.H - 32, 32, 32);
    -2 > SF._t && this.step_2.apply(this);
    -4 > SF._t && this.step_3.apply(this);
    -6 > SF._t && this.step_4.apply(this);
    SF.Draw.text("How To Play", !1, 40, 22, "#f0f");
    SF.Draw.text("SKIP >", 410, SF.H - 20, 12, "rgba(255,255,255,1)");
    this._super();
  },
  step_1: function () {
    SF.Draw.text(
      "1. " + SF.action + " screen to Fly",
      !1,
      70,
      18,
      "#000",
      "rgba(255,255,255,0.4)"
    );
    try {
      SF.ctx.drawImage(this.bird, 0, 0, 32, 32, 130, SF.H - 128, 32, 32);
    } catch (a) {}
  },
  step_2: function () {
    SF.Draw.text(
      "2. Eat to keep your strength up",
      !1,
      100,
      18,
      "#000",
      "rgba(255,255,255,0.4)"
    );
    this.coin.render();
  },
  step_3: function () {
    SF.Draw.text(
      "3. Avoid the baddies",
      !1,
      130,
      18,
      "#000",
      "rgba(255,255,255,0.4)"
    );
    this.baddie.render();
  },
  step_4: function () {
    SF.Draw.text(
      "4. Fly 100 miles to freedom!",
      !1,
      160,
      18,
      "#000",
      "rgba(255,255,255,0.4)"
    );
    this.baddie.render();
  },
});
SF_play = SF.Game.extend({
  init: function (a) {
    this._super(a);
    SF.entities = [];
    SF.entities.push(new SF.Bird({}));
    SF.p1 = SF.entities[0];
    SF.p1.health = 100;
    SF.plays += 1;
  },
  update: function () {
    window.scrollTo(0, 1);
    var a = 0 === SF.distance % 1024 ? !0 : !1,
      b;
    if (!0 !== SF.pause) {
      this._super();
      SF.distance += 2;
      SF.p1.health -= 0.04;
      100 < SF.p1.health && (SF.p1.health = 100);
      if (SF.distance > SF.hiScore && !1 === SF.newHiScore) {
        SF.newHiScore = !0;
        for (b = 0; 30 > b; b += 1)
          SF.entities.push(
            new SF.Particle(
              SF.W / 2,
              SF.H / 2 - 100,
              10,
              "rgba(255,0,255,1)",
              "star"
            )
          );
        SF.entities.push(
          new SF.Text({
            str: "New Hi Score",
            col: "#f0f",
            max: 30,
            size: 30,
            fade: 0.007,
          })
        );
      }
      13312 < SF.distance && SF.changeState("victory");
      a && ((SF.level += 1), this.levelUp());
      SF.p1.dead && SF.changeState("gameOver");
    }
  },
  render: function () {
    var a = 100 < SF.p1.health ? 100 : SF.p1.health,
      b = SF.levels[SF.level] || SF.levels[1],
      c = b.bg.grad || "day",
      d = b.bg.col,
      b = b.bg.type;
    SF.Draw.clear();
    SF.Draw.rect(0, 0, SF.W, SF.H, SF.gradients[c]);
    SF.Bg[b](d);
    this._super();
    SF.Draw.rect(19, 49, 102, 18, "#000");
    SF.Draw.rect(20, 50, a, 16, "#c20");
    SF.Draw.rect(20, 58, a, 8, "rgba(255,255,255,0.2)");
    SF.Draw.text(~~SF.distance + "m", 20, 30, 14, "#fff");
    SF.debug &&
      (SF.Draw.text("FPS " + SF.fps, 350, 15, 12, "#fff"),
      SF.Draw.text("Entities " + SF.entities.length, 350, 30, 12, "#fff"));
    !0 === SF.pause &&
      SF.Draw.text(
        "PAUSED",
        !1,
        130,
        20,
        "rgba(255,255,255," + SF.fadeText + ")"
      );
  },
  levelUp: function () {
    var a, b, c;
    c = SF.levels[SF.level];
    "undefined" === typeof c && (c = SF.levData[1]);
    for (b = 0; b < SF.entities.length; b += 1)
      "function" === typeof SF.entities[b].respawn &&
        (SF.entities[b].killOnRespawn = !0);
    for (a in c.entities)
      if (c.entities.hasOwnProperty(a))
        for (b = 0; b < c.entities[a]; b += 1) SF.entities.push(new SF[a]({}));
    SF.entities.push(
      new SF.Text({
        x: 100,
        str: "Level " + SF.level,
        col: "night" === c.bg.grad ? "#fff" : "#000",
      })
    );
  },
});
SF_gameOver = SF.Game.extend({
  init: function (a) {
    this._super(a);
    this.button = {
      x: 100,
      y: 230,
      w: SF.W - 200,
      h: 50,
      col: "#00aced",
      text: { str: "Tweet Score", x: !1, y: 260, size: 18, col: "#000" },
      pressed: function (a, c) {
        return (
          a > this.x && a < this.x + this.w && c > this.y && c < this.y + this.h
        );
      },
    };
    this.tweet = new Image();
    this.tweet.src = "t.png";
  },
  render: function () {
    var a = this.button;
    SF.Draw.rect(0, 0, SF.W, SF.H, "rgba(255,0,0,0.01)");
    SF.Draw.rect(0, 50, SF.W, 70, "#900");
    SF.Draw.text(
      "Game Over",
      !1,
      100,
      44,
      "rgba(255,255,255," + SF.fadeText + ")"
    );
    SF.newHiScore &&
      ((SF.hiScore = SF.distance),
      (localStorage.hiScore = SF.hiScore),
      SF.Draw.rect(0, 120, SF.W, 50, "#900"),
      SF.Draw.text("New HiScore!", !1, 150, 20, "#fff"));
    if (SF.tapped && 60 < SF._t) {
      if (!0 === a.pressed(SF.m.x, SF.m.y)) {
        window.location =
          "" +
          SF.distance +
          "";
        return;
      }
      SF.distance = 0;
      SF.newHiScore = !1;
      SF.changeState("splash");
    }
    SF.Draw.rect(a.x, a.y, a.w, a.h, a.col);
    SF.Draw.text(a.text.str, !1, a.text.y, a.text.size, a.text.col);
    SF.ctx.drawImage(this.tweet, a.x + 10, a.y + 8);
    SF._t += 1;
  },
});
SF_victory = SF.Game.extend({
  init: function (a) {
    this._super(a);
    this.fireworks =
      "tomato lightblue yellow orange lightgreen greenyellow plum white".split(
        " "
      );
    this.timer = 0;
    this.setTimer();
    this.bird = new Image();
    this.bird.src = "b.png";
  },
  update: function () {
    SF.tapped &&
      60 < SF._t &&
      ((SF.hiScore = SF.distance),
      (localStorage.hiScore = SF.hiScore),
      (SF.distance = 0),
      (SF.newHiScore = !1),
      SF.changeState("splash"));
    this.timer -= 1;
    this._super();
    0 >= this.timer && this.setTimer();
  },
  render: function () {
    SF.Draw.rect(0, 0, SF.W, SF.H, "#333");
    SF.Draw.text("Victory", !1, 100, 44, "rgba(255,0,255," + SF.fadeText + ")");
    SF.Draw.text("You Win!", !1, 150, 30, "#f0f");
    this._super();
    try {
      SF.ctx.drawImage(this.bird, 128, 0, 32, 32, 100, SF.H - 32, 32, 32);
    } catch (a) {
      console.log(a);
    }
  },
  setTimer: function () {
    var a = ~~(Math.random() * this.fireworks.length);
    this.timer = 5 * Math.random();
    SF.entities.push(
      new SF.Particle(SF.W / 2, -10, 3, this.fireworks[a], "star")
    );
  },
});
SF.Text = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.name = "text";
    this.max = a.max || 30;
    this.size = a.size || 5;
    this.col = a.col || "#000";
    this.speed = a.speed || 0.5;
    this.fade = a.fade || 0.02;
    this.opacity = 1;
    this.str = a.str;
    this.x = -SF.W;
    this.y = a.y || SF.H / 2;
    this.centerX = SF.W / 2;
    this.shadow = a.shadow || !1;
    this.collides = !1;
  },
  update: function () {
    this.size >= this.max
      ? ((this.size = this.max), (this.opacity -= this.fade), (this.y -= 0.5))
      : (this.size += this.speed);
    0 > this.opacity && (this.remove = !0);
    SF.ctx.font = "bold " + this.size + "px " + SF.font;
    this.x = this.centerX - SF.ctx.measureText(this.str).width / 2;
  },
  render: function () {
    SF.ctx.globalAlpha = this.opacity;
    this.shadow &&
      SF.Draw.text(this.str, this.x + 2, this.y + 2, this.size, this.shadow);
    SF.Draw.text(this.str, this.x, this.y, this.size, this.col);
    SF.ctx.globalAlpha = 1;
  },
});
SF.Bird = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.img = new Image();
    this.img.src = "b.png";
    this.col = a.col || "green";
    this.x = 150;
    this.y = SF.H - 40;
    this.h = this.w = 32;
    this.vx = 0;
    this.vy = -1;
    this.anims.flap = new SF.Anim({
      xOff: 0,
      yOff: 0,
      frames: 2,
      frameSpeed: 3,
      nextAnim: "glide",
    });
    this.anims.glide = new SF.Anim({
      xOff: 0,
      yOff: 0,
      frames: 0,
      frameSpeed: 3,
    });
    this.anims.run = new SF.Anim({
      xOff: 96,
      yOff: 0,
      frames: 1,
      frameSpeed: 7,
    });
    this.anims.stand = new SF.Anim({ xOff: 128, yOff: 0, frames: 0 });
    this.anims.hurt = new SF.Anim({
      xOff: 192,
      yOff: 0,
      frames: 0,
      nextAnim: "glide",
    });
    this.anims.dead = new SF.Anim({ xOff: 160, yOff: 0, frames: 0 });
    this.anim = "glide";
    this.name = "bird";
    this.health = 100;
    this.r = this.w / 2;
    this.invincible = !1;
    this.counter = 0;
  },
  update: function () {
    SF.tapped &&
      0 < this.health &&
      ((this.vy += -1.7), this.changeAnim("flap"));
    this._super();
    0 >= this.health
      ? ((this.health = 0), this.changeAnim("dead"))
      : this.y >= SF.H - this.h
      ? ((this.y = SF.H - this.h), (this.vy = 0), this.changeAnim("run"))
      : 0 >= this.y &&
        0 < this.health &&
        ((this.y = 0), (this.vy = -1 * (this.vy / 2)));
    0 < this.counter && (this.counter -= 0.3);
    0 >= this.counter && (this.invincible = !1);
    0 >= this.health && this.y >= SF.H - this.h && (this.dead = !0);
  },
  render: function () {
    var a;
    this._super();
    this.invincible &&
      ((a = this.counter / 100),
      SF.Draw.circle(
        this.x + this.r + 2,
        this.y + this.r,
        this.w / 2,
        "rgba(255,0,255,0.3)",
        "rgba(85,0,85, " + a + ")"
      ));
  },
  hit: function (a, b) {
    0 > a
      ? !1 === this.invincible &&
        0 < this.health &&
        ((this.health += a),
        this.changeAnim("hurt"),
        SF.entities.push(new SF.Particle(this.x, this.y, 2, this.col)))
      : (this.health += a);
    "powerup" === b && ((this.counter = 100), (this.invincible = !0));
  },
});
SF.Coin = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.h = this.w = 16;
    this.name = "coin";
    this.checkCollision = !0;
    this.strength = 15;
    this.respawn();
    this.sparkle = 0;
  },
  update: function () {
    this.sparkle = SF.fadeText / 4;
    this.x += this.vx;
    this.x < 0 - this.w && this.respawn();
  },
  render: function () {
    SF.Draw.circle(this.x, this.y, this.w / 2, "#ffd700", "brown");
    SF.Draw.circle(
      this.x,
      this.y,
      this.w / 2,
      "rgba(255,255,255," + this.sparkle + ")"
    );
  },
  respawn: function () {
    this._super();
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = ~~(Math.random() * (SF.H - 3 * this.h)) + this.h;
    this.vx = -3;
    this.vy = 0;
  },
  hit: function () {
    var a;
    for (a = 0; 3 > a; a += 1)
      SF.entities.push(
        new SF.Particle(
          this.x,
          this.y,
          3,
          "rgba(255,215,0," + 2 * Math.random() + ")",
          "star"
        )
      );
    this.respawn();
  },
});
SF.Tree = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.name = "tree";
    this.respawn();
    this.checkCollision = !0;
  },
  update: function () {
    this.x += this.vx;
    this.x < 0 - this.w && this.respawn();
  },
  render: function () {
    SF.Draw.circle(
      this.x + this.r,
      this.y + this.r - 10,
      this.r,
      "green",
      "#050"
    );
    SF.Draw.circle(
      this.x + this.r / 2,
      this.y + this.r - 10,
      this.r / 3,
      "rgba(0,0,0,0.08)"
    );
    SF.Draw.rect(this.x + this.r, this.y + this.r, 10, this.r, "brown", "#d20");
  },
  respawn: function () {
    this._super();
    this.h = this.w = ~~(64 * Math.random()) + 32;
    this.r = this.w / 2;
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = SF.H - this.h;
    this.vx = -3;
    this.vy = 0;
  },
});
SF.Hornet = SF.Sprite.extend({
  init: function (a) {
    a.w = 16;
    a.h = 12;
    a.vx = 1;
    this._super(a);
    this.name = "hornet";
    this.r = this.h / 2;
    this.q = Math.ceil(this.r / 2);
    this.checkCollision = !0;
    this.strength = -5;
    this.respawn();
  },
  update: function () {
    this.x += this.vx;
    this.x < 0 - this.w && this.respawn();
  },
  render: function () {
    var a = SF.ctx,
      b = this.x + this.q,
      c = this.y + this.q;
    SF.Draw.circle(b, c, this.r, "#000");
    SF.Draw.circle(b - 5, c - 2, 2, "#fff");
    SF.Draw.circle(b + this.r, c, this.r, "#000");
    SF.Draw.rect(b + this.r, c - this.q + 2, this.r, this.h, "yellow");
    a.beginPath();
    a.moveTo(b + this.w, c + this.r);
    a.lineTo(b + this.w, c);
    a.lineTo(b + this.w + this.q + this.q, c + this.r);
    a.fillStyle = "#000";
    a.fill();
    SF.Draw.circle(b + 5, c - 5, this.q + 2, "#69a");
  },
  respawn: function () {
    this._super();
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = ~~(200 * Math.random()) + 10;
    this.vx = -7;
    this.vy = 0;
  },
});
SF.Fly = SF.Sprite.extend({
  init: function (a) {
    a.w = 22;
    a.h = 22;
    a.vx = 1;
    this._super(a);
    this.name = "fly";
    this.r = this.h / 2;
    this.q = Math.ceil(this.r / 2);
    this.checkCollision = !0;
    this.respawn();
    this.flap = 0;
    this.strength = -2;
  },
  update: function () {
    this.x += this.vx;
    this.x < 0 - this.w && this.respawn();
    this.flap = SF.tick % 3 ? 3 : 0;
  },
  render: function () {
    var a = SF.ctx;
    a.beginPath();
    a.moveTo(this.x + this.q, this.y + this.q);
    a.lineTo(this.x + this.q, this.y + this.h - 3);
    a.lineTo(this.x - this.q, this.y + this.h / 2);
    a.fillStyle = "orange";
    a.strokeStyle = "#c02";
    a.stroke();
    a.fill();
    SF.Draw.circle(this.x + 16, this.y + this.flap, 6, "#666");
    SF.Draw.circle(this.x + this.r, this.y + this.r, this.r, "#333", "#111");
    SF.Draw.circle(this.x + 18, this.y + 2 + this.flap, 7, "#999");
    SF.Draw.circle(this.x, this.y + 4, 4, "#fff");
    SF.Draw.circle(this.x - 1, this.y + 4, 1, "#600");
  },
  respawn: function () {
    this._super();
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = ~~(200 * Math.random()) + 10;
    this.vx = -4;
    this.vy = 0;
  },
});
SF.Snapper = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.name = "snapper";
    this.maxH = 0;
    this.yDir = -1;
    this.respawn();
    this.strength = -5;
    this.checkCollision = !0;
  },
  update: function () {
    this.x += this.vx;
    if (this.y < this.maxH || this.y > SF.H) this.yDir *= -1;
    this.x < 0 - this.w && this.respawn();
    this.y += this.yDir * this.vx;
  },
  render: function () {
    SF.Draw.rect(this.x + this.r, this.y + this.r, 5, SF.H - this.y, "purple");
    SF.Draw.circle(
      this.x + this.r,
      this.y + this.r + this.q,
      this.r,
      "purple",
      "#000"
    );
    SF.Draw.circle(this.x + this.q, this.y + this.r + 4, this.q / 2, "#fff");
    SF.Draw.circle(
      this.x + this.q + this.r,
      this.y + this.r + 4,
      this.q / 2,
      "#fff"
    );
    SF.Draw.circle(this.x + this.r, this.y + this.r + 2, this.q, "purple");
  },
  respawn: function () {
    this._super();
    this.h = this.w = ~~(32 * Math.random()) + 32;
    this.r = this.w / 2;
    this.q = this.r / 2;
    this.maxH = this.getMaxH();
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = SF.H - this.h;
    this.vx = -3;
    this.vy = 0;
  },
  getMaxH: function () {
    return ~~(Math.random() * (SF.H / 2)) + 50;
  },
});
SF.Mozzie = SF.Sprite.extend({
  init: function (a) {
    a.w = 16;
    a.h = 10;
    a.vx = 1;
    this._super(a);
    this.name = "mozzie";
    this.r = this.h / 2;
    this.q = Math.ceil(this.r / 2);
    this.checkCollision = !0;
    this.respawn();
    this.strength = -5;
    this.offScreen = !0;
  },
  update: function () {
    this.x += this.vx;
    this.x > SF.W + this.w && this.respawn();
    this.offScreen = 0 > this.x ? !0 : !1;
  },
  render: function () {
    var a = SF.ctx,
      b = this.x + this.q,
      c = this.y + this.q;
    this.offScreen
      ? (SF.Draw.circle(16, c, this.h, "rgba(200,0,0," + SF.fadeText + ")"),
        SF.Draw.text(
          "!",
          18,
          c + 10,
          14,
          "rgba(255, 255, 255, " + SF.fadeText + ")"
        ))
      : (SF.Draw.circle(b, c, this.r, "#000"),
        SF.Draw.circle(b + this.r, c, this.r, "#000"),
        SF.Draw.rect(b + this.r, c - this.q + 2, this.r, this.h, "black"),
        a.beginPath(),
        a.moveTo(b + this.w - 3, c + this.q),
        a.lineTo(b + this.w, c + this.r),
        a.lineTo(b + this.w + this.r + this.q, c + this.r),
        (a.fillStyle = "#000"),
        a.fill(),
        SF.Draw.circle(b, c - 5, this.q + 2, "rgba(255,255,255,0.5)"),
        SF.Draw.circle(this.x + this.w - 2, this.y, 2, "red"));
  },
  respawn: function () {
    this._super();
    this.x = -1 * (~~(Math.random() * SF.W) + SF.W);
    this.y = ~~(200 * Math.random()) + 10;
    this.vx = 5;
    this.vy = 0;
  },
});
SF.Vamp = SF.Sprite.extend({
  init: function (a) {
    this._super(a);
    this.w = 8;
    this.h = 0;
    this.r = this.w / 2;
    this.yDir = 1;
    this.maxH = 0;
    this.speed = 3;
    this.name = "vamp";
    this.respawn();
    this.checkCollision = !0;
  },
  update: function () {
    this.x += this.vx;
    if (this.h > this.maxH || 0 > this.h) this.yDir *= -1;
    this.x < SF.W && (this.h += this.yDir * this.speed);
    this.x < 0 - this.w && this.respawn();
  },
  render: function () {
    SF.Draw.rect(this.x, this.y, this.w, this.h, "#c20");
    SF.Draw.circle(this.x - 1, this.h - this.r, 4, "#c20");
    SF.Draw.circle(this.x - 2, 0, 12, "darkgreen");
    SF.Draw.circle(this.x - this.w, 4, 4, "white");
    SF.Draw.circle(this.x + this.r, 4, 4, "white");
    SF.Draw.circle(this.x - 2, 0, 6, "darkgreen");
  },
  respawn: function () {
    this._super();
    this.x = ~~(Math.random() * SF.W) + SF.W;
    this.y = 0;
    this.r = this.w / 2;
    this.q = this.r / 2;
    this.maxH = this.getMaxH();
    this.h = 32;
    this.vx = -3;
    this.vy = 0;
  },
  getMaxH: function () {
    return ~~(Math.random() * (SF.H / 2)) + 50;
  },
});
