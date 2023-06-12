!(function (i) {
  var t = {};
  function e(n) {
    if (t[n]) return t[n].exports;
    var o = (t[n] = { i: n, l: !1, exports: {} });
    return i[n].call(o.exports, o, o.exports, e), (o.l = !0), o.exports;
  }
  (e.m = i),
    (e.c = t),
    (e.d = function (i, t, n) {
      e.o(i, t) || Object.defineProperty(i, t, { enumerable: !0, get: n });
    }),
    (e.r = function (i) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(i, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(i, "__esModule", { value: !0 });
    }),
    (e.t = function (i, t) {
      if ((1 & t && (i = e(i)), 8 & t)) return i;
      if (4 & t && "object" == typeof i && i && i.__esModule) return i;
      var n = Object.create(null);
      if (
        (e.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: i }),
        2 & t && "string" != typeof i)
      )
        for (var o in i)
          e.d(
            n,
            o,
            function (t) {
              return i[t];
            }.bind(null, o)
          );
      return n;
    }),
    (e.n = function (i) {
      var t =
        i && i.__esModule
          ? function () {
              return i.default;
            }
          : function () {
              return i;
            };
      return e.d(t, "a", t), t;
    }),
    (e.o = function (i, t) {
      return Object.prototype.hasOwnProperty.call(i, t);
    }),
    (e.p = ""),
    e((e.s = 8));
})([
  function (i, t) {
    i.exports = function (i, t, e) {
      var n,
        o,
        r,
        a,
        s,
        h,
        c,
        l,
        u,
        f,
        d,
        m,
        p = e[0],
        g = e[1],
        T = e[2];
      t === i
        ? ((i[12] = t[0] * p + t[4] * g + t[8] * T + t[12]),
          (i[13] = t[1] * p + t[5] * g + t[9] * T + t[13]),
          (i[14] = t[2] * p + t[6] * g + t[10] * T + t[14]),
          (i[15] = t[3] * p + t[7] * g + t[11] * T + t[15]))
        : ((n = t[0]),
          (o = t[1]),
          (r = t[2]),
          (a = t[3]),
          (s = t[4]),
          (h = t[5]),
          (c = t[6]),
          (l = t[7]),
          (u = t[8]),
          (f = t[9]),
          (d = t[10]),
          (m = t[11]),
          (i[0] = n),
          (i[1] = o),
          (i[2] = r),
          (i[3] = a),
          (i[4] = s),
          (i[5] = h),
          (i[6] = c),
          (i[7] = l),
          (i[8] = u),
          (i[9] = f),
          (i[10] = d),
          (i[11] = m),
          (i[12] = n * p + s * g + u * T + t[12]),
          (i[13] = o * p + h * g + f * T + t[13]),
          (i[14] = r * p + c * g + d * T + t[14]),
          (i[15] = a * p + l * g + m * T + t[15]));
      return i;
    };
  },
  function (i, t, e) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    const n = e(5),
      o = e(0);
    class r {
      constructor(i, t, e) {
        (this.transformations = i),
          (this.getPosition = t),
          (this.fillColor = [e[0] / 255, e[1] / 255, e[2] / 255, 1]);
      }
      render(i, t, e, r, a, s) {
        i.bindBuffer(i.ARRAY_BUFFER, e),
          i.vertexAttribPointer(
            t.attribLocations.vertexPosition,
            3,
            i.FLOAT,
            !1,
            0,
            0
          ),
          i.enableVertexAttribArray(t.attribLocations.vertexPosition),
          i.bindBuffer(i.ARRAY_BUFFER, r),
          i.vertexAttribPointer(
            t.attribLocations.vertexNormal,
            3,
            i.FLOAT,
            !1,
            0,
            0
          ),
          i.enableVertexAttribArray(t.attribLocations.vertexNormal);
        const h = n();
        o(h, h, this.getPosition()),
          this.transformations(h),
          i.uniformMatrix4fv(t.uniformLocations.modelViewMatrix, !1, h),
          i.uniform4fv(t.uniformLocations.fillColor, this.fillColor),
          i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, a),
          i.drawElements(i.TRIANGLES, s, i.UNSIGNED_SHORT, 0);
      }
    }
    class a extends r {
      constructor(i, t, e) {
        super(i, t, e);
      }
      static initBuffers(i) {
        (a.positionBuffer = i.createBuffer()),
          i.bindBuffer(i.ARRAY_BUFFER, a.positionBuffer),
          i.bufferData(
            i.ARRAY_BUFFER,
            new Float32Array(a.positions),
            i.STATIC_DRAW
          ),
          (a.normalsBuffer = i.createBuffer()),
          i.bindBuffer(i.ARRAY_BUFFER, a.normalsBuffer),
          i.bufferData(
            i.ARRAY_BUFFER,
            new Float32Array(a.normals),
            i.STATIC_DRAW
          ),
          (a.indicesBuffer = i.createBuffer()),
          i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, a.indicesBuffer),
          i.bufferData(
            i.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(a.indices),
            i.STATIC_DRAW
          );
      }
      render(i, t) {
        super.render(
          i,
          t,
          a.positionBuffer,
          a.normalsBuffer,
          a.indicesBuffer,
          36
        );
      }
    }
    (a.positions = [
      -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, -1, 1, -1, 1, 1, -1,
      1, -1, -1, -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, -1, -1, 1, -1, -1,
      1, -1, 1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, -1, -1, -1,
      -1, -1, 1, -1, 1, 1, -1, 1, -1,
    ]),
      (a.normals = [
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        -1, 0, 0,
      ]),
      (a.indices = [
        0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12,
        14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
      ]),
      (a.positionBuffer = null),
      (a.normalsBuffer = null),
      (a.indicesBuffer = null),
      (t.Cuboid = a);
    class s extends r {
      constructor(i, t, e) {
        super(i, t, e);
      }
      static initBuffers(i) {
        (s.positionBuffer = i.createBuffer()),
          i.bindBuffer(i.ARRAY_BUFFER, s.positionBuffer),
          i.bufferData(
            i.ARRAY_BUFFER,
            new Float32Array(s.positions),
            i.STATIC_DRAW
          ),
          (s.normalsBuffer = i.createBuffer()),
          i.bindBuffer(i.ARRAY_BUFFER, s.normalsBuffer),
          i.bufferData(
            i.ARRAY_BUFFER,
            new Float32Array(s.normals),
            i.STATIC_DRAW
          ),
          (s.indicesBuffer = i.createBuffer()),
          i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, s.indicesBuffer),
          i.bufferData(
            i.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(s.indices),
            i.STATIC_DRAW
          );
      }
      render(i, t) {
        super.render(
          i,
          t,
          s.positionBuffer,
          s.normalsBuffer,
          s.indicesBuffer,
          24
        );
      }
    }
    (s.positions = [
      0, 1, 0, -1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, -1, 0, 1, 0, 1, 0, -1,
      -1, 0, -1, 0, 1, 0, -1, 0, -1, -1, 0, 1, 0, -1, 0, -1, 0, 1, 1, 0, 1, 0,
      -1, 0, 1, 0, 1, 1, 0, -1, 0, -1, 0, 1, 0, -1, -1, 0, -1, 0, -1, 0, -1, 0,
      -1, -1, 0, 1,
    ]),
      (s.normals = [
        0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0, 1, -1, 0, 1,
        -1, 0, 1, -1, -1, 1, 0, -1, 1, 0, -1, 1, 0, 0, -1, 1, 0, -1, 1, 0, -1,
        1, 1, -1, 0, 1, -1, 0, 1, -1, 0, 0, -1, -1, 0, -1, -1, 0, -1, -1, -1,
        -1, 0, -1, -1, 0, -1, -1, 0,
      ]),
      (s.indices = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23,
      ]),
      (s.positionBuffer = null),
      (s.normalsBuffer = null),
      (s.indicesBuffer = null),
      (t.SquareBipyramid = s);
  },
  function (i, t, e) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    const n = e(0),
      o = e(6);
    (t.SIZE = 800),
      (function (i) {
        (i.HUMMER = "HUMMER"),
          (i.NORMAL = "NORMAL"),
          (i.NARROW_LEFT = "NARROW_LEFT"),
          (i.NARROW_RIGHT = "NARROW_RIGHT"),
          (i.STICKY = "STICKY"),
          (i.NARROW_LEFT_STICKY = "NARROW_LEFT_STICKY"),
          (i.NARROW_RIGHT_STICKY = "NARROW_RIGHT_STICKY"),
          (i.ICE = "ICE"),
          (i.NARROW_LEFT_ICE = "NARROW_LEFT_ICE"),
          (i.NARROW_RIGHT_ICE = "NARROW_RIGHT_ICE"),
          (i.HOLE = "HOLE"),
          (i.MOVING = "MOVING"),
          (i.BOMB = "BOMB");
      })(t.BrickType || (t.BrickType = {})),
      (t.animation = {
        walking: {
          rightArm: (i, t, e) => {
            n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          leftArm: (i, t, e) => {
            n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          rightLeg: (i, t, e) => {
            n(i, i, [0, 4, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -4, 0]);
          },
          leftLeg: (i, t, e) => {
            n(i, i, [0, 4, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -4, 0]);
          },
        },
        jumping: {
          head: (i, t, e) => {
            n(i, i, [0, e, 0]),
              n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          rightArm: (i, t, e) => {
            n(i, i, [0, e, 0]),
              n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          leftArm: (i, t, e) => {
            n(i, i, [0, e, 0]),
              n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          body: (i, t, e) => {
            n(i, i, [0, e, 0]),
              n(i, i, [0, 8, 0]),
              t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]),
              n(i, i, [0, -8, 0]);
          },
          rightLeg: (i, t, e) => {
            t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]);
          },
          leftLeg: (i, t, e) => {
            t[2] && o(i, i, t[2], [0, 0, 1]),
              t[1] && o(i, i, t[1], [0, 1, 0]),
              t[0] && o(i, i, t[0], [1, 0, 0]);
          },
        },
      }),
      (t.wait = (i) => new Promise((t) => setTimeout(t, i)));
  },
  function (i, t) {
    i.exports = function (i, t, e) {
      var n = e[0],
        o = e[1],
        r = e[2];
      return (
        (i[0] = t[0] * n),
        (i[1] = t[1] * n),
        (i[2] = t[2] * n),
        (i[3] = t[3] * n),
        (i[4] = t[4] * o),
        (i[5] = t[5] * o),
        (i[6] = t[6] * o),
        (i[7] = t[7] * o),
        (i[8] = t[8] * r),
        (i[9] = t[9] * r),
        (i[10] = t[10] * r),
        (i[11] = t[11] * r),
        (i[12] = t[12]),
        (i[13] = t[13]),
        (i[14] = t[14]),
        (i[15] = t[15]),
        i
      );
    };
  },
  function (i, t, e) {
    "use strict";
    Object.defineProperty(t, "__esModule", { value: !0 });
    t.default = class {
      constructor(i, t, e) {
        (this.savedState = []),
          (this.getState = i),
          (this.compareState = t),
          (this.reloadState = e);
      }
      runTimeMachine() {
        const i = this.savedState[this.savedState.length - 1];
        i &&
          (this.reloadState(i),
          (i.frames -= 1),
          i.frames <= 0 && this.savedState.pop());
      }
      saveState() {
        this.savedState.push(Object.assign({ frames: 1 }, this.getState()));
      }
      updateState() {
        if (!this.savedState.length) return void this.saveState();
        const i = this.savedState[this.savedState.length - 1];
        this.compareState(i) ? this.saveState() : (i.frames += 1);
      }
    };
  },
  function (i, t) {
    i.exports = function () {
      var i = new Float32Array(16);
      return (
        (i[0] = 1),
        (i[1] = 0),
        (i[2] = 0),
        (i[3] = 0),
        (i[4] = 0),
        (i[5] = 1),
        (i[6] = 0),
        (i[7] = 0),
        (i[8] = 0),
        (i[9] = 0),
        (i[10] = 1),
        (i[11] = 0),
        (i[12] = 0),
        (i[13] = 0),
        (i[14] = 0),
        (i[15] = 1),
        i
      );
    };
  },
  function (i, t) {
    i.exports = function (i, t, e, n) {
      var o,
        r,
        a,
        s,
        h,
        c,
        l,
        u,
        f,
        d,
        m,
        p,
        g,
        T,
        R,
        A,
        y,
        S,
        b,
        L,
        k,
        M,
        _,
        B,
        O = n[0],
        I = n[1],
        v = n[2],
        C = Math.sqrt(O * O + I * I + v * v);
      if (Math.abs(C) < 1e-6) return null;
      (O *= C = 1 / C),
        (I *= C),
        (v *= C),
        (o = Math.sin(e)),
        (r = Math.cos(e)),
        (a = 1 - r),
        (s = t[0]),
        (h = t[1]),
        (c = t[2]),
        (l = t[3]),
        (u = t[4]),
        (f = t[5]),
        (d = t[6]),
        (m = t[7]),
        (p = t[8]),
        (g = t[9]),
        (T = t[10]),
        (R = t[11]),
        (A = O * O * a + r),
        (y = I * O * a + v * o),
        (S = v * O * a - I * o),
        (b = O * I * a - v * o),
        (L = I * I * a + r),
        (k = v * I * a + O * o),
        (M = O * v * a + I * o),
        (_ = I * v * a - O * o),
        (B = v * v * a + r),
        (i[0] = s * A + u * y + p * S),
        (i[1] = h * A + f * y + g * S),
        (i[2] = c * A + d * y + T * S),
        (i[3] = l * A + m * y + R * S),
        (i[4] = s * b + u * L + p * k),
        (i[5] = h * b + f * L + g * k),
        (i[6] = c * b + d * L + T * k),
        (i[7] = l * b + m * L + R * k),
        (i[8] = s * M + u * _ + p * B),
        (i[9] = h * M + f * _ + g * B),
        (i[10] = c * M + d * _ + T * B),
        (i[11] = l * M + m * _ + R * B),
        t !== i &&
          ((i[12] = t[12]), (i[13] = t[13]), (i[14] = t[14]), (i[15] = t[15]));
      return i;
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = e(0),
      r = e(3),
      a = e(1),
      s = e(2),
      h = n(e(15)),
      c = n(e(4)),
      l = n(e(16)),
      u = (i, t) =>
        ((i === s.BrickType.NARROW_LEFT ||
          i === s.BrickType.NARROW_LEFT_STICKY ||
          i === s.BrickType.NARROW_LEFT_ICE) && [t[0] - 1.5, t[1], t[2]]) ||
        ((i === s.BrickType.NARROW_RIGHT ||
          i === s.BrickType.NARROW_RIGHT_STICKY ||
          i === s.BrickType.NARROW_RIGHT_ICE) && [t[0] + 1.5, t[1], t[2]]) || [
          t[0],
          t[1],
          t[2],
        ];
    t.default = class {
      constructor(i, t, e) {
        (this.initialMovingSpeed = 0.1),
          (this.movingSpeed = this.initialMovingSpeed),
          (this.originalPosition = u(t, i)),
          (this.position = u(t, i)),
          (this.type = t),
          (this.direction = t === s.BrickType.MOVING ? -1 : 0);
        const n = ((t === s.BrickType.STICKY ||
            t === s.BrickType.NARROW_LEFT_STICKY ||
            t === s.BrickType.NARROW_RIGHT_STICKY) && [98, 154, 52]) ||
            ((t === s.BrickType.ICE ||
              t === s.BrickType.NARROW_LEFT_ICE ||
              t === s.BrickType.NARROW_RIGHT_ICE) && [67, 128, 198]) ||
            (t === s.BrickType.BOMB && [230, 230, 0]) ||
            (t === s.BrickType.HUMMER && [255, 0, 0]) || [156, 169, 201],
          f =
            t === s.BrickType.NARROW_LEFT ||
            t === s.BrickType.NARROW_LEFT_STICKY ||
            t === s.BrickType.NARROW_LEFT_ICE ||
            t === s.BrickType.NARROW_RIGHT ||
            t === s.BrickType.NARROW_RIGHT_STICKY ||
            t === s.BrickType.NARROW_RIGHT_ICE
              ? 1.5
              : 3;
        (this.block = new a.Cuboid(
          (i) => {
            o(i, i, [0, -1, 0]), r(i, i, [f, 1, 3]);
          },
          () => this.position,
          n
        )),
          e &&
            t !== s.BrickType.HOLE &&
            (this.diamond = new h.default(this.position)),
          t === s.BrickType.HUMMER &&
            (this.hummer = new l.default([
              this.position[0],
              30,
              this.position[2],
            ])),
          (this.timeMachine = new c.default(
            () => ({
              direction: this.direction,
              movingSpeed: this.movingSpeed,
            }),
            (i) =>
              i.direction !== this.direction ||
              i.movingSpeed !== this.movingSpeed,
            (i) => {
              (this.position[0] -= i.direction * i.movingSpeed),
                (this.direction = i.direction),
                (this.movingSpeed = i.movingSpeed),
                this.diamond && this.diamond.timeMachine.runTimeMachine(),
                this.hummer && this.hummer.timeMachine.runTimeMachine();
            }
          ));
      }
      update(i) {
        this.type === s.BrickType.MOVING &&
          (i
            ? (this.movingSpeed = 0)
            : ((this.movingSpeed = this.initialMovingSpeed),
              Math.abs(this.position[0] - this.originalPosition[0]) > 5 &&
                (this.direction *= -1),
              (this.position[0] += this.direction * this.movingSpeed))),
          this.diamond && this.diamond.update(i),
          this.hummer && this.hummer.update(i),
          this.timeMachine.updateState();
      }
      render(i, t) {
        this.type !== s.BrickType.HOLE && this.block.render(i, t),
          this.diamond && this.diamond.render(i, t),
          this.hummer && this.hummer.render(i, t);
      }
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
        (this && this.__awaiter) ||
        function (i, t, e, n) {
          return new (e || (e = Promise))(function (o, r) {
            function a(i) {
              try {
                h(n.next(i));
              } catch (i) {
                r(i);
              }
            }
            function s(i) {
              try {
                h(n.throw(i));
              } catch (i) {
                r(i);
              }
            }
            function h(i) {
              i.done
                ? o(i.value)
                : new e(function (t) {
                    t(i.value);
                  }).then(a, s);
            }
            h((n = n.apply(i, t || [])).next());
          });
        },
      o =
        (this && this.__importDefault) ||
        function (i) {
          return i && i.__esModule ? i : { default: i };
        },
      r =
        (this && this.__importStar) ||
        function (i) {
          if (i && i.__esModule) return i;
          var t = {};
          if (null != i)
            for (var e in i) Object.hasOwnProperty.call(i, e) && (t[e] = i[e]);
          return (t.default = i), t;
        };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const a = e(5),
      s = e(9),
      h = e(10),
      c = o(e(12)),
      l = r(e(13)),
      u = e(1),
      f = e(2),
      d = new c.default([0, 0, 0]),
      m = 300;
    let p = 0,
      g = 0,
      T = 1;
    const R = (i, t) => {
        (i.elements.time.style.height = `${
          (d.numberOfCollectedTime / m) * 100
        }%`),
          (i.elements.time.style.transition = t ? "all 0.5s" : "none");
      },
      A = (i) => {
        (d.score = Math.floor(Math.max(d.score, -d.position[2]))),
          (i.elements.score.innerText = `${d.score}`);
      };
    function y() {
      if (d.currentAnimation) {
        const i = d.currentAnimation.reduce((i, t) => i + t.length, 0);
        d.frameIndex = i - d.frameIndex - 1;
      } else d.frameIndex = 0;
      d.walkAnimation.reverse(), d.jumpAnimation.reverse();
    }
    function S(i) {
      const t = Date.now(),
        e = l.default.getBrick(d);
      if (
        ((p -= 0.04),
        (p = Math.max(p, 0)),
        (g -= 0.02),
        (g = Math.max(g, 0)),
        T >= 1.05 ? (T -= 0.05) : T <= 0.95 && (T += 0.01),
        (d.turningSpeed = 0.5),
        (d.externalTurningSpeed = 0),
        (d.jumpSpeed = -1.5),
        (d.walkingSpeed = -1),
        (d.walkingSpeed *= Math.min((d.score + 3e3) / 3e3, 5)),
        d.position[1] <= 0)
      )
        if (
          ((e.brick.type === f.BrickType.NARROW_LEFT ||
            e.brick.type === f.BrickType.NARROW_LEFT_ICE ||
            e.brick.type === f.BrickType.NARROW_RIGHT ||
            e.brick.type === f.BrickType.NARROW_RIGHT_ICE) &&
            e.distanceX > 2.5) ||
          e.distanceX > 4 ||
          e.distanceZ > 4
        )
          d.isDead = !0;
        else {
          switch (e.brick.type) {
            case f.BrickType.ICE:
            case f.BrickType.NARROW_LEFT_ICE:
            case f.BrickType.NARROW_RIGHT_ICE:
              d.externalTurningSpeed = 0.15;
              break;
            case f.BrickType.STICKY:
            case f.BrickType.NARROW_LEFT_STICKY:
            case f.BrickType.NARROW_RIGHT_STICKY:
              (d.walkingSpeed *= 0.5),
                (d.turningSpeed = 0.1),
                (d.jumpSpeed = -1.2);
              break;
            case f.BrickType.MOVING:
              (d.externalDirection = e.brick.direction),
                (d.externalTurningSpeed = e.brick.movingSpeed);
              break;
            case f.BrickType.HUMMER:
              e.brick.hummer && e.brick.hummer.position[1] < 8 && (T = 0);
              break;
            case f.BrickType.BOMB:
              (T *= 2), (d.fallingSpeed = 1.5 * d.jumpSpeed);
          }
          if (e.brick.diamond) {
            const i = e.brick.diamond.getValue();
            i &&
              ((T *= 1.5),
              (d.numberOfCollectedTime += i),
              (d.numberOfCollectedTime = Math.min(d.numberOfCollectedTime, m)));
          }
        }
      if (
        (d.isDead && (d.fallingSpeed = Math.max(d.fallingSpeed, 0)),
        d.externalTurn(),
        d.jump(),
        d.walk(),
        d.turn(),
        d.animate(1),
        l.default.update(d, g > 0),
        l.default.tryToTransfer(),
        d.timeMachine.updateState(),
        R(i, !0),
        A(i),
        d.position[1] < -200)
      )
        return (
          (i.elements.finalScore.innerText = `Your score: ${d.score}`),
          i.actions.setShadowOpacity(1),
          void i.actions.setPlayAgainOpacity(1)
        );
      const n = Date.now() - t;
      d.isTimeMachineRunning && d.numberOfCollectedTime > 0
        ? (y(),
          setTimeout(
            () =>
              (function i(t) {
                if (d.numberOfCollectedTime <= 0)
                  return y(), void setTimeout(() => S(t), 33);
                const e = Date.now();
                (p += 0.04),
                  (p = Math.min(p, 1)),
                  T >= 1.05 ? (T -= 0.05) : T <= 0.95 && (T += 0.01),
                  d.timeMachine.runTimeMachine(),
                  l.default.runTimeMachine(),
                  (d.numberOfCollectedTime -= 1),
                  R(t, !1);
                const n = Date.now() - e;
                d.isTimeMachineRunning
                  ? setTimeout(() => i(t), 16 - n)
                  : (y(), setTimeout(() => S(t), 33 - n));
              })(i),
            33 - n
          ))
        : setTimeout(() => S(i), 33 - n);
    }
    const b =
        "\n  precision mediump float;\n\n  attribute vec4 aVertexPosition;\n  attribute vec3 aVertexNormal;\n\n  uniform mat4 uModelViewMatrix;\n  uniform mat4 uProjectionMatrix;\n  uniform mat4 uCameraView;\n  uniform vec3 uCameraPosition;\n  uniform vec3 uLightPosition;\n\n  varying vec3 vVertexNormal;\n  varying vec3 vSurfaceWorldPosition;\n\n  void main() {\n    gl_Position = uProjectionMatrix * uCameraView * uModelViewMatrix * aVertexPosition;\n\n    vVertexNormal = mat3(uModelViewMatrix) * aVertexNormal;\n    vSurfaceWorldPosition = (uModelViewMatrix * aVertexPosition).xyz;\n  }\n",
      L =
        "\n  precision mediump float;\n\n  struct Light {\n    vec3 position;\n    vec3 color;\n    float ambient;\n    float linear;\n    float quadratic;\n    float cutOff;\n    float outerCutOff;\n  };\n\n  uniform Light lights[20];\n  uniform int numberOfLights;\n  uniform vec4 fillColor;\n  uniform vec3 uCameraPosition;\n  uniform float uBrightnessFactor;\n  uniform float uGrayscaleFactor;\n\n  varying vec3 vVertexNormal;\n  varying vec3 vSurfaceWorldPosition;\n\n  void main(void) {\n    vec3 result = vec3(0.0, 0.0, 0.0);\n\n    for (int i = 0; i < 20; i += 1) {\n      if (i == numberOfLights) break;\n\n      vec3 ambient = lights[i].ambient * lights[i].color;\n\n      vec3 norm = normalize(vVertexNormal);\n      vec3 lightDir = normalize(lights[i].position - vSurfaceWorldPosition);\n      float diff = max(dot(norm, lightDir), 0.0);\n      vec3 diffuse = diff * lights[i].color;\n\n      float specularStrength = 0.5;\n      vec3 viewDir = normalize(uCameraPosition - vSurfaceWorldPosition);\n      vec3 reflectDir = reflect(-lightDir, norm);\n      float spec = max(dot(viewDir, reflectDir), 0.0);\n      spec *= spec * spec * spec * spec * spec * spec * spec * spec * spec * spec;\n      spec *= spec * spec * spec * spec * spec * spec * spec * spec * spec * spec;\n      vec3 specular = specularStrength * spec * lights[i].color;\n\n      float distance = length(lights[i].position - vSurfaceWorldPosition);\n      float attenuation = 1.0 / (1.0 + lights[i].linear * distance + lights[i].quadratic * (distance * distance));\n      ambient *= attenuation * uBrightnessFactor;\n      diffuse *= attenuation * uBrightnessFactor;\n      specular *= attenuation;\n\n      float theta = dot(lightDir, normalize(-vec3(0.0, -1.0, 0.0)));\n      float epsilon = lights[i].cutOff - lights[i].outerCutOff;\n      float intensity = clamp((theta - lights[i].outerCutOff) / epsilon, 0.0, 1.0);\n      diffuse *= intensity;\n\n      result += (ambient + diffuse) * fillColor.rgb;\n    }\n\n    float gray = 0.21 * result.r + 0.71 * result.g + 0.07 * result.b;\n\t  gl_FragColor = vec4(result.rgb * (1.0 - uGrayscaleFactor) + (gray * uGrayscaleFactor), fillColor.a);\n  }\n";
    function k(i, t, e) {
      const n = i.createShader(t);
      if (n)
        return (
          i.shaderSource(n, e),
          i.compileShader(n),
          i.getShaderParameter(n, i.COMPILE_STATUS)
            ? n
            : (console.error(
                `An error occurred compiling the shaders: ${i.getShaderInfoLog(
                  n
                )}`
              ),
              void i.deleteShader(n))
        );
    }
    function M(i, t, e) {
      t.clearColor(0, 0, 0, 1),
        t.clearDepth(1),
        t.enable(t.DEPTH_TEST),
        t.depthFunc(t.LEQUAL),
        t.clear(t.COLOR_BUFFER_BIT | t.DEPTH_BUFFER_BIT),
        t.enable(t.BLEND),
        t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0),
        t.blendFunc(t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA),
        t.useProgram(e.program),
        (function (i, t) {
          const e = (45 * Math.PI) / 180,
            n = i.canvas,
            o = n.clientWidth / n.clientHeight,
            r = a();
          s(r, e, o, 0.1, 500),
            i.uniformMatrix4fv(t.uniformLocations.projectionMatrix, !1, r);
          const c = [0, 35, d.position[2] + 35],
            u = a();
          if (
            (h(u, c, [0, 0, d.position[2] - 20], [0, 1, 0]),
            i.uniform3fv(t.uniformLocations.cameraPosition, c),
            i.uniformMatrix4fv(t.uniformLocations.cameraView, !1, u),
            i.uniform1f(t.uniformLocations.brightnessFactor, T),
            i.uniform1f(t.uniformLocations.grayscaleFactor, Math.max(g, p)),
            "normal" === t.type)
          ) {
            i.uniform3fv(t.uniformLocations.setLightPosition(0), [
              0,
              50,
              d.position[2] + 20,
            ]),
              i.uniform3fv(t.uniformLocations.setLightColor(0), [1, 1, 1]),
              i.uniform1f(t.uniformLocations.setLightAmbient(0), 0),
              i.uniform1f(t.uniformLocations.setLightLinear(0), 0.0014),
              i.uniform1f(t.uniformLocations.setLightQuadratic(0), 7e-6),
              i.uniform1f(t.uniformLocations.setLightCutOff(0), 0.5),
              i.uniform1f(t.uniformLocations.setLightOuterCutOff(0), 0.4);
            const e = l.WorldState.paths
              .reduce(
                (i, t) => [
                  ...i,
                  ...t.bricks.map((i) => i.diamond).filter((i) => i),
                ],
                []
              )
              .filter((i) => i.isVisible)
              .slice(0, 19);
            i.uniform1i(t.uniformLocations.numberOfLights, e.length + 1);
            for (let n = 0; n < e.length; n += 1)
              i.uniform3fv(t.uniformLocations.setLightPosition(n + 1), [
                e[n].position[0],
                3,
                e[n].position[2],
              ]),
                i.uniform3fv(t.uniformLocations.setLightColor(n + 1), [
                  193 / 255,
                  126 / 255,
                  205 / 255,
                ]),
                i.uniform1f(t.uniformLocations.setLightAmbient(n + 1), 1),
                i.uniform1f(t.uniformLocations.setLightLinear(n + 1), 0.045),
                i.uniform1f(
                  t.uniformLocations.setLightQuadratic(n + 1),
                  0.0075
                ),
                i.uniform1f(t.uniformLocations.setLightCutOff(n + 1), 1),
                i.uniform1f(t.uniformLocations.setLightOuterCutOff(n + 1), 0.2);
          }
        })(t, e),
        l.default.render(t, e),
        d.render(t, e),
        d.position[1] < -200 || requestAnimationFrame(() => M(i, t, e));
    }
    !(function () {
      const i = document.querySelector("canvas");
      if (!i) return;
      (i.width = window.innerWidth), (i.height = window.innerHeight);
      const t = i.getContext("webgl", { premultipliedAlpha: !1 });
      if (!t) return;
      window.addEventListener("keydown", (i) => {
        38 === i.keyCode &&
        d.currentAnimation !== d.jumpAnimation &&
        0 === d.fallingSpeed
          ? ((d.frameIndex = 0),
            (d.currentAnimation = d.jumpAnimation),
            (d.fallingSpeed = d.jumpSpeed))
          : 39 === i.keyCode
          ? ((d.externalDirection = 1), (d.direction = 1))
          : 37 === i.keyCode
          ? ((d.externalDirection = -1), (d.direction = -1))
          : 32 === i.keyCode
          ? (d.isTimeMachineRunning = !0)
          : 70 === i.keyCode &&
            d.numberOfCollectedTime >= 15 &&
            ((d.numberOfCollectedTime -= 15), (g = 1));
      }),
        window.addEventListener("keyup", (i) => {
          39 === i.keyCode
            ? (d.direction = 0)
            : 37 === i.keyCode
            ? (d.direction = 0)
            : 32 === i.keyCode && (d.isTimeMachineRunning = !1);
        });
      const e = (function (i) {
        const t = k(i, i.VERTEX_SHADER, b);
        if (!t) return;
        const e = k(i, i.FRAGMENT_SHADER, L);
        if (!e) return;
        const n = i.createProgram();
        if (n) {
          if (
            (i.attachShader(n, t),
            i.attachShader(n, e),
            i.linkProgram(n),
            i.getProgramParameter(n, i.LINK_STATUS))
          )
            return n;
          alert(
            `Unable to initialize the shader program: ${i.getProgramInfoLog(n)}`
          );
        }
      })(t);
      if (!e) return;
      const o = {
        type: "normal",
        program: e,
        attribLocations: {
          vertexPosition: t.getAttribLocation(e, "aVertexPosition"),
          vertexNormal: t.getAttribLocation(e, "aVertexNormal"),
        },
        uniformLocations: {
          cameraView: t.getUniformLocation(e, "uCameraView"),
          cameraPosition: t.getUniformLocation(e, "uCameraPosition"),
          projectionMatrix: t.getUniformLocation(e, "uProjectionMatrix"),
          modelViewMatrix: t.getUniformLocation(e, "uModelViewMatrix"),
          fillColor: t.getUniformLocation(e, "fillColor"),
          numberOfLights: t.getUniformLocation(e, "numberOfLights"),
          brightnessFactor: t.getUniformLocation(e, "uBrightnessFactor"),
          grayscaleFactor: t.getUniformLocation(e, "uGrayscaleFactor"),
          setLightPosition: (i) =>
            t.getUniformLocation(e, `lights[${i}].position`),
          setLightColor: (i) => t.getUniformLocation(e, `lights[${i}].color`),
          setLightAmbient: (i) =>
            t.getUniformLocation(e, `lights[${i}].ambient`),
          setLightLinear: (i) => t.getUniformLocation(e, `lights[${i}].linear`),
          setLightQuadratic: (i) =>
            t.getUniformLocation(e, `lights[${i}].quadratic`),
          setLightCutOff: (i) => t.getUniformLocation(e, `lights[${i}].cutOff`),
          setLightOuterCutOff: (i) =>
            t.getUniformLocation(e, `lights[${i}].outerCutOff`),
        },
      };
      u.Cuboid.initBuffers(t), u.SquareBipyramid.initBuffers(t);
      const r = document.querySelector(".shadow"),
        a = document.querySelector(".background"),
        s = document.querySelector(".menu"),
        h = document.querySelector(".controls"),
        c = document.querySelector(".button.new-game"),
        m = document.querySelector(".time > div"),
        p = document.querySelector(".play-again"),
        T = document.querySelector(".score"),
        R = document.querySelector(".play-again > span"),
        A = (i) => a.setAttribute("style", `opacity: ${i}`),
        y = (i) => h.setAttribute("style", `opacity: ${i}`),
        _ = (i) => r.setAttribute("style", `opacity: ${i}`),
        B = (i) =>
          s.setAttribute(
            "style",
            `opacity: ${i}; pointer-events: ${i ? "all" : "none"}`
          ),
        O = (i) =>
          p.setAttribute(
            "style",
            `opacity: ${i}; pointer-events: ${i ? "all" : "none"}`
          ),
        I = {
          elements: {
            shadow: r,
            menu: s,
            controls: h,
            newGameButton: c,
            time: m,
            playAgain: p,
            score: T,
            finalScore: R,
          },
          actions: {
            setShadowOpacity: _,
            setPlayAgainOpacity: O,
            setMenuOpacity: B,
            setBackgroundOpacity: A,
          },
        };
      p.addEventListener("click", () =>
        n(this, void 0, void 0, function* () {
          "1" === p.style.opacity &&
            (_(0), O(0), d.reset(), l.default.reset(), M(i, t, o), S(I));
        })
      ),
        c.addEventListener("click", () =>
          n(this, void 0, void 0, function* () {
            "1" === s.style.opacity &&
              (M(i, t, o),
              B(0),
              A(0),
              y(1),
              yield f.wait(6e3),
              y(0),
              _(0),
              S(I));
          })
        );
    })();
  },
  function (i, t) {
    i.exports = function (i, t, e, n, o) {
      var r = 1 / Math.tan(t / 2),
        a = 1 / (n - o);
      return (
        (i[0] = r / e),
        (i[1] = 0),
        (i[2] = 0),
        (i[3] = 0),
        (i[4] = 0),
        (i[5] = r),
        (i[6] = 0),
        (i[7] = 0),
        (i[8] = 0),
        (i[9] = 0),
        (i[10] = (o + n) * a),
        (i[11] = -1),
        (i[12] = 0),
        (i[13] = 0),
        (i[14] = 2 * o * n * a),
        (i[15] = 0),
        i
      );
    };
  },
  function (i, t, e) {
    var n = e(11);
    i.exports = function (i, t, e, o) {
      var r,
        a,
        s,
        h,
        c,
        l,
        u,
        f,
        d,
        m,
        p = t[0],
        g = t[1],
        T = t[2],
        R = o[0],
        A = o[1],
        y = o[2],
        S = e[0],
        b = e[1],
        L = e[2];
      if (
        Math.abs(p - S) < 1e-6 &&
        Math.abs(g - b) < 1e-6 &&
        Math.abs(T - L) < 1e-6
      )
        return n(i);
      (u = p - S),
        (f = g - b),
        (d = T - L),
        (m = 1 / Math.sqrt(u * u + f * f + d * d)),
        (r = A * (d *= m) - y * (f *= m)),
        (a = y * (u *= m) - R * d),
        (s = R * f - A * u),
        (m = Math.sqrt(r * r + a * a + s * s))
          ? ((r *= m = 1 / m), (a *= m), (s *= m))
          : ((r = 0), (a = 0), (s = 0));
      (h = f * s - d * a),
        (c = d * r - u * s),
        (l = u * a - f * r),
        (m = Math.sqrt(h * h + c * c + l * l))
          ? ((h *= m = 1 / m), (c *= m), (l *= m))
          : ((h = 0), (c = 0), (l = 0));
      return (
        (i[0] = r),
        (i[1] = h),
        (i[2] = u),
        (i[3] = 0),
        (i[4] = a),
        (i[5] = c),
        (i[6] = f),
        (i[7] = 0),
        (i[8] = s),
        (i[9] = l),
        (i[10] = d),
        (i[11] = 0),
        (i[12] = -(r * p + a * g + s * T)),
        (i[13] = -(h * p + c * g + l * T)),
        (i[14] = -(u * p + f * g + d * T)),
        (i[15] = 1),
        i
      );
    };
  },
  function (i, t) {
    i.exports = function (i) {
      return (
        (i[0] = 1),
        (i[1] = 0),
        (i[2] = 0),
        (i[3] = 0),
        (i[4] = 0),
        (i[5] = 1),
        (i[6] = 0),
        (i[7] = 0),
        (i[8] = 0),
        (i[9] = 0),
        (i[10] = 1),
        (i[11] = 0),
        (i[12] = 0),
        (i[13] = 0),
        (i[14] = 0),
        (i[15] = 1),
        i
      );
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = e(0),
      r = e(3),
      a = e(1),
      s = e(2),
      h = n(e(4));
    t.default = class {
      constructor(i) {
        (this.fallingSpeed = 0),
          (this.walkingSpeed = -1),
          (this.direction = 0),
          (this.turningSpeed = 0.5),
          (this.externalDirection = 1),
          (this.externalTurningSpeed = 0),
          (this.jumpSpeed = -1.5),
          (this.isDead = !1),
          (this.savedState = []),
          (this.numberOfCollectedTime = 0),
          (this.isTimeMachineRunning = !1),
          (this.score = 0),
          (this.headRotation = [0, 0, 0]),
          (this.headPosition = 0),
          (this.rightArmRotation = [0, 0, 0]),
          (this.rightArmPosition = 0),
          (this.leftArmRotation = [0, 0, 0]),
          (this.leftArmPosition = 0),
          (this.bodyRotation = [0, 0, 0]),
          (this.bodyPosition = 0),
          (this.rightLegRotation = [0, 0, 0]),
          (this.rightLegPosition = 0),
          (this.leftLegRotation = [0, 0, 0]),
          (this.leftLegPosition = 0),
          (this.animationDirection = 1),
          (this.frameIndex = 0),
          (this.position = i),
          (this.head = new a.Cuboid(
            (i) => {
              this.headAnimationFn &&
                this.headAnimationFn(i, this.headRotation, this.headPosition),
                o(i, i, [0, 9, 0]),
                r(i, i, [0.9, 1, 0.9]);
            },
            () => this.position,
            [255, 205, 148]
          )),
          (this.body = new a.Cuboid(
            (i) => {
              this.bodyAnimationFn &&
                this.bodyAnimationFn(i, this.bodyRotation, this.bodyPosition),
                o(i, i, [0, 6, 0]),
                r(i, i, [1, 2, 1]);
            },
            () => this.position,
            [76, 166, 76]
          )),
          (this.rightArm = new a.Cuboid(
            (i) => {
              this.rightArmAnimationFn &&
                this.rightArmAnimationFn(
                  i,
                  this.rightArmRotation,
                  this.rightArmPosition
                ),
                o(i, i, [1.4, 6, 0]),
                r(i, i, [0.4, 1.5, 0.5]);
            },
            () => this.position,
            [76, 166, 76]
          )),
          (this.leftArm = new a.Cuboid(
            (i) => {
              this.leftArmAnimationFn &&
                this.leftArmAnimationFn(
                  i,
                  this.leftArmRotation,
                  this.leftArmPosition
                ),
                o(i, i, [-1.4, 6, 0]),
                r(i, i, [0.4, 1.5, 0.5]);
            },
            () => this.position,
            [76, 166, 76]
          )),
          (this.rightLeg = new a.Cuboid(
            (i) => {
              this.rightLegAnimationFn &&
                this.rightLegAnimationFn(
                  i,
                  this.rightLegRotation,
                  this.rightLegPosition
                ),
                o(i, i, [0.5, 2, 0]),
                r(i, i, [0.5, 2, 0.75]);
            },
            () => this.position,
            [127, 58, 70]
          )),
          (this.leftLeg = new a.Cuboid(
            (i) => {
              this.leftLegAnimationFn &&
                this.leftLegAnimationFn(
                  i,
                  this.leftLegRotation,
                  this.leftLegPosition
                ),
                o(i, i, [-0.5, 2, 0]),
                r(i, i, [0.5, 2, 0.75]);
            },
            () => this.position,
            [127, 58, 70]
          ));
        const t = () => {
          (this.headPosition = 0),
            (this.headRotation = [0, 0, 0]),
            (this.rightArmRotation = [0, 0, 0]),
            (this.rightArmPosition = 0),
            (this.leftArmPosition = 0),
            (this.leftArmRotation = [0, 0, 0]),
            (this.bodyRotation = [0, 0, 0]),
            (this.bodyPosition = 0),
            (this.rightLegRotation = [0, 0, 0]),
            (this.rightLegPosition = 0),
            (this.leftLegRotation = [0, 0, 0]),
            (this.leftLegPosition = 0);
        };
        (this.walkAnimation = [
          {
            length: 1,
            action: () => {
              t(),
                (this.rightArmAnimationFn = s.animation.walking.rightArm),
                (this.leftArmAnimationFn = s.animation.walking.leftArm),
                (this.rightLegAnimationFn = s.animation.walking.rightLeg),
                (this.leftLegAnimationFn = s.animation.walking.leftLeg);
            },
          },
          {
            length: 5,
            action: () => {
              (this.rightArmRotation[0] +=
                (-this.walkingSpeed * this.animationDirection * Math.PI) / 24),
                (this.leftArmRotation[0] -=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.rightLegRotation[0] -=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.leftLegRotation[0] +=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24);
            },
          },
          {
            length: 10,
            action: () => {
              (this.rightArmRotation[0] -=
                (-this.walkingSpeed * this.animationDirection * Math.PI) / 24),
                (this.leftArmRotation[0] +=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.rightLegRotation[0] +=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.leftLegRotation[0] -=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24);
            },
          },
          {
            length: 5,
            action: () => {
              (this.rightArmRotation[0] +=
                (-this.walkingSpeed * this.animationDirection * Math.PI) / 24),
                (this.leftArmRotation[0] -=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.rightLegRotation[0] -=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24),
                (this.leftLegRotation[0] +=
                  (-this.walkingSpeed * this.animationDirection * Math.PI) /
                  24);
            },
          },
          {
            length: 1,
            action: () => {
              t(),
                (this.rightArmAnimationFn = s.animation.walking.rightArm),
                (this.leftArmAnimationFn = s.animation.walking.leftArm),
                (this.rightLegAnimationFn = s.animation.walking.rightLeg),
                (this.leftLegAnimationFn = s.animation.walking.leftLeg);
            },
          },
        ]),
          (this.jumpAnimation = [
            {
              length: 1,
              action: () => {
                t(),
                  (this.headAnimationFn = s.animation.jumping.head),
                  (this.rightArmAnimationFn = s.animation.jumping.rightArm),
                  (this.leftArmAnimationFn = s.animation.jumping.leftArm),
                  (this.bodyAnimationFn = s.animation.jumping.body),
                  (this.rightLegAnimationFn = s.animation.jumping.rightLeg),
                  (this.leftLegAnimationFn = s.animation.jumping.leftLeg);
              },
            },
            {
              length: 3,
              action: () => {
                (this.headRotation[0] -=
                  (this.animationDirection * Math.PI) / 20),
                  (this.headPosition -= 0.8 * this.animationDirection),
                  (this.leftArmRotation[0] -=
                    (this.animationDirection * Math.PI) / 7),
                  (this.leftArmPosition -= 0.8 * this.animationDirection),
                  (this.rightArmRotation[0] -=
                    (this.animationDirection * Math.PI) / 7),
                  (this.rightArmPosition -= 0.8 * this.animationDirection),
                  (this.bodyRotation[0] -=
                    (this.animationDirection * Math.PI) / 20),
                  (this.bodyPosition -= 0.8 * this.animationDirection),
                  (this.rightLegRotation[0] +=
                    (this.animationDirection * Math.PI) / 20),
                  (this.leftLegRotation[0] +=
                    (this.animationDirection * Math.PI) / 20);
              },
            },
            {
              length: 3,
              action: () => {
                (this.headRotation[0] +=
                  (this.animationDirection * Math.PI) / 20),
                  (this.headPosition += 0.8 * this.animationDirection),
                  (this.leftArmRotation[0] +=
                    (this.animationDirection * Math.PI) / 7),
                  (this.leftArmPosition += 0.8 * this.animationDirection),
                  (this.rightArmRotation[0] +=
                    (this.animationDirection * Math.PI) / 7),
                  (this.rightArmPosition += 0.8 * this.animationDirection),
                  (this.bodyRotation[0] +=
                    (this.animationDirection * Math.PI) / 20),
                  (this.bodyPosition += 0.8 * this.animationDirection),
                  (this.rightLegRotation[0] -=
                    (this.animationDirection * Math.PI) / 20),
                  (this.leftLegRotation[0] -=
                    (this.animationDirection * Math.PI) / 20);
              },
            },
            {
              length: 1,
              action: () => {
                (this.rightLegAnimationFn = s.animation.jumping.rightLeg),
                  (this.leftLegAnimationFn = s.animation.jumping.leftLeg),
                  (this.rightLegAnimationFn = s.animation.walking.rightLeg),
                  (this.leftLegAnimationFn = s.animation.walking.leftLeg);
              },
            },
            {
              length: 10,
              action: () => {
                (this.leftArmRotation[0] -=
                  (this.animationDirection * Math.PI) / 36),
                  (this.rightArmRotation[0] +=
                    (this.animationDirection * Math.PI) / 36),
                  (this.rightLegRotation[0] -=
                    (this.animationDirection * Math.PI) / 54),
                  (this.leftLegRotation[0] +=
                    (this.animationDirection * Math.PI) / 36);
              },
            },
            {
              length: 10,
              action: () => {
                (this.leftArmRotation[0] +=
                  (this.animationDirection * Math.PI) / 36),
                  (this.rightArmRotation[0] -=
                    (this.animationDirection * Math.PI) / 36),
                  (this.rightLegRotation[0] +=
                    (this.animationDirection * Math.PI) / 54),
                  (this.leftLegRotation[0] -=
                    (this.animationDirection * Math.PI) / 36);
              },
            },
            {
              length: 1,
              action: () => {
                t(),
                  (this.headAnimationFn = s.animation.jumping.head),
                  (this.rightArmAnimationFn = s.animation.jumping.rightArm),
                  (this.leftArmAnimationFn = s.animation.jumping.leftArm),
                  (this.bodyAnimationFn = s.animation.jumping.body),
                  (this.rightLegAnimationFn = s.animation.walking.rightLeg),
                  (this.leftLegAnimationFn = s.animation.walking.leftLeg);
              },
            },
          ]),
          (this.frameIndex = 0),
          (this.currentAnimation = this.walkAnimation),
          (this.timeMachine = new h.default(
            () => ({
              walkingSpeed: this.walkingSpeed,
              fallingSpeed: this.fallingSpeed,
              direction: this.direction,
              turningSpeed: this.turningSpeed,
              externalDirection: this.externalDirection,
              externalTurningSpeed: this.externalTurningSpeed,
              currentAnimation: this.currentAnimation,
            }),
            (i) =>
              i.walkingSpeed !== this.walkingSpeed ||
              i.fallingSpeed !== this.fallingSpeed ||
              i.direction !== this.direction ||
              i.turningSpeed !== this.turningSpeed ||
              i.externalDirection !== this.externalDirection ||
              i.externalTurningSpeed !== this.externalTurningSpeed ||
              i.currentAnimation !== this.currentAnimation,
            (i) => {
              (this.position[0] -= i.direction * i.turningSpeed),
                (this.position[0] -=
                  i.externalDirection * i.externalTurningSpeed),
                (this.position[1] += i.fallingSpeed),
                this.position[1] < 0 &&
                  i.fallingSpeed < 0 &&
                  (this.position[1] = 0),
                (this.position[2] -= i.walkingSpeed),
                (this.isDead = this.position[1] < -5),
                (this.walkingSpeed = i.walkingSpeed),
                (this.fallingSpeed = i.fallingSpeed),
                (this.direction = 0),
                (this.turningSpeed = i.turningSpeed),
                (this.externalDirection = i.externalDirection),
                (this.externalTurningSpeed = i.externalTurningSpeed),
                this.currentAnimation !== i.currentAnimation &&
                  ((this.frameIndex = 0),
                  (this.currentAnimation = i.currentAnimation)),
                this.animate(-1);
            }
          ));
      }
      animate(i) {
        this.animationDirection = i;
        let t = this.currentAnimation;
        if (!t) return;
        let e = 0,
          n = t.find((i) => {
            const t = e <= this.frameIndex && e + i.length > this.frameIndex;
            return (e += i.length), t;
          });
        if (!n) {
          if (
            ((this.frameIndex = 0),
            (this.currentAnimation = this.walkAnimation),
            !(t = this.currentAnimation))
          )
            return;
          n = t[0];
        }
        n.action(), (this.frameIndex += 1), 1 === n.length && this.animate(i);
      }
      turn() {
        this.position[0] += this.direction * this.turningSpeed;
      }
      externalTurn() {
        this.position[0] += this.externalDirection * this.externalTurningSpeed;
      }
      jump() {
        this.position[1] <= 0 && !this.isDead && this.fallingSpeed >= 0
          ? ((this.position[1] = 0), (this.fallingSpeed = 0))
          : ((this.fallingSpeed += 0.1),
            (this.position[1] -= this.fallingSpeed));
      }
      walk() {
        this.isDead && (this.walkingSpeed = 0),
          (this.position[2] += this.walkingSpeed);
      }
      render(i, t) {
        this.head.render(i, t),
          this.body.render(i, t),
          this.rightArm.render(i, t),
          this.leftArm.render(i, t),
          this.rightLeg.render(i, t),
          this.leftLeg.render(i, t);
      }
      reset() {
        (this.position = [0, 0, 0]),
          (this.fallingSpeed = 0),
          (this.walkingSpeed = -1),
          (this.direction = 0),
          (this.turningSpeed = 0.5),
          (this.externalDirection = 1),
          (this.externalTurningSpeed = 0),
          (this.jumpSpeed = -1.5),
          (this.isDead = !1),
          (this.savedState = []),
          (this.numberOfCollectedTime = 0),
          (this.isTimeMachineRunning = !1),
          (this.score = 0);
      }
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = n(e(14)),
      r = n(e(7)),
      a = e(2);
    class s {
      constructor(i) {
        (this.paths = i), (this.transferableTo = []);
      }
      getNextState() {
        return this.transferableTo[
          Math.floor(Math.random() * this.transferableTo.length)
        ];
      }
      update(i, t) {
        const e = this.paths;
        s.head[2] = 6 * Math.floor((i.position[2] - 200) / 6);
        for (let n = 0; n < s.paths.length; n += 1)
          s.paths[n].update(
            !!e[n],
            [s.head[0] + 15 * (n - 1), s.head[1], s.head[2]],
            i,
            t
          );
      }
      runTimeMachine() {
        for (let i = 0; i < s.paths.length; i += 1) s.paths[i].runTimeMachine();
      }
      render(i, t) {
        for (const e of s.paths) e.render(i, t);
      }
      getPaths() {
        return s.paths;
      }
    }
    (s.head = [0, 0, 0]),
      (s.paths = [
        new o.default([]),
        new o.default(
          new Array(34)
            .fill(0)
            .map(
              (i, t) => new r.default([0, 0, 6 * -t], a.BrickType.NORMAL, !1)
            )
        ),
        new o.default([]),
      ]),
      (t.WorldState = s);
    const h = new s([1, 0, 0]),
      c = new s([0, 1, 0]),
      l = new s([0, 0, 1]),
      u = new s([1, 1, 0]),
      f = new s([0, 1, 1]),
      d = new s([1, 0, 1]),
      m = new s([1, 1, 1]);
    (h.transferableTo = [c, u, f, d, m]),
      (c.transferableTo = [h, l, u, f, d, m]),
      (l.transferableTo = [c, u, f, d, m]),
      (u.transferableTo = [h, c, l, f, d, m]),
      (f.transferableTo = [h, c, l, u, d, m]),
      (d.transferableTo = [c, u, f, m]),
      (m.transferableTo = [h, c, l, u, f, d]);
    let p = c;
    t.default = {
      get: () => p,
      tryToTransfer() {
        Math.random() < 0.01 && (p = p.getNextState());
      },
      update(i, t) {
        p.update(i, t);
      },
      runTimeMachine() {
        p.runTimeMachine();
      },
      getBrick: (i) =>
        s.paths
          .reduce(
            (t, e) => [
              ...t,
              ...e.bricks
                .filter((i) => i.type !== a.BrickType.HOLE)
                .map((t) => ({
                  brick: t,
                  distanceX: Math.abs(t.position[0] - i.position[0]),
                  distanceZ: Math.abs(t.position[2] - i.position[2]),
                  distance: Math.sqrt(
                    Math.pow(t.position[0] - i.position[0], 2) +
                      Math.pow(t.position[2] - i.position[2], 2)
                  ),
                })),
            ],
            []
          )
          .sort((i, t) => i.distance - t.distance)[0],
      render(i, t) {
        p.render(i, t);
      },
      reset() {
        (p = c),
          (s.head = [0, 0, 0]),
          (s.paths = [
            new o.default([]),
            new o.default(
              new Array(34)
                .fill(0)
                .map(
                  (i, t) =>
                    new r.default([0, 0, 6 * -t], a.BrickType.NORMAL, !1)
                )
            ),
            new o.default([]),
          ]);
      },
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = n(e(7)),
      r = e(2),
      a = {
        [r.BrickType.BOMB]: {
          type: r.BrickType.BOMB,
          propabilityOfChange: 1,
          getTransferableTo: (i) => [r.BrickType.NORMAL],
        },
        [r.BrickType.HUMMER]: {
          type: r.BrickType.HUMMER,
          propabilityOfChange: 1,
          getTransferableTo: (i) => [r.BrickType.NORMAL],
        },
        [r.BrickType.NORMAL]: {
          type: r.BrickType.NORMAL,
          propabilityOfChange: 0.1,
          getTransferableTo: (i) => [
            i.position[2] < -500 ? r.BrickType.BOMB : null,
            i.position[2] < -2e3 ? r.BrickType.HUMMER : null,
            i.position[2] < -1e3 ? r.BrickType.STICKY : null,
            i.position[2] < -500 ? r.BrickType.ICE : null,
            i.position[2] < -750 ? r.BrickType.HOLE : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_LEFT : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_RIGHT : null,
          ],
        },
        [r.BrickType.NARROW_LEFT]: {
          type: r.BrickType.NARROW_LEFT,
          propabilityOfChange: 0.5,
          getTransferableTo: (i) => [r.BrickType.NORMAL],
        },
        [r.BrickType.NARROW_RIGHT]: {
          type: r.BrickType.NARROW_RIGHT,
          propabilityOfChange: 0.5,
          getTransferableTo: (i) => [r.BrickType.NORMAL],
        },
        [r.BrickType.STICKY]: {
          type: r.BrickType.STICKY,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [
            r.BrickType.NORMAL,
            i.position[2] < -750 ? r.BrickType.HOLE : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_LEFT_STICKY : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_RIGHT_STICKY : null,
          ],
        },
        [r.BrickType.NARROW_LEFT_STICKY]: {
          type: r.BrickType.NARROW_LEFT_STICKY,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [r.BrickType.STICKY],
        },
        [r.BrickType.NARROW_RIGHT_STICKY]: {
          type: r.BrickType.NARROW_RIGHT_STICKY,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [r.BrickType.STICKY],
        },
        [r.BrickType.ICE]: {
          type: r.BrickType.ICE,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [
            r.BrickType.NORMAL,
            i.position[2] < -750 ? r.BrickType.HOLE : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_LEFT_ICE : null,
            i.position[2] < -1500 ? r.BrickType.NARROW_RIGHT_ICE : null,
          ],
        },
        [r.BrickType.NARROW_LEFT_ICE]: {
          type: r.BrickType.NARROW_LEFT_ICE,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [r.BrickType.ICE],
        },
        [r.BrickType.NARROW_RIGHT_ICE]: {
          type: r.BrickType.NARROW_RIGHT_ICE,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [r.BrickType.ICE],
        },
        [r.BrickType.HOLE]: {
          type: r.BrickType.HOLE,
          propabilityOfChange: 1,
          getTransferableTo: (i) => [
            r.BrickType.NORMAL,
            i.position[2] < -500 ? r.BrickType.ICE : null,
            i.position[2] < -1e3 ? r.BrickType.STICKY : null,
            i.position[2] < -2e3 ? r.BrickType.MOVING : null,
          ],
        },
        [r.BrickType.MOVING]: {
          type: r.BrickType.MOVING,
          propabilityOfChange: 0.3,
          getTransferableTo: (i) => [
            i.position[2] < -750 ? r.BrickType.HOLE : null,
          ],
        },
      };
    t.default = class {
      constructor(i) {
        (this.bricks = i), (this.state = a[r.BrickType.NORMAL]);
      }
      update(i, t, e, n) {
        const a = this.state.type,
          s = Math.min((e.score + 3e3) / 3e3, 5) * e.numberOfCollectedTime + 25;
        if (
          ((this.bricks = this.bricks.filter(
            (i) => i.position[2] < e.position[2] + s
          )),
          i && (!this.bricks.length || this.bricks[0].position[2] > t[2]))
        ) {
          const i = new o.default(t, a, Math.random() < 0.05);
          this.bricks.length &&
            a === r.BrickType.MOVING &&
            this.bricks[0].type === r.BrickType.MOVING &&
            ((i.position[0] = this.bricks[0].position[0]),
            (i.originalPosition[0] = this.bricks[0].originalPosition[0]),
            (i.direction = this.bricks[0].direction),
            (i.movingSpeed = this.bricks[0].movingSpeed)),
            (this.bricks = [i, ...this.bricks]),
            this.tryToTransfer(e);
        }
        for (const i of this.bricks) i.update(n);
      }
      runTimeMachine() {
        for (const i of this.bricks) i.timeMachine.runTimeMachine();
      }
      tryToTransfer(i) {
        if (Math.random() < this.state.propabilityOfChange) {
          const t = this.state.getTransferableTo(i).filter((i) => i);
          if (!t.length) return;
          const e = t[Math.floor(t.length * Math.random())];
          this.state = a[e];
        }
      }
      render(i, t) {
        for (const e of this.bricks) e.render(i, t);
      }
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = e(0),
      r = e(3),
      a = e(6),
      s = e(1),
      h = n(e(4));
    t.default = class {
      constructor(i) {
        (this.rotation = 0),
          (this.direction = 1),
          (this.rotationSpeed = Math.PI / 36),
          (this.value = 30),
          (this.isVisible = !0),
          (this.position = i),
          (this.block = new s.SquareBipyramid(
            (i) => {
              o(i, i, [0, 5, 0]),
                a(i, i, this.rotation, [0, 1, 0]),
                r(i, i, [0.75, 1.25, 0.75]);
            },
            () => this.position,
            [193, 126, 205]
          )),
          (this.timeMachine = new h.default(
            () => ({ direction: this.direction }),
            (i) => i.direction !== this.direction,
            (i) => {
              (this.rotation -= i.direction * this.rotationSpeed),
                (this.direction = i.direction);
            }
          ));
      }
      getValue() {
        const i = this.value;
        return (this.value = 0), (this.isVisible = !1), i;
      }
      update(i) {
        (this.direction = i ? 0 : 1),
          (this.rotation += this.direction * this.rotationSpeed),
          this.timeMachine.updateState();
      }
      render(i, t) {
        this.isVisible && this.block.render(i, t);
      }
    };
  },
  function (i, t, e) {
    "use strict";
    var n =
      (this && this.__importDefault) ||
      function (i) {
        return i && i.__esModule ? i : { default: i };
      };
    Object.defineProperty(t, "__esModule", { value: !0 });
    const o = e(0),
      r = e(3),
      a = e(1),
      s = n(e(4));
    t.default = class {
      constructor(i) {
        (this.direction = 1),
          (this.fallingSpeed = 0),
          (this.position = i),
          (this.gripLeft = new a.Cuboid(
            (i) => {
              o(i, i, [-4, 20, 0]), r(i, i, [1, 20, 1]);
            },
            () => this.position,
            [50, 50, 50]
          )),
          (this.gripRight = new a.Cuboid(
            (i) => {
              o(i, i, [4, 20, 0]), r(i, i, [1, 20, 1]);
            },
            () => this.position,
            [50, 50, 50]
          )),
          (this.block = new a.Cuboid(
            (i) => {
              o(i, i, [0, 4, 0]), r(i, i, [4, 4, 2]);
            },
            () => this.position,
            [255, 0, 0]
          )),
          (this.timeMachine = new s.default(
            () => ({
              direction: this.direction,
              fallingSpeed: this.fallingSpeed,
            }),
            (i) =>
              i.direction !== this.direction ||
              i.fallingSpeed !== this.fallingSpeed,
            (i) => {
              (this.position[1] += i.direction * i.fallingSpeed),
                (this.direction = i.direction),
                (this.fallingSpeed = i.fallingSpeed);
            }
          ));
      }
      update(i) {
        (this.direction = i ? 0 : 1),
          this.direction &&
            (this.position[1] >= 0 && this.fallingSpeed >= 0
              ? (this.fallingSpeed += 0.5 * this.direction)
              : this.position[1] > 20
              ? (this.fallingSpeed = 0)
              : (this.fallingSpeed = -1)),
          (this.position[1] -= this.direction * this.fallingSpeed),
          this.timeMachine.updateState();
      }
      render(i, t) {
        this.gripLeft.render(i, t),
          this.gripRight.render(i, t),
          this.block.render(i, t);
      }
    };
  },
]);
