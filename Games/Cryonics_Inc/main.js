(() => {
  var xe = (t, e) => {
    let o = 0,
      r = 0,
      n = 1 / 60,
      s = 0;
    (function c(x) {
      for (r += x - o, r > 1e3 && (r = 0), o = x; r > n; ) (r -= n), t(n);
      e(s++), requestAnimationFrame(c);
    })(0);
  };
  var R = { p: !1, s: !1, n: 0, _: 0 },
    Tt = !1,
    Ee = (t) => {
      (t.onpointerdown = () => (R.p = Tt = !0)),
        (t.onpointerup = () => (R.p = !1)),
        (t.onpointermove = (e) => {
          (R.n = e.offsetX / t.clientWidth), (R._ = e.offsetY / t.clientHeight);
        }),
        (t.ontouchstart =
          t.ontouchmove =
          t.ontouchend =
          t.ontouchcancel =
            (e) => {
              if (
                (e.preventDefault(), (R.p = Tt = e.touches.length > 0), R.p)
              ) {
                let o = t.getBoundingClientRect();
                (R.n = (e.touches[0].clientX - o.left) / t.clientWidth),
                  (R._ = e.touches[0].clientY / t.clientHeight);
              }
            }),
        (t.onmousemove = (e) => {
          (R.n = e.offsetX / t.clientWidth), (R._ = e.offsetY / t.clientHeight);
        });
    },
    pe = () => {
      Tt ? ((Tt = !1), (R.s = !0)) : (R.s = !1);
    };
  var pr = (t) => () => {
      t.clearColor(0.1, 0.1, 0.1, 1), t.clear(16640);
    },
    Te = (t, e, o) => {
      let r = t.createShader(e);
      return t.shaderSource(r, o), t.compileShader(r), r;
    },
    Lr = (t, e) => (o) => {
      let r = t.getUniformLocation(e, o);
      return {
        Y: r,
        E: (n) => t.uniform1f(r, n),
        C: (n, s) => t.uniform2f(r, n, s),
        R: (n, s, c) => t.uniform3f(r, n, s, c),
        K: (n, s, c, x) => t.uniform4f(r, n, s, c, x),
        j: (n, s = !1) => t.uniformMatrix3fv(r, s, n),
        A: (n, s = !1) => t.uniformMatrix4fv(r, s, n),
        Z: (n) => t.uniform1i(r, n),
      };
    },
    ar = (t) => (e, o) => {
      let r = t.createProgram();
      t.attachShader(r, Te(t, 35633, e)),
        t.attachShader(r, Te(t, 35632, o)),
        t.linkProgram(r),
        t.getProgramParameter(r, 35714) ||
          alert("Program Link failed: " + t.getProgramInfoLog(r));
      let n = {
        Q: r,
        l: Lr(t, r),
        t() {
          return t.useProgram(r), n;
        },
        J: (s) => t.getAttribLocation(r, s),
      };
      return n;
    },
    Tr = (t) => () => {
      let e = t.createVertexArray(),
        o = {
          L: e,
          r() {
            return t.bindVertexArray(e), o;
          },
          M(r, n, s = 0, c = 0, x = 5126, E = !1) {
            return (
              this.r(),
              t.enableVertexAttribArray(r),
              t.vertexAttribPointer(r, n, x, E, s, c),
              o
            );
          },
        };
      return o.r();
    },
    Gr =
      (t) =>
      (e = 34962, o = 35044) => {
        let r = t.createBuffer(),
          n = {
            F: r,
            r() {
              return t.bindBuffer(e, r), n;
            },
            B(s) {
              return this.r(), t.bufferData(e, s, o), n;
            },
          };
        return n.r();
      },
    ir =
      (t) =>
      (e = 3553) => {
        let o = t.createTexture(),
          r = (s, c) => t.texParameteri(e, s, c),
          n = {
            m: o,
            r() {
              return t.bindTexture(e, o), n;
            },
            T(s = 9728) {
              return r(10241, s), r(10240, s), n;
            },
            S(s = 33071) {
              return r(10242, s), r(10243, s), n;
            },
            N(s) {
              return (
                n.r(),
                t.texImage2D(e, 0, 6408, 6408, 5121, s),
                t.generateMipmap(e),
                n
              );
            },
            $(s) {
              let c = new Image();
              return (
                (c.src = s),
                (c.onload = () => {
                  n.N(c);
                }),
                n
              );
            },
            G(
              s,
              c = 0,
              x = 33321,
              E = 2,
              T = 2,
              G = 0,
              A = 6403,
              m = 5121,
              L = 1
            ) {
              return (
                n.r(),
                t.pixelStorei(3317, L),
                t.texImage2D(e, c, x, E, T, G, A, m, s),
                n
              );
            },
            q(s, c) {
              return t.uniform1i(s, c), t.activeTexture(33984 + c), n.r(), n;
            },
          };
        return (
          n.G(new Uint8Array([0, 0, 255, 255]), 0, 6408, 1, 1, 0, 6408, 5121), n
        );
      },
    Rr =
      (t) =>
      (e = 35044) => {
        let o = t.createBuffer(),
          r = {
            F: o,
            r() {
              return t.bindBuffer(34963, o), r;
            },
            U(n) {
              return r.r(), t.bufferData(34963, new Uint16Array(n), e), r;
            },
          };
        return r.r();
      },
    ie = (t, e = 400, o = 300) => {
      let r = t.getContext("webgl2");
      r || alert("Could not get gl context"),
        (t.width = e),
        (t.height = o),
        r.viewport(0, 0, t.width, t.height),
        r.enable(2884),
        r.enable(2929),
        r.enable(3042),
        r.depthFunc(515),
        r.blendFunc(770, 771),
        r.clearDepth(1),
        Ee(t);
      let n = {
        tt: r,
        P: pr(r),
        O: ar(r),
        D: Gr(r),
        I: ir(r),
        h: Rr(r),
        H: Tr(r),
        o: (s, c = 4, x = 0) => r.drawArrays(c, x, s),
        X: (s, c = 4, x = 0) => r.drawElements(c, s, 5123, x),
        V([s, c], x) {
          let E = n.H();
          return (
            n.D().B(s),
            n.h().U(c),
            x.map((T) => E.M(...T)),
            { L: E, o: () => n.X(c.length) }
          );
        },
        u() {
          let s = Re(e, o);
          (t.width = e),
            (t.height = o),
            (t.style.width = e * s + "px"),
            (t.style.height = o * s + "px"),
            r.viewport(0, 0, r.canvas.width, r.canvas.height),
            (document.getElementById("d").style.display =
              window.innerWidth < window.innerHeight ? "block" : "none");
        },
        et(s, c) {
          (e = s), (o = c), n.u();
        },
        ot(s, c = e, x = o, E = 6408, T = 6408) {
          let G = r.createFramebuffer();
          s.G(null, 0, E, c, x, 0, T).T();
          let A = (S) => r.bindFramebuffer(36160, S),
            m = (S, F) => r.viewport(0, 0, S, F),
            L = (S) => {
              A(G), m(c, x), S(), m(e, o), A(null);
            };
          return (
            L(() => {
              r.framebufferTexture2D(36160, 36064, 3553, s.m, 0);
              let S = n.I().G(null, 0, 33190, c, x, 0, 6402, 5125).T(9729).S();
              r.framebufferTexture2D(36160, 36096, 3553, S.m, 0);
            }),
            L
          );
        },
      };
      return n;
    };
  var yt = 1e-6,
    $ = () => {
      let t = Q(16);
      return le(t);
    },
    Ae = (t) => {
      let e = $();
      return (
        (e[0] = t[0]),
        (e[1] = t[1]),
        (e[2] = t[2]),
        (e[3] = t[3]),
        (e[4] = t[4]),
        (e[5] = t[5]),
        (e[6] = t[6]),
        (e[7] = t[7]),
        (e[8] = t[8]),
        (e[9] = t[9]),
        (e[10] = t[10]),
        (e[11] = t[11]),
        (e[12] = t[12]),
        (e[13] = t[13]),
        (e[14] = t[14]),
        (e[15] = t[15]),
        e
      );
    };
  var le = (t) => (
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
    ),
    me = (t, e, o) => {
      let r = e[0],
        n = e[1],
        s = e[2],
        c = e[3],
        x = e[4],
        E = e[5],
        T = e[6],
        G = e[7],
        A = e[8],
        m = e[9],
        L = e[10],
        S = e[11],
        F = e[12],
        B = e[13],
        U = e[14],
        P = e[15],
        l = o[0],
        d = o[1],
        I = o[2],
        b = o[3];
      return (
        (t[0] = l * r + d * x + I * A + b * F),
        (t[1] = l * n + d * E + I * m + b * B),
        (t[2] = l * s + d * T + I * L + b * U),
        (t[3] = l * c + d * G + I * S + b * P),
        (l = o[4]),
        (d = o[5]),
        (I = o[6]),
        (b = o[7]),
        (t[4] = l * r + d * x + I * A + b * F),
        (t[5] = l * n + d * E + I * m + b * B),
        (t[6] = l * s + d * T + I * L + b * U),
        (t[7] = l * c + d * G + I * S + b * P),
        (l = o[8]),
        (d = o[9]),
        (I = o[10]),
        (b = o[11]),
        (t[8] = l * r + d * x + I * A + b * F),
        (t[9] = l * n + d * E + I * m + b * B),
        (t[10] = l * s + d * T + I * L + b * U),
        (t[11] = l * c + d * G + I * S + b * P),
        (l = o[12]),
        (d = o[13]),
        (I = o[14]),
        (b = o[15]),
        (t[12] = l * r + d * x + I * A + b * F),
        (t[13] = l * n + d * E + I * m + b * B),
        (t[14] = l * s + d * T + I * L + b * U),
        (t[15] = l * c + d * G + I * S + b * P),
        t
      );
    };
  var Se = (t, e, o, r, n) => {
      let s = 1 / Math.tan(e / 2);
      (t[0] = s / o),
        (t[1] = 0),
        (t[2] = 0),
        (t[3] = 0),
        (t[4] = 0),
        (t[5] = s),
        (t[6] = 0),
        (t[7] = 0),
        (t[8] = 0),
        (t[9] = 0),
        (t[11] = -1),
        (t[12] = 0),
        (t[13] = 0),
        (t[15] = 0);
      let c = 1 / (r - n);
      return (t[10] = (n + r) * c), (t[14] = 2 * n * r * c), t;
    },
    Ne = (t, e, o, r) => {
      let n,
        s,
        c,
        x,
        E,
        T,
        G,
        A,
        m,
        L,
        S = e[0],
        F = e[1],
        B = e[2],
        U = r[0],
        P = r[1],
        l = r[2],
        d = o[0],
        I = o[1],
        b = o[2];
      return Math.abs(S - d) < yt &&
        Math.abs(F - I) < yt &&
        Math.abs(B - b) < yt
        ? le(t)
        : ((G = S - d),
          (A = F - I),
          (m = B - b),
          (L = 1 / Math.hypot(G, A, m)),
          (G *= L),
          (A *= L),
          (m *= L),
          (n = P * m - l * A),
          (s = l * G - U * m),
          (c = U * A - P * G),
          (L = Math.hypot(n, s, c)),
          L
            ? ((L = 1 / L), (n *= L), (s *= L), (c *= L))
            : ((n = 0), (s = 0), (c = 0)),
          (x = A * c - m * s),
          (E = m * n - G * c),
          (T = G * s - A * n),
          (L = Math.hypot(x, E, T)),
          L
            ? ((L = 1 / L), (x *= L), (E *= L), (T *= L))
            : ((x = 0), (E = 0), (T = 0)),
          (t[0] = n),
          (t[1] = x),
          (t[2] = G),
          (t[3] = 0),
          (t[4] = s),
          (t[5] = E),
          (t[6] = A),
          (t[7] = 0),
          (t[8] = c),
          (t[9] = T),
          (t[10] = m),
          (t[11] = 0),
          (t[12] = -(n * S + s * F + c * B)),
          (t[13] = -(x * S + E * F + T * B)),
          (t[14] = -(G * S + A * F + m * B)),
          (t[15] = 1),
          t);
    };
  var W = (t = 0, e = 0, o = 0) => {
      let r = Q(3);
      return ht(r, t, e, o);
    },
    ht = (t, e, o, r) => ((t[0] = e), (t[1] = o), (t[2] = r), t);
  var q = (t, e, o) => (
    (t[0] = e[0] + o[0]), (t[1] = e[1] + o[1]), (t[2] = e[2] + o[2]), t
  );
  var vt = (t, e, o) => (
    (t[0] = e[0] * o), (t[1] = e[1] * o), (t[2] = e[2] * o), t
  );
  var Oe = (t, e, o) => (
      (t[0] = e[0] * o), (t[1] = e[1] * o), (t[2] = e[2] * o), t
    ),
    Ar = (t, e) => t[0] * e[0] + t[1] * e[1] + t[2] * e[2],
    de = (t, e, o) => (
      (t[0] = e[1] * o[2] - e[2] * o[1]),
      (t[1] = e[2] * o[0] - e[0] * o[2]),
      (t[2] = e[0] * o[1] - e[1] * o[0]),
      t
    ),
    Ht = (t, e) => {
      let o = Math.sqrt(Ar(e, e));
      return (
        o > 1e-5
          ? ((t[0] = e[0] / o), (t[1] = e[1] / o), (t[2] = e[2] / o))
          : ((t[0] = 0), (t[1] = 0), (t[2] = 0)),
        t
      );
    };
  var Gt = Math.PI / 2 - 0.01,
    lr = (t, e, o, r) => {
      let n = Se($(), t, r, e, o),
        s = $(),
        c = W(),
        x = W(0, 1),
        E = W(0, 0, -1),
        T = -Math.PI / 2,
        G = 0,
        A = W(),
        m = W(),
        L = W(),
        S = $(),
        F = W(),
        B = {
          W(U, P, l) {
            return (
              l && (vt(A, E, l), q(c, c, A)),
              P && (Oe(A, x, P), q(c, c, A)),
              U && (de(m, x, E), Ht(m, m), vt(A, m, U), q(c, c, A)),
              B
            );
          },
          rt(U, P) {
            (G -= U), (T += P), G > Gt && (G = Gt), G < -Gt && (G = -Gt);
            let l = Math.cos(G);
            return (
              (L[0] = Math.cos(T) * l),
              (L[1] = Math.sin(G)),
              (L[2] = Math.sin(T) * l),
              Ht(E, L),
              B
            );
          },
          nt(U, P, l) {
            return ht(c, U, P, l), B;
          },
          st(U, P, l) {
            return B;
          },
          k() {
            return Ne(S, c, q(F, c, E), x), me(B.i, n, S), B;
          },
          i: Ae(n),
          ct: s,
          _t: n,
          xt: c,
          Et: E,
        };
      return B;
    },
    Ie = lr;
  var be = 1920,
    ue = 1080,
    Xt = 11,
    wt = 8,
    _ = (t, e = {}, ...o) => {
      let r = document.createElement(t);
      for (let n in e) r[n] = e[n];
      return r.append(...o), r;
    },
    Re = (t, e) => Math.min(window.innerWidth / t, window.innerHeight / e);
  var mr = (t) => (t * Math.PI) / 180,
    Q = (t) => new Float32Array(t),
    X = ie(document.getElementById("c"), be, ue);
  (window.onresize = X.u)();
  var Vt = Ie(mr(45), 1, 400, be / ue)
      .W(-4, 4, -10)
      .k(),
    u = { x: 0, y: 0, isInRange: !1, leftHalf: !1 },
    Ce = () => {
      if (((u.isInRange = !1), R.n < 0.228 && R._ > 0.985)) return;
      let n = R.n - 0.228,
        s = Math.floor(n / 0.068),
        c = Math.floor((1 - R._ - (1 - 0.985)) / 0.122),
        x = n % 0.068 < 0.068 / 2;
      s >= 0 &&
        s < Xt &&
        c >= 0 &&
        c < wt &&
        ((u.x = s), (u.y = c), (u.isInRange = !0), (u.leftHalf = x));
    };
  var Me = `#version 300 es
precision mediump float;layout(location=0)in vec4 aPos;uniform mat4 uMat;uniform vec3 uPos;uniform float uAng;out vec2 vTex;vec2 e=vec2(.5);vec2 o(vec2 a,float o){vec2 v=a-e;return v*=mat2(cos(o),sin(o),-sin(o),cos(o)),v+=e;}void main(){gl_Position=uMat*(aPos+vec4(uPos,0.)),vTex=aPos.xy,vTex.y=1.-vTex.y,vTex=o(vTex,uAng);}`;
  var Fe = `#version 300 es
precision mediump float;in vec2 vTex;uniform lowp sampler2D uTex;uniform float uZoom,uOpacity,uBri;out vec4 outColor;void main(){vec2 o=vTex*(2.-uZoom)-(1.-uZoom)/2.;outColor=texture(uTex,o),outColor.xyz*=uBri,outColor.w*=uOpacity;}`;
  var fe = `#version 300 es
precision mediump float;layout(location=0)in vec4 aPos;uniform mat4 uMat;uniform vec2 uSize;uniform vec3 uPos;uniform float uAng;out vec2 vUV;vec2 u=vec2(.5);vec2 o(vec2 e,float o){vec2 c=e-u;return c*=mat2(cos(o),sin(o),-sin(o),cos(o)),c+=u;}void main(){gl_Position=uMat*(vec4(aPos.xy*uSize,aPos.zw)+vec4(uPos,0.)),vUV=o(aPos.xy,uAng);}`;
  var dr = [Q([0, 0, 0, 1, 1, 1, 1, 0]), [0, 3, 2, 0, 2, 1]],
    it = X.V(dr, [[0, 2]]);
  var Be = (t) => {
      switch (t) {
        case 0:
          return 1.57079;
        case 1.57079:
          return 3.14159;
        case 3.14159:
          return 4.71238;
        case 4.71238:
          return 0;
      }
    },
    C = (t) => {
      let e = X.O(Me, Fe);
      e.t();
      let o = e.l;
      o`uMat`.A(Vt.i);
      let r = {
        t() {
          return t.r(), it.L.r(), e.t(), r;
        },
        o(n, s, c, x = 1, E = 1, T = 0, G = 1) {
          return (
            o`uPos`.R(n, s, c),
            o`uZoom`.E(x),
            o`uOpacity`.E(E),
            o`uAng`.E(T),
            o`uBri`.E(G),
            it.o(),
            r
          );
        },
      };
      return r;
    },
    Rt = (t, e = 1, o = e) => {
      let r = X.O(fe, t);
      r.t();
      let n = r.l;
      n`uMat`.A(Vt.i), n`uSize`.C(e, o);
      let s = {
        t() {
          return it.L.r(), r.t(), s;
        },
        uni: n,
        o(c, x, E) {
          return n`uPos`.R(c, x, E), it.o(), s;
        },
      };
      return s;
    };
  var At = _("canvas"),
    M = (t, e) => {
      let o = At.getContext("2d");
      return (
        (At.width = e),
        (At.height = e),
        (o.font = "90px e"),
        (o.textAlign = "center"),
        (o.textBaseline = "middle"),
        (o.fillStyle = "white"),
        o.clearRect(0, 0, e, e),
        o.fillText(t, e / 2, e / 2),
        X.I().N(At).S().T()
      );
    };
  var Ue = `#version 300 es
precision mediump float;in vec2 vUV;out vec4 outColor;float v(vec2 e,float v){vec2 o=smoothstep(vec2(v),vec2(v)+.002,e);float c=o.x*o.y;vec2 t=smoothstep(vec2(v),vec2(v)+.002,1.-e);return c*=t.x*t.y,c;}void main(){float e=v(vUV,.01);vec3 o=vec3(vUV.x*.5,.2+vUV.y*.4,.7),c=vec3(.2);outColor=vec4(mix(o,c,e),1.);}`;
  var br = Rt(Ue, 3.7, 8.5),
    ve = null,
    He = null,
    Xe = null,
    we = null;
  setTimeout(() => {
    (ve = C(M("â›¶", 105))),
      (He = C(M("â–¶", 130))),
      (Xe = C(M("â¸", 130))),
      (we = C(M("ðŸ”", 130))),
      (i.selectedOpr = Object.keys(i.panelOprList)[0]);
  }, 100);
  var ur = { [0]: 0, [1]: 1, [2]: 2, [5]: 5, [6]: 6, [4]: 4, [3]: 3 },
    i = {
      paused: !0,
      scene: 1,
      scale: { btn1: 1, btn2: 1, [0]: 1 },
      panelOprList: {},
      selectedOpr: null,
      isEditor: !1,
    },
    Pe = 1.2,
    Cr = 1.1,
    De = { x: 0.027, y: 0.075 },
    ye = { x: 0.096, y: 0.075 },
    he = { x: 0.069, y: 0.26 },
    lt = 0.125,
    Wt = 0.069,
    kt = (t, e, o, r) => R.n >= t && R.n < t + o && R._ >= e && R._ < e + r,
    mt = (t) => {
      if (((i.scene = t), !(R.n > 0.205))) {
        if (kt(De.x, De.y, Wt, lt)) {
          if (((i.scale.btn1 = Pe), R.s))
            return (i.paused = !i.paused) ? (i.scene = 3) : (i.scene = 2);
        } else i.scale.btn1 = 1;
        if (kt(ye.x, ye.y, Wt, lt)) {
          if (((i.scale.btn2 = Pe), R.s)) return (i.paused = !0), (i.scene = 1);
        } else i.scale.btn2 = 1;
      }
    },
    St = (t) => {
      (i.panelOprList = t ? H : J),
        (i.selectedOpr = Object.keys(i.panelOprList)[0]),
        (i.isEditor = t),
        (i.paused = !0);
    },
    Ve = () => {
      R.n > 0.205 ||
        R._ < 0.25 ||
        Object.keys(i.panelOprList).map((t, e) => {
          kt(he.x, he.y + e * lt, Wt, lt)
            ? ((i.scale[t] = Cr), R.s && ke(ur[(i.selectedOpr = t)]))
            : (i.scale[t] = 1);
        });
    },
    We = () => {
      br.t().o(-4, -0.1, 0.1),
        i.isEditor ||
          (i.paused
            ? He.t().o(-2.9, 6.5, 0.11, i.scale.btn1)
            : Xe.t().o(-2.9, 6.5, 0.11, i.scale.btn1),
          we.t().o(-1.9, 6.5, 0.11, i.scale.btn2));
      let t = i.paused ? 1 : 0.7;
      Object.keys(i.panelOprList).map((e, o) => {
        i.panelOprList[e].t().o(-2.3, 5 - o, 0.11, i.scale[e], t),
          i.scene === 1 &&
            i.selectedOpr === e &&
            ve.t().o(-2.3, 5 - o, 0.11, 1.1, 1, 0, 0);
      });
    };
  var Ye = `#version 300 es
precision mediump float;in vec2 vUV;uniform vec2 uSize;uniform float uTime;out vec4 outColor;float v(vec2 v){return fract(sin(dot(v,vec2(12.9898,4.1414)))*43758.547);}float e(vec2 o){vec2 c=floor(o),e=fract(o);e=e*e*(3.-2.*e);float i=mix(mix(v(c),v(c+vec2(1,0)),e.x),mix(v(c+vec2(0,1)),v(c+vec2(1)),e.x),e.y);return i*i;}vec3 v(){vec2 v=vUV*10.+vec2(uTime*.005,uTime*.001);return vec3(e(v)*.5+.5);}void main(){vec2 c=fract(vUV*uSize),e=step(.03,c);outColor=vec4(mix(vec3(.4),vec3(.5,.7,.8),e.x*e.y)*v(),1.);}`;
  var Yt = Rt(Ye, 16, 10),
    Ke = (t) => {
      Yt.t(), Yt.uni`uTime`.E(t), Yt.o(-2, -1, -0.07);
    };
  var f = [],
    jt = null,
    zt = null;
  setTimeout(() => {
    (jt = C(M("ðŸ˜´", 120))), (zt = C(M("ðŸ¥¶", 120)));
  }, 100);
  var Br = (t) => {
      switch (t) {
        case 1:
          return jt.t(), jt;
        case 0:
          return zt.t(), zt;
      }
    },
    Ur = (t, e) => {
      let o = t.x,
        r = t.y;
      switch (t.next) {
        case 5:
          break;
        case 0:
          r += e;
          break;
        case 1.57079:
          o += e;
          break;
        case 3.14159:
          r -= e;
          break;
        case 4.71238:
          o -= e;
      }
      let n = Br(t.type);
      t.grid.map((s, c) => s.map((x, E) => x && n.o(o + E, r + c, 0)));
    },
    Pr = (t) => {
      let e = t.sort((n, s) => n.x - s.x)[0].x,
        o = t.sort((n, s) => n.y - s.y)[0].y,
        r = [];
      return (
        t.map((n) => {
          let s = n.x - e,
            c = n.y - o;
          n.grid.map((x, E) =>
            x.map((T, G) => {
              let A = s + G,
                m = c + E;
              (r[m] = r[m] || [])[A] = T;
            })
          );
        }),
        { x: e, y: o, grid: r, type: t[0].type, intent: 5, next: 5 }
      );
    },
    ze = (t, e, o = 5, r = 1) => ({
      x: t,
      y: e,
      grid: [[1]],
      intent: o,
      next: 5,
      type: r,
    }),
    Ze = (t, e, o) => {
      f.push(ze(t, e, o));
    },
    ge = (t, e) => !f.find((o) => o.x === t && o.y === e),
    N = (t) => t.grid[0].length,
    O = (t) => t.grid.length,
    Kt = (t) => O(t) > 0 && N(t) > 0,
    Dr = (t, e, o, r = 1) => {
      let n = e - t.x,
        s = o - t.y;
      if (!t.grid[s][n]) return [t];
      t.grid[s][n] = 0;
      let x = [ze(e, o, 5, r)];
      if (t.grid.every((E) => !E[n])) {
        let E = {
          x: e + 1,
          y: t.y,
          intent: t.intent,
          next: t.next,
          type: t.type,
          grid: t.grid.map((T) => T.slice(n + 1)),
        };
        Kt(E) && x.push(E), t.grid.map((T) => (T.length = n));
      }
      if (t.grid[s].every((E) => !E)) {
        let E = {
          x: t.x,
          y: o + 1,
          intent: t.intent,
          next: t.next,
          type: t.type,
          grid: t.grid.slice(s + 1),
        };
        Kt(E) && x.push(E), (t.grid.length = s);
      }
      return Kt(t) && x.push(t), x;
    },
    Zt = (t, e) => {
      let o = t.x,
        r = t.y;
      switch (e) {
        case 0:
          r++;
          break;
        case 3.14159:
          r--;
          break;
        case 1.57079:
          o++;
          break;
        case 4.71238:
          o--;
      }
      return { x: o, y: r };
    },
    yr = (t) => {
      for (let e = 0; e < t.grid.length; e++)
        for (let o = 0; o < t.grid[e].length; o++)
          if (t.grid[e][o] === 1) {
            let n = eo(t.x + o, t.y + e);
            if (n !== 5) {
              t.intent = n;
              return;
            }
          }
      t.intent = 5;
    },
    hr = (t, e) => {
      switch (e) {
        case 0:
          return t.grid[0].some((o, r) => o === 1 && et(t.x + r, t.y + 1));
        case 3.14159:
          return t.grid[t.grid.length - 1].some(
            (o, r) => o === 1 && et(t.x + r, t.y - t.grid.length)
          );
        case 1.57079:
          return t.grid.some(
            (o, r) =>
              o[t.grid[0].length - 1] === 1 &&
              et(t.x + t.grid[0].length, t.y + r)
          );
        case 4.71238:
          return t.grid.some((o, r) => o[0] === 1 && et(t.x - 1, t.y + r));
      }
    },
    tt = (t, e, o, r = 5) => {
      let n = Zt(t, e),
        s = Zt(o, r);
      if (
        n.x - s.x > N(o) ||
        s.x - n.x > N(t) ||
        n.y - s.y > O(o) ||
        s.y - n.y > O(t)
      )
        return !1;
      let c = Math.max(s.x - n.x, 0),
        x = Math.max(s.y - n.y, 0),
        E = Math.min(N(o), N(t) - c),
        T = Math.min(O(o), O(t) - x),
        G = Math.max(n.x - s.x, 0),
        A = Math.max(n.y - s.y, 0),
        m = Math.min(N(t), N(o) - G),
        L = Math.min(O(t), O(o) - A);
      for (let S = 0; S < Math.min(T, L); S++)
        for (let F = 0; F < Math.min(E, m); F++)
          if (t.grid[x + S][c + F] !== 0 && o.grid[A + S][G + F] !== 0)
            return !0;
      return !1;
    },
    je = (t) => t.grid.reduce((e, o) => e + o.filter((r) => r === 1).length, 0),
    w = (t, e, o, r, n, s, c, x) =>
      t < n + c && t + o > n && e < s + x && e + r > s,
    vr = (t, e, o) => {
      switch (e) {
        case 0:
          return w(t.x - 1, t.y + 1, N(t) + 2, O(t), o.x, o.y, N(o), O(o));
        case 3.14159:
          return w(t.x - 1, t.y - 1, N(t) + 2, O(t), o.x, o.y, N(o), O(o));
        case 4.71238:
          return w(t.x - 1, t.y - 1, N(t), O(t) + 2, o.x, o.y, N(o), O(o));
        case 1.57079:
          return w(t.x + 1, t.y - 1, N(t), O(t) + 2, o.x, o.y, N(o), O(o));
      }
    },
    Nt = (t, e, o) => {
      switch (e) {
        case 0:
          return w(t.x, t.y + 1, N(t), O(t), o.x, o.y, N(o), O(o));
        case 3.14159:
          return w(t.x, t.y - 1, N(t), O(t), o.x, o.y, N(o), O(o));
        case 4.71238:
          return w(t.x - 1, t.y, N(t), O(t), o.x, o.y, N(o), O(o));
        case 1.57079:
          return w(t.x + 1, t.y, N(t), O(t), o.x, o.y, N(o), O(o));
      }
    },
    Ot = (t, e, o) => {
      if (e === 5 || t.next === e) return !0;
      let r = Zt(t, e);
      return r.x > Xt || r.x < 0 || r.y > wt || r.y < 0 || hr(t, e)
        ? !1
        : f.filter((s, c) =>
            t.x === s.x && t.y === s.y
              ? !1
              : o.includes(c)
              ? tt(t, e, s, s.intent)
              : vr(t, e, s)
              ? s.intent === e || s.intent === 5
                ? tt(t, e, s)
                  ? Ot(s, e, [...o, c])
                    ? ((s.next = s.intent = e), !1)
                    : ((s.next = s.intent = 5), !0)
                  : !1
                : Ot(s, s.intent, [...o, c])
                ? ((s.next = s.intent), tt(t, e, s, s.intent))
                : tt(t, e, s)
                ? Ot(s, e, [...o, c])
                  ? ((s.next = s.intent = e), !1)
                  : ((s.next = s.intent = 5), tt(t, e, s))
                : !1
              : !1
          ).length === 0;
    },
    Hr = (t) => {
      switch (t.next) {
        case 5:
          break;
        case 0:
          t.y++;
          break;
        case 1.57079:
          t.x++;
          break;
        case 3.14159:
          t.y--;
          break;
        case 4.71238:
          t.x--;
      }
      t.next = 5;
    },
    Xr = (t, e) => {
      let o = [],
        r = f.filter(
          (s, c) =>
            s.type === 0 &&
            (Nt(t, 0, s) ||
              Nt(t, 1.57079, s) ||
              Nt(t, 3.14159, s) ||
              Nt(t, 4.71238, s)) &&
            o.push(c)
        ),
        n = Pr([...r, t]);
      return (n.type = 0), { mg: n, ids: [...o, e] };
    },
    Qe = () => {
      f.map(yr),
        f.map((t, e) => {
          Ot(t, t.intent, [e]) ? (t.next = t.intent) : (t.next = 5);
        });
    },
    wr = () => {
      let t = [],
        e = [];
      f.map((o, r) => {
        if (o.type !== 1 || t.includes(r) || !qe(o.x, o.y)) return;
        let { mg: n, ids: s } = Xr(o, r);
        t.push(...s), e.push(n);
      }),
        (f = f.filter((o, r) => !t.includes(r))),
        f.push(...e);
    },
    Vr = (t, e, o) =>
      t >= o.x &&
      t < o.x + N(o) &&
      e >= o.y &&
      e < o.y + O(o) &&
      o.grid[e - o.y][t - o.x] === 1,
    Wr = () => {
      let t = [],
        e = [];
      to().map((o) => {
        f.map((r, n) => {
          Vr(o.x, o.y, r) && (t.push(n), e.push(...Dr(r, o.x, o.y)));
        });
      }),
        (f = f.filter((o, r) => !t.includes(r))),
        f.push(...e);
    },
    kr = () => {
      let t = gt(),
        e = (r, n) => t.some((s) => s.x === r && s.y === n),
        o = 0;
      return (
        t.map((r) => {
          f.map((n, s) => {
            if (n.type !== 0 || !w(n.x, n.y, N(n), O(n), r.x, r.y, 1, 1))
              return !1;
            n.grid.every((c, x) =>
              c.every((E, T) => (E === 0 ? !0 : e(n.x + T, n.y + x)))
            ) &&
              je(n) === gt().length &&
              (f.splice(s, 1), (o += je(n)));
          });
        }),
        o
      );
    },
    Je = () => (f.map(Hr), wr(), Wr(), kr()),
    Jt = () => {
      f = [];
    },
    $e = (t) => {
      f.map((e) => Ur(e, t));
    };
  var ot = (t, e) => {
    let o = t[e],
      r = {
        state: e,
        run: (...n) => {
          let s = o(...n);
          typeof s == "function"
            ? (o = s)
            : s !== void 0 && ((o = t[s]), (r.state = s));
        },
        reset: (n) => {
          (o = t[n]), (r.state = n);
        },
      };
    return r;
  };
  var Yr = (t) => t;
  var Kr = (t, e, o) => t + (e - t) * o;
  var oo = (t) => {
      let e = 0;
      return (o) => ((e += o) > t ? ((e = 0), !0) : !1);
    },
    ro = (t, e, o = 1, r = Yr) => {
      let n = 0,
        s = {
          val: t,
          done: !1,
          step(c) {
            return s.done
              ? ((s.val = e), s.val)
              : ((s.done = n >= o),
                (n += c),
                (s.val = Kr(t, e, r(n / o))),
                s.val);
          },
          reset: () => ((n = 0), (s.val = t), (s.done = !1)),
        };
      return s;
    };
  var dt = [
      "03dz0304dz0504dz0604az0204bw0704bw0804bw0904fw0404",
      "04az0204bw0604bw0704bw0804bw0904",
      "03az0303bw0505bw0605bw0705",
      "03aw0303bw0504bw0503bw0505",
      "02cw0503az0303bw0704bw0703",
      "01az0303bw0505",
      "04aw0403bw0604bw0603",
    ],
    jr = { v: 5, w: 0, x: 4.71238, y: 3.14159, z: 1.57079 },
    zr = { [5]: "v", [0]: "w", [4.71238]: "x", [3.14159]: "y", [1.57079]: "z" },
    Zr = { a: 3, b: 4, c: 1, d: 0, e: 2, f: 5, g: 6 },
    gr = {
      [3]: "a",
      [4]: "b",
      [1]: "c",
      [0]: "d",
      [2]: "e",
      [5]: "f",
      [6]: "g",
    },
    qt = (t) => {
      let e = [],
        o = 0,
        r = parseInt(t[o]),
        n = 0;
      for (; (n = parseInt(t[++o])); ) r = 10 * r + n;
      for (; o < t.length; ) {
        let s = Zr[t[o]],
          c = jr[t[++o]],
          x = parseInt(t.slice(++o, o + 2));
        o += 2;
        let E = parseInt(t.slice(o, o + 2));
        (o += 2), e.push({ x, y: E, type: s, dir: c });
      }
      return { spawnCount: r, operators: e };
    },
    $t = (t) => (t < 10 ? "0" : "") + t,
    no = (t) => {
      let e = $t(t.spawnCount);
      for (let o of t.operators)
        e += gr[o.type] + zr[o.dir] + $t(o.x) + $t(o.y);
      return e;
    };
  var te = "js-13k-22-cryonics-inc",
    so = () => {
      let t = localStorage.getItem(te),
        e = {};
      try {
        e = JSON.parse(t) || {};
      } finally {
        return e;
      }
    },
    Qr = (t) => {
      localStorage.setItem(te, JSON.stringify(t));
    },
    co = (t, e, o) => {
      let r = so();
      (r[t] = [e, o]), Qr(r);
    },
    _o = (t) => {
      let o = so()[t];
      try {
        let [r, n] = o;
        return [r, n];
      } catch (r) {
        return [];
      }
    },
    xo = () => !localStorage.getItem(te);
  var a = {
      remainingSpawns: 0,
      curLevelSpawns: 0,
      completedObjs: 0,
      activeLevel: null,
      stepTime: 0,
    },
    Eo = () => {
      (a.remainingSpawns = a.curLevelSpawns),
        ct(a.curLevelSpawns - a.completedObjs),
        (a.completedObjs = 0);
    },
    Jr = oo(300),
    rt = ro(0, 1, 900),
    $r = ot(
      {
        [0]: (t) => {
          if (Jr(t)) {
            if (a.remainingSpawns > 0) {
              let e = Ao(a.remainingSpawns);
              a.remainingSpawns -= e;
            }
            return st(), Qe(), 1;
          }
        },
        [1]: (t) => {
          if ((rt.step(t), rt.done)) {
            rt.reset();
            let e = Je();
            return (
              e && (a.completedObjs += e),
              ct(a.curLevelSpawns - a.completedObjs),
              It(++a.stepTime),
              a.completedObjs === a.curLevelSpawns &&
                (co(a.activeLevel, io(), a.stepTime), mo()),
              0
            );
          }
        },
      },
      0
    ),
    nt = ot(
      {
        [1]: () => {
          let t = mt(1);
          return Ce(), Ve(), Ro(), t;
        },
        [2]: (t) => {
          $r.run(t);
          let e = mt(2);
          return e === 1 && (It((a.stepTime = 0)), Jt(), Eo()), e;
        },
        [3]: () => {
          let t = mt(3);
          return t === 1 && (It((a.stepTime = 0)), Jt(), Eo()), t;
        },
      },
      1
    ),
    po = () => {
      st(),
        St(!0),
        bt([], !0),
        nt.reset(1),
        (a.curLevelSpawns = 0),
        (a.stepTime = 0);
    },
    Lo = (t) => {
      (a.activeLevel = t), St();
      let e = qt(dt[t]);
      (a.remainingSpawns = e.spawnCount),
        (a.curLevelSpawns = e.spawnCount),
        (a.completedObjs = 0),
        (a.stepTime = 0),
        ct(a.curLevelSpawns - a.completedObjs),
        bt(e.operators),
        nt.reset(1);
    },
    ao = (t) => {
      (a.activeLevel = null), St();
      try {
        let e = qt(t);
        (a.remainingSpawns = e.spawnCount),
          (a.curLevelSpawns = e.spawnCount),
          (a.completedObjs = 0),
          (a.stepTime = 0),
          ct(a.curLevelSpawns - a.completedObjs),
          bt(e.operators),
          nt.reset(1);
      } catch (e) {
        alert("Invalid Level: " + e);
      }
    },
    To = (t) => {
      nt.run(t);
    },
    Go = (t) => {
      Ke(t), We(), lo(nt.state, rt.val), $e(rt.val);
    };
  var ut = (t, e = 1) => {
      switch (t.dir) {
        case 0:
          return { x: t.x, y: t.y + e };
        case 1.57079:
          return { x: t.x + e, y: t.y };
        case 3.14159:
          return { x: t.x, y: t.y - e };
        case 4.71238:
          return { x: t.x - e, y: t.y };
      }
    },
    So = (t, e, o) => {
      if (t.data) return !1;
      let r = ut(t),
        n = r.x === e && r.y === o;
      return n && (t.data = !0), n;
    },
    No = (t, e, o) => {
      let r = t.x === e && t.y === o;
      if (t.data) {
        let n = ut(t),
          s = n.x === e && n.y === o;
        return r || s;
      }
      return r;
    };
  var V = [],
    h = [],
    v = [],
    k = [],
    Y = [],
    K = [],
    j = [],
    p = {
      selectedOperator: 0,
      showHoverOpShadow: !1,
      showCellEditBtns: !1,
      lastEditPos: { x: -5, y: -5 },
      gridCheckType: null,
      opCount: 0,
    },
    io = () => p.opCount,
    et = (t, e) =>
      v.some((o) => o.x === t && o.y === e) ||
      k.some((o) => o.x === t && o.y === e) ||
      h.some((o) => No(o, t, e)),
    qe = (t, e) => Y.some((o) => o.x === t && o.y === e),
    to = () => K.map((t) => ({ x: t.x, y: t.y })),
    gt = () => j.map((t) => ({ x: t.x, y: t.y })),
    eo = (t, e) => {
      let o =
        V.find((r) => r.x === t && r.y === e) ||
        v.find((r) => r.x === t && r.y === e) ||
        V.find((r) => r.x === t && r.y === e) ||
        h.find((r) => So(r, t, e));
      return o ? o.dir : 5;
    },
    ke = (t) => (p.selectedOperator = t),
    bt = (t, e) => {
      (V = []),
        (k = []),
        (h = []),
        (v = []),
        (j = []),
        (Y = []),
        (K = []),
        t.map((o) => {
          switch (o.type) {
            case 0:
              V.push(o);
              break;
            case 1:
              k.push(o);
              break;
            case 2:
              h.push(o);
              break;
            case 3:
              v.push(o);
              break;
            case 4:
              j.push(o);
              break;
            case 5:
              Y.push(o);
              break;
            case 6:
              K.push(o);
              break;
          }
        }),
        e
          ? ((p.selectedOperator = 1), (p.gridCheckType = qr))
          : ((p.selectedOperator = 0), (p.gridCheckType = bo)),
        Mt((p.opCount = 0));
    },
    Oo = () => [...V, ...k, ...h, ...v, ...j, ...Y, ...K],
    Io = (t, e, o, r) => {
      let n = { x: t, y: e, type: o, dir: r };
      switch (o) {
        case 1:
          k.push(n);
          break;
        case 0:
          V.push(n);
          break;
        case 2:
          h.push(n);
          break;
        case 3:
          v.push(n);
          break;
        case 5:
          Y.push(n);
          break;
        case 6:
          K.push(n);
          break;
        case 4:
          j.push(n);
          break;
      }
    },
    y = (t) =>
      t.some((e, o) => {
        if (e.x === u.x && e.y === u.y)
          return (
            R.s &&
              (u.leftHalf
                ? (e.dir = Be(e.dir))
                : (t.splice(o, 1), Mt(--p.opCount))),
            (p.showHoverOpShadow = !1),
            (p.showCellEditBtns = !0)
          );
      }),
    ee = (t) =>
      t.some((e) => {
        if (e.x === u.x && e.y === u.y)
          return (p.showHoverOpShadow = !1), (p.showCellEditBtns = !1), !0;
      }),
    bo = () => {
      u.isInRange
        ? ((p.showHoverOpShadow = !0),
          (p.showCellEditBtns = !0),
          ee(v) ||
            ee(j) ||
            ee(k) ||
            y(V) ||
            y(h) ||
            y(Y) ||
            y(K) ||
            (p.showCellEditBtns = !1),
          R.s &&
            p.showHoverOpShadow &&
            (Mt(++p.opCount), Io(u.x, u.y, p.selectedOperator, 0)))
        : ((p.showHoverOpShadow = !1), (p.showCellEditBtns = !1));
    },
    qr = () => {
      u.isInRange
        ? ((p.showHoverOpShadow = !0),
          (p.showCellEditBtns = !0),
          y(v) ||
            y(j) ||
            y(k) ||
            y(V) ||
            y(h) ||
            y(Y) ||
            y(K) ||
            (p.showCellEditBtns = !1),
          R.s && p.showHoverOpShadow && Io(u.x, u.y, p.selectedOperator, 0))
        : ((p.showHoverOpShadow = !1), (p.showCellEditBtns = !1));
    };
  p.gridCheckType = bo;
  var Ro = () => {
      p.gridCheckType();
    },
    Ao = (t) => {
      let e = 0;
      for (let o = 0; o < Math.min(t, v.length); o++) {
        let r = v[o];
        ge(r.x, r.y) && (Ze(r.x, r.y, r.dir), e++);
      }
      return e;
    },
    st = () => {
      h.map((t) => (t.data = !1));
    },
    _t = null,
    xt = null,
    Ct = null,
    uo = null,
    Et = null,
    pt = null,
    Lt = null,
    Co = null,
    Mo = null,
    at = null,
    re = null,
    H = {},
    J = {},
    oe = {};
  setTimeout(() => {
    (_t = C(M("âŸ°", 100))),
      (xt = C(M("ðŸ›‘", 100))),
      (Ct = C(M("ðŸ”³", 100))),
      (uo = C(M("â†¥", 220))),
      (Et = C(M("ðŸ”·", 100))),
      (pt = C(M("â—‡", 100))),
      (Lt = C(M("ðŸ”˜", 100))),
      (Co = C(M("ðŸ”ƒ", 220))),
      (Mo = C(M("âŽ", 220))),
      (at = C(M("â¬†", 100))),
      (re = C(M("â–", 100))),
      (H[0] = _t),
      (H[2] = at),
      (H[1] = xt),
      (H[3] = Ct),
      (H[5] = Et),
      (H[6] = pt),
      (H[4] = Lt),
      (oe[1] = xt),
      (oe[3] = Ct),
      (oe[4] = Lt),
      (J[0] = _t),
      (J[2] = at),
      (J[5] = Et),
      (J[6] = pt);
  }, 100);
  var Z = (t, e) => {
      t === u.x && e === u.y && ((p.lastEditPos.x = t), (p.lastEditPos.y = e));
    },
    tn = (t) => {
      Z(t.x, t.y), xt.o(t.x, t.y, -0.02, 1, 1, t.dir);
    },
    en = (t) => {
      Z(t.x, t.y),
        Ct.t().o(t.x, t.y, -0.02, 1, 1, t.dir),
        uo.t().o(t.x, t.y, -0.02, 1, 1, t.dir);
    },
    on = (t) => {
      Et.o(t.x, t.y, -0.04, 1, 1, t.dir), Z(t.x, t.y);
    },
    rn = (t) => {
      pt.o(t.x, t.y, -0.04, 1, 1, t.dir), Z(t.x, t.y);
    },
    nn = (t) => {
      Lt.o(t.x, t.y, -0.04, 1, 1), Z(t.x, t.y);
    },
    sn = (t) => {
      _t.o(t.x, t.y, -0.04, 1, 1, t.dir), Z(t.x, t.y);
    },
    cn = (t) => {
      at.o(t.x, t.y, -0.02, 1, 1, t.dir), Z(t.x, t.y);
    },
    _n = (t, e) => {
      if (t.data) {
        let o = ut(t, e);
        re.t().o(o.x, o.y, -0.03, 1, 1, t.dir);
      }
    },
    lo = (t, e) => {
      _t.t(),
        V.map(sn),
        v.map(en),
        Et.t(),
        Y.map(on),
        pt.t(),
        K.map(rn),
        Lt.t(),
        j.map(nn),
        at.t(),
        h.map(cn),
        re.t(),
        h.map((o) => _n(o, e)),
        xt.t(),
        k.map(tn),
        t === 1 &&
          (p.showHoverOpShadow &&
            H[p.selectedOperator].t().o(u.x, u.y, -0.02, 1, 0.7),
          p.showCellEditBtns &&
            (Co.t().o(p.lastEditPos.x - 0.2, p.lastEditPos.y - 0.1, -0.01, 0.9),
            Mo.t().o(
              p.lastEditPos.x + 0.2,
              p.lastEditPos.y - 0.1,
              -0.01,
              0.9
            )));
    };
  var ne = ot(
      {
        [0]: () => {},
        [1]: (t) => {
          pe(), To(t);
        },
      },
      0
    ),
    Fo = (t) => {
      ne.run(t);
    },
    fo = (t) => {
      X.P(), Go(t);
    },
    se = () => ne.reset(1),
    Ft = () => ne.reset(0);
  var ft = document.getElementById("ui"),
    D = (...t) => {
      (ft.innerHTML = ""), ft.append(...t), (ft.style.display = "block");
    },
    Bo = () => (ft.style.display = "none"),
    ce = (t) => (t.style.opacity = "0"),
    _e = (t) => (t.style.opacity = "1"),
    Bt = () => {
      Bo();
      let t = _("div", { className: "btn pause", onclick: Po }, "II");
      D(
        t,
        _(
          "div",
          { id: "status", onclick: z },
          _("span", { id: "timestat", className: "stats" }, "ðŸ• -"),
          _("br"),
          _("span", { id: "nrgstat", className: "stats" }, "âš¡ -"),
          _("br"),
          _("span", { id: "facestat", className: "stats" }, "ðŸ˜´ -")
        )
      ),
        _e(t),
        se();
    },
    It = (t) => {
      setTimeout(() => {
        let e = document.getElementById("timestat");
        e && (e.innerHTML = `ðŸ• ${t != null ? t : "-"}`);
      }, 50);
    },
    Mt = (t) => {
      setTimeout(() => {
        let e = document.getElementById("nrgstat");
        e && (e.innerHTML = `âš¡ ${t != null ? t : "-"}`);
      }, 50);
    },
    ct = (t) => {
      setTimeout(() => {
        let e = document.getElementById("facestat");
        e && (e.innerHTML = `ðŸ˜´ ${t != null ? t : "-"}`);
      }, 50);
    },
    Uo = () => {
      let t = _(
        "div",
        { id: "bgscrn" },
        _("div", { className: "title" }, "CRYONICS INC."),
        _("div", { className: "btn start", onclick: z }, "START")
      );
      D(t);
    },
    xn = () => {
      Ft();
      let t = _("input", { type: "number", value: 1, className: "num" }),
        e = _(
          "div",
          { id: "bgscrn" },
          _("div", { className: "btn back", onclick: z }, "â†¼"),
          _("div", {}, "ENTER UNIT COUNT"),
          t,
          _(
            "div",
            {
              className: "btn",
              onclick: () => {
                let o = no({ operators: Oo(), spawnCount: t.value }),
                  r = _("input", { readOnly: !0, value: o });
                D(
                  _(
                    "div",
                    { id: "bgscrn" },
                    _("div", { className: "btn back", onclick: z }, "â†¼"),
                    _("div", { className: "subtitle" }, "LEVEL CREATED"),
                    r,
                    _(
                      "a",
                      {
                        className: "btn",
                        target: "_blank",
                        href: `https:`,
                      },
                      "SHARE ðŸ¦"
                    )
                  )
                ),
                  setTimeout(() => {
                    r.focus(), r.select();
                  }, 50);
              },
            },
            "CREATE"
          )
        );
      D(e), ce(e), setTimeout(() => t.focus(), 50), setTimeout(() => _e(e), 10);
    },
    En = () => {
      let t = _("input"),
        e = _(
          "div",
          { id: "bgscrn" },
          _("div", { className: "btn back", onclick: z }, "â†¼"),
          _("div", { className: "subtitle" }, "ENTER LEVEL DATA"),
          t,
          _(
            "div",
            {
              className: "btn",
              onclick: () => {
                ao(t.value), Bt();
              },
            },
            "START"
          )
        );
      D(e);
    },
    pn = () => {
      ce(document.getElementById("bgscrn")),
        Bo(),
        D(
          _("div", { className: "btn pause", onclick: Po }, "II"),
          _("div", { className: "btn pause", onclick: xn }, "âœ…")
        ),
        po(),
        se();
    },
    Ln = () => {
      let t = _(
        "div",
        { id: "bgscrn" },
        _("div", { className: "btn back", onclick: z }, "â†¼"),
        _("div", { className: "subtitle" }, "CUSTOM LEVELS"),
        _("div", { className: "btn", onclick: pn }, "LEVEL EDITOR"),
        _("div", { className: "btn", onclick: En }, "PLAY LEVEL")
      );
      D(t);
    },
    an = () => {
      D(
        _(
          "div",
          { id: "blurscrn", className: "instr", onclick: Bt },
          _("div", { className: "instrbox box1" }, "â· start/stop machines"),
          _("div", { className: "instrbox box2" }, "â¶ select machines"),
          _(
            "div",
            { className: "instrbox box3" },
            "â¸ place machines & move frozen bodies to cryochambers"
          ),
          _(
            "div",
            { className: "instrbox box4" },
            "(simply start the machines to complete this level)"
          )
        )
      );
    },
    Tn = () => {
      D(
        _(
          "div",
          { id: "blurscrn", onclick: an },
          _(
            "div",
            { className: "letter" },
            "From: Management",
            _("br"),
            _("br"),
            "To: EMPLOYEE_130847",
            _("br"),
            _("br"),
            "Welcome to your first day at Cryonics Inc.â„¢",
            _("br"),
            _("br"),
            `Your job is to ensure that all bodies are frozen & stored in cryochambers,
                so that people could one day be resurrected and be immortal.
                They're already vitrified, and we help them cheat death.`,
            _("br"),
            _("br"),
            "Have fun in your new role!",
            _("br"),
            _("br"),
            " (CLICK TO CONTINUE) "
          )
        )
      );
    },
    Gn = () => {
      xo() ? Tn() : Bt();
    },
    z = () => {
      let t = _(
        "div",
        { id: "bgscrn" },
        _("div", { className: "btn cstm", onclick: Ln }, "CUSTOM LEVELS"),
        _("div", { className: "subtitle" }, "LEVELS"),
        _(
          "div",
          { className: "levels" },
          ...dt.map((e, o) => {
            let [r, n] = _o(o);
            return _(
              "div",
              {
                className:
                  "level btn " + (!isNaN(r) && !isNaN(n) ? "visited" : ""),
                onclick: () => {
                  st(), Lo(o), Gn();
                },
              },
              o + 1 + "",
              _("br"),
              _("span", { className: "stats" }, `ðŸ• ${n != null ? n : "-"}`),
              _("br"),
              _("span", { className: "stats" }, `âš¡ ${r != null ? r : "-"}`)
            );
          })
        )
      );
      D(t);
    },
    mo = () => {
      Ft();
      let t = _(
        "div",
        { id: "bgscrn" },
        _("div", { className: "subtitle" }, "LEVEL COMPLETE!"),
        _("div", { className: "btn", onclick: z }, "NEXT")
      );
      D(t);
    },
    Po = () => {
      Ft();
      let t = _(
        "div",
        { id: "blurscrn" },
        _("div", { className: "title" }, "PAUSED"),
        _("div", { className: "btn", onclick: Bt }, "RESUME"),
        _("div", { className: "btn", onclick: z }, "LEVELS")
      );
      D(t), ce(t), setTimeout(() => _e(t), 10);
    };
  setTimeout(() => xe(Fo, fo), 150);
  Uo();
})();
