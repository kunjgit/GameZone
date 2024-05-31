let isRunning = false;
~(function () {
  function H() {
    this.A = function (e) {
      for (var f = 0; 24 > f; f++)
        this[String.fromCharCode(97 + f)] = e[f] || 0;
      0.01 > this.c && (this.c = 0.01);
      e = this.b + this.c + this.e;
      0.18 > e && ((e = 0.18 / e), (this.b *= e), (this.c *= e), (this.e *= e));
    };
  }
  var U = new (function () {
    this.z = new H();
    var e, f, d, h, j, w, I, J, K, y, k, L;
    this.reset = function () {
      var b = this.z;
      h = 100 / (b.f * b.f + 0.001);
      j = 100 / (b.g * b.g + 0.001);
      w = 1 - 0.01 * b.h * b.h * b.h;
      I = 1e-6 * -b.i * b.i * b.i;
      b.a || ((k = 0.5 - b.n / 2), (L = 5e-5 * -b.o));
      J = 1 + b.l * b.l * (0 < b.l ? -0.9 : 10);
      K = 0;
      y = 1 == b.m ? 0 : 2e4 * (1 - b.m) * (1 - b.m) + 32;
    };
    this.C = function () {
      this.reset();
      var b = this.z;
      e = 1e5 * b.b * b.b;
      f = 1e5 * b.c * b.c;
      d = 1e5 * b.e * b.e + 12;
      return 3 * (((e + f + d) / 3) | 0);
    };
    this.B = function (b, M) {
      var a = this.z,
        N = 1 != a.s || a.v,
        o = 0.1 * a.v * a.v,
        O = 1 + 3e-4 * a.w,
        l = 0.1 * a.s * a.s * a.s,
        V = 1 + 1e-4 * a.t,
        W = 1 != a.s,
        X = a.x * a.x,
        Y = a.g,
        P = a.q || a.r,
        Z = 0.2 * a.r * a.r * a.r,
        B = a.q * a.q * (0 > a.q ? -1020 : 1020),
        Q = a.p ? ((2e4 * (1 - a.p) * (1 - a.p)) | 0) + 32 : 0,
        $ = a.d,
        R = a.j / 2,
        aa = 0.01 * a.k * a.k,
        C = a.a,
        D = e,
        ba = 1 / e,
        ca = 1 / f,
        da = 1 / d,
        a = (5 / (1 + 20 * a.u * a.u)) * (0.01 + l);
      0.8 < a && (a = 0.8);
      for (
        var a = 1 - a,
          E = !1,
          S = 0,
          s = 0,
          t = 0,
          z = 0,
          q = 0,
          u,
          r = 0,
          g,
          m = 0,
          p,
          F = 0,
          c,
          T = 0,
          n,
          G = 0,
          A = Array(1024),
          v = Array(32),
          i = A.length;
        i--;

      )
        A[i] = 0;
      for (i = v.length; i--; ) v[i] = 2 * Math.random() - 1;
      for (i = 0; i < M; i++) {
        if (E) return i;
        Q && ++T >= Q && ((T = 0), this.reset());
        y && ++K >= y && ((y = 0), (h *= J));
        w += I;
        h *= w;
        h > j && ((h = j), 0 < Y && (E = !0));
        g = h;
        0 < R && ((G += aa), (g *= 1 + Math.sin(G) * R));
        g |= 0;
        8 > g && (g = 8);
        C || ((k += L), 0 > k ? (k = 0) : 0.5 < k && (k = 0.5));
        if (++s > D)
          switch (((s = 0), ++S)) {
            case 1:
              D = f;
              break;
            case 2:
              D = d;
          }
        switch (S) {
          case 0:
            t = s * ba;
            break;
          case 1:
            t = 1 + 2 * (1 - s * ca) * $;
            break;
          case 2:
            t = 1 - s * da;
            break;
          case 3:
            (t = 0), (E = !0);
        }
        P && ((B += Z), (p = B | 0), 0 > p ? (p = -p) : 1023 < p && (p = 1023));
        N && O && ((o *= O), 1e-5 > o ? (o = 1e-5) : 0.1 < o && (o = 0.1));
        n = 0;
        for (var ea = 8; ea--; ) {
          m++;
          if (m >= g && ((m %= g), 3 == C))
            for (u = v.length; u--; ) v[u] = 2 * Math.random() - 1;
          switch (C) {
            case 0:
              c = m / g < k ? 0.5 : -0.5;
              break;
            case 1:
              c = 1 - 2 * (m / g);
              break;
            case 2:
              c = m / g;
              c = 6.28318531 * (0.5 < c ? c - 1 : c);
              c = 1.27323954 * c + 0.405284735 * c * c * (0 > c ? 1 : -1);
              c = 0.225 * ((0 > c ? -1 : 1) * c * c - c) + c;
              break;
            case 3:
              c = v[Math.abs(((32 * m) / g) | 0)];
          }
          N &&
            ((u = r),
            (l *= V),
            0 > l ? (l = 0) : 0.1 < l && (l = 0.1),
            W ? ((q += (c - r) * l), (q *= a)) : ((r = c), (q = 0)),
            (r += q),
            (z += r - u),
            (c = z *= 1 - o));
          P && ((A[F % 1024] = c), (c += A[(F - p + 1024) % 1024]), F++);
          n += c;
        }
        n *= 0.125 * t * X;
        b[i] = 1 <= n ? 32767 : -1 >= n ? -32768 : (32767 * n) | 0;
      }
      return M;
    };
  })();
  window.SOUND = function (e) {
    U.z.A(e);
    var f = U.C(),
      e = new Uint8Array(4 * (((f + 1) / 2) | 0) + 44),
      f = 2 * U.B(new Uint16Array(e.buffer, 44), f),
      d = new Uint32Array(e.buffer, 0, 44);
    d[0] = 1179011410;
    d[1] = f + 36;
    d[2] = 1163280727;
    d[3] = 544501094;
    d[4] = 16;
    d[5] = 65537;
    d[6] = 44100;
    d[7] = 88200;
    d[8] = 1048578;
    d[9] = 1635017060;
    d[10] = f;
    for (
      var f = f + 44,
        d = 0,
        h = "data:audio/wav;base64,",
        x = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      d < f;
      d += 3
    )
      var j = (e[d] << 16) | (e[d + 1] << 8) | e[d + 2],
        h = h + (x[j >> 18] + x[(j >> 12) & 63] + x[(j >> 6) & 63] + x[j & 63]);
    return h;
  };
})();

