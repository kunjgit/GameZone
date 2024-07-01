function J() {
  this.B = function (t) {
    for (var e = 0; 24 > e; e++) this[String.fromCharCode(97 + e)] = t[e] || 0;
    0.01 > this.c && (this.c = 0.01),
      (t = this.b + this.c + this.e),
      0.18 > t && ((t = 0.18 / t), (this.b *= t), (this.c *= t), (this.e *= t));
  };
}
function Menu() {
  (MN = this),
    (this.y = 0),
    (this.font = "50px Helvetica"),
    (this.fireColor = "rgb(255, 56, 8)"),
    (ctx.fillStyle = "#fff"),
    ctx.fillRect(0, 0, G.can.width, G.can.height),
    (this.heat = MN.getHeatMap()),
    (this.noise = null),
    (this.noise = MN.getNoise(G.can.width, 8 * G.can.height)),
    ctx.drawImage(this.heat, 0, 0),
    this.update();
}
function Cloud() {
  (this.color = "blue"),
    (this.x = G.can.width || P.w),
    (this.y = 100),
    (this.speed = 7),
    this.update();
}
function SunMoon() {
  (SM = this),
    (this.isSun = !0),
    (this.r = 20),
    (this.x = 0),
    (this.y = 100),
    (this.speed = 1),
    (G.period = "morning"),
    this.update();
}
function WindParticle(t) {
  (this.x = G.can.width + utils.getRandomInt(0, G.can.width)),
    (this.y = (t + 1) * WD.pDist),
    (this.color = "#d1e5ff"),
    (this.speed = utils.getRandomInt(1, WD.speed));
}
function Wind() {
  (WD = this),
    (this.speed = 1),
    (this.particlesCount = 15),
    (this.particles = []),
    (this.pDist = 10),
    this.create();
}
function Droplet(t) {
  (this.x = RN.topDropletsDist * t),
    (this.y = 0),
    (this.color = "#d1e5ff"),
    (this.speed = utils.getRandomInt(10, 30));
}
function Rain() {
  (RN = this),
    (this.particles = []),
    (this.particlesCount = 33),
    (this.topDroplets = 1.5 * this.particlesCount),
    (this.rightDroplets = this.particlesCount / 3),
    (this.topDropletsDist = (G.can.width / this.topDroplets) * 2),
    (this.rightDropletsDist = (G.can.width / this.rightDroplets) * 2),
    this.create();
}
function Weather() {
  (this.colors = [
    [255, 255, 255],
    [142, 214, 255],
    [255, 254, 210],
    [153, 153, 153],
    [20, 20, 20],
    [20, 20, 20],
  ]),
    (this.step = 0),
    (this.i = 0),
    (this.colorIndices = [0, 1, 2, 3]),
    (thisWeather = this),
    (CC = document.getElementById("canvascontainer").style),
    this.init();
}
function Particles(t, e) {
  (PS = this),
    (this.x = t - 10),
    (this.y = e),
    (this.vyL1 = 3),
    (this.vyL2 = 2),
    (this.vyL3 = 1),
    (this.finished = !1),
    (this.particles = []),
    (this.diff = 0),
    this.draw();
}
function Player() {
  return (
    (Pl = this),
    (Pl.liesOn = 0),
    (Pl.maxH = 66),
    (Pl.bounceHeight = 5),
    (Pl.w = 20),
    (Pl.h = Pl.maxH),
    (Pl.x = G.trees[0].x),
    (Pl.y = G.trees[0].y - Pl.h),
    (Pl.vel = 0),
    (Pl.isJet = !1),
    (Pl.isRest = !0),
    (Pl.t = new Date()),
    Pl.update(),
    Pl
  );
}
function Tree(t) {
  return (
    (T = this),
    (t = t || {}),
    (T.minW = 10),
    (T.maxW = 80),
    (T.minH = P.fireOffset),
    (T.maxH = G.isMobile() ? 300 : 400),
    (T.minDist = 50),
    (T.maxDist = G.isMobile() ? 100 : 200),
    (CC.w = utils.pI(G.can.width)),
    (CC.h = utils.pI(G.can.height)),
    (T.color = "#a77b44"),
    this.add(),
    t.isNoFlame ||
      (G.isMobile()
        ? (this.flame = !0)
        : ((this.flame = smoky), this.flame.addEntity(Flame))),
    T
  );
}
function Game() {
  (G = this),
    (G.isInProgress = !0),
    (G.canSpeedBeIncreased = G.canExplode = !0),
    (G.backgroundColor = "#fff"),
    (G.karma = 0),
    (G.highscore = utils.getLocalStorageData() || 0),
    (G.isSound = utils.getLocalStorageData(!0)),
    0 !== G.isSound && (G.isSound = 1),
    (G.resolution = 1),
    (G.curPos = []),
    (G.can = document.querySelector("canvas")),
    (G.can.width = P.w),
    (G.can.height = P.h),
    (ctx = G.ctx = window.c = G.can.getContext("2d")),
    (G.trees = []),
    G.resize(),
    addEventListener("resize", G.resize, !1),
    (CC = document.getElementById("canvascontainer").style),
    document.body.addEventListener("touchstart", G.touchStart.bind(G), !1),
    document.body.addEventListener("touchmove", G.touchMove.bind(G), !1),
    document.body.addEventListener("touchend", G.touchEnd.bind(G), !1),
    document.body.addEventListener("mousedown", G.mouseDown.bind(G), !1),
    document.body.addEventListener("mousemove", G.mouseMove.bind(G), !1),
    document.body.addEventListener("mouseup", G.mouseUp.bind(G), !1),
    document.body.addEventListener("keydown", G.keyDown.bind(G), !1),
    document.body.addEventListener("keyup", G.keyUp.bind(G), !1),
    (G.frameCount = 0),
    (G.lastFrame = G.frameCountStart = Date.now());
  var t = _.innerWidth * _.innerHeight * _.devicePixelRatio,
    e = P.w * P.h,
    i = t / e;
  i < 0.5 && G.setResolution(2 * i),
    (G.speed = 1),
    (flameBack.canvas = G.can),
    (G.menu = !0);
}
function canvasToImage() {
  G.dataURL = document.getElementById("game-canvas").toDataURL("image/png");
}
function downloadCanvas() {
  var t = _.open();
  t
    ? t.document.write('<img src="' + G.dataURL + '"/>')
    : alert(
        "Your browser prevented the window from opening. Please allow to view game screenshot."
      );
}
navigator.vibrate = (function () {
  return (
    navigator.vibrate || navigator.mozVibrate || navigator.webkitVibrate || noop
  );
})();
var utils = {
    getRandomInt: function (t, e) {
      return Math.floor(Math.random() * (e - t + 1)) + t;
    },
    pI: function (t) {
      return parseInt(t, 10);
    },
    clamp: function (t, e, i) {
      return (
        "number" != typeof e && (e = -(1 / 0)),
        "number" != typeof i && (i = 1 / 0),
        Math.max(e, Math.min(i, t))
      );
    },
    getLocalStorageData: function (t) {
      return t
        ? utils.pI(atob(localStorage.getItem("__js13k_game_sound")))
        : utils.pI(atob(localStorage.getItem("__js13k_game_karma"))) || 0;
    },
    setLocalStorageData: function (t, e) {
      e
        ? localStorage.setItem("__js13k_game_sound", btoa(t))
        : localStorage.setItem("__js13k_game_karma", btoa(t));
    },
  },
  W = new (function () {
    this.A = new J();
    var t, e, i, a, n, r, o, s, l, h, c, d;
    (this.reset = function () {
      var t = this.A;
      (a = 100 / (t.f * t.f + 0.001)),
        (n = 100 / (t.g * t.g + 0.001)),
        (r = 1 - 0.01 * t.h * t.h * t.h),
        (o = 1e-6 * -t.i * t.i * t.i),
        t.a || ((c = 0.5 - t.n / 2), (d = 5e-5 * -t.o)),
        (s = 0 < t.l ? 1 - 0.9 * t.l * t.l : 1 + 10 * t.l * t.l),
        (l = 0),
        (h = 1 == t.m ? 0 : 2e4 * (1 - t.m) * (1 - t.m) + 32);
    }),
      (this.D = function () {
        this.reset();
        var a = this.A;
        return (
          (t = 1e5 * a.b * a.b),
          (e = 1e5 * a.c * a.c),
          (i = 1e5 * a.e * a.e + 10),
          (t + e + i) | 0
        );
      }),
      (this.C = function (f, u) {
        var p = this.A,
          P = 1 != p.s || p.v,
          m = 0.1 * p.v * p.v,
          g = 1 + 3e-4 * p.w,
          G = 0.1 * p.s * p.s * p.s,
          y = 1 + 1e-4 * p.t,
          x = 1 != p.s,
          v = p.x * p.x,
          w = p.g,
          b = p.q || p.r,
          S = 0.2 * p.r * p.r * p.r,
          M = p.q * p.q * (0 > p.q ? -1020 : 1020),
          C = p.p ? ((2e4 * (1 - p.p) * (1 - p.p)) | 0) + 32 : 0,
          T = p.d,
          I = p.j / 2,
          W = 0.01 * p.k * p.k,
          k = p.a,
          R = t,
          D = 1 / t,
          E = 1 / e,
          A = 1 / i,
          p = (5 / (1 + 20 * p.u * p.u)) * (0.01 + G);
        0.8 < p && (p = 0.8);
        for (
          var O,
            U,
            N,
            F,
            L,
            p = 1 - p,
            H = !1,
            B = 0,
            _ = 0,
            j = 0,
            q = 0,
            z = 0,
            K = 0,
            Y = 0,
            X = 0,
            J = 0,
            V = 0,
            Q = Array(1024),
            Z = Array(32),
            $ = Q.length;
          $--;

        )
          Q[$] = 0;
        for ($ = Z.length; $--; ) Z[$] = 2 * Math.random() - 1;
        for ($ = 0; $ < u; $++) {
          if (H) return $;
          if (
            (C && ++J >= C && ((J = 0), this.reset()),
            h && ++l >= h && ((h = 0), (a *= s)),
            (r += o),
            (a *= r),
            a > n && ((a = n), 0 < w && (H = !0)),
            (U = a),
            0 < I && ((V += W), (U *= 1 + Math.sin(V) * I)),
            (U |= 0),
            8 > U && (U = 8),
            k || ((c += d), 0 > c ? (c = 0) : 0.5 < c && (c = 0.5)),
            ++_ > R)
          )
            switch (((_ = 0), ++B)) {
              case 1:
                R = e;
                break;
              case 2:
                R = i;
            }
          switch (B) {
            case 0:
              j = _ * D;
              break;
            case 1:
              j = 1 + 2 * (1 - _ * E) * T;
              break;
            case 2:
              j = 1 - _ * A;
              break;
            case 3:
              (j = 0), (H = !0);
          }
          b &&
            ((M += S), (N = 0 | M), 0 > N ? (N = -N) : 1023 < N && (N = 1023)),
            P && g && ((m *= g), 1e-5 > m ? (m = 1e-5) : 0.1 < m && (m = 0.1)),
            (L = 0);
          for (var tt = 8; tt--; ) {
            if ((Y++, Y >= U && ((Y %= U), 3 == k)))
              for (O = Z.length; O--; ) Z[O] = 2 * Math.random() - 1;
            switch (k) {
              case 0:
                F = Y / U < c ? 0.5 : -0.5;
                break;
              case 1:
                F = 1 - 2 * (Y / U);
                break;
              case 2:
                (F = Y / U),
                  (F = 0.5 < F ? 6.28318531 * (F - 1) : 6.28318531 * F),
                  (F =
                    0 > F
                      ? 1.27323954 * F + 0.405284735 * F * F
                      : 1.27323954 * F - 0.405284735 * F * F),
                  (F =
                    0 > F ? 0.225 * (F * -F - F) + F : 0.225 * (F * F - F) + F);
                break;
              case 3:
                F = Z[Math.abs(((32 * Y) / U) | 0)];
            }
            P &&
              ((O = K),
              (G *= y),
              0 > G ? (G = 0) : 0.1 < G && (G = 0.1),
              x ? ((z += (F - K) * G), (z *= p)) : ((K = F), (z = 0)),
              (K += z),
              (q += K - O),
              (F = q *= 1 - m)),
              b && ((Q[X % 1024] = F), (F += Q[(X - N + 1024) % 1024]), X++),
              (L += F);
          }
          (L = 0.125 * L * j * v),
            (f[$] = 1 <= L ? 32767 : -1 >= L ? -32768 : (32767 * L) | 0);
        }
        return u;
      });
  })();
