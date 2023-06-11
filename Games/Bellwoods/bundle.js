!(function () {
  function t(t, n) {
    var e = [];
    for (let o = 0; o < t; o++) e.push(null == n ? o : n);
    return e;
  }
  function n(t, n) {
    return (n[0] = -t[2]), (n[1] = t[1]), (n[2] = t[0]), n;
  }
  function e(t) {
    return (
      (t[0] = 1),
      (t[1] = 0),
      (t[2] = 0),
      (t[3] = 0),
      (t[4] = 0),
      (t[5] = 1),
      (t[6] = 0),
      (t[7] = 0),
      (t[8] = 0),
      (t[9] = 0),
      (t[10] = 1),
      (t[11] = 0),
      (t[12] = 0),
      (t[13] = 0),
      (t[14] = 0),
      (t[15] = 1),
      t
    );
  }
  function o(t, n, e) {
    return (t[0] = n[0] * e), (t[1] = n[1] * e), (t[2] = n[2] * e), t;
  }
  function r(t, n) {
    return t[0] * n[0] + t[1] * n[1] + t[2] * n[2];
  }
  function i(t, n, e) {
    return (t[0] = n[0] + e[0]), (t[1] = n[1] + e[1]), (t[2] = n[2] + e[2]), t;
  }
  function s(t, n) {
    return (t[0] = n[0]), (t[1] = n[1]), (t[2] = n[2]), t;
  }
  function c(t, n, e = []) {
    return k.normalize(e, k.sub(e, t, n));
  }
  function a(t) {
    return Math.sqrt(1 - --t * t);
  }
  function u(t, n, e) {
    return Math.max(n, Math.min(e, t));
  }
  function l(t) {
    return u(t, 0, 1);
  }
  function h(t, n) {
    return ((t % n) + n) % n;
  }
  function f(t, n, e) {
    return t * (1 - e) + n * e;
  }
  function M(t, n, e) {
    var o = l((e - t) / (n - t));
    return o * o * (3 - 2 * o);
  }
  function _(t, n, e, o) {
    return f(t, n, 1 - Math.exp(-e * o));
  }
  function d(t, n, e, o, r = []) {
    for (let i = 0; i < t.length; i++) r[i] = _(t[i], n[i], e, o);
    return r;
  }
  function w(t, n = 0, e) {
    const o = (n = ~~n % I) / I,
      r = N(o),
      i = r.next(),
      s = r.range() > 0.5 ? r.range(0.25, 0.5) : 0.5,
      c = Math.floor(r.range(0, 4)),
      a = r.range(0.1, 0.3),
      u = r.next() > 0.9,
      l = r.next() > 0.99 ? 0 : 1;
    let f = r.next() > 0.9;
    const M = r.next() > 0.5 ? 1 : -1,
      _ = r.next() > 0.8 ? M : 0,
      d = r.range(0.3375, 0.75),
      w = r.range(0.3375, 0.75);
    let p, v;
    0 === c
      ? (p = v = i)
      : 1 === c
      ? ((p = i - a), (v = i + a))
      : 2 === c
      ? ((p = i + 0.5), (v = i - 0.5))
      : 3 === c && ((p = i + 1 / 3), (v = i - 1 / 3), (f = !0));
    let m = (u ? r.range(0, 0.3) : 0.65) * l,
      y = u ? r.range(0.2, 0.3) : 0.75,
      g = e || [0.5 * (2 * r.next() - 1), 0.5 * (2 * r.next() - 1)],
      b = t.depth >= 15 && !P && r.next() > 0.1,
      k = r.next() > 0.2;
    b && ((k = !1), (P = !0), (y = 0));
    let A = [F(p, s * l, d), F(v, s * l, w)];
    _
      ? (A = [F(0, 0, _ > 0 ? 1 : 0)])
      : f && (A = [A[Math.floor(r.next() * A.length)]]);
    let x = F(i + 0, s * l, 0.5),
      O = F(i, m, y);
    const T = t.explored >= 5 && r.next() < 0.025,
      D = T && r.next() < 0.5;
    let j = ["white", "black"],
      C = j[0];
    return (
      T && (D && j.reverse(), (x = C = j[1]), (O = j[0]), (A = [j[1]])),
      e &&
        ((k = !0),
        (b = !1),
        (C = "white"),
        (A = ["#50a0c5", "#b5d3f1"]),
        (x = "#c3776d"),
        (O = "#e29990")),
      {
        first: e,
        flowers: k,
        empty: b,
        hash: r.next(),
        t: r.next() > 0.5,
        n: r.next(),
        e: r.next(),
        user: C,
        offset: g,
        id: n,
        seed: o,
        depth: 0,
        random: r,
        o: Math.floor(1 + 3 * r.next()),
        background: O,
        colors: A,
        lines: x,
        petal(t) {
          const n = h(~~(t * this.colors.length), this.colors.length);
          return this.colors[n];
        },
      }
    );
  }
  function p(e = T) {
    const o = {},
      r = [-0.025, 0.095],
      i = [
        "first-time flyer",
        "little grasshopper",
        "speedy sailor ",
        "color scout",
        "pathfinder",
        "skipper",
        "globetrotter",
        "birdchaser",
        "wayfarer",
        "frequent flyer",
        "world explorer",
        "treetop surfer",
        "high flyer",
        "wind catcher",
      ];
    e %= O;
    let s = 0;
    const a = {
        current: null,
        exit: null,
        r: [],
        i: [],
        depth: 0,
        enter(e) {
          const a = this.current,
            u = e.world;
          if (((this.current = u), (this.r = []), e.tail))
            this.r = e.world.portals || [];
          else {
            o[u.id] = !0;
            const n = t(u.o).map((t) => {
                const n = w(this, u.id + 1 + t * u.o);
                return (
                  (n.depth = (u.depth || 0) + 1), u.first && (n.offset = r), n
                );
              }),
              e = a
                ? { tail: !0, explored: !1, world: a, offset: u.offset }
                : null,
              i = [];
            e && i.push(e),
              n.forEach((t) => {
                i.push({ tail: !1, explored: !1, world: t, offset: t.offset });
              }),
              (u.portals = i),
              (this.r = i);
          }
          e.explored ||
            (function () {
              const t = Math.min(~~Math.pow(s, 1 / 1.53), i.length - 1);
              (window.R.textContent = "— " + i[t]), s++;
            })();
          const l = Object.keys(o).length;
          (this.explored = l),
            (this.i = this.r.map((t) =>
              (function () {
                let t = !1,
                  e = 0,
                  o = [];
                const r = [],
                  i = [];
                let s = 0.1,
                  a = 0;
                const u = [0, 0, 0],
                  l = [0, 0, 0],
                  h = [0, 0, 0],
                  f = [0, 0, 0],
                  M = 5 * Math.random();
                return {
                  updated: !1,
                  position: [0, 0, 0],
                  direction: [0, 0, 0],
                  wings: [
                    [0, 0, 0],
                    [0, 0, 0],
                  ],
                  update(_, w, p, I, N) {
                    this.updated = !0;
                    const v = c(_, p.target);
                    v[1] *= 0;
                    const m = 0.5 + 0.5 * (0.5 * Math.sin(M + 1 * I) + 0.5);
                    k.s(r, p.target, v, m),
                      (this.position = t
                        ? d(this.position, r, 5, N, this.position)
                        : r.slice()),
                      (this.position[1] *= 0),
                      (this.position[1] += 1),
                      ((e += N) > s || !o.length) &&
                        ((e = 0),
                        (s = 0.1 * Math.random() + 0.1),
                        (function (t = 1, n = []) {
                          var e = Math.random() * Math.PI * 2,
                            o = 2 * Math.random() - 1,
                            r = Math.random(),
                            i = e,
                            s = Math.acos(o),
                            c = t * Math.cbrt(r);
                          (n[0] = c * Math.sin(s) * Math.cos(i)),
                            (n[1] = c * Math.sin(s) * Math.sin(i)),
                            (n[2] = c * Math.cos(s));
                        })(1, o),
                        k.s(o, this.position, o, 0.5)),
                      k.sub(i, o, this.position),
                      k.scale(i, i, 0.003),
                      k.add(u, u, i),
                      k.scale(u, u, 0.95),
                      k.add(this.position, this.position, u);
                    const y = c(o, this.position),
                      g = c(_, this.position);
                    k.copy(l, f),
                      k.s(l, l, y, 0.5),
                      k.s(l, l, g, 0.5),
                      (l[1] *= 0),
                      k.normalize(l, l),
                      d(this.direction, l, 10, N, this.direction),
                      k.normalize(this.direction, this.direction),
                      n(this.direction, h),
                      (a = Math.sin(20 * I + Math.cos(I))),
                      k.s(this.wings[0], this.position, h, 0.035),
                      k.s(this.wings[1], this.position, h, -0.035),
                      this.wings.forEach((t) => {
                        t[1] += a * (0.035 * 1.5);
                      }),
                      (t = !0);
                  },
                };
              })()
            )),
            (this.depth = u.depth),
            this.r.forEach((t) => {
              (t._updated = !1), t.world.id in o && (t.explored = !0);
            });
        },
      },
      u = w(a, 0.05, r);
    return (
      (u.id = e),
      (u.o = 1),
      a.enter({ world: u, explored: !1, tail: !1, offset: [0, 0] }),
      a
    );
  }
  const I = 2147483647;
  var N = (t = 0.5) => {
      function n(t) {
        (t %= 1), e.set(~~(t * I) % I);
      }
      let e = (function () {
        function t(t) {
          for (var n = 0; n < t.length; n++) {
            var e = 0.02519603282416938 * (i += t.charCodeAt(n));
            (e -= i = e >>> 0),
              (i = (e *= i) >>> 0),
              (i += 4294967296 * (e -= i));
          }
          return 2.3283064365386963e-10 * (i >>> 0);
        }
        var n,
          e,
          o,
          r,
          i = 4022871197,
          s = t(" "),
          c = t(" "),
          a = t(" "),
          u = i;
        return {
          next() {
            var t = 2091639 * n + 2.3283064365386963e-10 * r;
            return (n = e), (e = o), (o = t - (r = 0 | t));
          },
          set(l) {
            const h = String(l);
            (n = e = o = 0),
              (r = 1),
              (i = u),
              (n = s - t(h)) < 0 && (n += 1),
              (e = c - t(h)) < 0 && (e += 1),
              (o = a - t(h)) < 0 && (o += 1);
          },
        };
      })();
      return (
        n(t),
        {
          next: () => e.next(),
          range(t, n) {
            return this.next() * (n - t) + t;
          },
          gauss() {
            return (
              Math.sqrt(-2 * Math.log(this.next())) *
              Math.cos(2 * Math.PI * this.next())
            );
          },
          shuffle(t, n) {
            for (var e, o, r = t.length; r; )
              (e = Math.floor(this.next() * r--)),
                (o = n[r]),
                (n[r] = n[e]),
                (n[e] = o);
            return n;
          },
          set: n,
        }
      );
    },
    v = 0,
    m = 1,
    y = [0, 0, 0, 0],
    g = [0, 0, 0];
  const b = {
      c: e,
      a: function (t, n, e) {
        var o = n[0],
          r = n[1],
          i = n[2],
          s = n[3],
          c = n[4],
          a = n[5],
          u = n[6],
          l = n[7],
          h = n[8],
          f = n[9],
          M = n[10],
          _ = n[11],
          d = n[12],
          w = n[13],
          p = n[14],
          I = n[15],
          N = e[0],
          v = e[1],
          m = e[2],
          y = e[3];
        return (
          (t[0] = N * o + v * c + m * h + y * d),
          (t[1] = N * r + v * a + m * f + y * w),
          (t[2] = N * i + v * u + m * M + y * p),
          (t[3] = N * s + v * l + m * _ + y * I),
          (N = e[4]),
          (v = e[5]),
          (m = e[6]),
          (y = e[7]),
          (t[4] = N * o + v * c + m * h + y * d),
          (t[5] = N * r + v * a + m * f + y * w),
          (t[6] = N * i + v * u + m * M + y * p),
          (t[7] = N * s + v * l + m * _ + y * I),
          (N = e[8]),
          (v = e[9]),
          (m = e[10]),
          (y = e[11]),
          (t[8] = N * o + v * c + m * h + y * d),
          (t[9] = N * r + v * a + m * f + y * w),
          (t[10] = N * i + v * u + m * M + y * p),
          (t[11] = N * s + v * l + m * _ + y * I),
          (N = e[12]),
          (v = e[13]),
          (m = e[14]),
          (y = e[15]),
          (t[12] = N * o + v * c + m * h + y * d),
          (t[13] = N * r + v * a + m * f + y * w),
          (t[14] = N * i + v * u + m * M + y * p),
          (t[15] = N * s + v * l + m * _ + y * I),
          t
        );
      },
      u: function (t, n, o, r) {
        var i,
          s,
          c,
          a,
          u,
          l,
          h,
          f,
          M,
          _,
          d = n[0],
          w = n[1],
          p = n[2],
          I = r[0],
          N = r[1],
          v = r[2],
          m = o[0],
          y = o[1],
          g = o[2];
        return Math.abs(d - m) < 1e-6 &&
          Math.abs(w - y) < 1e-6 &&
          Math.abs(p - g) < 1e-6
          ? e(t)
          : ((h = d - m),
            (f = w - y),
            (M = p - g),
            (i =
              N * (M *= _ = 1 / Math.sqrt(h * h + f * f + M * M)) -
              v * (f *= _)),
            (s = v * (h *= _) - I * M),
            (c = I * f - N * h),
            (_ = Math.sqrt(i * i + s * s + c * c))
              ? ((i *= _ = 1 / _), (s *= _), (c *= _))
              : (i = s = c = 0),
            (a = f * c - M * s),
            (u = M * i - h * c),
            (l = h * s - f * i),
            (_ = Math.sqrt(a * a + u * u + l * l))
              ? ((a *= _ = 1 / _), (u *= _), (l *= _))
              : (a = u = l = 0),
            (t[0] = i),
            (t[1] = a),
            (t[2] = h),
            (t[3] = 0),
            (t[4] = s),
            (t[5] = u),
            (t[6] = f),
            (t[7] = 0),
            (t[8] = c),
            (t[9] = l),
            (t[10] = M),
            (t[11] = 0),
            (t[12] = -(i * d + s * w + c * p)),
            (t[13] = -(a * d + u * w + l * p)),
            (t[14] = -(h * d + f * w + M * p)),
            (t[15] = 1),
            t);
      },
      l: function (t, n) {
        var e = n[0],
          o = n[1],
          r = n[2],
          i = n[3],
          s = n[4],
          c = n[5],
          a = n[6],
          u = n[7],
          l = n[8],
          h = n[9],
          f = n[10],
          M = n[11],
          _ = n[12],
          d = n[13],
          w = n[14],
          p = n[15],
          I = e * c - o * s,
          N = e * a - r * s,
          v = e * u - i * s,
          m = o * a - r * c,
          y = o * u - i * c,
          g = r * u - i * a,
          b = l * d - h * _,
          k = l * w - f * _,
          A = l * p - M * _,
          x = h * w - f * d,
          F = h * p - M * d,
          P = f * p - M * w,
          O = I * P - N * F + v * x + m * A - y * k + g * b;
        return O
          ? ((O = 1 / O),
            (t[0] = (c * P - a * F + u * x) * O),
            (t[1] = (r * F - o * P - i * x) * O),
            (t[2] = (d * g - w * y + p * m) * O),
            (t[3] = (f * y - h * g - M * m) * O),
            (t[4] = (a * A - s * P - u * k) * O),
            (t[5] = (e * P - r * A + i * k) * O),
            (t[6] = (w * v - _ * g - p * N) * O),
            (t[7] = (l * g - f * v + M * N) * O),
            (t[8] = (s * F - c * A + u * b) * O),
            (t[9] = (o * A - e * F - i * b) * O),
            (t[10] = (_ * y - d * v + p * I) * O),
            (t[11] = (h * v - l * y - M * I) * O),
            (t[12] = (c * k - s * x - a * b) * O),
            (t[13] = (e * x - o * k + r * b) * O),
            (t[14] = (d * N - _ * m - w * I) * O),
            (t[15] = (l * m - h * N + f * I) * O),
            t)
          : null;
      },
      h: function (t, n, e, o, r) {
        var i = 1 / Math.tan(n / 2),
          s = 1 / (o - r);
        return (
          (t[0] = i / e),
          (t[1] = 0),
          (t[2] = 0),
          (t[3] = 0),
          (t[4] = 0),
          (t[5] = i),
          (t[6] = 0),
          (t[7] = 0),
          (t[8] = 0),
          (t[9] = 0),
          (t[10] = (r + o) * s),
          (t[11] = -1),
          (t[12] = 0),
          (t[13] = 0),
          (t[14] = 2 * r * o * s),
          (t[15] = 0),
          t
        );
      },
    },
    k = {
      normalize: function (t, n) {
        var e = n[0],
          o = n[1],
          r = n[2],
          i = e * e + o * o + r * r;
        return (
          i > 0 &&
            ((i = 1 / Math.sqrt(i)),
            (t[0] = n[0] * i),
            (t[1] = n[1] * i),
            (t[2] = n[2] * i)),
          t
        );
      },
      copy: s,
      scale: o,
      add: i,
      dot: r,
      length: function (t) {
        var n = t[0],
          e = t[1],
          o = t[2];
        return Math.sqrt(n * n + e * e + o * o);
      },
      s: function (t, n, e, o) {
        return (
          (t[0] = n[0] + e[0] * o),
          (t[1] = n[1] + e[1] * o),
          (t[2] = n[2] + e[2] * o),
          t
        );
      },
      sub: function (t, n, e) {
        return (
          (t[0] = n[0] - e[0]), (t[1] = n[1] - e[1]), (t[2] = n[2] - e[2]), t
        );
      },
    },
    A = (function () {
      function t(t) {
        !(function (t) {
          var n;
          for (n = 0; n < 256; n++) i[n] = n;
          for (n = 0; n < 255; n++) {
            var e = n + ~~(t() * (256 - n)),
              o = i[n];
            (i[n] = i[e]), (i[e] = o);
          }
        })(N(t).next);
        for (var n = 0; n < 512; n++)
          (s[n] = i[255 & n]), (c[n] = (s[n] % 12) * 3);
      }
      var n = 0.5 * (Math.sqrt(3) - 1),
        e = (3 - Math.sqrt(3)) / 6,
        o = 2 * e;
      const r = Math.random();
      var i = new Uint8Array(256),
        s = new Uint8Array(512),
        c = new Uint8Array(512),
        a = new Float32Array([
          1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1,
          -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
        ]);
      return (
        t(r),
        {
          f: t,
          M(t, r) {
            var i,
              u,
              l = 0,
              h = 0,
              f = 0,
              M = (t + r) * n,
              _ = Math.floor(t + M),
              d = Math.floor(r + M),
              w = (_ + d) * e,
              p = t - (_ - w),
              I = r - (d - w);
            p > I ? ((i = 1), (u = 0)) : ((i = 0), (u = 1));
            var N = p - i + e,
              v = I - u + e,
              m = p - 1 + o,
              y = I - 1 + o,
              g = 255 & _,
              b = 255 & d,
              k = 0.5 - p * p - I * I,
              A = 0.5 - N * N - v * v,
              x = 0.5 - m * m - y * y;
            if (k >= 0) {
              var F = c[g + s[b]];
              l = k * k * k * k * (a[F] * p + a[F + 1] * I);
            }
            if (A >= 0) {
              var P = c[g + i + s[b + u]];
              h = A * A * A * A * (a[P] * N + a[P + 1] * v);
            }
            if (x >= 0) {
              var O = c[g + 1 + s[b + 1]];
              f = x * x * x * x * (a[O] * m + a[O + 1] * y);
            }
            return 70 * (l + h + f);
          },
        }
      );
    })(),
    x = (t, n, e, c, a) => {
      var u = r(e, c);
      if (0 !== u) {
        var l = -(r(n, c) + a) / u;
        return l < 0 ? null : (o(g, e, l), i(t, n, g));
      }
      return r(c, n) + a === 0 ? s(t, n) : null;
    },
    F = (t, n, e) =>
      `hsl(${(t = h(360 * t, 360).toFixed(5))}, ${(n = (100 * n).toFixed(
        5
      ))}%, ${(e = (100 * e).toFixed(5))}%)`;
  let P;
  const O = 2147483647,
    T = O * Math.random();
  var D = function (e, o) {
      function r() {
        return z ? 1 : E;
      }
      function i(t, n, e) {
        let r = !1,
          i = !1;
        const s = g.project(T._, G);
        for (let c = 0; c < h.r.length; c++) {
          const a = h.r[c],
            u = P.getXZWorldPosition(a.offset);
          (a._updated = !0), (a._position = k.add(a._position || [], u, D));
          const l = g.project(a._position, q),
            f = a._position;
          h.i[c].update(f, T, g, t, n);
          const M = s[0] - l[0],
            _ = s[1] - l[1],
            d = 4 * W,
            w = U < B,
            p = M * M + _ * _ < d * d;
          e &&
            0 === C &&
            !w &&
            p &&
            (($ && $ === a) ||
              ((U = 0),
              h.enter(a),
              (r = !0),
              (z = !1),
              o.d(),
              (C = 1),
              (j = 0))),
            p && ((i = !0), ($ = a));
        }
        return i || ($ = null), r;
      }
      function s() {
        for (let t = 0; t < S.length; t++) if (!S[t].active) return S[t];
        return null;
      }
      const h = p();
      let w = h.current;
      const I = () => {
        (document.body.style.background = w.background),
          (document.body.style.color = w.user);
      };
      I();
      const g = (function () {
          const t = [],
            n = [],
            e = [],
            o = [0, 0, 1, 1],
            r = [],
            i = [0, -1, 0];
          return {
            eye: [0, 4, 4],
            target: [0, 0, 0],
            set(s, c) {
              const a = s / c;
              (o[2] = s),
                (o[3] = c),
                b.h(t, Math.PI / 4, a, 0.001, 100),
                b.u(n, this.eye, this.target, i),
                b.a(e, t, n),
                b.l(r, e);
            },
            unproject: (t, n = []) =>
              (function (t, n, e, o) {
                var r = e[0],
                  i = e[1],
                  s = e[2],
                  c = e[3],
                  a = n[0],
                  u = n[1],
                  l = n[2];
                return (
                  (a -= r),
                  (u = c - u - 1),
                  (u -= i),
                  (t[0] = (2 * a) / s - 1),
                  (t[1] = (2 * u) / c - 1),
                  (t[2] = 2 * l - 1),
                  (function (t, n, e) {
                    var o = n[0],
                      r = n[1],
                      i = n[2],
                      s = e[0],
                      c = e[1],
                      a = e[2],
                      u = e[4],
                      l = e[5],
                      h = e[6],
                      f = e[8],
                      M = e[9],
                      _ = e[10],
                      d = e[12],
                      w = e[13],
                      p = e[14],
                      I = 1 / (o * e[3] + r * e[7] + i * e[11] + e[15]);
                    return (
                      (t[0] = (o * s + r * u + i * f + d) * I),
                      (t[1] = (o * c + r * l + i * M + w) * I),
                      (t[2] = (o * a + r * h + i * _ + p) * I),
                      t
                    );
                  })(t, t, o)
                );
              })(n, t, o, r),
            project: (t, n = []) =>
              (function (t, n, e, o) {
                var r = e[0],
                  i = e[1],
                  s = e[2],
                  c = e[3],
                  a = v,
                  u = m;
                (y[0] = n[0]),
                  (y[1] = n[1]),
                  (y[2] = n[2]),
                  (y[3] = 1),
                  (function (t, n, e) {
                    var o = n[0],
                      r = n[1],
                      i = n[2],
                      s = n[3];
                    (t[0] = e[0] * o + e[4] * r + e[8] * i + e[12] * s),
                      (t[1] = e[1] * o + e[5] * r + e[9] * i + e[13] * s),
                      (t[2] = e[2] * o + e[6] * r + e[10] * i + e[14] * s),
                      (t[3] = e[3] * o + e[7] * r + e[11] * i + e[15] * s);
                  })(y, y, o);
                var l = y[3];
                return (
                  0 !== l &&
                    ((y[0] = y[0] / l), (y[1] = y[1] / l), (y[2] = y[2] / l)),
                  (t[0] = r + (s / 2) * y[0] + (0 + s / 2)),
                  (t[1] = i + (c / 2) * y[1] + (0 + c / 2)),
                  (t[2] = ((u - a) / 2) * y[2] + (u + a) / 2),
                  (t[3] = 0 === l ? 0 : 1 / l),
                  t
                );
              })(n, t, o, e),
          };
        })(),
        F = (function (e, o, r) {
          const i = [],
            s = [];
          var c = t(6).map(() => []),
            u = [];
          const h = (t, n) => {
            e.beginPath(), e.arc(t[0], t[1], n, 0, 2 * Math.PI);
          };
          return {
            w: h,
            point(t, n = "red", r = 4) {
              const s = o.project(t, i);
              h(s, r), (e.fillStyle = n), e.fill();
            },
            butterfly(t, n) {
              t.updated &&
                (e.beginPath(),
                (u[0] = t.wings[0]),
                (u[1] = t.position),
                (u[2] = t.wings[1]),
                u.forEach((t) => {
                  (t = o.project(t, i)), e.lineTo(t[0], t[1]);
                }),
                (e.lineJoin = "miter"),
                (e.lineCap = "square"),
                (e.strokeStyle = r.flowering.user),
                (e.lineWidth = 2),
                (e.globalAlpha = 1),
                e.stroke());
            },
            portal(t, n, s, c, u) {
              let f = c * u;
              if (f <= 0) return;
              const M = o.target[0] - t[0],
                _ = o.target[2] - t[2],
                d = M * M + _ * _;
              if (d > 4) return;
              (e.lineJoin = e.lineCap = "round"),
                (f *= a(1 - l(Math.sqrt(d) - 1) / 1));
              const w = o.project(t, i);
              h(w, f),
                (e.globalAlpha = 1),
                (e.fillStyle = s),
                e.fill(),
                (e.strokeStyle = r.flowering.user),
                (e.lineWidth = 2),
                e.stroke(),
                n || (h(w, 2 * f), (e.globalAlpha = 0.25), e.stroke());
            },
            kite(t, o, a, u, l, h) {
              const f = r.flowering.user,
                M = o.kiteHeading,
                _ = o._,
                d = o.kiteLength,
                w = o.kiteWidth,
                p = n(M, s),
                I = k.s(c[2], _, p, -w),
                N = k.s(c[3], _, p, w),
                v = k.s(c[4], _, M, 0.5 * d),
                m = [I, k.s(c[5], _, M, -d), N, v].map((n, e) =>
                  t.project(n, c[e])
                );
              (e.strokeStyle = f),
                (e.lineWidth = 1 * h),
                (e.lineJoin = e.lineCap = "round"),
                (e.globalAlpha = 1),
                e.beginPath();
              const y = m[0],
                g = m[2],
                b = m[1],
                A = m[3];
              for (let n = 0; n < o.mousePoints.length; n++) {
                const r = t.project(o.mousePoints[n].offset, i);
                e.lineTo(r[0], r[1]);
              }
              o.mousePoints.length > 2 && e.lineTo(b[0], b[1]),
                e.stroke(),
                e.beginPath(),
                e.moveTo(b[0], b[1]),
                e.lineTo(A[0], A[1]),
                e.moveTo(y[0], y[1]),
                e.lineTo(g[0], g[1]),
                e.stroke(),
                (e.lineWidth = 2 * h),
                e.beginPath(),
                m.forEach((t) => e.lineTo(t[0], t[1])),
                e.closePath(),
                e.stroke();
            },
          };
        })(e, g, h),
        P = (function (n, e) {
          function o(t, n) {
            let e = null;
            for (let o = 0; o < t.length; o++) {
              const r = t[o];
              if (r.p && r.I === n) return r;
              r.p || (e = r);
            }
            return e;
          }
          function r(t, n, e) {
            return ~~(t + n * e);
          }
          function i(t, n) {
            return 0.5 * A.M(t, n) + 0.5;
          }
          let s, c;
          const a = [0, 0, 0],
            h = [0, 0, 0],
            _ = [0, 0],
            d = t(20).map(() => ({ N: 0, I: -1, v: [0, 0, 0], p: !1 })),
            w = t(361).map((t) => {
              const n = Math.floor(t % 19),
                e = Math.floor(t / 19);
              return {
                velocity: [0, 0, 0],
                random: N(0),
                position: [0, 0, 0],
                head: [0, 0, 0],
                headProjected: [0, 0, 0, 0],
                ground: [0, 0, 0],
                tileIndex: -1,
                drawnTileIndex: t,
                inView: !1,
                state: 0,
                active: !1,
                brightness: 0,
                drawX: n,
                drawY: e,
                hash: 0,
                x: -1,
                y: -1,
                inside: !1,
              };
            });
          let p,
            I = -1;
          const v = {};
          return {
            worldSize: 30,
            reset: function (t, n) {
              p ? p.set(t) : (p = N(t));
              const e = n.flowers && p.next() > 0.9;
              (v.frequency = e ? 0.01 : p.range(0.25, 0.75)),
                (v.exp = p.range(1, 4)),
                (v.height = p.range(0.05, 2)),
                (v.hasFlower = n.flowers ? p.range(0.1, 0.2) : 1),
                (v.yscale = e ? 0.25 : 1),
                (s = p.range(7.5, 8)),
                (c = ~~(30 * s)),
                (v.sparse = p.range(0.05, 0.1));
            },
            pool: w,
            hitTile: -1,
            m(t, n = []) {
              return this.g(15 * t[0], 15 * t[1], n);
            },
            b: (t) => ((t[0] = u(t[0], -15, 15)), (t[2] = u(t[2], -15, 15)), t),
            getXZWorldPosition: (t, n = []) => (
              (n[0] = 15 * t[0]), (n[1] = 0), (n[2] = 15 * t[1]), n
            ),
            k(t, n) {
              const e = v.frequency;
              let o =
                1 * i(1 * (t *= e), 1 * (n *= e)) +
                0.5 * i(2 * t, 2 * n) +
                0.25 * i(4 * t, 4 * n) +
                0.13 * i(8 * t, 8 * n) +
                0.06 * i(16 * t, 16 * n) +
                0.03 * i(32 * t, 32 * n);
              return (
                (o /= 1.97),
                (o = Math.pow(o, v.exp)),
                (o = Math.max(o, 0)),
                (o *= 2) * v.yscale
              );
            },
            g(t, n, e = []) {
              const o = this.k(t, n);
              return (e[0] = t), (e[1] = o), (e[2] = n), e;
            },
            mesh(t, e, i, u, p) {
              const N = (19 / s) * 0.5;
              for (let t = 0; t < d.length; t++) {
                const n = d[t];
                n.p &&
                  (k.scale(n.v, n.v, 0.905),
                  n.v[0] * n.v[0] + n.v[2] * n.v[2] <= 0.05 * 0.05 &&
                    (n.p = !1));
              }
              !(function (t, n = []) {
                const e = 0.5 * t[0] + 0.5,
                  o = 0.5 * t[1] + 0.5,
                  r = e * (c - 1),
                  i = o * (c - 1);
                (n[0] = r), (n[1] = i);
              })(t, _);
              let m = _[0],
                y = _[1];
              (m = Math.floor(m)), (y = Math.floor(y));
              let g = -1,
                b = 1 / 0;
              for (let t = 0; t < 19; t++)
                for (let s = 0; s < 19; s++) {
                  let u = m + (s - 9),
                    _ = y + (t - 9);
                  const I = r(s, t, 19),
                    A = r(~~u, ~~_, c),
                    x = w[I],
                    F = u / (c - 1),
                    P = _ / (c - 1);
                  let O = 15 * (2 * F - 1),
                    T = 15 * (2 * P - 1);
                  this.g(O, T, x.position);
                  const D = A / (c * c);
                  x.random.set(D),
                    (x.hash = x.random.next()),
                    (x.inside = F >= 0 && F <= 1 && P >= 0 && P <= 1);
                  const j = p;
                  if ((k.copy(a, h), x.inside)) {
                    let t = x.hash * Math.PI * 2;
                    const n = 0.1,
                      e = x.random.next(),
                      o = n * Math.sqrt(e);
                    let r = Math.cos(t),
                      s = Math.sin(t);
                    (x.position[0] += r * o),
                      (x.position[2] += s * o),
                      this.b(x.position);
                    const c = 1.5,
                      u = j * x.random.next() * x.position[1],
                      l = 2;
                    (a[0] = Math.cos(i * c + F * r * l) * u),
                      (a[1] = Math.sin(i * c + F * s * l) * u);
                  }
                  k.copy(x.head, x.position),
                    k.copy(x.ground, x.position),
                    (x.ground[1] = 0),
                    x.inside && k.s(x.head, x.position, a, 0.1),
                    (x.head[1] *= j);
                  let C,
                    $ = x.head[0] - e[0],
                    z = x.head[1] - e[1],
                    E = x.head[2] - e[2],
                    G = $ * $ + z * z + E * E;
                  const q = o(d, A),
                    B = G <= 0.25;
                  B && G < b && ((b = G), (g = A)),
                    q &&
                      (B &&
                        (q.p ||
                          ((q.v[0] = q.v[1] = q.v[2] = 0),
                          (q.p = !0),
                          (q.I = A)),
                        q.I === A &&
                          ((q.v[0] += 1 * $),
                          (q.v[1] += 1 * z),
                          (q.v[2] += 1 * E))),
                      q.I === A && k.s(x.head, x.head, q.v, 0.035)),
                    ($ = x.position[0] - n.target[0]),
                    (E = x.position[2] - n.target[2]),
                    (C = Math.sqrt($ * $ + E * E));
                  let U = l((C += Math.abs(x.random.gauss()) * v.sparse) / N);
                  (U = M(0.75, 1, U)),
                    (x.active = U < 0.925),
                    (x.state = 1 - l(U)),
                    (x.alpha = x.random.next()),
                    (x.tileIndex = A);
                  const W = 0.1 + 0.5 * Math.abs(x.random.gauss());
                  (x.radius = W * f(0.25, 4, x.state)),
                    (x.hasFlower = x.random.next() > v.hasFlower),
                    n.project(x.head, x.headProjected);
                }
              let A = -1;
              g !== I && (-1 !== g && (A = g), (I = g)), (this.hitTile = A);
            },
          };
        })(g);
      A.f(w.seed), P.reset(w.seed, w);
      const O = (function (t, n) {
          const e = [0, 0, 0],
            o = [0, 0, 0],
            r = [0, 0, 0],
            i = [0, 0, 0],
            s = [0, 0],
            a = n.m(s),
            h = a.slice(),
            f = 2 * Math.PI + (10 * Math.PI) / 180;
          let M = 0,
            w = 0;
          const p = 0.005 / n.worldSize,
            I = 20 * p,
            N = [0, 0, 0],
            v = [0, 0, 0],
            m = [0, 0, 0],
            y = [0, 0, 0],
            g = [0, 0, 0],
            b = [0, 1, 0];
          let A = null,
            F = 0;
          return {
            origin: s,
            velocity: r,
            direction: e,
            speed: 0,
            worldPosition: h,
            mouseOnPlane: i,
            step(P, O, T, D, j, C) {
              (A = (function (n, e, o = []) {
                (y[0] = n[0]), (y[1] = n[1]), (y[2] = 0.5);
                const r = t.unproject(y, y),
                  i = c(r, t.eye, g);
                return x(o, r, i, b, 0) ? o : null;
              })(j, t.target, i)),
                n.b(i);
              let $ = 0;
              if (A) {
                k.sub(v, A, t.target), (v[1] *= 0);
                const n = k.length(v);
                0 !== n && (k.scale(v, v, 1 / n), ($ = l(n / 0.5)));
              }
              (F = _(F, $, 3, D)), d(e, v, 10, D, e), d(o, v, 0.001, D, o);
              const z = 60 * D;
              C && (k.scale(m, e, p * z * F), k.s(r, r, m, z)),
                d(r, N, 5, D, r);
              const E = I;
              (r[0] = u(r[0], -E, E)),
                (r[1] = u(r[1], -E, E)),
                (r[2] = u(r[2], -E, E)),
                (s[0] += 1 * r[0]),
                (s[1] += 1 * r[2]),
                (s[0] = u(s[0], -1, 1)),
                (s[1] = u(s[1], -1, 1)),
                n.m(s, h),
                (a[0] = h[0]),
                (a[1] = _(a[1], h[1], 0.5, D)),
                (a[2] = h[2]),
                n.b(a),
                k.copy(t.target, a),
                (M = _(M, (j[0] / P) * 2 - 1, 1, D)),
                (w = _(w, (j[1] / O) * 0.15, 1, D));
              const G = k.length(r),
                q = Math.min(1, G / E);
              this.speed = _(this.speed, q, 1, D);
              const B = f + 0.01 * T + 0.1 * M,
                U = P / O;
              let W = 0.9;
              U < 0.7
                ? (W *= 1 / Math.max(0.6, U / 0.7))
                : U > 1.5 && (W /= Math.min(1.075, U / 1.5));
              const K = (2.5 + -0.75 * this.speed) * W,
                S = 1 + 4 * w;
              (t.eye[0] = a[0] + Math.cos(B) * K),
                (t.eye[1] = a[1] + (K + S) * W),
                (t.eye[2] = a[2] + Math.sin(B) * K);
            },
          };
        })(g, P),
        T = (function (t, n, e) {
          const o = [],
            r = [0, 0, 0],
            i = [0, 0, 0],
            s = e.worldPosition.slice();
          (s[0] = 0.25), (s[1] = 0.5);
          let a = 0.5;
          const l = [0, 0, 0],
            h = [0, 0, 0],
            f = [0, 0, 0],
            M = [0, 0, 0],
            w = [0, 0, 0],
            p = [0, 0, 0],
            I = [0, 0, 0],
            N = [0, 0, 0],
            v = [0, 0, 0],
            m = [0, 0, 0];
          let y = 0;
          const g = [0, 0, 0];
          let b = 0,
            A = [0, 0, 0];
          const x = [0, 0, 0],
            F = [0, 0, 0],
            P = [0, 0, 0],
            O = [0, 0, 0];
          return {
            A: l,
            F: N,
            _: [0, 0, 0],
            kiteHeading: h,
            mousePoints: o,
            kiteLength: 0.175,
            kiteWidth: 0.07875,
            step(T, D, j, C, $, z) {
              const E = e.mouseOnPlane,
                G = n.k(g[0], g[2]);
              (k.copy(v, E)[1] = G),
                (a = _(a, G, 1, C)),
                (y = _(y, z ? 0.1 : 0.075, 1, C));
              const q = k.copy(m, t.target);
              q[1] *= 0;
              const B = k.sub(x, E, q),
                U = k.length(B);
              k.scale(B, B, 1 / (U || 1)),
                k.scale(B, B, u(U, 0.05, 1.5)),
                d(A, B, 7, C, A),
                k.add(g, q, A);
              const W = 0.25 * Math.sin(j),
                K = a + W + y;
              P[1] = K;
              const S = k.add(F, g, P);
              d(s, S, 4, C, s);
              const V = s[0] - r[0],
                X = s[2] - r[2],
                H = V * V + X * X,
                L = E[0] - r[0],
                R = E[2] - r[2];
              let Y = !1;
              if (
                (L * L + R * R >= 1e-4 && (k.copy(r, E), (Y = !0)),
                (b = _(b, Y ? 1 : 0, 1, C)),
                H >= 25e-6)
              ) {
                k.copy(i, s), o.length >= 7 && o.shift();
                const t = s.slice();
                if (
                  (o.push({
                    offset: N.slice(),
                    point: t,
                    time: 0,
                    duration: 0.25,
                  }),
                  o.length >= 2)
                ) {
                  const n = k.copy(p, w);
                  let e = 0;
                  for (let r = o.length - 2; r >= 0 && e < 6; r--, e++) {
                    const e = c(t, o[r].point, F);
                    k.add(n, n, e);
                  }
                  0 !== e && k.scale(n, n, 1 / e),
                    k.normalize(n, n),
                    k.copy(I, n),
                    k.copy(f, I),
                    (f[1] *= 0),
                    k.normalize(f, f);
                }
              }
              k.copy(M, w),
                k.s(M, M, I, b),
                k.s(M, M, f, 1 - b),
                k.normalize(M, M),
                k.copy(l, s),
                d(h, M, 20, C, h),
                k.normalize(h, h);
              for (let t = o.length - 1; t >= 0; t--) {
                const n = o[t];
                (n.time += C), n.time > n.duration && o.splice(t, 1);
              }
              const Z = 0.55 * this.kiteLength;
              k.s(this._, l, h, Z), k.s(O, l, h, -Z / 2), d(N, O, 40, C, N);
            },
          };
        })(g, P, O),
        D = [0, 1, 0];
      let j = 0,
        C = -1,
        $ = null,
        z = !0;
      const E = 0.5,
        G = [],
        q = [];
      let B = 1,
        U = B;
      let W = 1,
        K = 0;
      const S = t(15).map(() => ({
        position: [],
        time: 0,
        duration: 0.5,
        active: !1,
        index: -1,
      }));
      return {
        P: function (t, n, i) {
          let c = r();
          const u = Math.min(1, K / 1);
          let f = 1;
          0 !== C && ((f = j / c), 1 === C && (f = 1 - f), (f = a(f))),
            e.clearRect(0, 0, n, i),
            1 === C &&
              ((e.fillStyle = h.current.background),
              (e.globalAlpha = 1),
              e.fillRect(0, 0, n, i));
          var M = l(1 === C ? 1 - (j - 0.5 * c) / (0.5 * c) : 1);
          (e.fillStyle = w.background),
            (e.globalAlpha = a(M)),
            e.fillRect(0, 0, n, i),
            P.mesh(O.origin, T._, t, 0, f),
            w.empty ||
              (function (t) {
                const n = 1.5 * t;
                (e.lineWidth = n), (e.lineCap = "round");
                const r = w.lines;
                e.strokeStyle = r;
                const i = P.pool;
                for (let t = 0; t < i.length; t++) {
                  const n = i[t];
                  if (!1 === n.active) continue;
                  const o = n.headProjected,
                    r = n.state * n.alpha;
                  if (n.inside && r > 0.01) {
                    e.globalAlpha = r;
                    const t = n.ground,
                      i = g.project(t, G);
                    e.beginPath(),
                      e.lineTo(o[0], o[1]),
                      e.lineTo(i[0], i[1]),
                      e.stroke();
                  }
                }
                let c;
                e.globalAlpha = 1;
                for (let n = 0; n < i.length; n++) {
                  const a = i[n];
                  if (!1 === a.active) continue;
                  const u = (a.inside ? a.radius : 1) * t,
                    l = u > 0.001,
                    h = a.inside ? w.petal(a.hash) : r;
                  if (
                    !w.empty &&
                    l &&
                    a.active &&
                    a.inside &&
                    a.tileIndex === P.hitTile
                  ) {
                    let t = s();
                    t &&
                      (k.copy(t.position, a.head),
                      (t.time = 0),
                      (t.radius = u),
                      (t.color = a.hasFlower && u > 0 ? h : r),
                      (t.active = !0),
                      o.O({ flower: a.hasFlower }));
                  }
                  ((l && a.active && a.hasFlower) || !a.inside) &&
                    (F.w(a.headProjected, u),
                    h !== c && ((e.fillStyle = h), (c = h)),
                    e.fill());
                }
              })(f),
            (e.lineWidth = u),
            (e.globalAlpha = 0.5);
          for (let t = 0; t < S.length; t++) {
            const n = S[t];
            if (n.active) {
              const t =
                Math.sin((n.time / n.duration) * Math.PI) * n.radius * 4;
              if (t >= 1e-4) {
                const o = g.project(n.position, G);
                (e.strokeStyle = n.color), F.w(o, t), e.stroke();
              }
            }
          }
          (e.globalAlpha = 1),
            F.kite(g, T, O, P, t, u),
            h.r.forEach((t, n) => {
              const e = h.i[n],
                o = t._position;
              F.portal(o, t.explored, t.world.background, W, u),
                F.butterfly(e, t.world.background);
            });
        },
        T: function (t, n, e, s, c, a) {
          K += n;
          const u = Math.sqrt(e * e + s * s);
          (W = Math.max(12, (u / 1280) * 16)),
            o.D(w),
            g.set(e, s),
            (h.flowering = w);
          const l = r();
          (U += n),
            0 !== C &&
              (j += n) > l &&
              ((j = 0),
              1 === C
                ? ((C = -1),
                  A.f(h.current.seed),
                  P.reset(h.current.seed, h.current),
                  (w = h.current),
                  I())
                : ((z = !1), (C = 0))),
            O.step(e, s, t, n, c, a),
            T.step(e, s, t, n, c, a),
            S.forEach((t) => {
              t.active &&
                ((t.time += n), t.time > t.duration && (t.active = !1));
            }),
            i(t, n, !0) && i(t, n, !1);
        },
      };
    },
    j = 440 * Math.pow(Math.pow(2, 1 / 12), -9),
    C = {};
  "B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb"
    .split("|")
    .forEach(function (t, n) {
      t.split("-").forEach(function (t) {
        C[t] = n;
      });
    });
  const $ = (t, n) => {
      const e = C[t],
        o = n;
      return j * Math.pow(Math.pow(2, 1 / 12), e) * Math.pow(2, o);
    },
    z = performance && performance.now ? () => performance.now() : Date.now;
  !(function () {
    function t() {
      (M = window.innerWidth),
        (_ = window.innerHeight),
        (r.width = M * c),
        (r.height = _ * c),
        (r.style.width = `${M}px`),
        (r.style.height = `${_}px`);
    }
    function n() {
      t(), w && e(w.elapsed);
    }
    function e() {
      d && (i.save(), i.scale(c, c), d.P(w.elapsed, M, _), i.restore());
    }
    function o(t, n) {
      d.T(t, n, M, _, p, I);
    }
    const r = window.canvas,
      i = r.getContext("2d", {
        alpha: !1,
        powerPreference: "high-performance",
      }),
      s = [1, 1.25, 2];
    let c,
      a,
      l = 2;
    /firefox/i.test(navigator.userAgent) && l--;
    const h = (t) => {
      (a = t), (c = Math.min(window.devicePixelRatio, t));
    };
    h(s[l]);
    const f = (function () {
      function t(t = 0, n = {}) {
        const { portal: i, flower: s } = n;
        (t = Math.max(t, 0)), A > k.length - 1 && (A = 0);
        const c = F.t ? k[Math.floor(Math.random() * k.length)] : k[A++];
        let a = 0;
        const l = F.hash > 0.5 ? -1 : 0;
        if (((a = l), F.n > 0.75)) {
          const t = -1 === l ? 1 : 0;
          a += Math.random() > 0.5 ? t : 0;
        }
        const h =
          y[
            (function (t, n) {
              var e,
                o = Math.random() * n;
              for (e = 0; e < t.length; e++) {
                if (o < t[e]) return e;
                o -= t[e];
              }
              return 0;
            })(m, g)
          ];
        F.e > 0.5 ? (a = l + h) : (a += h), (a = u(a, -1, 1)), i && (a = 0);
        const f = i ? 1 : 0,
          M = $(c, a),
          _ = o.currentTime + t;
        I.forEach(({ j: t, C: n, $: i, z: c = 0, G: a, q: u, B: l }) => {
          if (l && !s) return;
          const h = o.createOscillator();
          (a *= e),
            (u += f),
            (h.frequency.value = M),
            "string" == typeof n ? (h.type = n) : n && h.setPeriodicWave(n),
            h.start(_);
          const p = r();
          h.connect(p),
            d.forEach((t) => p.connect(t)),
            p.connect(w),
            p.gain.setValueAtTime(1e-4, _),
            p.gain.exponentialRampToValueAtTime(a, _ + t),
            p.gain.setValueAtTime(a, _ + t + i),
            p.gain.exponentialRampToValueAtTime(1e-4, _ + t + i + u),
            h.stop(_ + t + i + u);
        });
      }
      const n = N(Math.random()),
        e = 1.75,
        o = new (window.AudioContext || window.webkitAudioContext)(),
        r = () => o.createGain(),
        i = () => o.createBiquadFilter();
      let s = 0;
      const c = r();
      let a = !1;
      const l = (t) => {
        t.preventDefault(),
          (a = !a),
          window.mute.classList.toggle("OK"),
          (c.gain.value = a ? 0 : 1);
      };
      window.muteC.addEventListener("click", l, { passive: !1 }),
        window.muteC.addEventListener("touchstart", l, { passive: !1 }),
        c.connect(o.destination);
      const h = "highpass",
        f = i();
      (f.frequency.value = 170), (f.type = h);
      const M = i();
      (M.frequency.value = 5e3),
        (M.type = "lowpass"),
        f.connect(M),
        M.connect(c);
      const _ = f,
        d = [
          { U: 1.275, K: 1.5, V: 0.5, X: "bandpass", H: 2e3 },
          { U: 0.85, K: 2, V: 0.25, X: h, H: 500 },
        ].map((t) => {
          const n = (function (t, n, e, o = {}) {
            var r = n(),
              i = n(),
              s = (r.output = n()),
              c = t.createConvolver(),
              a = e();
            r.connect(i),
              c.connect(a),
              i.connect(c),
              a.connect(s),
              (i.value = o.V);
            var u = o.U;
            (a.frequency.value = o.H), (a.type = o.X);
            const l = t.sampleRate,
              h = Math.max(1, Math.floor(l * u)),
              f = new Float32Array(h),
              M = new Float32Array(h);
            var _ = o.K;
            let d = 0,
              w = Math.min(2048, h);
            return (
              (s.gain.value = 1e-4),
              setTimeout(function n() {
                for (let t = d; t < w; t++) {
                  var e = 0 === h ? 0 : t / h,
                    o = Math.pow(1 - e, _) || 0;
                  (f[t] = (2 * Math.random() - 1) * o),
                    (M[t] = (2 * Math.random() - 1) * o);
                }
                if (w >= h - 1) {
                  const n = t.createBuffer(2, h, l);
                  n.getChannelData(0).set(f),
                    n.getChannelData(1).set(M),
                    (c.buffer = n),
                    s.gain.exponentialRampToValueAtTime(1, t.currentTime + 0.3);
                } else (d = w), (w = Math.min(w + 2048, h)), setTimeout(n, 5);
              }, 5),
              r
            );
          })(o, r, i, t);
          return n.output.connect(_), n;
        }),
        w = r();
      (w.gain.value = 0.1), w.connect(_);
      const p = (t, n) => {
          var e = new Float32Array(t),
            r = new Float32Array(n || t);
          return o.createPeriodicWave(e, r);
        },
        I = [
          { C: p([0, 0], [0, 1]), G: 0.5, j: 0.0075, $: 0.0075, q: 0.85 },
          {
            C: p([-1, 0, 0, 0, 0, 0, 0]),
            G: 0.25,
            j: 0.0075,
            $: 0.0075,
            q: 0.85,
          },
          {
            B: !0,
            C: p([1, 0, 0.05, 1]),
            G: 0.1,
            j: 0.0075,
            $: 0.0075,
            q: 0.85,
          },
        ],
        v = [50, 100, 100],
        m = v.slice(),
        y = [-1, 0, 1],
        g = ((t) => {
          let n = 0;
          for (let e = 0; e < t.length; e++) n += t[e];
          return n;
        })(v),
        b = ["C", "F", "G", "A", "D"];
      let k = b.slice(),
        A = 0;
      const x = [];
      let F;
      return {
        D(e) {
          e !== F &&
            (n.set(e.hash),
            e.hash,
            n.shuffle(b, k),
            n.shuffle(v, m),
            (A = 0),
            (F = e));
          const r = o.currentTime;
          for (let e = 0; e < x.length; e++) {
            const o = x[e];
            o.played &&
              e !== x.length - 1 &&
              r - o.time > (60 / 90) * 0.2125 * 2 &&
              (o.dead = !0),
              !o.played &&
                r >= o.time &&
                (t(o.time - r, o.opts),
                (o.played = !0),
                ++s % 16 == 0 && n.shuffle(v, m));
          }
          for (let t = x.length - 1; t >= 0; t--) x[t].dead && x.splice(t, 1);
        },
        O(t = {}) {
          if (a) return;
          const n = o.currentTime,
            e = Math.round(n / ((60 / 90) * 0.2125)) * ((60 / 90) * 0.2125);
          let r = !1;
          0 === x.length ? (r = !0) : e > x[x.length - 1].time && (r = !0),
            r && x.push({ time: e, opts: t });
        },
        d(n = 0, e = 1) {
          for (let o = 0; o < e; o++)
            t(n + (60 / 90) * 0.2125 * 0.85 * o, { portal: !0 });
        },
        L() {
          o.resume();
        },
      };
    })();
    let M, _, d, w;
    n(), (d = D(i, f));
    const p = [M / 2, _ / 2];
    let I = !1;
    (w = (function (t, n, e, o = 60) {
      function r() {
        requestAnimationFrame(r);
        const o = z(),
          i = Math.min(150, o - s) / 1e3;
        if (((s = o), c++, (a += i), (l += i) > u)) {
          const t = a / c;
          (l = c = a = 0), e(t);
        }
        (h.elapsed += i), n(h.elapsed, i), t(h.elapsed);
      }
      let i = z(),
        s = i,
        c = 0,
        a = 0,
        u = 5,
        l = 0;
      const h = {
        elapsed: 0,
        start() {
          (s = i = z()), r();
        },
        animate: r,
      };
      return h;
    })(e, o, function (n) {
      let e = a;
      n > 1 / 29 ? (l = Math.min(l, 0)) : n > 0.025 && (l = Math.min(l, 1)),
        h(s[l]),
        e !== a && t();
    })),
      o(0, 1e-5),
      e(),
      (r.style.display = "none");
    let v = !1;
    const m = (t) => {
      v ||
        (n(),
        "?z" !== location.search &&
          ((window.muteC.style.display = "block"),
          (window.R.style.display = "block")),
        (window.W.style.display = "none"),
        (v = !0),
        t && t.preventDefault(),
        f.L(),
        (function () {
          function t(t) {
            "mute" !== t.target.id && ((I = !0), f.L());
          }
          function e() {
            I = !1;
          }
          const o = {
            resize: n,
            mouseup: e,
            mousedown: t,
            touchend: e,
            touchstart: t,
          };
          Object.keys(o).forEach((t) => {
            window.addEventListener(t, o[t]);
          });
        })(),
        w.start(),
        (r.style.display = ""));
    };
    window.S.addEventListener("click", m, { passive: !1 }),
      window.S.addEventListener("touchend", f.L, { passive: !1 }),
      window.S.addEventListener("touchstart", m, { passive: !1 }),
      (window.ondragstart = () => !1),
      document.addEventListener("touchmove", (t) => t.preventDefault(), {
        passive: !1,
      }),
      window.addEventListener("mousemove", function (t) {
        (p[0] = t.clientX), (p[1] = _ - t.clientY - 1);
      }),
      window.addEventListener("touchmove", function (t) {
        (p[0] = t.changedTouches[0].clientX),
          (p[1] = _ - t.changedTouches[0].clientY - 1);
      });
  })();
})();
