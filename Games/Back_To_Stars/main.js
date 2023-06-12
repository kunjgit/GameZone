!(function () {
  "use strict";
  const e = (...e) =>
      e.reduceRight(
        (e, t) =>
          (...a) =>
            t(e(...a)),
        (e) => e
      ),
    t = {
      46: 4,
      45: 31744,
      49: 12718239,
      50: 31504927,
      51: 31505470,
      52: 19496002,
      53: 33060926,
      54: 15235630,
      55: 32540804,
      56: 15252014,
      57: 15252526,
      48: 15255086,
      65: 33095217,
      66: 32079423,
      67: 33047071,
      68: 29967935,
      69: 33059359,
      70: 33059344,
      71: 33054271,
      72: 18415153,
      73: 32641183,
      74: 1082943,
      75: 19558993,
      76: 17318431,
      77: 18732593,
      78: 18667121,
      79: 33080895,
      80: 33095184,
      81: 32066143,
      82: 33095249,
      83: 33061951,
      84: 32641156,
      85: 18400831,
      86: 18400580,
      87: 18405233,
      88: 18157905,
      89: 18414724,
      90: 32575775,
      32: 0,
      44: 132,
      43: 145536,
      47: 1118480,
      58: 131200,
      64: 32569023,
      35: 328e3,
      37: 15259182,
    };
  var a = {
      t(e, a, s, n, i = 1) {
        (n = n.toUpperCase()),
          [...n].map((r, o) => {
            if (t[n.charCodeAt(o)])
              for (let r = 0; r < 25; r++) {
                const d = ~~(r / 5);
                (t[n.charCodeAt(o)] >> r) & !0 &&
                  e.fillRect(
                    a + 5 * i + (6 * o - (r - 5 * d)) * i,
                    s + 5 * i - d * i,
                    i,
                    i
                  );
              }
          });
      },
    },
    s = (e) => {
      const t = new Image();
      return (
        (t.src = e),
        (t.onload = (e) => {
          console.log("loaded");
        }),
        t
      );
    },
    n = (e) => {
      const {
        state: t = { x: 0, y: 0, animation: "idle", paused: !1 },
        width: a,
        height: s,
        image: n,
        animations: i,
        update: r,
        render: o,
        onEnd: d = () => {
          console.log("from ss");
        },
      } = e;
      let l = t.animation,
        c = 0,
        g = 2,
        u = 0,
        m = !1,
        h = 0,
        f = 0,
        p = !1,
        A = !0,
        y = 1;
      function x(e) {
        m = -1 === e;
      }
      function S(e) {
        c = i[(l = e)].speed;
      }
      function b() {
        (h = 0), (f = 0), v.setVisible(!0), (p = !1), (y = 1);
      }
      const v = {
        ...e,
        setVisible(e) {
          A = e;
        },
        setPosition(e, a) {
          (t.x = e), (t.y = a);
        },
        setScale(e) {
          g = e;
        },
        setAnimation: S,
        setSpeed(e) {
          c = e;
        },
        setRotation(e) {
          u = e;
        },
        setDirection: x,
        playAnimation: b,
        stop() {
          p = !0;
        },
      };
      return {
        ...v,
        update(e) {
          r && r({ ...e, setDirection: x, setAnimation: S, playAnimation: b }),
            (f += 1),
            h >= i[l].frames.length - 1 &&
              (i[l].direction && "alternate" === i[l].direction
                ? (y = -1)
                : "once" !== i[l].direction || p
                ? (h = 0)
                : ((y = 0), (p = !0), d({ ...v }))),
            0 === h &&
              i[l].direction &&
              "alternate" === i[l].direction &&
              (y = 1),
            !p && c && f % c == 0 && (h += y);
        },
        render(e) {
          o && o(e);
          const { context: r } = e;
          if (!A) return;
          const d = i[l].frames[h] - 1;
          r.sv(),
            r.tr(t.x + a, t.y + s),
            r.sc(m ? -g : g, g),
            r.rt(((m ? -u : u) * Math.PI) / 180),
            r.di(n, d * a, 0, a, s, -a / 2, -s / 2, a, s),
            r.ro();
        },
      };
    },
    i = (e) => {
      const { state: t, init: a, update: s, render: n } = e;
      function i(e) {
        Object.entries(e).forEach((e) => {
          t[e[0]] = e[1];
        });
      }
      return {
        ...e,
        state: t,
        setState: i,
        init(e) {
          a && a(e);
        },
        update(e) {
          s && s({ ...e, state: t, setState: i });
        },
        render(e) {
          n && n({ ...e, state: t });
        },
      };
    },
    r = (t) => {
      const { state: a = {}, update: s, render: n } = t;
      return e(i)({
        ...t,
        update(e) {
          a.entities &&
            a.entities.forEach((t) => {
              t.update(e);
            }),
            s && s(e);
        },
        render(e) {
          a.entities &&
            a.entities.forEach((t) => {
              t.render(e);
            }),
            n && n(e);
        },
      });
    },
    o = (e) => {
      const { update: t, render: a, beforeCameraRender: s } = e,
        { state: n = { speed: 30, target: { x: 0, y: 0 } } } = e;
      let i = 0,
        r = 0,
        o = 0,
        d = 0,
        l = 0,
        c = !1,
        g = 0,
        u = 500;
      function m(e) {
        (g = 1), (u = e);
      }
      function h(e, t) {
        (i = e), (r = t), (c = !0);
      }
      function f() {
        return { x: d + 256, y: o + 240 };
      }
      return {
        ...e,
        update(e) {
          t && t({ ...e, setShake: m, setTarget: h, getTarget: f });
          const { speed: a } = n;
          g > 0 &&
            ((g += 5),
            (d = d + 10 * Math.random() - 5),
            (o = o + 10 * Math.random() - 5)),
            g > u && (g = 0);
          const s = i - d,
            p = r - o,
            A = Math.sqrt(s * s + p * p);
          (l = Math.atan2(p, s) * (180 / Math.PI)),
            c && (A > 20 ? ((d += s / a), (o += p / a)) : (c = !1)),
            (o = ~~o) > 260 && (o = 260),
            (d = ~~d) < 256 && (d = 256),
            d > 512 && (d = 512);
        },
        render(e) {
          const { context: t } = e;
          s && s(e), t.sv(), t.tr(-(d - 256), -(o - 240)), a && a(e), t.ro();
        },
      };
    },
    d = (e) => {
      const { keys: t = { up: 38, down: 40, left: 37, right: 39 }, update: a } =
          e,
        s = {};
      function n(e) {
        return !!s[t[e]];
      }
      return {
        ...e,
        update(e) {
          a && a({ ...e, isPressed: n });
          const { isKeyPressed: i } = e;
          Object.keys(t).map((e) => {
            s[t[e]] = i(t[e]);
          });
        },
      };
    },
    l = (e) => {
      const {
        state: t = {
          x: 0,
          y: 0,
          xVel: 0,
          yVel: 0,
          speed: 0.2,
          maxSpeed: 8,
          friction: 2,
          gravity: 10,
        },
        update: a,
      } = e;
      function s(e) {
        t.xVel < t.maxSpeed && (t.xVel += 2 * e || t.speed * t.friction * 2);
      }
      function n(e) {
        t.xVel > -t.maxSpeed && (t.xVel -= 2 * e || t.speed * t.friction * 2);
      }
      return {
        ...e,
        update(e) {
          const i = t.speed * t.friction;
          ~~t.xVel > 0 && (t.xVel -= i),
            ~~t.xVel < 0 && (t.xVel += i),
            (t.yVel += t.speed),
            t.yVel > t.gravity && (t.yVel = t.gravity),
            (t.x += ~~t.xVel),
            (t.y += ~~t.yVel),
            a && a({ ...e, incXVel: s, decXVel: n });
        },
      };
    },
    g = (e) => {
      const {
        state: t = {
          x: 0,
          y: 0,
          xVel: 0,
          yVel: 0,
          speed: 0.5,
          gravity: 10,
          isJumping: !1,
        },
        update: a,
      } = e;
      function s(e) {
        t.isJumping || ((t.yVel = -7), (t.isJumping = !0));
      }
      return {
        ...e,
        update(e) {
          a && a({ ...e, jump: s });
        },
      };
    };
  function u() {
    (this.x = new AudioContext()),
      (this.r = Date.now()),
      (this.buffer = 0),
      (this.volume = 0.5),
      (this.randomness = 0.1);
  }
  (u.prototype.z = function (e, t) {
    var a,
      s = this.Generate(e);
    for (a in t) s[a] = t[a];
    return this.Z(
      s.volume,
      s.randomness,
      s.frequency,
      s.length,
      s.attack,
      s.slide,
      s.noise,
      s.modulation,
      s.modulationPhase
    );
  }),
    (u.prototype.Z = function (e, t, a, s, n, i, r, o, d) {
      (s = void 0 === s ? 1 : s),
        (n = void 0 === n ? 0.1 : n),
        (i = void 0 === i ? 0 : i),
        (r = void 0 === r ? 0 : r),
        (o = void 0 === o ? 0 : o),
        (d = void 0 === d ? 0 : d),
        (e *= this.volume),
        (a *= (2 * Math.PI) / 44100),
        (a *= 1 + t * (2 * this.R() - 1)),
        (i *= (1e3 * Math.PI) / 194481e4),
        (n *= 0 | (s = 0 < s ? (44100 * (10 < s ? 10 : s)) | 0 : 1)),
        (o *= (2 * Math.PI) / 44100),
        (d *= Math.PI),
        (t = []);
      for (var l = 0, c = 0, g = 0; g < s; ++g)
        (t[g] =
          e *
          Math.cos(l * a * Math.cos(c * o + d)) *
          (g < n ? g / n : 1 - (g - n) / (s - n))),
          (l += 1 + r * (2 * this.R() - 1)),
          (c += 1 + r * (2 * this.R() - 1)),
          (a += i);
      return (
        (this.buffer = t),
        (e = this.x.createBuffer(1, t.length, 44100)),
        (a = this.x.createBufferSource()),
        e.getChannelData(0).set(t),
        (a.buffer = e),
        a.connect(this.x.destination),
        a.start(),
        a
      );
    }),
    (u.prototype.Generate = function (e) {
      var t = this.r;
      this.r = e;
      for (var a = 9; a--; ) this.R();
      return (
        ((a = {}).seed = e),
        (a.volume = 1),
        (a.randomness = e ? this.randomness : 0),
        (a.frequency = e ? (2e3 * Math.pow(this.R(), 2)) | 0 : 220),
        (a.slide = e ? parseFloat((10 * Math.pow(this.R(), 3)).toFixed(1)) : 0),
        (a.length = e ? parseFloat((0.1 + this.R()).toFixed(1)) : 1),
        (a.attack = e ? parseFloat(this.R().toFixed(2)) : 0.1),
        (a.noise = e ? parseFloat((5 * Math.pow(this.R(), 3)).toFixed(1)) : 0),
        (a.modulation = e
          ? parseFloat((99 * Math.pow(this.R(), 5)).toFixed(1))
          : 0),
        (a.modulationPhase = e ? parseFloat(this.R().toFixed(2)) : 0),
        (this.r = t),
        a
      );
    }),
    (u.prototype.Note = function (e, t) {
      return e * Math.pow(2, t / 12);
    }),
    (u.prototype.R = function () {
      return (
        (this.r ^= this.r << 13),
        (this.r ^= this.r >> 7),
        (this.r ^= this.r << 17),
        (Math.abs(this.r) % 1e9) / 1e9
      );
    }),
    new u();
  var m = (t) => {
      const { gameState: a, update: s, render: r, colliding: o } = t,
        { assets: c } = a;
      let m = new u();
      return e(
        i,
        n,
        (e) => {
          const { update: t } = e;
          return {
            ...e,
            update(e) {
              t && t(e);
              const { state: a, setState: s } = e;
              a.y > 448 && s({ y: 448, yVel: 0, isJumping: !1 }),
                a.x < 0 && s({ x: 0, xVel: 0 }),
                a.x > 736 && s({ x: 736, xVel: 0 });
            },
          };
        },
        g,
        l,
        d
      )({
        state: {
          x: 0,
          y: 0,
          xVel: 0,
          yVel: 0,
          speed: 0.2,
          maxSpeed: 5,
          friction: 1,
          gravity: 10,
          isJumping: !1,
          animation: "idle",
          bbox: { x: 0, y: 0, w: 32, h: 32 },
          colliders: [],
        },
        keys: { left: 37, right: 39, jump: 32 },
        width: 16,
        height: 16,
        image: c.getAsset("spritesheet"),
        animations: {
          idle: { frames: [1] },
          walk: { frames: [1, 2, 3, 4, 5], speed: 3, direction: "alternate" },
          jump: { frames: [1] },
          fall: { frames: [6] },
          talk: { frames: [1, 6], speed: 15, direction: "alternate" },
        },
        ...t,
        update(e) {
          s && s(e);
          const {
            state: t,
            setDirection: a,
            setAnimation: n,
            isPressed: i,
            incXVel: r,
            decXVel: d,
            jump: l,
          } = e;
          n("idle"),
            i("left") && (d(), a(-1), n("walk")),
            i("right") && (r(), a(1), n("walk")),
            i("jump") && !t.isJumping && (m.z(28209), l(), n("jump")),
            t.isJumping && n("jump"),
            ~~t.yVel > 1 && n("fall"),
            t.colliders.forEach((e) => {
              o &&
                t.x + t.bbox.x + t.bbox.w > e.state.x + e.state.bbox.x &&
                t.x + t.bbox.x < e.state.x + e.state.bbox.x + e.state.bbox.w &&
                t.y + t.bbox.y + t.bbox.h > e.state.y + e.state.bbox.y &&
                t.y + t.bbox.y < e.state.y + e.state.bbox.y + e.state.bbox.h &&
                o(e);
            });
        },
        render(e) {
          r && r(e);
        },
      });
    },
    h = (t) => {
      const { image: a, render: s } = t;
      return e(i)({
        ...t,
        render(e) {
          s && s(e);
          const { context: t } = e;
          for (let e = 0; e < 24; e++)
            t.di(a, 96, 0, 16, 16, 32 * e, 478, 32, 32);
        },
      });
    },
    f = (t) => {
      const { gameState: a, update: s, getTarget: r } = t,
        { assets: o } = a;
      let d = 0;
      function c(e) {
        const { state: t, setAnimation: a, playAnimation: s } = e;
        t.bursting || ((t.bursting = !0), a("burst"), s());
      }
      function g() {
        return 234 + ~~(300 * Math.random());
      }
      return e(
        i,
        n,
        (e) => {
          const { update: t } = e;
          return {
            ...e,
            update(e) {
              t && t(e);
              const { state: a, setState: s } = e,
                n = r();
              a.y > n.y - 32 && (s({ y: 480 - n.y }), c(e)),
                a.x < 0 && s({ x: 0, xVel: 0 }),
                a.x > 736 && s({ x: 736, xVel: 0 });
            },
          };
        },
        l
      )({
        state: {
          x: g(),
          y: 480 - r().y,
          xVel: 0,
          yVel: 0,
          speed: 0.2,
          maxSpeed: 5,
          friction: 1,
          gravity: 1.5,
          animation: "idle",
          bbox: { x: 0, y: 0, w: 32, h: 32 },
          bursting: !1,
        },
        keys: { left: 37, right: 39, jump: 32 },
        width: 16,
        height: 16,
        image: o.getAsset("spritesheet"),
        animations: {
          idle: { frames: [21, 22], speed: 10, direction: "alternate" },
          burst: {
            frames: [22, 23, 24, 25, 26, 27, 28],
            speed: 3,
            direction: "once",
          },
        },
        onEnd(e) {
          const { state: t, setAnimation: a, playAnimation: s } = e;
          (t.bursting = !1), a("idle"), (t.y = r().y - 480), (t.x = g()), s();
        },
        ...t,
        burst: c,
        update(e) {
          s && s({ ...e }, c);
          const { state: t } = e;
          ++d % ~~(40 * Math.random()) == 0 &&
            (t.xVel = 3 - ~~(6 * Math.random()));
        },
      });
    },
    p = (t) => {
      const { gameState: a } = t,
        { assets: s } = a;
      return e(i, n, (e) => ({ ...e }))({
        state: { x: 30, y: 30, animation: "twinkle" },
        width: 16,
        height: 16,
        image: s.getAsset("spritesheet"),
        animations: {
          twinkle: {
            frames: [12, 13, 14, 15, 16],
            speed: 3,
            direction: "once",
          },
        },
        onEnd(e) {
          const { state: t, playAnimation: a, setVisible: s } = e;
          (t.x = 768 * Math.random()),
            s(!1),
            setTimeout(() => {
              s(!0), a();
            }, 1e3 * Math.random());
        },
        ...t,
      });
    },
    A = ({ gameState: t }) => {
      const { assets: a } = t,
        s = e(i, (e) => {
          const { image: t } = e;
          return {
            ...e,
            render({ context: e }) {
              e.di(t, 0, 0, 256, 240, 0, 0, 512, 480),
                e.di(t, 0, 0, 256, 240, 512, 0, 512, 480);
            },
          };
        })({ state: { x: 0, y: 0 }, image: a.getAsset("background") }),
        n = e(i, (e) => {
          const { image: t } = e;
          return {
            render({ context: e }) {
              e.di(t, 0, 0, 256, 240, 0, 295, 512, 480);
            },
          };
        })({ image: a.getAsset("sun") }),
        o = e(i, (e) => {
          const { image: t } = e;
          let a = 0;
          return {
            update(e) {
              ((a -= 0.25) < -512 || a > 512) && (a = 0);
            },
            render({ context: e }) {
              e.di(t, 0, 0, 256, 240, ~~a, 0, 512, 480),
                e.di(t, 0, 0, 256, 240, 512 + ~~a, 0, 512, 480);
            },
          };
        })({ image: a.getAsset("clouds") });
      function d(e) {
        const a = p({ gameState: t });
        return (
          a.setState({ x: 100, y: e }),
          a.setAnimation("twinkle"),
          a.setScale(4),
          a.playAnimation(),
          a
        );
      }
      const l = [d(130), d(30), d(-130), d(-260), d(-390), d(-420)];
      return e(r)({
        state: { entities: [...l, s, n, o] },
        update(e) {},
        render(e) {},
      });
    };
  const y = c.getContext("2d"),
    x = e((t) => {
      const {
        state: a = {
          scenes: {},
          assets: {},
          renderer: null,
          currentScene: null,
        },
        assets: i = {},
        onload: r = () => {},
        onready: o = () => {},
      } = t;
      !(function () {
        const e = {
          13: "enter",
          27: "esc",
          32: "space",
          37: "left",
          38: "up",
          39: "right",
          40: "down",
        };
        for (let t = 0; t < 26; t++) e[65 + t] = (10 + t).toString(36);
        for (let t = 0; t < 10; t++) e[48 + t] = "" + t;
      })();
      let d,
        l = 0,
        g = {};
      function u(e) {
        Object.entries(e).forEach((e) => {
          a[e[0]] = e[1];
        });
      }
      function m(e) {
        const t = e - l;
        l = e;
        const s = a.renderer;
        a.currentScene && a.currentScene.update({ dt: t, isKeyPressed: h }),
          s.clr(),
          s.sv(),
          s.r(0, 0, 512, 480, { fill: "#036" }),
          a.currentScene &&
            a.currentScene.render({ context: a.renderer, gameState: a }),
          s.ro(),
          (d = requestAnimationFrame(m));
      }
      function h(e) {
        return e ? !!g[e] : Object.entries(g).length > 0 || void 0;
      }
      const f = new Worker("assets-loader.js");
      function p(e) {
        e.preventDefault(), console.log(e);
      }
      function A(e) {
        e.preventDefault(), console.log(e);
      }
      return (
        (f.onmessage = function (t) {
          (a.assets = ((a) => {
            const i = {
                spritesheet: (t) => e(n)(t),
                image: (t) => e(s)(t),
                dithered: (t) => {
                  const { width: a, height: n, image_data: i } = t,
                    r = document.createElement("canvas");
                  (r.width = a), (r.height = n);
                  const o = r.getContext("2d"),
                    d = new ImageData(a, n);
                  return (
                    d.data.set(i), o.putImageData(d, 0, 0), e(s)(r.toDataURL())
                  );
                },
              },
              r = {};
            return (
              Object.entries(t.data).forEach((e) => {
                r[e[0]] = i[e[1].type](e[1].data);
              }),
              { getAsset: (e) => r[e] }
            );
          })()),
            o({ state: a, setState: u });
        }),
        f.postMessage(i),
        (a.currentScene = a.scenes.loading({ gameState: a })),
        addEventListener("keydown", (e) => {
          g[e.which] = !0;
        }),
        addEventListener("keyup", (e) => {
          (g[e.which] = !1), delete g[e.which];
        }),
        addEventListener("blur", () => (g = {})),
        (document.body.onload = () => {
          c.addEventListener("touchstart", A, !1),
            c.addEventListener("touchmove", p, !1),
            addEventListener("mousemove", p, !1),
            console.log("attach");
        }),
        {
          ...t,
          setScene(e) {
            a.currentScene = a.scenes[e]({ gameState: a });
          },
          start() {
            d = requestAnimationFrame(m);
          },
          stop() {
            cancelAnimationFrame(d);
          },
        }
      );
    })({
      state: {
        scenes: {
          loading: ({}) => {
            let t = 0;
            return e(r)({
              update(e) {
                t++;
              },
              render({ context: e }) {
                e.t("Loading", 172, 140, { size: 4, fill: "#fff", stroke: 5 }),
                  e.sv(),
                  e.tr(256, 240),
                  e.rt(t / 50),
                  e.t("#", -30, -30, { size: 10, stroke: 0 }),
                  e.ro();
              },
            });
          },
          game: ({ gameState: t }) => {
            const { assets: a, gameOver: s } = t;
            let n = 0,
              i = 0,
              d = 0,
              l = 0,
              c = 0,
              g = !1,
              p = !1,
              y = !1,
              x = !1,
              S = new u();
            const b = A({ gameState: t }),
              v = e(m)({
                gameState: t,
                colliding(e) {
                  const { burst: a } = e;
                  a(e),
                    (v.state.yVel = -7),
                    (v.state.isJumping = !0),
                    (c = 0),
                    (p = !0),
                    (t.score += t.height),
                    !y && S.z(28209),
                    (y = !0),
                    setTimeout(() => {
                      y = !1;
                    }, 50);
                },
              });
            v.setAnimation("idle"),
              v.setScale(2),
              v.setState({ x: 384, y: 460 }),
              v.playAnimation();
            const w = h({ image: a.getAsset("spritesheet") }),
              V = a.getAsset("zyxplay");
            return e(
              o,
              r
            )({
              state: { speed: 10, entities: [w, v] },
              update(a) {
                const { state: r, setTarget: o, getTarget: u } = a;
                n++, o(v.state.x, v.state.y);
                const m = u();
                if (
                  ((i = m.x),
                  (d = m.y),
                  ~~v.state.yVel > 0 && c++,
                  ~~v.state.yVel <= 0 && (c = 0),
                  ++l % 100 == 0 && r.entities.length < 10)
                ) {
                  const a = (function (a) {
                    const s = e(f)({ gameState: t, getTarget: a });
                    return (
                      s.setAnimation("idle"),
                      s.setScale(2),
                      s.playAnimation(),
                      s
                    );
                  })(u);
                  r.entities.push(a), v.state.colliders.push(a);
                }
                c > 120 && (g = !0),
                  v.state.y > 447 && p && (g = !0),
                  g && (S.z(35003), s()),
                  (t.height = ~~((480 - v.state.y) / 30)),
                  b.update(a);
              },
              beforeCameraRender(e) {
                const { context: a } = e;
                let s = -~~v.state.x,
                  i = -~~v.state.y;
                a.sv(),
                  a.tr(s / 20, 20 + i / 20),
                  b.render(e),
                  a.ro(),
                  n < 300 &&
                    (a.t("Jump into the", 139, 130, {
                      size: 3,
                      fill: "#fff",
                      stroke: 2,
                    }),
                    a.t("bubbles to get", 130, 160, {
                      size: 3,
                      fill: "#fff",
                      stroke: 2,
                    })),
                  n > 150 &&
                    n < 450 &&
                    (a.t("back to", 130, 200, {
                      size: 6,
                      fill: "#fff",
                      stroke: 6,
                    }),
                    a.t("the stars", 94, 240, {
                      size: 6,
                      fill: "#fff",
                      stroke: 6,
                    }),
                    !x && S.z(55428),
                    (x = !0)),
                  n < 400 &&
                    (a.t("Arrow keys to move", 148, 410, {
                      size: 2,
                      fill: "#fff",
                      stroke: 2,
                    }),
                    a.t("Space to jump", 178, 430, {
                      size: 2,
                      fill: "#fff",
                      stroke: 2,
                    })),
                  a.t(`Score ${t.score}`, 10, 10, {
                    size: 2,
                    fill: "#fff",
                    stroke: 2,
                  }),
                  a.di(V, 0, 0, 51, 25, 405, 10, 102, 50);
              },
            });
          },
          gameOver: ({ gameState: t }) => {
            const {
                startGame: a,
                score: s = 0,
                highScore: n = 0,
                assets: i,
              } = t,
              o = i.getAsset("zyxplay");
            let d = 0;
            return e(r)({
              update(e) {
                const { isKeyPressed: t } = e;
                (d += 1) > 100 && t() && a();
              },
              render({ context: e }) {
                e.di(o, 0, 0, 51, 25, 405, 10, 102, 50),
                  e.t("Game Over", 30, 160, { size: 8, stroke: 8 }),
                  e.t(`Score:${s}`, 30, 240, { size: 4, stroke: 4 }),
                  e.t(`High Score:${n}`, 30, 270, { size: 4, stroke: 4 }),
                  d > 100 &&
                    e.t("Press any key", 178, 420, { size: 2, stroke: 2 });
              },
            });
          },
          nyanCat: ({ gameState: t }) => {
            const { assets: a } = t;
            let s = 0,
              d = 0;
            new u();
            const l = A({ gameState: t }),
              c = h({ image: a.getAsset("spritesheet") }),
              g = ((t) => {
                const { gameState: a, update: s, render: r } = t,
                  { assets: o } = a;
                let d = 0;
                const l = [];
                return e(i, n, (e) => ({ ...e }))({
                  state: {
                    x: 0,
                    y: 330,
                    animation: "flying",
                    bbox: { x: 0, y: 0, w: 64, h: 32 },
                  },
                  width: 32,
                  height: 16,
                  image: o.getAsset("spritesheet"),
                  animations: { flying: { frames: [9, 10, 9], speed: 15 } },
                  ...t,
                  update(t) {
                    s && s(t);
                    const { state: a } = t;
                    var r;
                    (a.x += 2),
                      d++,
                      l.map((e, s) => {
                        e.update(t), (e.state.x = a.x - 16 * s);
                      }),
                      l.length > 200 && l.pop(),
                      l.unshift(
                        ((r = a.y - (d % 20 >= 0 && d % 20 < 10 ? 2 : 0)),
                        e(i, n, (e) => ({ ...e }))({
                          state: {
                            x: 100,
                            y: r,
                            animation: "default",
                            flying: !1,
                            trailFlick: 1,
                            alt: !1,
                          },
                          width: 16,
                          height: 16,
                          image: o.getAsset("spritesheet"),
                          animations: { default: { frames: [29] } },
                        }))
                      );
                  },
                  render(e) {
                    l.map((t) => {
                      t.render(e);
                    }),
                      r && r(e);
                  },
                });
              })({ gameState: t });
            return (
              (g.state.x = 0),
              g.setDirection(-1),
              g.setAnimation("flying"),
              g.playAnimation(),
              e(
                o,
                r
              )({
                state: { speed: 10, entities: [c, g] },
                update(e) {
                  const { setTarget: a, getTarget: n } = e;
                  a(g.state.x, g.state.y);
                  const i = n();
                  (s = i.x),
                    (d = i.y),
                    (t.height = ~~((480 - g.state.y) / 30)),
                    l.update(e);
                },
                beforeCameraRender(e) {
                  const { context: t } = e;
                  let a = -~~g.state.x,
                    s = -~~g.state.y;
                  t.sv(), t.tr(a / 20, 20 + s / 20), l.render(e), t.ro();
                },
              })
            );
          },
        },
        renderer: (({ context: e }) => (
          (e.webkitImageSmoothingEnabled = !1),
          (e.msImageSmoothingEnabled = !1),
          (e.imageSmoothingEnabled = !1),
          {
            r(t, a, s, n, i = {}) {
              (e.fillStyle = i.fill || "#e0e0e0"), e.fillRect(t, a, s, n);
            },
            t(t, s, n, i) {
              (e.fillStyle = "#000"),
                a.t(e, s, n + i.stroke || 3, t, i.size || 3),
                (e.fillStyle = i.fill || "#f0f0f0"),
                a.t(e, s, n, t, i.size || 3);
            },
            di(t, a, s, n, i, r, o, d, l) {
              e.drawImage(t, a, s, n, i, r, o, d, l);
            },
            clr() {
              e.clearRect(0, 0, e.canvas.width, e.canvas.height);
            },
            rt(t) {
              e.rotate(t);
            },
            tr(t, a) {
              e.translate(t, a);
            },
            sc(t, a) {
              e.scale(t, a);
            },
            st(t, a, s, n, i, r) {
              e.setTransform(t, a, s, n, i, r);
            },
            sv() {
              e.save();
            },
            ro() {
              e.restore();
            },
          }
        ))({ context: y }),
        gameOver() {
          x.state.maxHeight < x.state.height &&
            (x.state.maxHeight = x.state.height),
            x.state.highScore < x.state.score &&
              (x.state.highScore = x.state.score),
            x.setScene("gameOver");
        },
        startGame() {
          (x.state.score = 0), x.setScene("game");
        },
        score: 0,
        highScore: 0,
        height: 0,
        maxHeight: 0,
        currentHeight: 0,
      },
      assets: {
        background: {
          type: "dithered",
          data: ((e) => {
            const t = e.createLinearGradient(0, 0, 0, 240);
            return (
              t.addColorStop(0, "rgb(0, 0, 63, 0)"),
              t.addColorStop(0.5, "rgb(127, 0, 127, 1)"),
              t.addColorStop(0.75, "rgb(127, 0, 0, 1)"),
              t.addColorStop(1, "orange"),
              e.clearRect(0, 0, 256, 240),
              (e.fillStyle = t),
              e.fillRect(0, 0, 512, 480),
              {
                width: 256,
                height: 240,
                image_data: e.getImageData(0, 0, 256, 240),
              }
            );
          })(y),
        },
        clouds: {
          type: "dithered",
          data: ((e) => {
            e.clearRect(0, 0, 256, 240),
              (e.font = "30px sans-serif"),
              (e.fillStyle = "#fff"),
              e.save(),
              e.translate(20, 100),
              e.fillText(`${String.fromCodePoint(9729)}`, -15, 15),
              e.restore(),
              e.save(),
              (e.font = "60px sans-serif"),
              e.translate(200, 200),
              e.fillText(`${String.fromCodePoint(9729)}`, -15, 15),
              e.restore(),
              e.save(),
              (e.font = "40px sans-serif"),
              e.translate(140, 20),
              e.fillText(`${String.fromCodePoint(9729)}`, -15, 15),
              e.restore(),
              e.save(),
              (e.globalCompositeOperation = "source-in");
            const t = e.createLinearGradient(0, 0, 0, 240);
            return (
              t.addColorStop(0, "rgb(0, 0, 0, 0.75)"),
              t.addColorStop(1, "rgb(255, 255, 255, 1)"),
              (e.fillStyle = t),
              e.fillRect(0, 0, 256, 240),
              (e.globalCompositeOperation = "source-over"),
              e.restore(),
              {
                width: 256,
                height: 240,
                image_data: e.getImageData(0, 0, 256, 240),
              }
            );
          })(y),
        },
        sun: {
          type: "dithered",
          data: ((e) => (
            e.clearRect(0, 0, 256, 240),
            e.save(),
            (e.font = "200px sans-serif"),
            e.translate(128, 120),
            e.fillText(`${String.fromCodePoint(127774)}`, -100, 100),
            e.restore(),
            {
              width: 256,
              height: 240,
              image_data: e.getImageData(0, 0, 256, 240),
            }
          ))(y),
        },
        spritesheet: {
          type: "image",
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdAAAAAQCAMAAACRHN4yAAAAqFBMVEUAAAAAAAB5eXmioqIwUYJBksNh0+Oi//MwYUFJomlx45Ki/8s4bQBJqhBx80Gi86I4aQBRogCa6wDL84JJWQCKigDr0yD/85J5QQDDcQD/ogD/26KiMADjUQD/eTD/y7qyEDDbQWH/YbL/uuuaIHnbQcPzYf/jsv9hEKKSQfOicf/Dsv8oALpBQf9Rgv+iuv8gALJBYfthov+S0/95eXmysrLr6+v///+noU3CAAAAOHRSTlMA/////////////////////////////////////////////////////////////////////////7X8Y8UAAARLSURBVFiFvZlNb9swDIZNBLvt4PSQOk53KJoi2HFAU/7/fzZ98yUlWVmTjqljv6JiW3pMSnKnaWhUbFy3YbO3KW3zvKxip/V0YmPpevb6X7r0Y4yqg8ryrd/qv1dv3i5pYFZPdClGN9S3en7aPz39nOPmDpejt3VN+9OnsYn23qTzrH64DYDRLjd713myc1dDl6v+t/6b9+r3yJNl/2oMeUVgLe3aELeOf0MHHHPa3PeSSOb951V/HMCZZgVU60fbCBjtXAU6HPz+cDg8e1MVYndjpzMU1f5bNVCL/maIVkBdUxQwq/3OFXDYGv6R3htboh2PcX8yPD8dP2+FoNUPtxEwVx5I+93b65s35ffdzBoeuir/rZoVX3PTUvjL2BRjCoC1daC04e/qvQvD/T5u3twY6jOut7C/GvMAyQClxwOVHuoAK2HqHckoeF+1nzHXct4YpfLfpBmLuIRvI+32gFpgSr+/xxT63gfc1Udji4yfft9Iua6rHEEZ2YL+V6DNR7ppbWAhbpObODg5V3B+Kn7FoxDRSk1vdC4GHSna1MqDphyMTS1gd2lCTR7oKjjX4wLjpz+2ETq9+HNASFrdtu1Wc6NGshEwf+BG1/C9oxzB4Qf51DpuVAFX/pJJIz4ZGxl+AbdsZ0hK8NeAukiLMdeLWNS+sugLFZ5r3GD89PsK6IsnCACtbgLbisCBdYGl69H5nAP4fKYQwAF4TrmsJrctoJA9Of3BJEi0fGDwldlRHbrB7BxlirMYBazWeeqaU6oBjDqqrD1Q4ZnG0DJ+ro0xNPbiDDl3agA1iYjZ5jXTz9AD6vneAJYv7fwUPsnvauCkCO8kUYHrYEEKyUIrDo1s0gebu63nRPrZrYESLjRTztQAR/pyyQXVuoUaY6hah7aBGoKWb9WqeyJ0ACyGcJ40xVnTMyxszDylATQrmc5yYcgAjEs1hNlumNT4YQxxhIiSGNsAigCnmJG1X+qvFqhZh14/9Cf14ghor4VtvTGGjoDBrMmvasKyJvykvpCZ0xjFUlTGR9k2Hkg5X92oqQkUAFzSKNgGml8dkQFaiJaIld+bjLuadWg/QmGeux/y7PZCT4M1gNFOEa1NxlgdgvLkKGol3U55niQMkWZ90NSo/hjLbw5Show5UwVkKMAXKAI0AQ44KWfsCc/nga5qoktmHWoC9Jo70YdoOv8XeA4N+2STV6wRXj7EwrxuNWdizKPoUjkWmZdj9SCUAwz9irDIGii0yDawtCdQlOZN1r+hjybn2nVoO+WGEE1IQ7RWL1AfaYYXrEKlBuWXhJOJ3xyC5bAIBj9QKUNrcXRTrj6DLkz738bS/TpciCxGoWpRJU11jVw0sAxoyaxDP4yVU5Q3fpHtd76fD09LfmSUgCr5q3be8nKegWH7ZftoWtfxd4AS6dusX1FX0lRXNUAf1ULUAaWFFjCb7fQlSI6+MULvtvG/z8L3/7iVv71PU/fkrJXOAAAAAElFTkSuQmCC",
        },
        zyxplay: {
          type: "image",
          data: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAZCAYAAACclhZ6AAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+Gkqr6gAAAYVpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAACiRdZG/L0NRFMc/ivhVMeggYehAB1GhpGFDI0VEmiJpsbRPXytp6+W9iojRYO3QwY9YiFjMbOIfkEgkmCxWMZBYRJ5z2yZtRM/Nvfdzv/ecc+89FxyRtJaxGoYgk82Z4eCUOxJdcTe90kI37Xjoi2mWMRkKzVPTvh6pU/ODV+Wq7fevta0nLA3qmoUnNMPMCc8IL2znDMUHwi4tFVsXvhQeMOWCws9Kj5f4TXGyyA6V02UuhQPCLmF3sorjVaylzIzwqHBvJr2lle+jXuJMZJcXlS69B4swQaZwM8s0AfwMMy6jHy8+BmVFjXhfMX6BTYnVZDTYwWSDJClyDIi6JdkTMuuiJ6SlxUNM/cHf2lr6iK90gnMOGl9t+7Mfmo7hZ9+2v09t++cM6qUut4VK/GYBxt5Fz1e03hPo2IOrm4oWP4frPHS9GDEzVpTqpTt0HT4uoD0KnffQulqqW3mfsydY2oX5Ozg8Ao/4d6z9AkrLZ1nFF9t1AAAACXBIWXMAAA7EAAAOxAGVKw4bAAABhUlEQVRYhd2YQXLCMAxFnxiOEPZsWTATLpR79AS9BxeCmS7YZl/uoK7SUYztWHbadPpXDJaCnr+QDaKqikMiIlOOiEgu1sZ9fhwV4HAeszmlcTHtvAlWuY1IrU3FetdKtEhvi7JOpN7Prdliw53PrZWqqE1iBafWl3JiRa8BAhmYpaJicbMHZ3JS7dQCAgmYUpBYfGlOCNQKApEB4AUJ40pzfkIzmBqQGsXarHWSgYHZAuRwHsW2VyvQDrYDsa+72wiAXqkGktzBF01IwC7dCkrGr17R5+VIdxuRYfkMDNV0A6hRbmrJgHS3keflWOXQZpMnJwviccjVZuEp3/r9yj3HA6RvvYKzzbzfrxZ9Azz6bMtNIGCc8Vzn13Cm9NagV5RHD6f7i0MzkPe7/PoA8EoGhNP9xaEQBDZyJswveZ4t3moCgcpzZgsYeAWyIOAcAGvcDmKFx34LRT/fuhCAAOzXLHRr7ZdD1pPd+ZQLqqq1G/vnp5lHTc6UDg/v31O17vwrZ74AU8A2WY7UEnEAAAAASUVORK5CYII=",
        },
      },
      onready: ({}) => {
        x.setScene("game");
      },
    });
  x.start();
})();