window.jsfxr = function (t) {
  W.A.B(t);
  var e = W.D();
  t = new Uint8Array(4 * (((e + 1) / 2) | 0) + 44);
  var e = 2 * W.C(new Uint16Array(t.buffer, 44), e),
    i = new Uint32Array(t.buffer, 0, 44);
  (i[0] = 1179011410),
    (i[1] = e + 36),
    (i[2] = 1163280727),
    (i[3] = 544501094),
    (i[4] = 16),
    (i[5] = 65537),
    (i[6] = 44100),
    (i[7] = 88200),
    (i[8] = 1048578),
    (i[9] = 1635017060),
    (i[10] = e);
  for (var e = e + 44, i = 0, a = "data:audio/wav;base64,"; i < e; i += 3)
    var n = (t[i] << 16) | (t[i + 1] << 8) | t[i + 2],
      a =
        a +
        ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
          n >> 18
        ] +
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
            (n >> 12) & 63
          ] +
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
            (n >> 6) & 63
          ] +
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
            63 & n
          ]);
  return (i -= e), a.slice(0, a.length - i) + "==".slice(0, i);
};
var soundUtils = (SU = {
  rd: function (t, e) {
    return e || ((e = t), (t = 0)), Math.random() * (e - t) + t;
  },
  rp: function (t) {
    return t[~~this.rd(t.length)];
  },
  soundEffect: function (t, e) {
    (SU[t] = []),
      e.forEach(function (e) {
        var i = new Audio();
        (i.src = jsfxr(e)), SU[t].push(i);
      });
  },
  play: function (t) {
    G.isSound && SU[t] && SU.rp(SU[t]).play();
  },
});
SU.soundEffect("gameOver", [
  [
    2,
    0.2,
    0.01,
    ,
    0.83,
    0.24,
    ,
    ,
    ,
    0.62,
    0.6,
    ,
    ,
    0.1248,
    0.4522,
    ,
    ,
    ,
    0.4,
    ,
    ,
    ,
    ,
    0.6,
  ],
]),
  SU.soundEffect("moveAhead", [
    [
      2,
      ,
      0.2047,
      ,
      0.3986,
      0.5855,
      0.2236,
      -0.1697,
      ,
      ,
      ,
      ,
      ,
      0.7882,
      -0.2576,
      ,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      0.43,
    ],
  ]),
  SU.soundEffect("highestScore", [
    [
      0,
      ,
      0.016,
      0.4953,
      0.3278,
      0.6502,
      ,
      ,
      ,
      ,
      ,
      0.4439,
      0.6322,
      ,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      1,
    ],
  ]),
  SU.soundEffect("explosion1", [
    [
      3,
      ,
      0.3729,
      0.6547,
      0.4138,
      0.0496,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      0.4,
    ],
  ]),
  SU.soundEffect("explosion2", [
    [
      3,
      0.43,
      0.61,
      0.3794,
      0.86,
      0.17,
      0.17,
      0.1399,
      0.1,
      0.07,
      0.06,
      0.04,
      0.1,
      ,
      ,
      0.96,
      0.26,
      -0.16,
      1,
      ,
      ,
      ,
      ,
      0.15,
    ],
  ]),
  SU.soundEffect("info", [
    [
      2,
      ,
      0.1889,
      ,
      0.111,
      0.2004,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      0.1157,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      0.1,
      ,
      1,
    ],
  ]),
  SU.soundEffect("soundOn", [
    [
      2,
      ,
      0.2,
      ,
      0.1753,
      0.64,
      ,
      -0.5261,
      ,
      ,
      ,
      ,
      ,
      0.5522,
      -0.564,
      ,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      0.5,
    ],
  ]),
  SU.soundEffect("playGame", [
    [
      2,
      ,
      0.261,
      0.2142,
      0.2005,
      0.4618,
      0.0137,
      -0.3602,
      ,
      ,
      ,
      ,
      ,
      0.2249,
      0.0858,
      ,
      ,
      ,
      1,
      ,
      ,
      1e-4,
      ,
      0.44,
    ],
  ]),
  SU.soundEffect("glitch", [
    [
      3,
      ,
      0.0272,
      0.5654,
      0.1785,
      0.7424,
      ,
      ,
      ,
      ,
      ,
      0.2984,
      0.5495,
      ,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      0.43,
    ],
  ]);
