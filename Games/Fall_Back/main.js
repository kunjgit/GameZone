!(function (t) {
  var e = {};
  function i(s) {
    if (e[s]) return e[s].exports;
    var o = (e[s] = { i: s, l: !1, exports: {} });
    return t[s].call(o.exports, o, o.exports, i), (o.l = !0), o.exports;
  }
  (i.m = t),
    (i.c = e),
    (i.d = function (t, e, s) {
      i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: s });
    }),
    (i.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (i.t = function (t, e) {
      if ((1 & e && (t = i(t)), 8 & e)) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var s = Object.create(null);
      if (
        (i.r(s),
        Object.defineProperty(s, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t)
      )
        for (var o in t)
          i.d(
            s,
            o,
            function (e) {
              return t[e];
            }.bind(null, o)
          );
      return s;
    }),
    (i.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return i.d(e, "a", e), e;
    }),
    (i.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (i.p = ""),
    i((i.s = 1));
})([
  function (t) {
    t.exports = JSON.parse(
      '{"height":20,"infinite":false,"layers":[{"data":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,10,7,7,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,15,7,11,0,0,0,0,0,0,0,0,0,0,0,0,10,7,16,13,7,14,0,6,0,0,0,0,0,0,0,0,0,0,0,0,6,0,6,14,0,9,11,6,0,0,0,0,0,0,0,0,0,0,0,0,17,0,6,15,11,0,15,8,0,0,0,0,0,0,0,0,0,0,0,7,8,0,9,12,16,7,8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,17,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,13,4,0,0,15,7,11,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,6,0,6,0,0,0,0,0,0,0,0,0,0,0,0,10,16,7,11,5,16,7,14,0,0,0,0,0,0,5,13,4,0,0,0,6,6,0,15,4,6,0,6,0,0,0,0,0,3,0,6,0,10,11,0,17,9,7,12,13,12,11,15,4,0,0,10,7,16,7,16,7,12,16,7,14,0,0,0,6,0,15,14,0,0,0,6,0,2,0,6,0,0,2,0,2,0,0,0,9,13,12,8,0,0,0,2,0,0,5,8,0,0,0,0,0,0,0,0,0,2,0,0,0,0],"height":20,"id":3,"name":"Tile Layer 1","opacity":1,"type":"tilelayer","visible":true,"width":20,"x":0,"y":0}],"nextlayerid":4,"nextobjectid":1,"orientation":"orthogonal","properties":[{"name":"startX","type":"int","value":1},{"name":"startY","type":"int","value":18}],"renderorder":"right-down","tiledversion":"1.2.4","tileheight":8,"tilesets":[{"firstgid":1,"source":"Tileset.tsx"}],"tilewidth":8,"type":"map","version":1.2,"width":20}'
    );
  },
  function (t, e, i) {
    "use strict";
    i.r(e);
    var s = i(0);
    const o = {},
      h = {};
    function r(t) {
      return o[t];
    }
    function a(t) {
      return h[t];
    }
    class n {
      constructor(t, e, i) {
        (this.x = t),
          (this.y = e),
          (this.radius = i),
          (this.velocity = { x: 0, y: 0 });
      }
      collidesWithRectangle(t) {}
    }
    class l {
      constructor(t, e, i, s) {
        (this.x = t), (this.y = e), (this.width = i), (this.height = s);
      }
    }
    class d {
      constructor() {
        this.game = Ct();
      }
      update() {}
      draw(t) {}
      drawLight(t) {}
      drawUi(t) {}
      getColliders() {
        return [];
      }
      getTriggers() {
        return [];
      }
    }
    const g = 9,
      c = 9,
      f = 16,
      m = 5,
      p = 3;
    class u extends d {
      constructor(t, e, i, s = 3) {
        super(),
          (this.speed = s),
          (this.collider = new n(t + i, e + i, i)),
          (this.xDirection = 0),
          (this.yDirection = 0),
          (this.xFacing = 0),
          (this.yFacing = 0);
      }
      update() {
        (this.xDirection = 0), (this.yDirection = 0);
      }
      setX(t) {
        this.collider.x = t;
      }
      setY(t) {
        this.collider.y = t;
      }
      getX() {
        return this.collider.x;
      }
      getY() {
        return this.collider.y;
      }
      getWidth() {
        return this.collider.radius;
      }
      getHeight() {
        return this.collider.radius;
      }
      move(t, e) {
        (this.xDirection = Math.sign(t)),
          (this.yDirection = Math.sign(e)),
          (0 === t && 0 === e) ||
            ((this.xFacing = this.xDirection),
            (this.yFacing = this.yDirection)),
          (this.collider.x += t * this.speed),
          (this.collider.y += e * this.speed);
      }
      draw(t) {
        (t.fillStyle = "white"),
          t.beginPath(),
          t.ellipse(
            this.getX(),
            this.getY(),
            this.getWidth(),
            this.getHeight(),
            0,
            0,
            360
          ),
          t.closePath(),
          t.fill();
      }
      getColliders() {
        return [this.collider];
      }
    }
    class y extends d {
      constructor(t, e) {
        super(),
          (this.x = t),
          (this.y = e),
          (this.game.getRoomFromCoord(t, e).containsFlare = !0);
      }
      draw(t) {
        (t.fillStyle = "orange"), t.fillRect(this.x, this.y, 3, 10);
      }
      drawLight(t) {
        const e = t.createRadialGradient(
          this.x,
          this.y,
          f / 2,
          this.x,
          this.y,
          2 * f
        );
        e.addColorStop(0, "rgba(255, 200, 0, 0.75)"),
          e.addColorStop(1, "rgba(0, 0, 0, 0)"),
          (t.fillStyle = e),
          t.fillRect(this.x - 2 * f, this.y - 2 * f, 4 * f, 4 * f);
      }
    }
    const x = 600;
    class w extends u {
      constructor(t, e) {
        super(t, e, 5, 2),
          (this.canControl = !1),
          (this.isAlive = !0),
          (this.flareTimer = 0);
      }
      update() {
        if (!this.canControl || !this.isAlive) return;
        let t = 0,
          e = 0;
        if (
          (r(65) ? (t = -1) : r(68) && (t = 1),
          r(87) ? (e = -1) : r(83) && (e = 1),
          a(82) && this.flareTimer >= x)
        ) {
          const t = new y(this.getX(), this.getY());
          this.game.addFlare(t), (this.flareTimer = 0);
        }
        this.move(t, e),
          this.flareTimer++,
          this.flareTimer > x && (this.flareTimer = x);
      }
      damage(t) {
        this.isAlive = !1;
        const e = this.game.getEnemy(),
          i = e.getX() - this.getX(),
          s = e.getY() - this.getY();
        Math.abs(i) > Math.abs(s)
          ? Math.sign(i) < 0
            ? (this.bloodOffset = 1)
            : (this.bloodOffset = 3)
          : Math.sign(s) < 0
          ? (this.bloodOffset = 2)
          : (this.bloodOffset = 0);
      }
      draw(t) {
        if (!this.isAlive) {
          const e =
              1 === this.bloodOffset ? 0 : 3 === this.bloodOffset ? -1 : -0.5,
            i = 0 === this.bloodOffset ? -1 : 2 === this.bloodOffset ? 0 : -0.5;
          t.drawImage(
            this.game.tileset,
            32 * this.bloodOffset,
            32,
            32,
            32,
            this.getX() + 2 * f * e,
            this.getY() + 2 * f * i,
            2 * f,
            2 * f
          );
        }
        super.draw(t);
      }
      drawUi(t) {
        const e = this.getX() - this.game.width / 2 + 64,
          i = this.getY() + this.game.height / 2 - 64,
          s = this.flareTimer / x;
        t.drawImage(this.game.tileset, 16, 64, f, f, e, i, 2 * f, 2 * f),
          t.drawImage(
            this.game.tileset,
            0,
            64,
            f * s,
            f,
            e,
            i,
            f * s * 2,
            2 * f
          );
      }
    }
    const C = 8,
      b = 65;
    function M(t, e, i, s, o, h = 1, r = null) {
      r &&
        ((t.fillStyle = r), t.fillRect(s - 4, o - 4, e.length * C + 8, C + 8));
      const a = e.toUpperCase();
      for (let e = 0; e < a.length; e++) {
        let r = a.charCodeAt(e);
        if (32 === r) continue;
        46 === r
          ? (r = 26)
          : 33 === r
          ? (r = 27)
          : 40 === r
          ? (r = 28)
          : 41 === r
          ? (r = 29)
          : 58 === r
          ? (r = 30)
          : (r -= b);
        const n = (r % 16) * C,
          l = 112 + Math.floor(r / 16) * C;
        t.drawImage(i, n, l, C, C, s + e * C * h, o, C * h, C * h);
      }
    }
    let v = 0,
      T = 0;
    const O = ["start", "controls"],
      k = 0,
      Y = 1,
      R = 2,
      S = 3,
      P = 4,
      E = 5,
      X = [
        "WASD to move",
        "E to lock and unlock doors",
        "R to drop flares",
        "The icon in the bottom left",
        "shows the cooldown on flares.",
      ];
    let j = k;
    function A() {
      j === k
        ? (T += 0.05) >= 1 && (j = Y)
        : j === Y
        ? (a(87)
            ? --v < 0 && (v = O.length - 1)
            : a(83)
            ? v++
            : a(69) && 0 === v && (j = R),
          (v %= O.length))
        : j === R
        ? (T -= 0.05) <= 0 && ((j = S), W(B))
        : (j !== P && j !== E) || (T += 0.01),
        Ct().getPlayer().isAlive || j === P || ((T = 0), (j = P));
    }
    const B = [
        "OPERATOR: Starting the experiment.",
        "OPERATOR: Security drone is now active! Readings appear normal.",
        "OPERATOR: Testing employee recognition function...",
      ],
      D = [
        "SECURITY: Fall back, repeat, fall back!",
        "SECURITY: Hostile drone detected, retreat to the nearest checkpoint.",
        "SECURITY: You are advised to lock any doors behind you...",
        "SECURITY: ...to stop the advance of the drone.",
      ],
      I = [
        "SECURITY: Checkpoint A reached, drone in hot pursuit.",
        "SECURITY: Proceed to the next checkpoint ASAP.",
      ],
      L = [
        "SECURITY: The drone is proving more resillient than expected.",
        "SECURITY: You are advised to exit the laboratory through the...",
        "SECURITY: ...remaining last security checkpoint.",
      ],
      F = [
        "SECURITY: Nicely done, head on upstairs. We can take it from here.",
      ];
    let G = null,
      U = 0,
      H = 0,
      _ = 0;
    const z = 200;
    function W(t) {
      (G = t), (H = 0), (U = 0), (_ = 0);
    }
    function N() {
      G &&
        ++H >= G[U].length &&
        ++_ >= z &&
        ((H = 0),
        (_ = 0),
        ++U >= G.length &&
          (!(function () {
            if (G == B) {
              const t = Ct();
              t.getPlayer().canControl = !0;
              const e = t.getEnemy();
              (e.targets = t.getTargets()), (e.isActive = !0), (G = D);
            } else G == F ? ((G = null), (T = 0), (j = E)) : (G = null);
          })(),
          (U = 0)));
    }
    const q = [0, 3, 4, 5, 7, 10, 11, 13],
      V = [0, 2, 3, 5, 6, 9, 10, 15, 17],
      J = [0, 2, 4, 5, 7, 8, 9, 12],
      K = [0, 2, 3, 4, 6, 8, 11, 14, 17];
    class Q extends d {
      constructor(t, e, i) {
        super(),
          (this.x = t),
          (this.y = e),
          (this.type = i),
          (this.visited = !1),
          (this.left = t * f * c),
          (this.top = e * f * c),
          (this.hasTopDoor = !q.includes(i)),
          (this.hasBottomDoor = !J.includes(i)),
          (this.hasLeftDoor = !V.includes(i)),
          (this.hasRightDoor = !K.includes(i)),
          (this.colliders = []),
          (this.exits = []),
          (this.containsFlare = !1),
          0 === i
            ? this.colliders.push(new l(this.left, this.top, f * c, f * g))
            : this.generateBodies(),
          10 === t && 16 === e
            ? this.addCutsceneTrigger(() => {
                W(I);
              })
            : 15 === t && 11 === e
            ? this.addCutsceneTrigger(() => {
                W(L);
              })
            : 11 === t &&
              9 === e &&
              this.addCutsceneTrigger(() => {
                W(F);
              });
      }
      addCutsceneTrigger(t) {
        (this.cutsceneTriggered = !1),
          (this.trigger = new l(this.left, this.top, c * f, g * f)),
          (this.trigger.onCollision = (e) => {
            this.cutsceneTriggered || ((this.cutsceneTriggered = !0), t());
          }),
          (this.triggers = [this.trigger]);
      }
      generateBodies() {
        for (var t = 0; t < c; t++) {
          const e = t === Math.ceil(c / 2) - 1;
          (e && this.hasTopDoor) ||
            this.colliders.push(new l(this.left + t * f, this.top, f, f)),
            (e && this.hasBottomDoor) ||
              this.colliders.push(
                new l(this.left + t * f, this.top + (g - 1) * f, f, f)
              );
        }
        for (var e = 1; e < g - 1; e++) {
          const t = e === Math.ceil(g / 2) - 1;
          (t && this.hasLeftDoor) ||
            this.colliders.push(new l(this.left, this.top + e * f, f, f)),
            (t && this.hasRightDoor) ||
              this.colliders.push(
                new l(this.left + (c - 1) * f, this.top + e * f, f, f)
              );
        }
      }
      getExits() {
        return this.exits;
      }
      addExit(t, e, i = !0) {
        this.exits.push({ room: t, door: e }),
          17 === this.type && (e.locked = !0),
          i && t.addExit(this, e, !1);
      }
      draw(t) {
        t.fillStyle = "black";
        for (let e = 0; e < this.colliders.length; e++) {
          const i = this.colliders[e];
          t.fillRect(i.x, i.y, i.width, i.height);
        }
      }
      drawLight(t) {
        if (!(Math.random() > 0.999) && this.lightLevel > 0) {
          const e = this.left + (f * c) / 2,
            i = this.top + (f * g) / 2,
            s = t.createRadialGradient(e, i, f, e, i, f * c);
          17 === this.type
            ? s.addColorStop(
                0,
                "rgba(100, 255, 200, " + this.lightLevel / m + ")"
              )
            : s.addColorStop(
                0,
                "rgba(255, 255, 255, " + this.lightLevel / m + ")"
              ),
            s.addColorStop(1, "rgba(0, 0, 0, 0)"),
            (t.fillStyle = s),
            t.fillRect(this.left, this.top, f * c, f * g);
        }
      }
      getEmittedLight() {
        return this.containsPlayer() ? m : this.containsFlare ? p : 0;
      }
      getColliders() {
        return this.colliders;
      }
      getTriggers() {
        return this.triggers ? this.triggers : super.getTriggers();
      }
      containsPlayer() {
        const t = this.game.getPlayer();
        return this == this.game.getRoomFromCoord(t.getX(), t.getY());
      }
    }
    const Z = 0,
      $ = 1,
      tt = 2,
      et = 3,
      it = 4,
      st = 5,
      ot = 100;
    class ht extends d {
      constructor(t, e, i, s, o, h) {
        super(),
          (this.x = t),
          (this.y = e),
          (this.width = i),
          (this.height = s),
          (this.isHorizontal = o),
          (this.rooms = h),
          (this.collider = new l(t, e, i, s)),
          (this.state = Z),
          (this.locked = !1),
          (this.health = ot),
          (this.hasBeenTriggered = !1),
          (this.openTrigger = new l(t - 16, e - 16, i + 32, s + 32)),
          (this.openTrigger.onCollision = (t) => {
            this.hasBeenTriggered = !0;
          }),
          (this.obstructedTrigger = new l(t, e, i, s)),
          (this.obstructedTrigger.onCollision = (t) => {
            this.isObstructed = !0;
          }),
          this.isHorizontal
            ? ((this.openX = this.x + 16), (this.openY = this.y))
            : ((this.openX = this.x), (this.openY = this.y + 16));
      }
      update() {
        const t = this.game.getPlayer();
        this.isPlayerInRange() &&
          t.canControl &&
          a(69) &&
          (this.locked = !this.locked),
          (this.state === Z && !this.locked && this.hasBeenTriggered) ||
          (this.state === et && this.isObstructed)
            ? (this.state = $)
            : this.state !== tt ||
              (this.hasBeenTriggered && !this.locked) ||
              (this.state = et);
        let e = this.collider.x,
          i = this.collider.y;
        if (
          (this.state === $ || this.state === it
            ? this.collider.x === this.openX && this.collider.y === this.openY
              ? this.state === $
                ? (this.state = tt)
                : this.state === it && this.state
              : ((e = this.openX), (i = this.openY))
            : this.state === et &&
              (this.collider.x === this.x && this.collider.y === this.y
                ? (this.state = Z)
                : ((e = this.x), (i = this.y))),
          this.collider.x !== e)
        ) {
          const t = e - this.collider.x;
          this.collider.x += 2 * Math.sign(t);
        }
        if (this.collider.y !== i) {
          const t = i - this.collider.y;
          this.collider.y += 2 * Math.sign(t);
        }
        (this.hasBeenTriggered = !1), (this.isObstructed = !1);
      }
      isPlayerInRange() {
        const t = this.game.getPlayer();
        return (
          Math.abs(t.getX() - this.collider.x) < 32 &&
          Math.abs(t.getY() - this.collider.y) < 32
        );
      }
      draw(t) {
        (t.fillStyle = "black"),
          t.fillRect(
            this.collider.x,
            this.collider.y,
            this.collider.width,
            this.collider.height
          );
      }
      drawLight(t) {
        for (let e = 0; e < this.rooms.length; e++)
          if (this.rooms[e].lightLevel > 0) {
            const e = this.getX(),
              i = this.getY(),
              s = t.createRadialGradient(e, i, f / 2, e, i, 2 * f);
            return (
              this.locked || this.isDestroyed()
                ? s.addColorStop(0, "rgba(255, 0, 0, 1.0)")
                : s.addColorStop(0, "rgba(0, 128, 255, 1.0)"),
              s.addColorStop(1, "rgba(0, 0, 0, 0)"),
              (t.fillStyle = s),
              void t.fillRect(e - 2 * f, i - 2 * f, 4 * f, 4 * f)
            );
          }
      }
      drawUi(t) {
        const e = this.game.getPlayer();
        if (this.isPlayerInRange() && e.canControl) {
          const e = this.x + (this.isHorizontal ? this.width + 8 : -24),
            i = this.y + (this.isHorizontal ? 0 : -16);
          M(t, "E: Lock", this.game.tileset, e, i, 1, "black");
        }
      }
      getColliders() {
        return [this.collider];
      }
      getTriggers() {
        return [this.openTrigger, this.obstructedTrigger];
      }
      getX() {
        return this.x + this.width / 2;
      }
      getY() {
        return this.y + this.height / 2;
      }
      isDestroyed() {
        return this.state === st || this.state === it;
      }
      damage(t) {
        (this.health -= t), this.health <= 0 && (this.state = it);
      }
    }
    class rt extends d {
      constructor(t, e, i, s, o, h) {
        super(),
          (this.x = t),
          (this.y = e),
          (this.width = i),
          (this.height = s),
          (this.tileX = o),
          (this.tileY = h),
          (this.collider = new l(t, e, i, s));
      }
      getColliders() {
        return [this.collider];
      }
      draw(t) {
        t.drawImage(
          this.game.tileset,
          this.tileX,
          this.tileY,
          this.width,
          this.height,
          this.x,
          this.y,
          this.width,
          this.height
        );
      }
    }
    const at = [1, 16, 17];
    function nt(t) {
      if (at.includes(t.type) || (1 === t.x && 19 === t.y)) return [];
      const e = [];
      return (
        Math.random() <= 0.1
          ? (e.push(
              new rt(
                t.left + f + Math.random(),
                t.top + f + Math.random(),
                f,
                f,
                48,
                0
              )
            ),
            e.push(
              new rt(
                t.left + f * (2 + Math.random()),
                t.top + f + Math.random(),
                f,
                f,
                48,
                0
              )
            ),
            e.push(
              new rt(
                t.left + f + Math.random(),
                t.top + 2 * f + Math.random(),
                f,
                f,
                48,
                0
              )
            ))
          : Math.random() <= 0.2 &&
            e.push(new rt(t.left + f, t.top + f, 2 * f, f, 64, 0)),
        Math.random() <= 0.1 &&
          (e.push(
            new rt(
              t.left + f * (c - (2 + Math.random())),
              t.top + f * (g - 2) + Math.random(),
              f,
              f,
              48,
              0
            )
          ),
          e.push(
            new rt(
              t.left + f * (c - (2 + Math.random())),
              t.top + f * (g - 3) + Math.random(),
              f,
              f,
              48,
              0
            )
          )),
        Math.random() <= 0.1 &&
          e.push(new rt(t.left + 6 * f, t.top + f, 2 * f, f, 64, 0)),
        Math.random() <= 0.1 &&
          e.push(new rt(t.left + f, t.top + 6 * f, 2 * f, 2 * f, 96, 0)),
        e
      );
    }
    function lt(t, e, i) {
      return e * i + t;
    }
    const dt = 16,
      gt = 6,
      ct = 16,
      ft = 8;
    class mt extends u {
      constructor(t, e) {
        super(t, e, 7, 3),
          (this.feet = [
            { x: -6, y: 6, direction: 1, stride: 3 },
            { x: 6, y: -6, direction: 1, stride: 3 },
            { x: -6, y: -6, direction: -1, stride: 3 },
            { x: 6, y: 6, direction: -1, stride: 3 },
          ]),
          (this.targets = []),
          (this.t = 0),
          (this.attacking = !1),
          (this.attackProgress = 0),
          (this.bodyOffset = 0),
          (this.isActive = !1);
      }
      update() {
        if ((super.update(), this.isActive)) {
          if (this.attacking)
            this.attackProgress++,
              this.attackProgress <= gt
                ? (this.bodyOffset = Math.pow(this.attackProgress / 2, 2))
                : this.attackProgress <= gt + ct
                ? (this.bodyOffset = 16 - (this.attackProgress - gt))
                : this.attackProgress <= gt + ct + ft || (this.attacking = !1);
          else {
            if (!this.target || !this.target.isAlive) {
              if (0 == this.targets.length) return;
              this.target = this.targets.pop();
            }
            const t = this.game.getRoomFromCoord(this.getX(), this.getY());
            if (
              t ===
              this.game.getRoomFromCoord(this.target.getX(), this.target.getY())
            )
              this.attack(this.target);
            else {
              const e = this.findBestExit(t);
              e.door.state === tt || !e.door.locked || e.door.isDestroyed()
                ? this.moveTowardsExit(e)
                : this.attack(e.door);
            }
          }
          this.t += Math.PI / 30;
        }
      }
      moveTowardsExit(t) {
        let e = t.door.getX(),
          i = t.door.getY();
        Math.abs(e - this.getX()) < this.speed &&
          Math.abs(i - this.getY()) < this.speed &&
          ((e = t.door.isHorizontal ? e : t.room.left + c / 2),
          (i = t.door.isHorizontal ? t.room.top + g / 2 : i)),
          this.moveTowards(e, i);
      }
      moveTowards(t, e) {
        const i = t - this.getX(),
          s = e - this.getY();
        this.move(Math.sign(i), Math.sign(s));
      }
      findBestExit(t) {
        const e = t.getExits();
        let i = Number.MAX_VALUE,
          s = null;
        for (let t = 0; t < e.length; t++) {
          const o = e[t],
            h = this.game.distanceMap[o.room.x][o.room.y];
          h < i && ((i = h), (s = o));
        }
        return s;
      }
      attack(t) {
        const e = t.getX(),
          i = t.getY();
        Math.abs(e - this.getX()) < dt && Math.abs(i - this.getY()) < dt
          ? ((this.attacking = !0), (this.attackProgress = 0), t.damage(15))
          : this.moveTowards(e, i);
      }
      draw(t) {
        t.fillStyle = "black";
        for (let e = 0; e < this.feet.length; e++) {
          const i = this.feet[e],
            s = Math.sin(this.t);
          t.beginPath(),
            t.ellipse(
              this.getX() +
                i.x +
                (0 !== this.xDirection ? s * i.stride * i.direction : 0),
              this.getY() +
                i.y +
                (0 !== this.yDirection ? s * i.stride * i.direction : 0),
              3,
              3,
              0,
              0,
              360
            ),
            t.closePath(),
            t.fill();
        }
        const e =
            this.getX() - f / 2 + Math.sign(this.xFacing) * this.bodyOffset,
          i = this.getY() - f / 2 + Math.sign(this.yFacing) * this.bodyOffset;
        t.drawImage(this.game.tileset, 0, 16, 16, 16, e, i, f, f);
      }
    }
    class pt extends w {
      constructor(t, e) {
        super(t, e);
      }
      update() {}
      drawUi() {}
    }
    i.d(e, "getGame", function () {
      return Ct;
    });
    const ut = new Image(),
      yt = document.getElementById("game");
    (yt.width = 1280), (yt.height = 720);
    const xt = document.createElement("canvas");
    (xt.width = 1280), (xt.height = 720);
    const wt = new (class {
      constructor(t, e, i, s, o, h) {
        (this.width = t),
          (this.height = e),
          (this.tileset = i),
          (this.mainCanvas = s),
          (this.mainContext = s.getContext("2d")),
          (this.mainContext.imageSmoothingEnabled = !1),
          (this.floorCanvas = o),
          (this.floorContext = o.getContext("2d")),
          (this.floorContext.imageSmoothingEnabled = !1),
          (this.lightCanvas = h),
          (this.lightContext = h.getContext("2d")),
          (this.lightContext.imageSmoothingEnabled = !1),
          (this.dynamicBodies = []),
          (this.staticBodies = []),
          (this.triggers = []),
          (this.gameObjects = []),
          (this.pendingGameObjects = []);
      }
      init() {
        this.generateFloorPattern();
      }
      generateFloorPattern() {
        (this.floorCanvas.width = 50 * f), (this.floorCanvas.height = 50 * f);
        for (let t = 0; t < 50; t++)
          for (let e = 0; e < 50; e++) {
            let i = 0;
            const s = 100 * Math.random();
            s >= 95 ? (i = 1 * f) : s >= 90 && (i = 2 * f),
              this.floorContext.drawImage(
                this.tileset,
                i,
                0,
                f,
                f,
                t * f,
                e * f,
                f,
                f
              );
          }
        this.floorPattern = this.mainContext.createPattern(
          this.floorCanvas,
          "repeat"
        );
      }
      loadMap(t) {
        (this.map = (function (t) {
          const e = { width: t.width, height: t.height, rooms: [], doors: [] },
            i = t.layers[0].data;
          for (let s = 0; s < i.length; s++) {
            const o = s % t.width,
              h = Math.floor(s / t.height);
            e.rooms.push(new Q(o, h, i[s]));
          }
          for (let i = 0; i < e.rooms.length; i++) {
            const s = i % t.width,
              o = Math.floor(i / t.height),
              h = e.rooms[lt(s, o, t.width)];
            if (h.hasRightDoor) {
              const i = e.rooms[lt(s + 1, o, t.width)];
              if (i) {
                const t = new ht(i.left - 4, h.top + 64, 8, 16, !1, [h, i]);
                h.addExit(i, t), e.doors.push(t);
              }
            }
            if (h.hasBottomDoor) {
              const i = e.rooms[lt(s, o + 1, t.width)];
              if (i) {
                const t = new ht(h.left + 64, i.top - 4, 16, 8, !0, [h, i]);
                h.addExit(i, t), e.doors.push(t);
              }
            }
          }
          return e;
        })(t)),
          (this.rooms = this.map.rooms),
          (this.doors = this.map.doors),
          (this.targets = []);
        let e = 0,
          i = 0;
        for (let s = 0; s < t.properties.length; s++) {
          const o = t.properties[s];
          "startX" === o.name
            ? (e = Math.floor((o.value + 0.5) * f * c))
            : "startY" === o.name && (i = Math.floor((o.value + 0.5) * f * g));
        }
        this.setPlayer(e, i + 3 * f),
          this.targets.push(this.player),
          (this.enemy = new mt(e, i + f * g)),
          this.addGameObject(this.enemy);
        const s = new pt(this.enemy.getX() - 2 * f, this.enemy.getY() - f);
        this.targets.push(s), this.addGameObject(s);
        const o = new pt(this.enemy.getX() + 1 * f, this.enemy.getY() - 2 * f);
        this.targets.push(o), this.addGameObject(o);
        const h = new pt(
          this.enemy.getX() + 1.5 * f,
          this.enemy.getY() + 2 * f
        );
        this.targets.push(h), this.addGameObject(h);
        const r = new pt(
          this.enemy.getX() - 1.5 * f,
          this.enemy.getY() + 1.5 * f
        );
        this.targets.push(r),
          this.addGameObject(r),
          (this.roomsByCoord = {}),
          (this.distanceMap = {});
        for (let t = 0; t < this.map.width; t++)
          (this.roomsByCoord[t] = {}), (this.distanceMap[t] = {});
        for (let t = 0; t < this.rooms.length; t++) {
          const e = this.rooms[t];
          (this.roomsByCoord[e.x][e.y] = e), this.addGameObject(e);
          const i = nt(e);
          for (let t = 0; t < i.length; t++) this.addGameObject(i[t]);
        }
        for (let t = 0; t < this.doors.length; t++)
          this.addGameObject(this.doors[t]);
        (this.lightCanvas.width = f * c * this.map.width),
          (this.lightCanvas.height = f * g * this.map.height);
      }
      addGameObject(t) {
        this.gameObjects.push(t);
        const e = t.getColliders();
        for (let t = 0; t < e.length; t++) {
          const i = e[t];
          i instanceof n
            ? this.dynamicBodies.push(i)
            : i instanceof l && this.staticBodies.push(i);
        }
        const i = t.getTriggers();
        for (let t = 0; t < i.length; t++) this.triggers.push(i[t]);
      }
      addFlare(t) {
        this.pendingGameObjects.push(t);
      }
      getRoomFromCoord(t, e) {
        return (
          (t = Math.floor(t / f / c)),
          (e = Math.floor(e / f / g)),
          this.roomsByCoord[t][e]
        );
      }
      setPlayer(t, e) {
        this.player
          ? (this.player.setX(t), this.player.setY(e))
          : ((this.player = new w(t, e)), this.addGameObject(this.player));
      }
      getPlayer() {
        return this.player;
      }
      getTargets() {
        return this.targets;
      }
      getEnemy() {
        return this.enemy;
      }
      update(t) {
        this.updateDistanceMap();
        for (let t = 0; t < this.gameObjects.length; t++)
          this.gameObjects[t].update();
        this.resolveCollisions(), this.updateLightMap();
      }
      updateDistanceMap() {
        for (let t = 0; t < this.map.width; t++)
          for (let e = 0; e < this.map.height; e++)
            this.distanceMap[t][e] = Number.MAX_VALUE;
        const t = this.getRoomFromCoord(this.player.getX(), this.player.getY());
        this.distanceMap[t.x][t.y] = 0;
        const e = [];
        for (e.push({ x: t.x, y: t.y }); e.length > 0; ) {
          const t = e.pop(),
            i = this.roomsByCoord[t.x][t.y],
            s = i.getExits();
          for (let t = 0; t < s.length; t++) {
            const o = s[t],
              h = o.room,
              r = o.door.locked ? 3 : 1,
              a = this.distanceMap[i.x][i.y] + r;
            this.distanceMap[h.x][h.y] > a &&
              ((this.distanceMap[h.x][h.y] = a), e.push(h));
          }
        }
      }
      updateLightMap() {
        const t = [];
        for (let e = 0; e < this.map.width; e++)
          for (let i = 0; i < this.map.height; i++) {
            const s = this.roomsByCoord[e][i],
              o = s.getEmittedLight();
            o > 0 ? ((s.lightLevel = o), t.push(s)) : (s.lightLevel = 0);
          }
        for (; t.length > 0; ) {
          const e = t.pop(),
            i = e.getExits();
          for (let s = 0; s < i.length; s++) {
            const o = i[s];
            if (o.door.state === Z) continue;
            const h = o.room,
              r = e.lightLevel - 1;
            r > 0 && r > h.lightLevel && ((h.lightLevel = r), t.push(h));
          }
        }
        for (A(), N(); this.pendingGameObjects.length > 0; )
          this.gameObjects.push(this.pendingGameObjects.pop());
      }
      draw() {
        (this.mainContext.globalCompositeOperation = "source-over"),
          (this.lightContext.globalAlpha = 1),
          (this.lightContext.fillStyle = "black"),
          this.lightContext.fillRect(
            0,
            0,
            this.lightCanvas.width,
            this.lightCanvas.height
          ),
          (this.mainContext.fillStyle = "black"),
          this.mainContext.fillRect(0, 0, this.width, this.height);
        const t = Math.floor(this.player.getX() - this.width / 2),
          e = Math.floor(this.player.getY() - this.height / 2);
        this.mainContext.translate(-1 * t, -1 * e),
          (this.mainContext.fillStyle = this.floorPattern),
          this.mainContext.fillRect(
            0,
            0,
            this.map.width * f * c,
            this.map.height * f * g
          ),
          (this.lightContext.globalCompositeOperation = "lighten");
        for (let t = 0; t < this.gameObjects.length; t++)
          this.gameObjects[t].draw(this.mainContext),
            this.gameObjects[t].drawLight(this.lightContext);
        (this.lightContext.globalCompositeOperation = "source-over"),
          this.mainContext.setTransform(1, 0, 0, 1, 0, 0),
          this.lightContext.setTransform(1, 0, 0, 1, 0, 0),
          (this.mainContext.globalCompositeOperation = "multiply"),
          this.mainContext.drawImage(
            this.lightCanvas,
            t,
            e,
            this.width,
            this.height,
            0,
            0,
            this.width,
            this.height
          ),
          (this.mainContext.globalCompositeOperation = "source-over"),
          this.mainContext.translate(-1 * t, -1 * e);
        for (let t = 0; t < this.gameObjects.length; t++)
          this.gameObjects[t].drawUi(this.mainContext);
        this.mainContext.setTransform(1, 0, 0, 1, 0, 0),
          (function (t, e) {
            if (j === S) return;
            const i = t.globalAlpha;
            if (((t.globalAlpha = T), j === P))
              return (
                (t.fillStyle = "black"),
                t.fillRect(0, 0, Ct().width, Ct().height),
                M(t, "Game Over!", e, 32, 200, 5),
                M(t, "Refresh the page to play again.", e, 32, 350, 3),
                void (t.globalAlpha = i)
              );
            if (j === E)
              return (
                (t.fillStyle = "black"),
                t.fillRect(0, 0, Ct().width, Ct().height),
                M(t, "Congratulations!", e, 32, 200, 5),
                M(t, "Thanks for playing!", e, 32, 350, 3),
                void (t.globalAlpha = i)
              );
            M(t, "Fall Back!", e, 32, 200, 5);
            let s = 350;
            for (let i = 0; i < O.length; i++) {
              const o = i === v ? 4 : 2;
              M(t, O[i] + (0 === i ? " (E)" : ""), e, 32, s, o), (s += 16 * o);
            }
            if (1 === v)
              for (let i = 0; i < X.length; i++)
                M(t, X[i], e, 500, 350 + 32 * i, 2);
            t.globalAlpha = i;
          })(this.mainContext, this.tileset),
          (function (t, e) {
            if (G) {
              const i = G[U],
                s = Math.min(i.length, H);
              M(t, i.substring(0, s), e, 16, 16, 2);
            }
          })(this.mainContext, this.tileset);
      }
      resolveCollisions() {
        for (let t = 0; t < this.dynamicBodies.length; t++) {
          const e = this.dynamicBodies[t];
          for (let t = 0; t < this.staticBodies.length; t++) {
            const i = this.staticBodies[t];
            this.checkCollision(e, i);
          }
          for (let t = 0; t < this.triggers.length; t++) {
            const i = this.triggers[t];
            this.checkCollision(e, i, !1) && i.onCollision(e);
          }
        }
      }
      resolveCollision(t, e, i, s, o) {
        const h = Math.sqrt(s * s + o * o),
          r = s / h,
          a = o / h;
        (t.x = Math.floor(e + r * t.radius)),
          (t.y = Math.floor(i + a * t.radius));
      }
      checkCollision(t, e, i = !0) {
        const s = Math.max(e.x, Math.min(t.x, e.x + e.width)),
          o = Math.max(e.y, Math.min(t.y, e.y + e.height)),
          h = t.x - s,
          r = t.y - o;
        return (
          h * h + r * r < t.radius * t.radius &&
          (i && this.resolveCollision(t, s, o, h, r), !0)
        );
      }
    })(1280, 720, ut, yt, document.createElement("canvas"), xt);
    function Ct() {
      return wt;
    }
    function bt(t) {
      wt.update(t),
        wt.draw(),
        (function () {
          for (const t in h) delete h[t];
        })(),
        window.requestAnimationFrame(bt);
    }
    wt.loadMap(s),
      (window.onkeydown = function (t) {
        (o[t.keyCode] = !0), (h[t.keyCode] = !0);
      }),
      (window.onkeyup = function (t) {
        o[t.keyCode] = !1;
      }),
      (ut.onload = function () {
        wt.init(), bt(0);
      }),
      (ut.src = "./tileset.png");
  },
]);