!(function () {
  function t(t) {
    return Math.min((0 | (0.04 * Math.PI * t)) << 1, 16);
  }

  function e() {
    P = new q(255, 360, 450, 180, !1);
  }

  function n() {
    A.clearRect(0, 0, T, S),
      A.save(),
      (A.shadowColor = "rgba(0,0,0,0.4)"),
      (A.shadowBlur = 25),
      P.paint(A, "#0091EA"),
      (A.shadowColor = "#000"),
      A.translate(0, 1),
      at.paint(A, "rgba(55,71,79,0.4)"),
      ct.paint(A, "rgba(55,71,79,0.4)"),
      ft.paint(A, "rgba(55,71,79,0.4)"),
      A.restore();
  }

  function o(t, e, n) {
    t.style[e] = n + "px";
  }

  function s() {
    var t = window.innerWidth,
      e = window.innerHeight;
    t / e > B ? (t = e * B) : (e = t / B),
      (I = T / t),
      o(D, "width", t),
      o(D, "height", e),
      o(D, "left", 0.5 * (window.innerWidth - t)),
      o(D, "top", 0.5 * (window.innerHeight - e));
    var n = (0.5 * t) / T,
      s = "scale3d(" + n + "," + n + ",1)";
    (W.style[O] = s), (V.style[O] = s);
  }

  function i(t, e) {
    var n,
      o = null;
    return function () {
      function s() {
        var i = Date.now() - n;
        i < e ? (o = setTimeout(s, e - i)) : ((o = null), t());
      }
      (n = Date.now()), o || (o = setTimeout(s, e));
    };
  }

  function r(t) {
    var e = t.target;
    "INPUT" != e.tagName &&
      "LABEL" != e.tagName &&
      (t.preventDefault(), t.stopPropagation());
  }

  function a() {
    isRunning = true;
    D.removeChild(W),
      x.play("new"),
      (y || I > 1) &&
        document.body.requestFullscreen &&
        document.body.requestFullscreen();
  }

  function c() {
    (V.style.display = "block"), x.play("win");
  }

  function keyDown(e) {
    if (e.key === "Escape" && isRunning) {
      renderMenu();
      p();
    }
  }

  function renderMenu() {
    let menuControls = document.getElementById("menu-controls");
    if (menuControls.style.display === "block") {
      menuControls.style.display = "none";
    } else {
      menuControls.style.display = "block";
    }
  }

  function closeMenu() {
    renderMenu();
  }

  function f() {
    (V.style.display = "none"),
      x.play("new"),
      ($ = []),
      (tt = []),
      (et = []),
      (nt = null),
      (ht.dragging = !1),
      h();
  }

  function l() {
    C.clearRect(0, 0, T, S);
    for (var t = 0, e = tt; t < e.length; t++) {
      var n = e[t];
      n.integrate();
    }
    for (
      var o,
        s = !1,
        i = function (t) {
          var e = $[t];
          e.center.y >= S + e.r &&
            ((et = et.filter(function (t) {
              return t.parent != e;
            })),
            (tt = tt.filter(function (t) {
              return t.parent != e;
            })),
            nt && nt.parent == e && ((nt = null), (ht.dragging = !1)),
            $.splice(t, 1),
            --it[e.n],
            x.play("die"),
            (s = !0),
            --t),
            (o = t);
        },
        r = 3;
      r < $.length;
      ++r
    )
      i(r), (r = o);
    for (
      var a = function (t) {
          for (
            var e = $[t], n = 2.5 * e.r, o = 99999, i = null, r = 0, a = t + 1;
            a < $.length;
            ++a
          ) {
            var f = $[a];
            if (e.n == f.n) {
              var l = e.center.distance(f.center);
              l < n && l < o && ((o = l), (i = f), (r = a));
            }
          }
          if (!i) return "continue";
          var _ = 0.5 * (e.center.x + i.center.x),
            h = 0.5 * (e.center.y + i.center.y);
          if (o > 2 * e.r) {
            for (var u = 0, d = e.positions; u < d.length; u++) {
              var p = d[u];
              (p.x += (_ - p.x) * G), (p.y += (h - p.y) * G);
            }
            for (var v = 0, y = i.positions; v < y.length; v++) {
              var p = y[v];
              (p.x += (_ - p.x) * G), (p.y += (h - p.y) * G);
            }
          } else
            (et = et.filter(function (t) {
              return t.parent != e && t.parent != i;
            })),
              (tt = tt.filter(function (t) {
                return t.parent != e && t.parent != i;
              })),
              !nt ||
                (nt.parent != e && nt.parent != i) ||
                ((nt = null), (ht.dragging = !1)),
              $.splice(r, 1),
              ($[t] = new E(_, h, e.n << 1, !1)),
              (it[e.n] -= 2),
              x.play("bip"),
              (s = !0),
              1024 == e.n && c();
        },
        r = 3;
      r < $.length - 1;
      ++r
    )
      a(r);
    s && rt(),
      nt &&
        ((nt.position.x += (ht.x - nt.position.x) * Z),
        (nt.position.y += (ht.y - nt.position.y) * Z));
    for (var f = 0; f < J; ++f) {
      for (var _ = 0, h = et; _ < h.length; _++) {
        var u = h[_];
        u.solve();
      }
      for (var d = 0, p = $; d < p.length; d++) {
        var v = p[d];
        v.boundingBox();
      }
      for (var r = 0; r < $.length - 1; ++r)
        for (var y = r + 1; y < $.length; ++y) R($[r], $[y]) && U();
    }
    for (var m = 0, w = $; m < w.length; m++) {
      var v = w[m];
      v.paint(C);
    }
    nt &&
      (C.beginPath(),
      C.moveTo(nt.position.x, nt.position.y),
      C.lineTo(ht.x, ht.y),
      (C.strokeStyle = "#FFD600"),
      C.stroke()),
      requestAnimationFrame(l);
  }

  function _() {
    return (0.3 * Math.random() + 0.35) * T;
  }

  function h() {
    for (var t = 2; t <= 2048; t *= 2) it[t] = 0;
    (at = new q(280, 480, 400, 60)),
      (ct = new q(220, 420, 60, 120)),
      (ft = new q(680, 420, 60, 120)),
      new w(at, at.handle0, ct.handle0, 0.1),
      new w(at, at.handle1, ft.handle1, 0.1);
    var e = 0.5 * S;
    new E(0.35 * T, e), new E(0.65 * T, e);
  }

  function u(t) {
    (ht.x = (t.clientX - D.offsetLeft) * I),
      (ht.y = (t.clientY - D.offsetTop) * I);
  }

  function d() {
    for (var t = new lt(), e = 0; e < 8; ++e) t.generate(e);
    (ut = t.createAudio()), (ut.loop = !0), (ut.volume = 0.9);
  }

  function p() {
    y && (document.body.className = "mobile");
    var t = document.getElementById("m"),
      e = document.getElementById("s"),
      o = document.getElementById("q"),
      g= document.getElementById("d"),
      h1=document.getElementById("h1"),
      para =document.getElementById("p");

      g.addEventListener('change', ()=>{
        document.body.classList.toggle('white');
      
        if(document.body.classList.contains("white"))
        {
          W.style.color = " #0033cc";
          h1.style.fontWeight= "400";
          para.style.fontWeight= "500";
          h1.style.textShadow= "1px 0 0 #ffffb3, -1px 0 0 #4da6ff";
          para.style.textShadow= "1px 0 0  #b3b3cc";
          F.style.background = "white";
          H.style.background = "white";
          V.style.color="#0033cc"
        }
        else 
        {
          W.style.color = "white";
          F.style.background = "#455a64";
          h1.style.fontWeight= "300";
          para.style.fontWeight= "400";
          h1.style.textShadow= "2px 0 0 red, -2px 0 0 #0ff";
          para.style.textShadow= "1px 0 0 red, -1px 0 0 #0ff";
          H.style.background = "rgba(0, 0, 0, 0.5)";
          V.style.color="#fff";
        }
      
      })

    t.addEventListener("change", function (e) {
      ut && (t.checked ? ((ut.currentTime = 0), ut.play()) : ut.pause());
    }),
      e.addEventListener("change", function (t) {
        x.on = e.checked;
      });
    var s = q.prototype.paint,
      i = q.prototype.paintLow,
      r = E.prototype.paint,
      a = E.prototype.paintLow;
    y && ((o.checked = !1), (q.prototype.paint = i), (E.prototype.paint = a)),
      o.addEventListener("change", function (t) {
        (q.prototype.paint = o.checked ? s : i),
          (E.prototype.paint = o.checked ? r : a),
          n();
      }),
      D.removeChild(H),
      ut && ut.play();
  }
  var v = (function () {
      function t() {
        (this.on = !0), (this.sounds = {});
      }
      return (
        (t.prototype.add = function (t, e, n) {
          this.sounds[t] = {
            tick: 0,
            count: e,
            pool: [],
          };
          for (var o = 0; o < e; ++o) {
            var s = new Audio();
            (s.src = window.SOUND(n)), this.sounds[t].pool.push(s);
          }
        }),
        (t.prototype.play = function (t) {
          if (this.on) {
            var e = this.sounds[t];
            e.pool[e.tick].play(), ++e.tick >= e.count && (e.tick = 0);
          }
        }),
        t
      );
    })(),
    x = new v(),
    y = null != navigator.userAgent.match(/Android|iPhone|iPad/i);
  y
    ? (x.on = !1)
    : (x.add("bip", 9, [
        1,
        ,
        0.1241,
        ,
        0.1855,
        0.5336,
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
        0.1,
        ,
        0.64,
      ]),
      x.add("die", 4, [
        1,
        0.0013,
        0.3576,
        0.0681,
        0.8007,
        0.5117,
        ,
        -0.3453,
        0.0049,
        0.148,
        -0.2563,
        -0.2717,
        0.2608,
        ,
        -0.3543,
        -0.1884,
        -0.0106,
        -0.0281,
        0.9971,
        -0.6629,
        -0.7531,
        0.0097,
        -0.0086,
        0.5,
      ]),
      x.add("new", 2, [
        1,
        ,
        0.2548,
        ,
        0.1007,
        0.7539,
        0.0996,
        -0.5302,
        ,
        ,
        ,
        ,
        ,
        0.7769,
        -0.4436,
        ,
        ,
        ,
        1,
        ,
        ,
        ,
        ,
        0.5,
      ]),
      x.add("win", 1, [
        1,
        0.0309,
        0.5597,
        0.0464,
        0.7472,
        0.369,
        ,
        -0.1366,
        ,
        -0.3111,
        ,
        -0.1581,
        -0.8665,
        ,
        -0.0414,
        0.2802,
        0.0258,
        -0.1198,
        0.9955,
        0.1759,
        ,
        ,
        -5e-4,
        0.64,
      ]));
  var m = (function () {
      function t(t) {
        void 0 === t && (t = 1),
          (this.vertices = []),
          (this.positions = []),
          (this.constraints = []),
          (this.boundaries = []),
          (this.center = new k()),
          (this.halfExtents = new k()),
          (this.mass = t);
      }
      return (
        (t.prototype.boundingBox = function () {
          for (
            var t = 99999,
              e = 99999,
              n = -99999,
              o = -99999,
              s = 0,
              i = this.positions;
            s < i.length;
            s++
          ) {
            var r = i[s];
            r.x < t && (t = r.x),
              r.y < e && (e = r.y),
              r.x > n && (n = r.x),
              r.y > o && (o = r.y);
          }
          this.center.set(0.5 * (t + n), 0.5 * (e + o)),
            this.halfExtents.set(0.5 * (n - t), 0.5 * (o - e));
        }),
        (t.prototype.project = function (t) {
          (this._min = 99999), (this._max = -99999);
          for (var e = 0, n = this.positions; e < n.length; e++) {
            var o = n[e],
              s = o.dot(t);
            s < this._min && (this._min = s), s > this._max && (this._max = s);
          }
        }),
        (t.prototype.drag = function () {
          if (ht.dragging && !nt && C.isPointInPath(ht.x, ht.y))
            for (var t = 99999, e = 0, n = this.vertices; e < n.length; e++) {
              var o = n[e],
                s = o.position.distance(ht);
              s < t && ((t = s), (nt = o));
            }
        }),
        t
      );
    })(),
    w = (function () {
      function t(t, e, n, o, s) {
        void 0 === s && (s = !1),
          (this.parent = t),
          (this.v0 = e),
          (this.v1 = n),
          (this.p0 = e.position),
          (this.p1 = n.position),
          (this.length = this.p0.distance(this.p1)),
          (this.stiffness = o),
          (this.isBoundary = s),
          t.constraints.push(this),
          s && t.boundaries.push(this),
          et.push(this);
      }
      return (
        (t.prototype.solve = function () {
          ot.setSubtract(this.p0, this.p1);
          var t = ot.length();
          t &&
            (ot.multiplyScalar((this.stiffness * (this.length - t)) / t),
            this.p0.add(ot),
            this.p1.subtract(ot));
        }),
        t
      );
    })(),
    g =
      (this && this.__extends) ||
      function (t, e) {
        function n() {
          this.constructor = t;
        }
        for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
        t.prototype =
          null === e
            ? Object.create(e)
            : ((n.prototype = e.prototype), new n());
      },
    q = (function (t) {
      function e(n, o, s, i, r) {
        void 0 === r && (r = !0), t.call(this, 250);
        var a = (this.handle0 = new M(this, n, o + e.chamfer)),
          c = new M(this, n + e.chamfer, o),
          f = new M(this, n + s - e.chamfer, o),
          l = (this.handle1 = new M(this, n + s, o + e.chamfer)),
          _ = new L(this, n + s, o + i),
          h = new L(this, n, o + i);
        new w(this, a, c, 0.1, !0),
          new w(this, c, f, 0.1, !0),
          new w(this, f, l, 0.1, !0),
          new w(this, l, _, 0.1, !0),
          new w(this, _, h, 0.1, !0),
          new w(this, h, a, 0.1, !0),
          new w(this, a, l, 0.1),
          new w(this, a, _, 0.1),
          new w(this, c, _, 0.1),
          new w(this, c, h, 0.1),
          new w(this, f, _, 0.1),
          new w(this, f, h, 0.1),
          new w(this, l, h, 0.1),
          r && $.push(this);
      }
      return (
        g(e, t),
        (e.prototype.paint = function (t, e) {
          t.beginPath();
          var n = this.positions[0],
            o = this.positions[1];
          t.moveTo(0.5 * (n.x + o.x), 0.5 * (n.y + o.y));
          for (var s = 1; s <= 6; ++s)
            4 != s && 5 != s
              ? ((n = this.positions[s % 6]),
                (o = this.positions[(s + 1) % 6]),
                t.quadraticCurveTo(
                  n.x,
                  n.y,
                  0.5 * (n.x + o.x),
                  0.5 * (n.y + o.y),
                ))
              : t.lineTo(this.positions[s].x, this.positions[s].y);
          (t.fillStyle = e || "#00B0FF"), t.fill();
        }),
        (e.prototype.paintLow = function (t, e) {
          t.beginPath();
          for (var n = 0, o = this.positions; n < o.length; n++) {
            var s = o[n];
            t.lineTo(s.x, s.y);
          }
          (t.fillStyle = e || "#00B0FF"), t.fill();
        }),
        (e.chamfer = 10),
        e
      );
    })(m),
    g =
      (this && this.__extends) ||
      function (t, e) {
        function n() {
          this.constructor = t;
        }
        for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
        t.prototype =
          null === e
            ? Object.create(e)
            : ((n.prototype = e.prototype), new n());
      },
    b = {};
  ~[
    "eee4da",
    "ede0c8",
    "f2b179",
    "f59563",
    "f67c5f",
    "f65e3b",
    "edcf72",
    "edcc61",
    "edc850",
    "edc53f",
    "edc22e",
  ].forEach(function (t, e) {
    b[Math.pow(2, e + 1)] = "#" + t;
  });
  var E = (function (e) {
      function n(n, o, s, i) {
        void 0 === o && (o = -40),
          void 0 === s && (s = 2),
          void 0 === i && (i = !0),
          e.call(this, 1 + 0.2 * Math.log10(s)),
          ++it[(this.n = s)],
          (this.r = 40 + 4 * (Math.log2(s) - 1)),
          (this.font =
            "bold " +
            (0.1 * this.r + 28) +
            "px 'Segoe UI','Helvetica Neue',sans-serif");
        for (var r = t(this.r), a = (2 * Math.PI) / r, c = 0; c < r; ++c) {
          var f = c * a;
          new M(this, n + this.r * Math.cos(f), o + this.r * Math.sin(f));
        }
        for (var c = 0; c < r - 1; ++c)
          for (var l = c + 1; l < r; ++l)
            new w(this, this.vertices[c], this.vertices[l], 0.005, l == c + 1);
        i && (this.boundingBox(), $.push(this));
      }
      return (
        g(n, e),
        (n.prototype.paint = function (t) {
          t.beginPath();
          var e = this.positions[0],
            n = this.positions[1];
          t.moveTo(0.5 * (e.x + n.x), 0.5 * (e.y + n.y));
          for (var o = 1; o <= this.positions.length; ++o)
            (e = this.positions[o % this.positions.length]),
              (n = this.positions[(o + 1) % this.positions.length]),
              t.quadraticCurveTo(
                e.x,
                e.y,
                0.5 * (e.x + n.x),
                0.5 * (e.y + n.y),
              );
          (t.fillStyle = b[this.n]),
            t.fill(),
            t.save(),
            t.translate(this.center.x, this.center.y),
            t.rotate(Math.atan2(e.y - this.center.y, e.x - this.center.x)),
            (t.font = this.font),
            (t.fillStyle = this.n > 4 ? "#f9f6f2" : "#776e65"),
            t.fillText("" + this.n, 0, 0),
            t.restore(),
            this.drag();
        }),
        (n.prototype.paintLow = function (t) {
          t.beginPath();
          var e = this.boundaries[0].p0;
          t.moveTo(e.x, e.y);
          for (var n = 0, o = this.boundaries; n < o.length; n++) {
            var s = o[n].p1;
            t.lineTo(s.x, s.y);
          }
          (t.fillStyle = b[this.n]),
            t.fill(),
            t.save(),
            t.translate(this.center.x, this.center.y),
            t.rotate(Math.atan2(e.y - this.center.y, e.x - this.center.x)),
            (t.font = this.font),
            (t.fillStyle = this.n > 4 ? "#f9f6f2" : "#776e65"),
            t.fillText("" + this.n, 0, 0),
            t.restore(),
            this.drag();
        }),
        n
      );
    })(m),
    M = (function () {
      function t(t, e, n) {
        (this.parent = t),
          (this.position = new k(e, n)),
          (this.oldPosition = new k(e, n)),
          t.vertices.push(this),
          t.positions.push(this.position),
          tt.push(this);
      }
      return (
        (t.prototype.integrate = function () {
          var t = this.position,
            e = this.oldPosition,
            n = t.x,
            o = t.y;
          (t.x += t.x - e.x),
            (t.y += t.y - e.y + Y),
            e.set(n, o),
            t.y < -100
              ? (t.y = -100)
              : t.y >= N.height + 250 &&
                ((t.x -= (t.x - e.x) * Q), (t.y = N.height - 1)),
            t.x < 0 ? (t.x = 0) : t.x >= N.width && (t.x = N.width - 1);
        }),
        t
      );
    })(),
    g =
      (this && this.__extends) ||
      function (t, e) {
        function n() {
          this.constructor = t;
        }
        for (var o in e) e.hasOwnProperty(o) && (t[o] = e[o]);
        t.prototype =
          null === e
            ? Object.create(e)
            : ((n.prototype = e.prototype), new n());
      },
    L = (function (t) {
      function e(e, n, o) {
        t.call(this, e, n, o), (this.x = n), (this.y = o);
      }
      return (
        g(e, t),
        (e.prototype.integrate = function () {
          this.position.set(this.x, this.y),
            this.oldPosition.set(this.x, this.y);
        }),
        e
      );
    })(M),
    k = (function () {
      function t(t, e) {
        void 0 === t && (t = 0),
          void 0 === e && (e = 0),
          (this.x = t),
          (this.y = e);
      }
      return (
        (t.prototype.set = function (t, e) {
          (this.x = t), (this.y = e);
        }),
        (t.prototype.setTo = function (t) {
          (this.x = t.x), (this.y = t.y);
        }),
        (t.prototype.length = function () {
          return Math.sqrt(this.x * this.x + this.y * this.y);
        }),
        (t.prototype.distance = function (t) {
          var e = this.x - t.x,
            n = this.y - t.y;
          return Math.sqrt(e * e + n * n);
        }),
        (t.prototype.add = function (t) {
          (this.x += t.x), (this.y += t.y);
        }),
        (t.prototype.subtract = function (t) {
          (this.x -= t.x), (this.y -= t.y);
        }),
        (t.prototype.setSubtract = function (t, e) {
          (this.x = t.x - e.x), (this.y = t.y - e.y);
        }),
        (t.prototype.dot = function (t) {
          return this.x * t.x + this.y * t.y;
        }),
        (t.prototype.multiplyScalar = function (t) {
          (this.x *= t), (this.y *= t);
        }),
        (t.prototype.setMultiplyScalar = function (t, e) {
          (this.x = t.x * e), (this.y = t.y * e);
        }),
        (t.prototype.setNormal = function (t, e) {
          var n = t.y - e.y,
            o = e.x - t.x,
            s = Math.sqrt(n * n + o * o);
          if (s < Number.MIN_VALUE) return (this.x = n), void (this.y = o);
          var i = 1 / s;
          (this.x = n * i), (this.y = o * i);
        }),
        t
      );
    })(),
    P = null,
    T = 960,
    S = 540,
    B = 16 / 9,
    I = 1,
    D = document.getElementById("container"),
    F = document.getElementById("backcanvas"),
    N = document.getElementById("canvas"),
    A = F.getContext("2d"),
    C = N.getContext("2d"),
    O = "transform";
  O in D.style || (O = "webkitTransform"),
    (F.width = N.width = T),
    (F.height = N.height = S),
    (C.lineWidth = 2),
    (C.textAlign = "center"),
    (C.textBaseline = "middle"),
    window.addEventListener("resize", s),
    window.addEventListener("orientationchange", s),
    N.addEventListener("contextmenu", function (t) {
      t.preventDefault();
    });
  var j = (function () {
      function t(t, e) {
        if (
          Math.abs(e.center.x - t.center.x) -
            (t.halfExtents.x + e.halfExtents.x) >=
            0 ||
          Math.abs(e.center.y - t.center.y) -
            (t.halfExtents.y + e.halfExtents.y) >=
            0
        )
          return !1;
        n = 99999;
        for (var r = 0, a = [t, e]; r < a.length; r++)
          for (var c = a[r], f = 0, l = c.boundaries; f < l.length; f++) {
            var _ = l[f];
            ot.setNormal(_.p0, _.p1), t.project(ot), e.project(ot);
            var h = t._min < e._min ? e._min - t._max : t._min - e._max;
            if (h > 0) return !1;
            (h *= -1), h < n && ((n = h), i.setTo(ot), (o = _));
          }
        if (o.parent != e) {
          var u = t;
          (t = e), (e = u);
        }
        ot.setSubtract(t.center, e.center),
          ot.dot(i) < 0 && i.multiplyScalar(-1);
        for (var d = 99999, p = 0, v = t.vertices; p < v.length; p++) {
          var x = v[p];
          ot.setSubtract(x.position, e.center);
          var h = i.dot(ot);
          h < d && ((d = h), (s = x));
        }
        return !0;
      }

      function e() {
        var t = o.p0,
          e = o.p1,
          r = o.v0.oldPosition,
          a = o.v1.oldPosition,
          c = s.position,
          f = s.oldPosition;
        ot.setMultiplyScalar(i, n);
        var l =
            Math.abs(t.x - e.x) > Math.abs(t.y - e.y)
              ? (c.x - ot.x - t.x) / (e.x - t.x)
              : (c.y - ot.y - t.y) / (e.y - t.y),
          _ = 1 / (l * l + (1 - l) * (1 - l)),
          h = s.parent.mass,
          u = o.parent.mass,
          d = h + u;
        (h /= 2 * d), (u /= d);
        var p = (1 - l) * _ * h,
          v = l * _ * h;
        (t.x -= ot.x * p),
          (t.y -= ot.y * p),
          (e.x -= ot.x * v),
          (e.y -= ot.y * v),
          (c.x += ot.x * u),
          (c.y += ot.y * u),
          ot.set(
            c.x - f.x - 0.5 * (t.x + e.x - r.x - a.x),
            c.y - f.y - 0.5 * (t.y + e.y - r.y - a.y),
          ),
          st.set(-i.y, i.x),
          ot.setMultiplyScalar(st, ot.dot(st)),
          (r.x -= ot.x * K * p),
          (r.y -= ot.y * K * p),
          (a.x -= ot.x * K * v),
          (a.y -= ot.y * K * v),
          (f.x += ot.x * K * u),
          (f.y += ot.y * K * u);
      }
      var n,
        o,
        s,
        i = new k();
      return [t, e];
    })(),
    R = j[0],
    U = j[1],
    H = document.getElementById("load"),
    W = document.getElementById("home"),
    z = document.getElementById("start"),
    V = document.getElementById("end"),
    X = document.getElementById("reset")
    closeMenuButton = document.getElementById("close-menu-controls");
  W.addEventListener("mousedown", r),
    W.addEventListener("touchstart", r),
    z.addEventListener("mousedown", a),
    z.addEventListener("touchstart", a),
    V.addEventListener("mousedown", r),
    V.addEventListener("touchstart", r),
    X.addEventListener("mousedown", f),
    X.addEventListener("touchstart", f),
    closeMenuButton.addEventListener("mousedown", closeMenu),
    closeMenuButton.addEventListener("touchstart", closeMenu),
    document.addEventListener("keydown", keyDown);
  var Y = 0.6,
    G = 0.1,
    J = 40,
    K = 0.9,
    Q = 0.6,
    Z = 0.24,
    $ = [],
    tt = [],
    et = [],
    nt = null,
    ot = new k(),
    st = new k(),
    it = {},
    rt = i(function () {
      var t = it[256] || it[512] || it[1024];
      it[2]
        ? new E(_())
        : it[4]
        ? new E(_(), -44, 4)
        : t
        ? it[8]
          ? new E(_(), -48, 8)
          : (new E(0.35 * T, -44, 4), new E(0.65 * T, -44, 4))
        : (new E(0.35 * T), new E(0.65 * T)),
        x.play("new");
    }, 300),
    at = null,
    ct = null,
    ft = null,
    lt = function () {
      function t(t) {
        return Math.sin(6.283184 * t);
      }

      function e(e) {
        return t(e) < 0 ? -1 : 1;
      }

      function n(t) {
        return (t % 1) - 0.5;
      }

      function o(t) {
        var e = (t % 1) * 4;
        return e < 2 ? e - 1 : 3 - e;
      }

      function s(t) {
        return 0.00390625 * Math.pow(1.059463094, t - 128);
      }
      var i,
        r,
        a = 44100,
        c = 2,
        f = a * _t.songLen;
      !(function () {
        var t = Math.ceil(Math.sqrt((f * c) / 2)),
          e = document.createElement("canvas").getContext("2d");
        i = e.createImageData(t, t).data;
        var n,
          o = e.createImageData(t, t).data;
        for (n = t * t * 4 - 2; n >= 0; n -= 2) (o[n] = 0), (o[n + 1] = 128);
        r = o;
      })(),
        (this.lps = a / _t.rowLen),
        (this.generate = function (l) {
          var _,
            h,
            u,
            d,
            p,
            v,
            x,
            y,
            m,
            w,
            g,
            q,
            b,
            E,
            M,
            L,
            k,
            P,
            T,
            S,
            B,
            I,
            D = [t, e, n, o],
            F = i,
            N = r,
            A = f,
            C = f * c * 2,
            O = _t.songData[l],
            j = _t.rowLen,
            R = D[O.lfo_waveform],
            U = D[O.osc1_waveform],
            H = D[O.osc2_waveform],
            W = O.env_attack,
            z = O.env_sustain,
            V = O.env_release,
            X = Math.pow(2, O.fx_pan_freq - 8) / j,
            Y = Math.pow(2, O.lfo_freq - 8) / j;
          for (u = 0; u < C; u += 2) (F[u] = 0), (F[u + 1] = 128);
          for (x = 0, d = 0; d < _t.endPattern - 1; ++d)
            for (y = O.p[d], p = 0; p < 32; ++p) {
              if (y && (v = O.c[y - 1].n[p]))
                for (
                  m = w = 0,
                    B =
                      s(v + 12 * (O.osc1_oct - 8) + O.osc1_det) *
                      (1 + 8e-4 * O.osc1_detune),
                    I =
                      s(v + 12 * (O.osc2_oct - 8) + O.osc2_det) *
                      (1 + 8e-4 * O.osc2_detune),
                    g = O.fx_resonance / 255,
                    q = b = 0,
                    _ = W + z + V - 1;
                  _ >= 0;
                  --_
                ) {
                  switch (
                    ((h = _ + x),
                    (L = (R(h * Y) * O.lfo_amt) / 512 + 0.5),
                    (k = 1),
                    _ < W ? (k = _ / W) : _ >= W + z && (k -= (_ - W - z) / V),
                    (M = B),
                    O.lfo_osc1_freq && (M += L),
                    O.osc1_xenv && (M *= k * k),
                    (m += M),
                    (T = U(m) * O.osc1_vol),
                    (M = I),
                    O.osc2_xenv && (M *= k * k),
                    (w += M),
                    (T += H(w) * O.osc2_vol),
                    O.noise_fader &&
                      (T += (2 * Math.random() - 1) * O.noise_fader * k),
                    (T *= k / 255),
                    (S = O.fx_freq),
                    O.lfo_fx_freq && (S *= L),
                    (S = 1.5 * Math.sin((3.141592 * S) / a)),
                    (q += S * b),
                    (E = g * (T - b) - q),
                    (b += S * E),
                    O.fx_filter)
                  ) {
                    case 1:
                      T = E;
                      break;
                    case 2:
                      T = q;
                      break;
                    case 3:
                      T = b;
                      break;
                    case 4:
                      T = q + E;
                  }
                  (M = (t(h * X) * O.fx_pan_amt) / 512 + 0.5),
                    (T *= 39 * O.env_master),
                    (h <<= 2),
                    (P = F[h] + (F[h + 1] << 8) + T * (1 - M)),
                    (F[h] = 255 & P),
                    (F[h + 1] = (P >> 8) & 255),
                    (P = F[h + 2] + (F[h + 3] << 8) + T * M),
                    (F[h + 2] = 255 & P),
                    (F[h + 3] = (P >> 8) & 255);
                }
              x += j;
            }
          for (
            d = (O.fx_delay_time * j) >> 1, M = O.fx_delay_amt / 255, v = 0;
            v < A - d;
            ++v
          )
            (u = 4 * v),
              (h = 4 * (v + d)),
              (P =
                F[h] +
                (F[h + 1] << 8) +
                (F[u + 2] + (F[u + 3] << 8) - 32768) * M),
              (F[h] = 255 & P),
              (F[h + 1] = (P >> 8) & 255),
              (P =
                F[h + 2] +
                (F[h + 3] << 8) +
                (F[u] + (F[u + 1] << 8) - 32768) * M),
              (F[h + 2] = 255 & P),
              (F[h + 3] = (P >> 8) & 255);
          for (u = 0; u < C; u += 2)
            (P = N[u] + (N[u + 1] << 8) + F[u] + (F[u + 1] << 8) - 32768),
              (N[u] = 255 & P),
              (N[u + 1] = (P >> 8) & 255);
        }),
        (this.createAudio = function () {
          var t,
            e,
            n,
            o,
            s,
            a,
            l,
            _,
            h = r,
            u = f * c * 2;
          for (
            i = null,
              s = u - 8,
              a = s - 36,
              o = String.fromCharCode(
                82,
                73,
                70,
                70,
                255 & s,
                (s >> 8) & 255,
                (s >> 16) & 255,
                (s >> 24) & 255,
                87,
                65,
                86,
                69,
                102,
                109,
                116,
                32,
                16,
                0,
                0,
                0,
                1,
                0,
                2,
                0,
                68,
                172,
                0,
                0,
                16,
                177,
                2,
                0,
                4,
                0,
                16,
                0,
                100,
                97,
                116,
                97,
                255 & a,
                (a >> 8) & 255,
                (a >> 16) & 255,
                (a >> 24) & 255,
              ),
              t = 0;
            t < u;

          ) {
            for (n = "", e = 0; e < 256 && t < u; ++e, t += 2)
              (_ = 4 * (h[t] + (h[t + 1] << 8) - 32768)),
                (_ = _ < -32768 ? -32768 : _ > 32767 ? 32767 : _),
                (n += String.fromCharCode(255 & _, (_ >> 8) & 255));
            o += n;
          }
          return (
            (l = "data:audio/wav;base64," + btoa(o)), (o = null), new Audio(l)
          );
        }),
        (this.getData = function (t, e) {
          for (
            var n = Math.floor(t * a), o = 0, s = [], i = r;
            o < 2 * e;
            o += 2
          ) {
            var c = 4 * (n + o) + 1;
            s.push(t > 0 && c < i.length ? (i[c] + i[c - 1] / 256) / 256 : 0.5);
          }
          return s;
        });
    },
    _t = {
      songLen: 37,
      songData: [
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 192,
          osc1_waveform: 3,
          osc2_oct: 7,
          osc2_det: 0,
          osc2_detune: 7,
          osc2_xenv: 0,
          osc2_vol: 201,
          osc2_waveform: 3,
          noise_fader: 0,
          env_attack: 789,
          env_sustain: 1234,
          env_release: 13636,
          env_master: 191,
          fx_filter: 2,
          fx_freq: 5839,
          fx_resonance: 254,
          fx_delay_time: 6,
          fx_delay_amt: 121,
          fx_pan_freq: 6,
          fx_pan_amt: 147,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 6,
          lfo_amt: 195,
          lfo_waveform: 0,
          p: [
            1, 2, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                154, 0, 154, 0, 152, 0, 147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 0,
                154, 0, 152, 0, 157, 0, 0, 0, 156, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                154, 0, 154, 0, 152, 0, 147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 0,
                154, 0, 152, 0, 157, 0, 0, 0, 159, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 255,
          osc1_waveform: 2,
          osc2_oct: 8,
          osc2_det: 0,
          osc2_detune: 18,
          osc2_xenv: 1,
          osc2_vol: 191,
          osc2_waveform: 2,
          noise_fader: 0,
          env_attack: 3997,
          env_sustain: 56363,
          env_release: 1e5,
          env_master: 255,
          fx_filter: 2,
          fx_freq: 392,
          fx_resonance: 255,
          fx_delay_time: 8,
          fx_delay_amt: 69,
          fx_pan_freq: 5,
          fx_pan_amt: 67,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 4,
          lfo_amt: 57,
          lfo_waveform: 3,
          p: [
            1, 2, 1, 2, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                130, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                123, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 8,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 0,
          osc1_waveform: 0,
          osc2_oct: 8,
          osc2_det: 0,
          osc2_detune: 0,
          osc2_xenv: 0,
          osc2_vol: 0,
          osc2_waveform: 0,
          noise_fader: 60,
          env_attack: 50,
          env_sustain: 419,
          env_release: 4607,
          env_master: 130,
          fx_filter: 1,
          fx_freq: 10332,
          fx_resonance: 120,
          fx_delay_time: 4,
          fx_delay_amt: 16,
          fx_pan_freq: 5,
          fx_pan_amt: 108,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 0,
          lfo_freq: 5,
          lfo_amt: 187,
          lfo_waveform: 0,
          p: [
            0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                0, 0, 147, 0, 0, 0, 147, 147, 0, 0, 147, 0, 0, 147, 0, 147, 0,
                0, 147, 0, 0, 0, 147, 147, 0, 0, 147, 0, 0, 147, 0, 147,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 1,
          osc1_vol: 255,
          osc1_waveform: 0,
          osc2_oct: 7,
          osc2_det: 0,
          osc2_detune: 0,
          osc2_xenv: 1,
          osc2_vol: 255,
          osc2_waveform: 0,
          noise_fader: 0,
          env_attack: 50,
          env_sustain: 150,
          env_release: 4800,
          env_master: 200,
          fx_filter: 2,
          fx_freq: 600,
          fx_resonance: 254,
          fx_delay_time: 0,
          fx_delay_amt: 0,
          fx_pan_freq: 0,
          fx_pan_amt: 0,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 0,
          lfo_freq: 0,
          lfo_amt: 0,
          lfo_waveform: 0,
          p: [
            1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                147, 0, 0, 0, 0, 0, 0, 0, 147, 0, 0, 0, 0, 0, 0, 0, 147, 0, 0,
                0, 0, 0, 0, 0, 147, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 255,
          osc1_waveform: 2,
          osc2_oct: 7,
          osc2_det: 0,
          osc2_detune: 9,
          osc2_xenv: 0,
          osc2_vol: 154,
          osc2_waveform: 2,
          noise_fader: 0,
          env_attack: 2418,
          env_sustain: 1075,
          env_release: 10614,
          env_master: 240,
          fx_filter: 3,
          fx_freq: 2962,
          fx_resonance: 255,
          fx_delay_time: 6,
          fx_delay_amt: 117,
          fx_pan_freq: 3,
          fx_pan_amt: 73,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 5,
          lfo_amt: 124,
          lfo_waveform: 0,
          p: [
            0, 0, 0, 0, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                154, 0, 154, 0, 152, 0, 147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 0,
                154, 0, 152, 0, 157, 0, 0, 0, 156, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                154, 0, 154, 0, 152, 0, 147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 154, 0,
                147, 0, 152, 0, 157, 0, 0, 0, 159, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 192,
          osc1_waveform: 1,
          osc2_oct: 6,
          osc2_det: 0,
          osc2_detune: 9,
          osc2_xenv: 0,
          osc2_vol: 192,
          osc2_waveform: 1,
          noise_fader: 0,
          env_attack: 137,
          env_sustain: 2e3,
          env_release: 4611,
          env_master: 192,
          fx_filter: 1,
          fx_freq: 982,
          fx_resonance: 89,
          fx_delay_time: 6,
          fx_delay_amt: 25,
          fx_pan_freq: 6,
          fx_pan_amt: 77,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 3,
          lfo_amt: 69,
          lfo_waveform: 0,
          p: [
            1, 2, 1, 3, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                130, 0, 130, 0, 142, 0, 130, 130, 0, 142, 130, 0, 142, 0, 130,
                0, 130, 0, 130, 0, 142, 0, 130, 130, 0, 142, 130, 0, 142, 0,
                130, 0,
              ],
            },
            {
              n: [
                123, 0, 123, 0, 135, 0, 123, 123, 0, 135, 123, 0, 135, 0, 123,
                0, 123, 0, 123, 0, 135, 0, 123, 123, 0, 135, 123, 0, 135, 0,
                123, 0,
              ],
            },
            {
              n: [
                135, 0, 135, 0, 147, 0, 135, 135, 0, 147, 135, 0, 147, 0, 135,
                0, 135, 0, 135, 0, 147, 0, 135, 135, 0, 147, 135, 0, 147, 0,
                135, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 7,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 255,
          osc1_waveform: 3,
          osc2_oct: 8,
          osc2_det: 0,
          osc2_detune: 0,
          osc2_xenv: 0,
          osc2_vol: 255,
          osc2_waveform: 0,
          noise_fader: 127,
          env_attack: 22,
          env_sustain: 88,
          env_release: 3997,
          env_master: 255,
          fx_filter: 3,
          fx_freq: 4067,
          fx_resonance: 234,
          fx_delay_time: 4,
          fx_delay_amt: 33,
          fx_pan_freq: 2,
          fx_pan_amt: 84,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 3,
          lfo_amt: 28,
          lfo_waveform: 0,
          p: [
            0, 0, 1, 2, 1, 2, 1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                0, 0, 142, 0, 154, 0, 0, 0, 142, 0, 0, 0, 154, 0, 0, 0, 0, 0,
                142, 0, 154, 0, 0, 0, 142, 0, 0, 0, 154, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 147, 0, 154, 0, 0, 0, 147, 0, 0, 0, 154, 0, 0, 0, 0, 0,
                147, 0, 154, 0, 147, 0, 0, 0, 154, 0, 0, 0, 154, 0,
              ],
            },
            {
              n: [
                0, 0, 147, 0, 154, 0, 0, 0, 147, 0, 0, 0, 154, 0, 0, 0, 0, 0,
                147, 0, 154, 0, 0, 0, 147, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
        {
          osc1_oct: 8,
          osc1_det: 0,
          osc1_detune: 0,
          osc1_xenv: 0,
          osc1_vol: 0,
          osc1_waveform: 0,
          osc2_oct: 8,
          osc2_det: 0,
          osc2_detune: 0,
          osc2_xenv: 0,
          osc2_vol: 0,
          osc2_waveform: 0,
          noise_fader: 255,
          env_attack: 140347,
          env_sustain: 9216,
          env_release: 133417,
          env_master: 208,
          fx_filter: 2,
          fx_freq: 2500,
          fx_resonance: 16,
          fx_delay_time: 2,
          fx_delay_amt: 157,
          fx_pan_freq: 8,
          fx_pan_amt: 207,
          lfo_osc1_freq: 0,
          lfo_fx_freq: 1,
          lfo_freq: 2,
          lfo_amt: 51,
          lfo_waveform: 0,
          p: [
            0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0,
          ],
          c: [
            {
              n: [
                147, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
            {
              n: [
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
              ],
            },
          ],
        },
      ],
      rowLen: 5513,
      endPattern: 9,
    },
    ht = {
      dragging: !1,
      x: 0,
      y: 0,
    };
  addEventListener("mousedown", function (t) {
    t.preventDefault(), (ht.dragging = !0), u(t);
  }),
    addEventListener("mousemove", function (t) {
      t.preventDefault(), u(t);
    }),
    addEventListener("mouseup", function (t) {
      t.preventDefault(), (ht.dragging = !1), (nt = null);
    }),
    document.addEventListener("touchstart", function (t) {
      var e = t.target;
      "INPUT" != e.tagName && "LABEL" != e.tagName && t.preventDefault(),
        (ht.dragging = !0),
        u(t.targetTouches[0]);
    }),
    document.addEventListener("touchmove", function (t) {
      t.preventDefault(), u(t.targetTouches[0]);
    }),
    document.addEventListener("touchend", function (t) {
      (ht.dragging = !1), (nt = null);
    }),
    document.addEventListener("touchcancel", function (t) {
      (ht.dragging = !1), (nt = null);
    }),
    Math.log2 ||
      (Math.log2 = function (t) {
        return Math.log(t) / Math.LN2;
      }),
    Math.log10 ||
      (Math.log10 = function (t) {
        return Math.log(t) / Math.LN10;
      }),
    Date.now ||
      (Date.now = function () {
        return new Date().getTime();
      }),
    Element.prototype.requestFullscreen ||
      (Element.prototype.requestFullscreen =
        Element.prototype.mozRequestFullScreen ||
        Element.prototype.msRequestFullscreen ||
        Element.prototype.webkitRequestFullscreen);
  var ut = null;
  if (!y)
    try {
      d();
    } catch (t) {}
  s(), p(), h(), e(), requestAnimationFrame(l), n();
})();