var SF,
  Flame,
  H,
  PI_2,
  Smoke,
  Trail,
  W,
  SmokyFlame,
  drawCircle,
  rand,
  w,
  slice = [].slice;
(PI_2 = 2 * Math.PI),
  (rand = function (t, e) {
    return (e - t) * Math.random() + t;
  }),
  (drawCircle = function (t, e, i, a) {
    return bp(), ar(t, e, i, 0, PI_2, !1), (ctx.fillStyle = a), fl();
  }),
  (Smoke = (function () {
    function t(t, e) {
      (this.opacity = 0.8), (this.x = t), (this.y = e), (this.r = 2);
    }
    return (
      (t.prototype.step = function (t, e, i) {
        if (
          ((e -= utils.getRandomInt(rand(60, 70), rand(200, 350))),
          (t += rand(-2, 2)),
          (this.opacity -= 0.04),
          this.opacity <= 0)
        )
          return (this.destroyed = !0);
      }),
      (t.prototype.draw = function (t, e, i) {
        if (
          ((e -= utils.getRandomInt(60, 150)),
          (t += utils.getRandomInt(rand(-i + i / 2, 0), rand(0, i - i / 2))),
          !(this.opacity <= 0))
        )
          return drawCircle(
            t,
            e,
            this.r,
            "rgba(60,60,60," + this.opacity + ")"
          );
      }),
      t
    );
  })()),
  (Trail = (function () {
    function t(t, e) {
      (this.opacity = 1), (this.x = t), (this.y = e), (this.r = 12);
    }
    return (
      (t.prototype.step = function (t, e, i) {
        if (
          ((this.r = i / 5),
          (e -= rand(0, 8)),
          (t -= rand(-3, 3)),
          (this.opacity -= 0.03),
          this.opacity <= 0 && ((this.destroyed = !0), rand(0, 1) < 0.5))
        )
          return SF.addEntity(Smoke, t, e - this.r);
      }),
      (t.prototype.draw = function (t, e, i) {
        (this.r = i / 6),
          (e -= rand(rand(-45, 5), rand(25, 75))),
          (t -= rand(-i / 2 - 20, i / 2 + 20));
        var a, n, r, o;
        if (!(this.opacity <= 0))
          return (
            (a =
              "rgba(255," +
              ~~(240 * this.opacity) +
              ",0," +
              this.opacity +
              ")"),
            (n = "rgba(255," + ~~(240 * this.opacity) + ",0,0)"),
            (o = 1.5 * this.r + rand(0, 2)),
            (r = ctx.createRadialGradient(t, e, 0, t, e, o)),
            r.addColorStop(0, a),
            r.addColorStop(1, n),
            drawCircle(t, e, this.r, r),
            drawCircle(t, e, this.r * this.opacity, a)
          );
      }),
      t
    );
  })()),
  (Flame = (function () {
    function t() {
      (this.x = G.can.width / 2),
        (this.y = G.can.height / 2 + 90),
        (this.r = 24),
        (this.rg = 22);
    }
    return (
      (t.prototype.step = function (t, e, i) {
        return !1;
      }),
      (t.prototype.draw = function (t, e, i) {
        (this.g = ctx.createRadialGradient(t, e, 0, t, e, 1.2 * i)),
          this.g.addColorStop(0, "rgba(255,255,255,1)"),
          this.g.addColorStop(1, "rgba(255,120,0,0)");
        var a;
        return (
          SF.addEntity(Trail, t, e - this.r / 3),
          (a = ctx.createRadialGradient(t, e, 0, t, e, this.rg)),
          a.addColorStop(0, "rgba(255,180,0," + rand(0.2, 0.9) + ")"),
          a.addColorStop(1, "rgba(255,180,0,0)"),
          drawCircle(t, e, this.rg, a),
          drawCircle(t + rand(-1.5, 1.5), e + rand(-1.5, 1.5), i, this.g)
        );
      }),
      t
    );
  })()),
  (SmokyFlame = (function () {
    function t() {
      (SF = this), (this.entities = {}), (this.i = 0), (this.ii = 0);
    }
    return (
      (t.prototype.addEntity = function () {
        var t, e;
        return (
          (e = arguments[0]),
          (t = 2 <= arguments.length ? slice.call(arguments, 1) : []),
          (this.entities[this.i] = (function (t, e, i) {
            i.prototype = t.prototype;
            var a = new i(),
              n = t.apply(a, e);
            return Object(n) === n ? n : a;
          })(e, t, function () {})),
          (this.i += 1)
        );
      }),
      (t.prototype.update = function (t, e, i) {
        var a, n, r;
        r = this.entities;
        for (n in r)
          (a = r[n]),
            a.destroyed !== !0
              ? (this.ii % 5 === 0 &&
                  (a.step(t + i / 2, e - 10, i),
                  a.draw(t + i / 2, e - 10, i),
                  (this.ii = 0)),
                this.ii++)
              : delete this.entities[n];
      }),
      t
    );
  })());
var MN;
Menu.prototype = {
  getNoise: function () {
    var t = document.createElement("canvas");
    (t.width = G.can.width), (t.height = G.can.height);
    for (
      var e = t.getContext("2d"),
        i = t.width,
        a = t.height,
        n = e.createImageData(i, a),
        r = i * a * 4,
        o = 0;
      o < r;
      o += 4
    )
      (n.data[o] = 15),
        (n.data[o + 1] = 3),
        (n.data[o + 2] = 1),
        (n.data[o + 3] = Math.floor(128 * Math.random()));
    sv(),
      e.putImageData(n, 0, 0),
      e.drawImage(t, 0, 0, 64 * i, 64 * a),
      (e.globalAlpha = 0.5),
      e.drawImage(t, 0, 0, 16 * i, 16 * a);
    for (var n = e.getImageData(0, 0, i, a), o = 3; o < i * a * 4; o += 4)
      n.data[o] > 220 && (n.data[o] = 255), n.data[o] < 40 && (n.data[o] = 0);
    return e.putImageData(n, 0, 0), rs(), t;
  },
  getHeatMap: function () {
    var t = document.createElement("canvas");
    (t.width = G.can.width), (t.height = G.can.height);
    var e = t.getContext("2d");
    sv();
    var i = G.can.width,
      a = G.can.height,
      n = MN.fireColor,
      r = G.isGameOver ? "GAME" : "SAVE",
      o = G.isGameOver ? "OVER" : "THE";
    (thirdText = G.isGameOver ? "" : "FOREST"),
      G.isMobile()
        ? ((r = r.split("").join(" ")),
          (o = o.split("").join(" ")),
          (thirdText = thirdText.split("").join(" ")))
        : ((r = r.split("").join("   ")),
          (o = o.split("").join("   ")),
          (thirdText = thirdText.split("").join("   "))),
      (e.fillStyle = n),
      (e.strokeStyle = n),
      (e.font = MN.font);
    var s = e.measureText(r),
      l = e.measureText(o),
      h = e.measureText(thirdText);
    if (
      (e.fillText(r, (i - s.width) / 2, a / 6),
      e.fillText(o, (i - l.width) / 2, a / 4),
      e.fillText(thirdText, (i - h.width) / 2, a / 3),
      (e.lineWidth = 10),
      G.isInfoMenu)
    ) {
      var c = G.isMobile() ? 10 : 4.4;
      e.beginPath(),
        e.arc(i / 10, a / c, 30, 0, 2 * Math.PI, !1),
        (e.fillStyle = "#555"),
        e.closePath(),
        e.fill(),
        e.beginPath(),
        e.moveTo(i / 10, a / c - 5),
        e.lineTo(i / 10, a / c - 5 - 10),
        e.lineTo(i / 10 - 20, a / c - 5 + 5),
        e.lineTo(i / 10, a / c - 5 + 20),
        e.lineTo(i / 10, a / c - 5 + 10),
        e.lineTo(i / 10 + 20, a / c - 5 + 10),
        e.lineTo(i / 10 + 20, a / c - 5),
        e.closePath(),
        (e.fillStyle = "#000"),
        e.fill();
      var d = [
        "Save our planet Earth!",
        "Protect Forest! Don't burn them!",
        "Abrupt climatic changes. Time to worry!",
        "Extinguish fire on trees.",
        "Hit spacebar or tap to jump player.",
        "Earn Karma! Nature will show her love!",
        "JS13KGames 16 - hidden glitches",
        "Climate Abnormalities, Player Loves Trees",
        "(Player struggles to jump off tree)",
        "More hinderances once speed > 1.6 mph",
      ];
      (e.font = G.isMobile() ? "15px Helvetica" : "20px Helvetica"),
        (e.fillStyle = "#fff");
      for (var f = 0; f < d.length; f++) {
        var u = d[f],
          p = G.isMobile() ? 40 * f : 45 * f;
        (0 !== f && 2 !== f && 4 !== f && 6 !== f) ||
          (e.beginPath(),
          e.arc(i / 10, a / 2.6 + p, 10, 0, 2 * Math.PI, !1),
          e.fill(),
          e.closePath()),
          e.fillText(u, i / 10 + (G.isMobile() ? 25 : 50), a / 2.6 + p);
      }
    } else {
      var P = "BEST: " + G.highscore;
      if (
        ((P = G.isMobile() ? P.split("").join(" ") : P.split("").join("   ")),
        (e.fillStyle = "#fff"),
        (e.font = "35px Helvetica"),
        e.fillText(P, (i - e.measureText(P).width) / 2, a / 2.1),
        e.beginPath(),
        e.arc(0.25 * i, a / 1.2, 30, 0, 2 * Math.PI, !1),
        (e.fillStyle = "#555"),
        e.closePath(),
        e.fill(),
        e.beginPath(),
        e.arc(0.75 * i, a / 1.2, 30, 0, 2 * Math.PI, !1),
        (e.fillStyle = "#555"),
        e.closePath(),
        e.fill(),
        e.beginPath(),
        e.moveTo(0.25 * i - 20, a / 1.2 - 10),
        e.lineTo(0.25 * i - 20, a / 1.2 + 5),
        e.lineTo(0.25 * i - 10, a / 1.2 + 5),
        e.lineTo(0.25 * i + 5, a / 1.2 + 15),
        e.lineTo(0.25 * i + 5, a / 1.2 - 20),
        e.lineTo(0.25 * i - 10, a / 1.2 - 10),
        (e.fillStyle = "#222"),
        e.closePath(),
        G.isSound &&
          (e.fillRect(0.25 * i + 10, a / 1.2 - 5, 3, 10),
          e.fillRect(0.25 * i + 15, a / 1.2 - 7, 3, 15),
          e.fillRect(0.25 * i + 20, a / 1.2 - 10, 3, 20)),
        e.fill(),
        G.isSound ||
          (e.save(),
          e.beginPath(),
          e.moveTo(0.25 * i + 10, a / 1.2 - 22),
          e.lineTo(0.25 * i - 10, a / 1.2 + 22),
          e.closePath(),
          e.fill(),
          (e.lineWidth = 5),
          (e.strokeStyle = "#000"),
          e.stroke(),
          e.restore()),
        e.fillRect(0.75 * i - 2, a / 1.2, 5, 15),
        e.beginPath(),
        e.arc(0.75 * i, a / 1.2 - 10, 5, 0, 2 * Math.PI, !1),
        e.closePath(),
        (e.fillStyle = "#222"),
        e.fill(),
        G.isGameOver)
      ) {
        (e.fillStyle = "#fff"), (e.font = "35px Helvetica");
        var m = "KARMA: " + G.karma;
        (m = G.isMobile() ? m.split("").join(" ") : m.split("").join("   ")),
          e.fillText(m, (i - e.measureText(m).width) / 2, a / 2.5),
          (e.lineWidth = 10),
          e.beginPath(),
          e.arc(0.5 * i, a / 1.2, 30, 0, 2 * Math.PI, !1),
          (e.fillStyle = "#555"),
          e.closePath(),
          e.fill(),
          e.beginPath(),
          e.moveTo(0.5 * i - 10, a / 1.2 - 15),
          e.lineTo(0.5 * i - 10, a / 1.2 - 15 + 15),
          e.lineTo(0.5 * i - 20, a / 1.2 - 15 + 15),
          e.lineTo(0.5 * i, a / 1.2 - 15 + 35),
          e.lineTo(0.5 * i + 20, a / 1.2 - 15 + 15),
          e.lineTo(0.5 * i + 10, a / 1.2 - 15 + 15),
          e.lineTo(0.5 * i + 10, a / 1.2 - 15),
          (e.fillStyle = "#222"),
          e.closePath(),
          e.fill();
      }
      e.beginPath(),
        e.arc(i / 2, a / 1.6, 50, 0, 2 * Math.PI, !1),
        (e.fillStyle = "#793f02"),
        e.closePath(),
        e.fill();
      var g = 20,
        y = a / 1.6 - g;
      e.beginPath(),
        e.moveTo(i / 2 - g / 2, y),
        e.lineTo(i / 2 + g, y + 20),
        e.lineTo(i / 2 - g / 2, y + 40),
        (e.fillStyle = "#fff"),
        e.closePath(),
        e.fill();
    }
    return rs(), t;
  },
  process: function () {
    sv(),
      (ctx.globalAlpha = 0.35),
      (ctx.globalCompositeOperation = "source-over"),
      (MN.y = (MN.y + 3) % MN.noise.height),
      (x = 0 * Math.round(5 * Math.random())),
      ctx.drawImage(MN.noise, x, MN.y),
      ctx.drawImage(MN.noise, x, MN.y - MN.noise.height),
      (ctx.globalAlpha = 1),
      (x = 1 - 2 * Math.random()),
      ctx.drawImage(G.can, x, -1),
      (ctx.globalAlpha = 0.13),
      (ctx.globalCompositeOperation = "lighter"),
      ctx.drawImage(G.can, x, -1),
      (ctx.globalAlpha = 0.22),
      ctx.drawImage(MN.heat, 0, 0),
      fs(MN.fireColor),
      bp(),
      (ctx.globalAlpha = 0.52),
      cp(),
      fl(),
      rs();
  },
  mouseDown: function (t, e, i) {
    var a = G.can.width,
      n = G.can.height,
      r = (MN.heat.getContext("2d"), G.isMobile() ? 10 : 4.4);
    e >= a / 2 - 50 && e <= a / 2 + 50 && i >= n / 1.6 - 50 && i <= n / 1.6 + 50
      ? ((G.menu = null), G.restart(), SU.play("playGame"))
      : e >= 0.5 * a - 30 &&
        e <= 0.5 * a + 30 &&
        i >= n / 1.2 - 30 &&
        i <= n / 1.2 + 30
      ? (downloadCanvas(), SU.play("download"))
      : e >= 0.25 * a - 30 &&
        e <= 0.25 * a + 30 &&
        i >= n / 1.2 - 30 &&
        i <= n / 1.2 + 30
      ? ((G.isSound = +!G.isSound),
        G.isSound && SU.play("soundOn"),
        utils.setLocalStorageData(G.isSound, !0),
        (MN.heat = MN.getHeatMap()))
      : e >= 0.75 * a - 30 &&
        e <= 0.75 * a + 30 &&
        i >= n / 1.2 - 30 &&
        i <= n / 1.2 + 30
      ? ((G.isInfoMenu = !0), (MN.heat = MN.getHeatMap()), SU.play("info"))
      : e >= 0.1 * a - 30 &&
        e <= 0.1 * a + 30 &&
        i >= n / r - 30 &&
        i <= n / r + 30 &&
        ((G.isInfoMenu = !1), (MN.heat = MN.getHeatMap()), SU.play("info"));
  },
  update: function () {
    MN.process();
  },
};
var CC,
  RN,
  WD,
  SM,
  cloud,
  sunMoon,
  wind,
  rain,
  diffInWeatherTime = 5;
(Cloud.prototype = {
  drawArcs: function (t, e, i, a) {
    bp(),
      mt(t / i + 150, e - 15),
      qct(t / i + 150 + 50, e - 15 + 0, t / i + 150 + 40, e - 15 + 40),
      (ctx.lineWidth = 4),
      sts(thisWeather.hexToRgb(thisWeather.getColor(), 0.8)),
      st(),
      bp(),
      mt(t / i + 20 + 30, e + 10),
      qct(t / i + 30, e + 35 + 10, t / i + 30 + 60, e + 35 + 15),
      st();
  },
  draw: function (t, e, i, a) {
    var n = thisWeather.hexToRgb(thisWeather.getColor(), 0.5);
    ctx.scale(i, a),
      bp(),
      fs(n),
      mt(t / i, e),
      bct(t / i - 40, e + 20, t / i - 40, e + 70, t / i + 60, e + 70),
      bct(t / i + 80, e + 100, t / i + 150, e + 100, t / i + 170, e + 70),
      bct(t / i + 250, e + 70, t / i + 250, e + 40, t / i + 220, e + 20),
      bct(t / i + 260, e - 40, t / i + 200, e - 50, t / i + 170, e - 30),
      bct(t / i + 150, e - 75, t / i + 80, e - 60, t / i + 80, e - 30),
      bct(t / i + 30, e - 75, t / i - 20, e - 60, t / i, e),
      cp(),
      (ctx.shadowColor = thisWeather.hexToRgb(thisWeather.getColor(), 0.8)),
      (ctx.shadowOffsetX = -3),
      (ctx.shadowOffsetY = 3),
      (ctx.shadowBlur = 10),
      (ctx.lineWidth = 3),
      sts(thisWeather.hexToRgb(thisWeather.getColor(), 0.8)),
      st(),
      fl(),
      this.drawArcs(t, e, i, a);
  },
  update: function () {
    (this.x -= this.speed),
      this.x + 250 < 0 &&
        ((this.x = CC.w + 250),
        (this.y = this.y + utils.getRandomInt(-10, 10)));
    var t = this.x,
      e = this.y;
    sv(),
      this.draw(t, e, 0.8, 0.7),
      this.draw(t, e, 0.7, 0.6),
      this.draw(t, e, 0.6, 0.6),
      this.draw(t, e, 0.5, 0.7),
      rs();
  },
}),
  (SunMoon.prototype = {
    getColor: function () {
      var t;
      switch (G.period) {
        case "morning":
          t = this.isSun ? "#ffff9e" : "#fff";
          break;
        case "afternoon":
          t = this.isSun ? "yellow" : "#fff";
          break;
        case "evening":
          t = this.isSun ? "#e28800" : "#fff";
          break;
        case "night":
          this.isSun, (t = "#fff");
      }
      return t;
    },
    resetPos: function () {
      (this.x = 0),
        (this.y = 100),
        (G.period = "morning"),
        (thisWeather.step = 0);
    },
    update: function () {
      return (
        (Weather.dt / 1e3) % (5 * diffInWeatherTime) > 5 * diffInWeatherTime ||
        (Weather.dt / 1e3) % (5 * diffInWeatherTime) > 4 * diffInWeatherTime ||
        (Weather.dt / 1e3) % (5 * diffInWeatherTime) > 3 * diffInWeatherTime
          ? (G.period = "night")
          : (Weather.dt / 1e3) % (5 * diffInWeatherTime) > 2 * diffInWeatherTime
          ? (G.period = "evening")
          : (Weather.dt / 1e3) % (5 * diffInWeatherTime) > 1 * diffInWeatherTime
          ? (G.period = "afternoon")
          : (G.period = "morning"),
        (this.x += G.can.width / (2 * diffInWeatherTime) / fps),
        this.x > G.can.width
          ? (this.resetPos(), void (this.isSun = !this.isSun))
          : ((this.y -= 0.1),
            sv(),
            (ctx.shadowColor = this.getColor()),
            (ctx.shadowOffsetX = -3),
            (ctx.shadowOffsetY = 3),
            (ctx.shadowBlur = 10),
            bp(),
            ar(this.x, this.y, this.r, 0, 2 * Math.PI, !0),
            cp(),
            (ctx.fillStyle = this.getColor()),
            fl(),
            rs(),
            sv(),
            bp(),
            (ctx.fillStyle = thisWeather.hexToRgb("#444", 0.5)),
            this.isSun || ar(this.x + 5, this.y - 5, 20, 0, 2 * Math.PI, !0),
            cp(),
            fl(),
            rs(),
            void thisWeather.updateGradient())
      );
    },
  }),
  (Wind.prototype = {
    create: function () {
      for (var t = 0; t < WD.particlesCount; t++)
        WD.particles.push(new WindParticle(t));
    },
    update: function () {
      for (var t = 0; t < WD.particles.length; t++) {
        var e = WD.particles[t];
        (e.x -= M.max(e.speed)),
          (e.color = thisWeather.getColor()),
          fs(e.color);
        var i = utils.getRandomInt(10, 50);
        bp(),
          mt(e.x, e.y),
          lt(e.x - i, e.y),
          cp(),
          fl(),
          (ctx.lineWidth = 2),
          sts(e.color),
          st(),
          e.x < 0 && (WD.particles[t] = new WindParticle(t));
      }
    },
  }),
  (Rain.prototype = {
    create: function () {
      for (var t = 0; t < RN.particlesCount; t++)
        RN.particles.push(new Droplet(t));
    },
    update: function () {
      for (var t = 0; t < RN.particles.length; t++) {
        var e = RN.particles[t];
        (e.y += e.speed),
          (e.x -= M.max(G.speed, wind.speed)),
          (e.color = thisWeather.getColor()),
          fs(e.color);
        var i = utils.getRandomInt(6, 20);
        bp(),
          mt(e.x, e.y),
          lt(e.x - 2, e.y + i),
          cp(),
          fl(),
          (ctx.lineWidth = 2),
          sts(e.color),
          st(),
          e.y > CC.h && (RN.particles[t] = new Droplet(t));
      }
    },
  }),
  (Weather.prototype = {
    updateGradient: function () {
      var t = thisWeather.colors[thisWeather.colorIndices[0]],
        e = thisWeather.colors[thisWeather.colorIndices[1]],
        i =
          (thisWeather.colors[thisWeather.colorIndices[2]],
          thisWeather.colors[thisWeather.colorIndices[3]],
          1 - thisWeather.step),
        a = Math.round(i * t[0] + thisWeather.step * e[0]),
        n = Math.round(i * t[1] + thisWeather.step * e[1]),
        r = Math.round(i * t[2] + thisWeather.step * e[2]),
        o = "rgb(" + a + "," + n + "," + r + ")",
        s = Math.round(255 * i + 255 * thisWeather.step),
        l = Math.round(255 * i + 255 * thisWeather.step),
        h = Math.round(255 * i + 255 * thisWeather.step),
        c = "rgb(" + s + "," + l + "," + h + ")",
        d = ctx.createLinearGradient(0, 0, 0, G.can.height);
      if (
        (d.addColorStop(0, o),
        d.addColorStop(0.9, c),
        (G.backgroundColor = d),
        (thisWeather.step += SM.isSun ? 0.0076 : 0.0076 / 2.22),
        thisWeather.step >= 1)
      ) {
        thisWeather.step = 0;
        for (var f = 0; f < thisWeather.colorIndices.length; f++)
          thisWeather.colorIndices[f] =
            (thisWeather.i + 1) % thisWeather.colors.length;
        thisWeather.i += 1;
      }
    },
    hexToRgb: function (t, e) {
      if (t) {
        e = e || 1;
        var i = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        t = t.replace(i, function (t, e, i, a) {
          return e + e + i + i + a + a;
        });
        var a = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);
        return a
          ? "rgba(" +
              parseInt(a[1], 16) +
              "," +
              parseInt(a[2], 16) +
              "," +
              parseInt(a[3], 16) +
              "," +
              e +
              ")"
          : "rgba(255,255,255,0)";
      }
    },
    getColor: function (t) {
      var e;
      switch (G.period) {
        case "morning":
          e = t ? (SM.isSun ? "#444" : "#fff") : SM.isSun ? "#8ED6FF" : "#444";
          break;
        case "afternoon":
          e = t ? (SM.isSun ? "#444" : "#fff") : SM.isSun ? "#56baf3" : "#444";
          break;
        case "evening":
          e = t ? (SM.isSun ? "#444" : "#fff") : SM.isSun ? "#999" : "#444";
          break;
        case "night":
          e = t ? (SM.isSun ? "#444" : "#fff") : (SM.isSun, "#444");
      }
      return e;
    },
    update: function () {
      var t = new Date().getTime();
      (Weather.dt = t - G.gameStartTime),
        sunMoon.update(),
        G.isMobile() ||
          (cloud.update(),
          this.canRain || M.ceil(Weather.dt / 1e3) % 16 !== 0
            ? M.ceil(Weather.dt / 1e3) % 33 === 0 &&
              ((this.canRain = !1), (this.isRaining = !1))
            : ((this.canRain = !0), (this.isRaining = !0)),
          this.canRain && this.isRaining && rain.update(),
          wind.update());
    },
    init: function () {
      (cloud = new Cloud()),
        (sunMoon = new SunMoon()),
        (rain = new Rain()),
        (wind = new Wind()),
        this.update();
    },
  });
var PS;
Particles.prototype = {
  draw: function () {
    fs("red");
    for (var t = 0; t < 10; t += 2)
      fr(
        PS.x + 4 * t,
        M.min(PS.y + this.vyL1, CC.h - 50),
        utils.getRandomInt(4, 6),
        utils.getRandomInt(4, 6)
      );
    for (var t = 1; t < 10; t += 2)
      fr(
        PS.x + 4 * t,
        M.min(PS.y + 7 + this.vyL2, CC.h - 50),
        utils.getRandomInt(4, 6),
        utils.getRandomInt(4, 6)
      );
    for (var t = 0; t < 10; t += 2)
      fr(
        PS.x + 4 * t,
        M.min(PS.y + 15 + this.vyL3, CC.h - 50),
        utils.getRandomInt(4, 6),
        utils.getRandomInt(4, 6)
      );
    (this.diff = CC.h - PS.y),
      (PS.y += this.diff * (10 / 15) * (fps / 1e3)),
      PS.y > CC.h - P.fireOffset && (PS.finished = !0),
      (PS.x -= G.speed);
  },
};
var flameBack = new (function () {
    var t,
      e,
      i,
      a,
      n,
      r,
      o,
      s,
      l = 2,
      h = 2.5,
      c = 5;
    (this.time = new Date()),
      (this.canvas = void 0),
      (this.init = function () {
        (t = this.canvas.getContext("2d")),
          (o = (this.canvas.width + 30) / l),
          (s = P.fireOffset / l),
          (o = Math.ceil(o)),
          (s = Math.ceil(s)),
          (r = Array(o * s));
        for (var e = 0; e < r.length; e++) r[e] = 255;
        d(), f(), this.update();
      });
    var d = function () {
        n = Array(256);
        for (var t = 0; t < 64; t++)
          (n[t] = [t << 2, 0, 0]),
            (n[t + 64] = [255, t << 2, 0]),
            (n[t + 128] = [255, 255, t << 2]),
            (n[t + 192] = [255, 255, 255]);
      },
      f = function () {
        (e = document.createElement("canvas")),
          (e.width = o),
          (e.height = s),
          (e.style.visibility = "hidden"),
          (i = e.getContext("2d")),
          (a = i.createImageData(o, s));
      };
    this.update = function () {
      if (G.isMobile()) {
        var t = ctx.createLinearGradient(
          0,
          CC.h - P.fireOffset,
          0,
          G.can.height
        );
        t.addColorStop(
          0,
          "rgba(255, 0, 0, " + utils.getRandomInt(8, 10) / 10 + ")"
        ),
          t.addColorStop(
            0.7,
            "rgba(255, 165, 0, " + utils.getRandomInt(8, 10) / 10 + ")"
          ),
          t.addColorStop(
            0.9,
            "rgba(255, 255, 0, " + utils.getRandomInt(8, 10) / 10 + ")"
          ),
          sv(),
          fs(t),
          fr(0, CC.h - P.fireOffset, G.can.width, P.fireOffset),
          rs();
      } else u(), p(), (h = utils.getRandomInt(0, 6));
    };
    var u = function () {
        for (var t = o - 1; t >= 1; t--)
          for (var e = s; e--; ) {
            var i =
              (r[y(t - 1, e - 1)] +
                r[y(t, e - 1)] +
                r[y(t + 1, e - 1)] +
                r[y(t - 1, e)] +
                r[y(t + 1, e)] +
                r[y(t - 1, e + 1)] +
                r[y(t, e + 1)] +
                r[y(t + 1, e + 1)]) >>
              3;
            (i = Math.max(0, i - g(h))),
              (r[y(t, e - 1)] = i),
              e < s - c &&
                (e < s - 2 &&
                  ((r[y(t, s)] = g(n.length)), (r[y(t, s - 1)] = g(n.length))),
                m(t, e, n[r[y(t, e)]]));
          }
      },
      p = function () {
        i.putImageData(a, 0, 0),
          t.drawImage(e, -20, CC.h - s * l, o * l, s * l + 10);
      },
      m = function (t, e, i) {
        var n = 4 * (t + e * a.width);
        (a.data[n] = i[0]),
          (a.data[n + 1] = i[1]),
          (a.data[n + 2] = i[2]),
          (a.data[n + 3] = 255);
      },
      g = function (t) {
        return ~~(Math.random() * t);
      },
      y = function (t, e) {
        return e * o + t;
      };
    this.drawEmbers = function () {
      for (var t = 1; t < o - 1; t++)
        for (var e = 1; e < s; e++)
          Math.random() < 0.11 && (r[y(t, e)] = g(n.length));
    };
  })(),
  Pl;
Player.prototype = {
  tears: function (t, e) {
    Pl.died ||
      (bp(),
      (ctx.fillStyle = "#36b1f7"),
      mt(Pl.x + Pl.w + t - 3, Pl.y + e),
      lt(Pl.x + Pl.w + t, Pl.y + e - 4),
      lt(Pl.x + Pl.w + t + 3, Pl.y + e),
      ar(Pl.x + Pl.w + t, Pl.y + e, 3, 0, Math.PI),
      cp(),
      fl());
  },
  body: function () {
    sv(),
      (ctx.shadowColor = "#000"),
      (ctx.shadowOffsetX = -2),
      (ctx.shadowOffsetY = 2),
      (ctx.shadowBlur = 10),
      Pl.died
        ? (fr(Pl.x - 2 * (Pl.h / 3), Pl.y, (2 * Pl.h) / 3, Pl.w), rs())
        : (fr(Pl.x, Pl.y, Pl.w, (2 * Pl.h) / 3),
          rs(),
          fs("#777"),
          fr(Pl.x + 3, Pl.y + 15, 3, 2 * (Pl.h / 3) - 30)),
      rs();
  },
  eyes: function () {
    if (Pl.w || Pl.h) {
      var t,
        e = new Date();
      (Pl.isBlink = e - Pl.t > 2500 ? ++Pl.isBlink : 0),
        (t = Pl.isBlink > 5 ? "#000" : "#fff"),
        Pl.isBlink >= 8 && ((Pl.t = e), (Pl.isBlink = 0)),
        bp(t),
        Pl.died
          ? (ar(Pl.x - 2 * (Pl.h / 3) + 6, Pl.y + 4, 2, 0, 2 * M.PI, !0),
            ar(Pl.x - 2 * (Pl.h / 3) + 6, Pl.y + 10, 2, 0, 2 * M.PI, !0))
          : (ar(Pl.x + 2 * (Pl.w / 3) - 2, Pl.y + 5, 2, 0, 2 * M.PI, !0),
            ar(Pl.x + (Pl.w - 3), Pl.y + 5, 2, 0, 2 * M.PI, !0)),
        (ctx.fillStyle = t),
        fl();
    }
  },
  legs: function () {
    var t = 3;
    fs("#000"),
      Pl.died
        ? (fr(Pl.x, Pl.y + Pl.w / 3, Pl.h / 3, t),
          fr(Pl.x, Pl.y + 2 * (Pl.w / 3), Pl.h / 3, t))
        : (fr(Pl.x + Pl.w / 3 - t / 2, Pl.y + 2 * (Pl.h / 3), t, Pl.h / 3),
          fr(
            Pl.x + 2 * (Pl.w / 3) - t / 2,
            Pl.y + 2 * (Pl.h / 3),
            t,
            Pl.h / 3
          ));
  },
  fe: function () {
    fs("#eaeaea"),
      bp(),
      el(ctx, Pl.x - 30, Pl.y + Pl.h, 80, 10, "#000"),
      cp(),
      fs("#EAEAEA"),
      fl(),
      (ctx.lineWidth = 1),
      sts("#dedede"),
      st(),
      fs("#8ED6FF");
    for (var t = -30; t < Pl.w + 30; t += 6)
      bp(),
        mt(Pl.x + t, Pl.y + Pl.h),
        lt(
          Pl.x + t - 1,
          Pl.y + Pl.h + utils.getRandomInt(10, G.can.height / 2)
        ),
        lt(
          Pl.x + t + 3,
          Pl.y + Pl.h + utils.getRandomInt(10, G.can.height / 2)
        ),
        lt(Pl.x + t + 1, Pl.y + Pl.h),
        cp(),
        fl();
  },
  burst: function () {
    Pl.w && Pl.h
      ? (this.dieParticles = new Particles(Pl.x, Pl.y))
      : PS.finished && (G.stopCycle(), (PS.finished = !1)),
      Pl.w || Pl.h || this.dieParticles.draw(),
      (Pl.w = 0),
      (Pl.h = 0);
  },
  update: function () {
    (Pl.x -= G.speed),
      Pl.isInAir && Pl.bounceFactor > 0
        ? ((Pl.y -= Pl.bounceHeight),
          (Pl.x += 1.5 * G.speed),
          (Pl.bounceFactor -= 2))
        : Pl.isInAir && !Pl.bounceFactor
        ? ((Pl.y -= Pl.bounceHeight / 2),
          (Pl.x += 1.5 * G.speed),
          (Pl.bounceFactor -= 2))
        : Pl.isInAir && Pl.bounceFactor === -2
        ? ((Pl.y -= 0), (Pl.x += 1.5 * G.speed), (Pl.bounceFactor -= 2))
        : Pl.isInAir && Pl.bounceFactor === -4
        ? ((Pl.y -= Pl.bounceHeight / 2),
          (Pl.x += 1.5 * G.speed),
          (Pl.bounceFactor -= 2))
        : Pl.isInAir &&
          Pl.bounceFactor === -6 &&
          ((Pl.y += Pl.bounceHeight),
          (Pl.x += 1.5 * G.speed),
          (Pl.bounceFactor = -6)),
      Pl.died &&
        !Pl.busted &&
        ((Pl.y += 10),
        Pl.isCornerStrike
          ? Pl.y > CC.h - 3 * P.fireOffset && (Pl.busted || (Pl.busted = !0))
          : Pl.busted || (Pl.busted = !0)),
      fs("#000"),
      Pl.body(),
      Pl.legs(),
      Pl.eyes(),
      Pl.tears(2, 6),
      Pl.tears(5, 15),
      Pl.isInAir && !Pl.busted && Pl.fe(),
      Pl.busted && Pl.burst(),
      Pl.checkCollision();
  },
  keyDown: function (t) {
    if (!Pl.busted) {
      if (32 === t) {
        if (((Pl.irj = !0), Pl.h < 50)) return;
        (Pl.h -= 2), (Pl.y += 2);
      } else 39 === t && (Pl.x += G.speed);
      Pl.irj &&
        ((Pl.irj = !1),
        (Pl.isInAir = !0),
        (Pl.isKarmaLocked = !1),
        (Pl.bounceFactor = Pl.maxH - Pl.h),
        (Pl.bounceFactor *= 4),
        (Pl.h = Pl.maxH));
    }
  },
  keyUp: function () {},
  checkCollision: function () {
    if (Pl.x <= 0) return (Pl.died = !0), void (Pl.isCornerStrike = !0);
    if (Pl.y > CC.h - P.fireOffset)
      return (Pl.died = !0), void (Pl.isCornerStrike = !0);
    if (Pl.x + Pl.w > CC.w)
      return (Pl.died = !0), void (Pl.isCornerStrike = !0);
    if (Pl.y < 0) return (Pl.died = !0), void (Pl.isCornerStrike = !0);
    var t, e;
    for (t = 0; t < G.trees.length; t++) {
      e = G.trees[t];
      var i = Pl.x + Pl.w - 4;
      if (i >= e.x && i < e.x + e.width + 4 && Pl.y + Pl.w + Pl.h >= e.x) {
        for (var a = 0; a < Pl.bounceHeight; a++)
          if (Pl.y + Pl.h + a >= e.y) {
            (G.trees[t].flame = null),
              (Pl.isInAir = !1),
              (Pl.liesOn = t),
              Pl.isKarmaLocked ||
                Pl.liesOn === Pl.lastLiesOn ||
                (G.karma && SU.play("moveAhead"), (G.karma += 1)),
              (Pl.isKarmaLocked = !0),
              (Pl.lastLiesOn = Pl.liesOn);
            break;
          }
        if (Pl.y >= e.y && Pl.y < e.y + e.height) {
          Pl.died = !0;
          break;
        }
      }
    }
  },
};
var T,
  CC,
  blw = 200,
  bw = 0;
Tree.prototype = {
  getWidth: function (t) {
    return void 0 !== t ? t : utils.getRandomInt(T.minW, T.maxW);
  },
  getHeight: function (t) {
    return void 0 !== t ? t : utils.getRandomInt(T.minH, T.maxH);
  },
  add: function (t) {
    return (
      T.preCompute(),
      (T.x = blw + bw),
      (T.y = CC.h - T.h - 0.6 * P.fireOffset),
      (T.width = bw),
      (T.height = T.h),
      T
    );
  },
  update: function (t) {
    var e = t.x,
      i = t.y,
      a = t.width,
      n = t.height;
    sv(),
      fs(T.color),
      bp(),
      mt(e, i),
      bct(e, i + n, e - 25, i + n, e - 25, i + n),
      bct(e, i + n, e + a / 2, i + n / 1.2, e + a / 2, i + n / 1.2),
      bct(e + a / 2, i + n / 1.2, e + a / 2, i + n / 1.2, e + a + 25, i + n),
      bct(e + a, i + n, e + a, i, e + a, i),
      (ctx.shadowColor = "#6b4e2a"),
      (ctx.shadowOffsetX = -3),
      (ctx.shadowOffsetY = 3),
      (ctx.shadowBlur = 10),
      (ctx.strokeStyle = "#6b4e2a"),
      (ctx.lineWidth = 1),
      st(),
      cp(),
      fl(),
      rs(),
      fs("#444"),
      el(ctx, e, i - 4, a, 10, "#6b4e2a"),
      t.flame &&
        (G.isMobile() ? T.addCircle(e, i, a) : t.flame.update(e, i, a));
  },
  addCircle: function (t, e, i) {
    bp(),
      ar(t + i / 2, e, i / 2, 0, 2 * Math.PI, !1),
      fs("rgba(255, 0, 0, 0.4)"),
      fl(),
      bp(),
      ar(t + i / 2, e, i / 3, 0, 2 * Math.PI, !1),
      fs("rgba(255, 165, 0, 0.4)"),
      fl(),
      bp(),
      ar(t + i / 2, e, i / 6, 0, 2 * Math.PI, !1),
      fs("rgba(255, 255, 0, " + utils.getRandomInt(0.3, 0.5) / 10 + ")"),
      fl();
  },
  preCompute: function () {
    (T.lw =
      blw + bw + (0 === bw ? 0 : utils.getRandomInt(T.minDist, T.maxDist))),
      (blw = T.lw),
      (T.w = utils.getRandomInt(T.minW, T.maxW)),
      (bw = T.w),
      (T.h = utils.getRandomInt(T.minH, T.maxH));
  },
  removeFlame: function (t) {
    t.flame = void 0;
  },
};
var G, ctx, CC, background, player, weather, smoky, tree, time;
Game.prototype = {
  restart: function () {
    (G.isGameOver = !1),
      (G.isInProgress = !0),
      (G.karma = 0),
      (G.speed = 1),
      (G.gameStartTime = new Date().getTime()),
      (smoky = new SmokyFlame()),
      (blw = 200),
      (bw = 0),
      G.addInitialtrees(),
      (player = new Player()),
      (Pl.x = G.trees[0].x),
      flameBack.init(),
      (weather = new Weather()),
      (G.raf = raf(function () {
        G.raf && (G.cycle(), raf(arguments.callee));
      }));
  },
  stopCycle: function () {
    (G.isGameOver = !0),
      (G.isInProgress = !1),
      flameBack.update(),
      canvasToImage(),
      G.karma > G.highscore &&
        (SU.play("highestScore"),
        (G.highscore = G.karma),
        utils.setLocalStorageData(G.karma)),
      SU.play("gameOver"),
      (G.menu = new Menu());
  },
  cycle: function () {
    var t = new Date().getTime();
    if (((dt = t - time), !(dt < 1e3 / fps))) {
      if (((time = t), G.menu)) return void (G.menu.update && G.menu.update());
      G.canExplode && M.ceil((t - G.gameStartTime) / 1e3) % 6 === 0
        ? (G.mildExplosion ? SU.play("explosion2") : SU.play("explosion1"),
          (G.mildExplosion = !G.mildExplosion),
          (G.canExplode = !1))
        : M.ceil((t - G.gameStartTime) / 1e3) % 7 === 0 && (G.canExplode = !0),
        G.canSpeedBeIncreased && M.ceil((t - G.gameStartTime) / 1e3) % 10 === 0
          ? ((G.speed += G.isMobile() ? 0.1 : 0.2),
            (WD.speed = utils.getRandomInt(1, 30)),
            (G.canSpeedBeIncreased = !1))
          : M.ceil((t - G.gameStartTime) / 1e3) % 11 === 0 &&
            (G.canSpeedBeIncreased = !0),
        fs(G.backgroundColor),
        fr(0, 0, CC.w, CC.h);
      var e = G.isMobile() ? 1.1 : 1.6;
      if (
        (G.speed >= e &&
          10 === utils.getRandomInt(0, 10) &&
          (G.showNoisyScreen(),
          4 === utils.getRandomInt(0, 10) && SU.play("glitch")),
        weather.update(),
        (ctx.font = "15px Comic Sans"),
        (ctx.fillStyle = thisWeather.hexToRgb(thisWeather.getColor(!0), 1)),
        ctx.fillText("KARMA: " + G.karma, 25, 25),
        ctx.fillText(
          "SPEED: " + G.speed.toFixed(1) + " mph",
          G.can.width - 130,
          25
        ),
        ctx.fillText(
          "WIND:  " + WD.speed.toFixed(1) + " mph W",
          G.can.width - 130,
          45
        ),
        (ctx.lineWidth = 3),
        G.trees.length)
      ) {
        for (var i = 0; i < G.trees.length; i++)
          (G.trees[i].x -= G.speed),
            G.trees[i].update(G.trees[i]),
            G.trees[i].x < 0 - G.trees[i].width && (G.trees[i] = new Tree());
        player.update();
      }
      flameBack.update();
    }
  },
  showNoisyScreen: function () {
    for (
      var t = G.can.width,
        e = G.can.height,
        i = ctx.createImageData(t, e),
        a = new Uint32Array(i.data.buffer),
        n = a.length,
        r = 0;
      r < n;

    )
      a[r++] = ((255 * Math.random()) | 0) << 24;
    ctx.putImageData(i, 0, 0);
  },
  addInitialtrees: function () {
    (G.trees = []), G.trees.push(new Tree({ isNoFlame: !0 }));
    for (var t = 0; t < 5; t++) G.trees.push(new Tree());
  },
  resize: function () {
    setTimeout(function () {
      var t,
        e,
        i = innerWidth,
        a = innerHeight,
        n = i / a,
        r = P.w / P.h,
        o = (abs(n - r), document.getElementById("canvascontainer").style);
      return (
        n <= r ? ((t = i), (e = a)) : ((e = a), (t = e * r)),
        (o.width = t + "px"),
        (o.height = e + "px"),
        (ctx.globalCompositeOperation = "lighter"),
        (G.can.width = t),
        (G.can.height = e),
        G.menu
          ? ((G.menu = new Menu()),
            void (G.raf = raf(function () {
              G.raf && (G.cycle(), raf(arguments.callee));
            })))
          : void G.restart()
      );
    }, 100);
  },
  isMobile: function () {
    return !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  },
  pos: function (t) {
    var e = (G.can.getBoundingClientRect(), []);
    t = t.touches || [t];
    for (var i = 0; i < t.length; i++)
      e.push({ x: t[i].clientX, y: t[i].clientY });
    return e;
  },
  touchStart: function (t, e) {
    t.preventDefault(), (G.touch = G.touch || !e);
    var i = G.pos(t);
    if (((G.curPos = i), scrollTo(0, 1), G.menu)) {
      var a = G.curPos[0].x - G.can.offsetLeft,
        n = G.curPos[0].y - G.can.offsetTop;
      G.menu.mouseDown && G.menu.mouseDown(t, a, n);
    } else G.keyDown({ keyCode: 32 });
    !G.isInProgress;
  },
  touchMove: function (t) {
    t.preventDefault(), G.curPos && ((G.curPos = G.pos(t)), !G.isInProgress);
  },
  touchEnd: function (t) {
    t.preventDefault();
    G.curPos[0];
    (G.curPos = G.pos(t)), !G.isInProgress;
  },
  keyDown: function (t) {
    return (13 !== t.keyCode && 32 !== t.keyCode) || !G.menu
      ? void (
          G.isInProgress &&
          ((39 !== t.keyCode && 38 !== t.keyCode && 32 !== t.keyCode) ||
            (player && player.keyDown(t.keyCode)))
        )
      : ((G.menu = null), G.restart(), void SU.play("playGame"));
  },
  keyUp: function (t) {
    G.isInProgress && player && player.keyUp(t.keyCode);
  },
  mouseDown: function (t) {
    if (G.menu) {
      var e = t.pageX - G.can.offsetLeft,
        i = t.pageY - G.can.offsetTop;
      G.menu.mouseDown && G.menu.mouseDown(t, e, i);
    }
  },
  mouseMove: function (t) {},
  mouseUp: function (t) {},
  setResolution: function (t) {
    (G.can.width = P.w * t), (G.can.height = P.h * t), (G.resolution = t);
  },
};
var _ = window,
  raf = (function () {
    return (
      _.requestAnimationFrame ||
      _.webkitRequestAnimationFrame ||
      _.mozRequestAnimationFrame ||
      function (t) {
        setTimeout(t, 1e3 / 60);
      }
    );
  })(),
  M = Math,
  abs = M.abs,
  min = M.min,
  max = M.max,
  to = setTimeout,
  fps = 60,
  p = CanvasRenderingContext2D.prototype;
(p.fr = p.fillRect),
  (p.sv = p.save),
  (p.rs = p.restore),
  (p.lt = p.lineTo),
  (p.mt = p.moveTo),
  (p.sc = p.scale),
  (p.bp = p.beginPath),
  (p.cp = p.closePath),
  (p.rt = p.rotate),
  (p.ft = p.fillText),
  (p.bct = p.bezierCurveTo),
  (p.qct = p.quadraticCurveTo),
  (p.st = p.stroke),
  (p.ar = p.arc),
  (p.fl = p.fill),
  (p.el = function (t, e, i, a, n, r) {
    var o = e + a,
      s = i + n,
      l = e + a / 2,
      h = i + n / 2;
    sv(),
      bp(),
      mt(e, h),
      qct(e, i, l, i),
      qct(o, i, o, h),
      qct(o, s, l, s),
      qct(e, s, e, h),
      (t.strokeStyle = r ? r : "#000"),
      (t.lineWidth = 2),
      st(),
      rs(),
      fl();
  }),
  (p.fs = function (t) {
    this.fillStyle = P.inverted ? invert(t) : t;
  }),
  (p.sts = function (t) {
    this.strokeStyle = P.inverted ? invert(t) : t;
  });
for (var i in p)
  _[i] = (function (t) {
    return function () {
      c[t].apply(c, arguments);
    };
  })(i);
var P = {
  w: 640,
  h: 760,
  g: 800,
  fireOffset: 70,
  spikesOffset: 50,
  tbOffset: 20,
};
addEventListener("DOMContentLoaded", function () {
  (_._can = document.querySelector("canvas")), new Game();
});
