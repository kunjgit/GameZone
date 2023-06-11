function H() {
  this.A = function (e) {
    for (var t = 0; 24 > t; t++) this[String.fromCharCode(97 + t)] = e[t] || 0;
    0.01 > this.c && (this.c = 0.01),
      0.18 > (e = this.b + this.c + this.e) &&
        ((e = 0.18 / e), (this.b *= e), (this.c *= e), (this.e *= e));
  };
}
AFRAME.registerComponent("button", {
  schema: {
    resetTime: { type: "number", default: null },
    pressed: { type: "boolean" },
  },
  init: function () {
    const e = this.el;
    console.log("button init"),
      e.addEventListener("click", (t) => {
        e.addState("pressed");
      }),
      e.addEventListener("stateadded", (t) => {
        "pressed" == t.detail &&
          (e.classList.remove("clickable"),
          e.emit("in"),
          this.data.resetTime >= 0 &&
            setTimeout(() => e.removeState("pressed"), this.data.resetTime));
      }),
      e.addEventListener("stateremoved", (t) => {
        "pressed" == t.detail && (e.classList.add("clickable"), e.emit("out"));
      });
  },
  update: function () {
    const e = this.el;
    console.log("button update"),
      setTimeout(() => {
        this.data.pressed ? e.addState("pressed") : e.removeState("pressed");
      }, 0);
  },
});
var U = new (function () {
  var e, t, n, i, s, o, a, r, c, l, u, d;
  (this.z = new H()),
    (this.reset = function () {
      var e = this.z;
      (i = 100 / (e.f * e.f + 0.001)),
        (s = 100 / (e.g * e.g + 0.001)),
        (o = 1 - 0.01 * e.h * e.h * e.h),
        (a = 1e-6 * -e.i * e.i * e.i),
        e.a || ((u = 0.5 - e.n / 2), (d = 5e-5 * -e.o)),
        (r = 1 + e.l * e.l * (0 < e.l ? -0.9 : 10)),
        (c = 0),
        (l = 1 == e.m ? 0 : 2e4 * (1 - e.m) * (1 - e.m) + 32);
    }),
    (this.C = function () {
      this.reset();
      var i = this.z;
      return (
        (e = 1e5 * i.b * i.b),
        (t = 1e5 * i.c * i.c),
        (n = 1e5 * i.e * i.e + 12),
        3 * (((e + t + n) / 3) | 0)
      );
    }),
    (this.B = function (m, b) {
      var f = 1 != (V = this.z).s || V.v,
        h = 0.1 * V.v * V.v,
        p = 1 + 3e-4 * V.w,
        v = 0.1 * V.s * V.s * V.s,
        y = 1 + 1e-4 * V.t,
        g = 1 != V.s,
        w = V.x * V.x,
        A = V.g,
        j = V.q || V.r,
        E = 0.2 * V.r * V.r * V.r,
        x = V.q * V.q * (0 > V.q ? -1020 : 1020),
        M = V.p ? 32 + ((2e4 * (1 - V.p) * (1 - V.p)) | 0) : 0,
        D = V.d,
        k = V.j / 2,
        T = 0.01 * V.k * V.k,
        S = V.a,
        L = e,
        H = 1 / e,
        R = 1 / t,
        z = 1 / n;
      0.8 < (V = (5 / (1 + 20 * V.u * V.u)) * (0.01 + v)) && (V = 0.8);
      for (
        var C,
          O,
          B,
          P,
          I,
          V = 1 - V,
          U = !1,
          q = 0,
          F = 0,
          G = 0,
          N = 0,
          W = 0,
          J = 0,
          K = 0,
          Q = 0,
          X = 0,
          Y = 0,
          Z = Array(1024),
          $ = Array(32),
          _ = Z.length;
        _--;

      )
        Z[_] = 0;
      for (_ = $.length; _--; ) $[_] = 2 * Math.random() - 1;
      for (_ = 0; _ < b; _++) {
        if (U) return _;
        if (
          (M && ++X >= M && ((X = 0), this.reset()),
          l && ++c >= l && ((l = 0), (i *= r)),
          (i *= o += a) > s && ((i = s), 0 < A && (U = !0)),
          (O = i),
          0 < k && ((Y += T), (O *= 1 + Math.sin(Y) * k)),
          8 > (O |= 0) && (O = 8),
          S || (0 > (u += d) ? (u = 0) : 0.5 < u && (u = 0.5)),
          ++F > L)
        )
          switch (((F = 0), ++q)) {
            case 1:
              L = t;
              break;
            case 2:
              L = n;
          }
        switch (q) {
          case 0:
            G = F * H;
            break;
          case 1:
            G = 1 + 2 * (1 - F * R) * D;
            break;
          case 2:
            G = 1 - F * z;
            break;
          case 3:
            (G = 0), (U = !0);
        }
        j && (0 > (B = 0 | (x += E)) ? (B = -B) : 1023 < B && (B = 1023)),
          f && p && (1e-5 > (h *= p) ? (h = 1e-5) : 0.1 < h && (h = 0.1)),
          (I = 0);
        for (var ee = 8; ee--; ) {
          if (++K >= O && ((K %= O), 3 == S))
            for (C = $.length; C--; ) $[C] = 2 * Math.random() - 1;
          switch (S) {
            case 0:
              P = K / O < u ? 0.5 : -0.5;
              break;
            case 1:
              P = 1 - (K / O) * 2;
              break;
            case 2:
              P =
                0.225 *
                  ((0 >
                  (P =
                    1.27323954 *
                      (P = 6.28318531 * (0.5 < (P = K / O) ? P - 1 : P)) +
                    0.405284735 * P * P * (0 > P ? 1 : -1))
                    ? -1
                    : 1) *
                    P *
                    P -
                    P) +
                P;
              break;
            case 3:
              P = $[Math.abs(((32 * K) / O) | 0)];
          }
          f &&
            ((C = J),
            0 > (v *= y) ? (v = 0) : 0.1 < v && (v = 0.1),
            g ? ((W += (P - J) * v), (W *= V)) : ((J = P), (W = 0)),
            (N += (J += W) - C),
            (P = N *= 1 - h)),
            j && ((Z[Q % 1024] = P), (P += Z[(Q - B + 1024) % 1024]), Q++),
            (I += P);
        }
        (I *= 0.125 * G * w),
          (m[_] = 1 <= I ? 32767 : -1 >= I ? -32768 : (32767 * I) | 0);
      }
      return b;
    });
})();
(window.jsfxr = function (e) {
  U.z.A(e);
  var t = U.C();
  (e = new Uint8Array(4 * (((t + 1) / 2) | 0) + 44)),
    (t = 2 * U.B(new Uint16Array(e.buffer, 44), t));
  ((n = new Uint32Array(e.buffer, 0, 44))[0] = 1179011410),
    (n[1] = t + 36),
    (n[2] = 1163280727),
    (n[3] = 544501094),
    (n[4] = 16),
    (n[5] = 65537),
    (n[6] = 44100),
    (n[7] = 88200),
    (n[8] = 1048578),
    (n[9] = 1635017060),
    (n[10] = t);
  t += 44;
  for (var n = 0, i = "data:audio/wav;base64,"; n < t; n += 3) {
    var s = (e[n] << 16) | (e[n + 1] << 8) | e[n + 2];
    i =
      i +
      ("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
        s >> 18
      ] +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
          (s >> 12) & 63
        ] +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
          (s >> 6) & 63
        ] +
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[
          63 & s
        ]);
  }
  return i;
}),
  AFRAME.registerComponent("logic", {
    init: function () {
      console.log("logic init");
      const e = this.el,
        t = (t) => e.querySelector(t);
      e.addEventListener("touchstart", (e) => {
        navigator.vibrate(10);
      }),
        (e.renderer.localClippingEnabled = !0);
      var n = [
        new THREE.Plane(new THREE.Vector3(0, 0, 1), 0.74),
        new THREE.Plane(new THREE.Vector3(0, -1, 0), 1.74),
        new THREE.Plane(new THREE.Vector3(0, 0, -1), 0.74),
        new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.77),
      ];
      const i = t("#mask"),
        s = t("#game"),
        o = t("#startMenu"),
        a = t("#playButton"),
        r = t("#cursor");
      function c() {
        (b.nodes = []),
          (b.links = []),
          p("start", 0, 0, 8, "yellow", !0, [], "main1"),
          (b.nodes[0].scanned = !0),
          p("nav-start", 2, 2, 4, "grey", !1, [2, 3, 4, 5], "navmain1"),
          (b.nodes[1].scanned = !0),
          p("2", 3, -1, 4, "orange", !1, [], "out1"),
          p("3", 2, -3, 5, "yellow", !0, [], "main2"),
          p("4", 2.5, -6, 7, "yellow", !0, [], "main1"),
          p(
            "nav-4",
            3,
            -8,
            4,
            "grey",
            !1,
            [6, 7, 8, 21, 22, 23, 24, 25],
            "navmain2"
          ),
          p("6", 0, -6.5, 3, "orange", !1, [], "out2"),
          p("7", 0, -10, 6, "yellow", !0, [], "main3"),
          p("nav-7", 1.5, -12, 4, "grey", !1, [9, 10, 11, 12, 13], "navmain2"),
          p("9", -1.5, -14, 4, "orange", !1, [], "out3"),
          p("10", -5, -14, 8, "yellow", !0, [], "main2"),
          p("11", -3, -17, 6, "yellow", !0, [], "main1"),
          p("nav-11", -1, -19, 4, "grey", !1, [14, 15], "navmain1"),
          p("13", 1, -16, 4, "orange", !1, [], "out2"),
          p("14", 6, -15, 9, "yellow", !0, [], "main1"),
          p("nav-14", 8, -14, 4, "grey", !1, [16, 17, 18, 27, 28], "navmain2"),
          p("16", 10, -15.5, 3.5, "orange", !1, [], "out1"),
          p("17", 9, -18, 7, "yellow", !0, [], "main3"),
          p("nav-17", 11, -17.5, 4, "grey", !1, [19, 20], "navmain2"),
          p("19", 13, -19, 4, "orange", !1, [], "out2"),
          p("finish", 16, -15, 3, "lightblue", !1, [], "finish"),
          p("21", 6.5, -3, 3, "orange", !1, [], "out1"),
          p("22", 7, -6, 5, "yellow", !0, [], "main1"),
          p("23", 9, -4.5, 4, "orange", !1, [], "out3"),
          p("24", 6, -9, 3.5, "orange", !1, [], "out2"),
          p("nav-24", 6, -10.5, 4, "grey", !1, [7, 8, 26, 27, 28], "navout1"),
          p("26", 10, -8, 7, "yellow", !0, [], "main1"),
          p("27", 8, -12, 5, "orange", !1, [], "out1"),
          p(
            "nav-27",
            9.5,
            -11.5,
            4,
            "grey",
            !1,
            [14, 15, 29, 30, 31],
            "navout2"
          ),
          p("29", 11, -12, 9, "yellow", !0, [], "main3"),
          p("30", 14, -10, 4, "orange", 2, [], "out2"),
          p("nav-30", 14, -8, 4, "grey", !1, [32, 20], "navout1"),
          p("32", 17, -11, 7, "yellow", !0, [], "main2"),
          v(["start", "nav-start"], 0.1),
          v(["start", "2"], 0.4),
          v(["2", "3"], 0.3),
          v(["3", "4"], 0.4),
          v(["4", "nav-4"], 0.2),
          v(["4", "6"], 0.3),
          v(["6", "7"], 0.4),
          v(["7", "nav-7"], 0.15),
          v(["7", "9"], 0.5),
          v(["9", "10"], 0.2),
          v(["9", "11"], 0.4),
          v(["11", "13"], 0.3),
          v(["9", "13"], 0.3),
          v(["11", "nav-11"], 0.2),
          v(["13", "14"], 0.5),
          v(["14", "nav-14"], 0.05),
          v(["14", "16"], 0.3),
          v(["16", "17"], 0.3),
          v(["17", "nav-17"], 0.1),
          v(["17", "19"], 0.4),
          v(["19", "finish"], 0.4),
          v(["4", "22"], 0.4),
          v(["22", "21"], 0.3),
          v(["21", "23"], 0.3),
          v(["22", "23"], 0.3),
          v(["22", "24"], 0.35),
          v(["24", "nav-24"], 0.1),
          v(["24", "7"], 0.7),
          v(["24", "26"], 0.5),
          v(["24", "27"], 0.4),
          v(["26", "27"], 0.5),
          v(["27", "nav-27"], 0.1),
          v(["27", "14"], 0.4),
          v(["27", "29"], 0.3),
          v(["29", "30"], 0.3),
          v(["29", "16"], 0.5),
          v(["30", "nav-30"], 0.1),
          v(["30", "32"], 0.4),
          v(["32", "finish"], 0.6),
          (y.location = b.nodes[0]),
          (y.target = null),
          (y.fuel = 1),
          (y.scoopDeployed = !1),
          (S = { x: 0, y: 0 });
        for (let e of [
          "main1",
          "main2",
          "main3",
          "out1",
          "out2",
          "out3",
          "navmain1",
          "navmain2",
          "navout1",
          "navout2",
          "finish",
        ])
          t(`#${e}`).setAttribute("visible", !1);
        t(`#${y.location.system}`).setAttribute("visible", !0),
          L(),
          H(),
          R(),
          M(E, y.fuel),
          M(x, 0);
      }
      s.setAttribute("visible", !1),
        o.setAttribute("visible", !0),
        r.setAttribute("raycaster", { objects: "#startMenu .clickable" }),
        a.addEventListener("click", (e) => {
          sound.start.play(),
            i.emit("fadeOut"),
            r.setAttribute("raycaster", { objects: "#game .clickable" }),
            setTimeout(() => {
              c(),
                o.setAttribute("visible", !1),
                s.setAttribute("visible", !0),
                i.emit("fadeIn");
            }, 2e3);
        });
      const l = t("#gameOverMenu");
      t("#retryButton").addEventListener("click", (e) => {
        sound.start.play(),
          i.emit("fadeOut"),
          r.setAttribute("raycaster", { objects: "#game .clickable" }),
          setTimeout(() => {
            l.setAttribute("visible", !1),
              s.setAttribute("visible", !0),
              i.emit("fadeIn");
          }, 2e3);
      });
      const u = t("#winMenu"),
        d = t("#playAgainButton"),
        m = t("#winText");
      d.addEventListener("click", (e) => {
        sound.start.play(),
          i.emit("fadeOut"),
          r.setAttribute("raycaster", { objects: "#game .clickable" }),
          setTimeout(() => {
            u.setAttribute("visible", !1),
              s.setAttribute("visible", !0),
              i.emit("fadeIn");
          }, 2e3);
      });
      let b = { nodes: [], links: [] };
      const f = (e) => b.nodes.find((t) => t.name === e),
        h = (e, t) =>
          b.links.find(
            (n) => n.nodes.includes(e.name) && n.nodes.includes(t.name)
          ),
        p = (e, t, n, i, s, o, a, r) =>
          b.nodes.push({
            name: e,
            x: t,
            y: n,
            size: i,
            color: s,
            scanned: !1,
            fuel: o,
            reveals: a,
            system: r,
          }),
        v = (e, t) => b.links.push({ nodes: e, cost: t });
      const y = {
        location: b.nodes[0],
        target: null,
        fuel: 1,
        scoopDeployed: !1,
      };
      function g(e, t) {
        (y.target = e), R(), j(), M(x, t);
      }
      function w(e, n) {
        (y.location = e),
          g(null, 0),
          (y.fuel -= n),
          (S = { x: -e.x / 10, y: -e.y / 10 });
        for (let e of [
          "main1",
          "main2",
          "main3",
          "out1",
          "out2",
          "out3",
          "navmain1",
          "navmain2",
          "navout1",
          "navout2",
          "finish",
        ])
          t(`#${e}`).setAttribute("visible", !1);
        t(`#${y.location.system}`).setAttribute("visible", !0),
          L(),
          H(),
          R(),
          M(E, y.fuel),
          y.fuel <= 0 &&
            (sound.gameOver.play(),
            i.emit("fadeOut"),
            r.setAttribute("raycaster", {
              objects: "#gameOverMenu .clickable",
            }),
            setTimeout(() => {
              c(),
                s.setAttribute("visible", !1),
                l.setAttribute("visible", !0),
                i.emit("fadeIn");
            }, 1500)),
          "finish" === y.location.name &&
            (sound.win.play(),
            m.setAttribute("visible", !0),
            setTimeout(() => {
              i.emit("fadeOut"),
                r.setAttribute("raycaster", { objects: "#winMenu .clickable" }),
                setTimeout(() => {
                  c(),
                    s.setAttribute("visible", !1),
                    m.setAttribute("visible", !1),
                    u.setAttribute("visible", !0),
                    i.emit("fadeIn");
                }, 1500);
            }, 1e4));
      }
      this.updateFuel = (e) => {
        y.scoopDeployed &&
          y.location.fuel &&
          ((y.fuel = Math.min(y.fuel + e, 1)), M(E, y.fuel));
      };
      const A = t("#launchButton");
      function j() {
        y.target && !y.scoopDeployed
          ? A.removeState("pressed")
          : A.addState("pressed");
      }
      A.addEventListener("click", (e) =>
        (function () {
          if (y.target) {
            const e = h(y.target, y.location).cost;
            sound.jumpStart.play(),
              setTimeout(() => {
                w(y.target, e), j(), sound.jumpEnd.play();
              }, 2e3);
          }
        })()
      ),
        t("#scoopButton").addEventListener(
          "click",
          (e) => (
            (y.scoopDeployed = !y.scoopDeployed),
            y.scoopDeployed ? sound.fuel.play() : sound.fuel.pause(),
            E.setAttribute(
              "color",
              y.scoopDeployed ? (y.location.fuel ? "yellow" : "red") : "green"
            ),
            void j()
          )
        ),
        t("#scanButton").addEventListener("click", (e) =>
          (function () {
            const e = y.location.name,
              t = f(e).reveals;
            if (t.length > 0) {
              sound.scan.play();
              for (let e of t) b.nodes[e].scanned = !0;
            } else sound.error.play();
            L();
          })()
        );
      const E = t("#fuelGuage"),
        x = t("#jumpCostGuage");
      function M(e, t) {
        e.setAttribute("height", 0.5 * t),
          (e.object3D.position.y = 0.25 * (t - 1)),
          (e.object3D.visible = t > 0);
      }
      const D = t("#mapObjects"),
        k = t("#location"),
        T = t("#target");
      let S = { x: 0, y: 0 };
      function L() {
        D.innerHTML = "";
        for (let e of b.nodes)
          if (e.scanned) {
            let t;
            const i = e.size / 100;
            e.name.startsWith("nav-")
              ? (t = document.createElement("a-triangle")).setAttribute(
                  "scale",
                  { x: 1.5 * i, y: 1.5 * i, z: 1 }
                )
              : (t = document.createElement("a-circle")).setAttribute(
                  "geometry",
                  { radius: i }
                ),
              t.setAttribute("color", e.color),
              t.setAttribute("position", {
                x: e.x / 10 + S.x,
                y: e.y / 10 + S.y,
                z: 0.002,
              }),
              (t.className = "clickable"),
              t.addEventListener("click", (t) => {
                const n = b.links.find(
                  (t) =>
                    t.nodes.includes(e.name) &&
                    t.nodes.includes(y.location.name)
                );
                y.location != e && n
                  ? (sound.select.play(), g(e, n.cost))
                  : sound.error.play();
              }),
              t.addEventListener("loaded", (e) => {
                (t.object3DMap.mesh.material.clippingPlanes = n),
                  (t.object3DMap.mesh.material.clipIntersection = !1),
                  (t.object3DMap.mesh.material.clipShadows = !0);
              }),
              D.appendChild(t);
          }
        for (let e of b.links) {
          const t = f(e.nodes[0]),
            i = f(e.nodes[1]);
          if (t.scanned && i.scanned) {
            const e = document.createElement("a-entity"),
              s = (i.x - t.x) / 10,
              o = (i.y - t.y) / 10;
            e.setAttribute("geometry", {
              primitive: "plane",
              width: 0.01,
              height: Math.sqrt(s * s + o * o),
            }),
              e.object3D.position.set(
                t.x / 10 + s / 2 + S.x,
                t.y / 10 + o / 2 + S.y,
                0.001
              ),
              (e.object3D.rotation.z = Math.atan2(o, s) - Math.PI / 2),
              e.setAttribute("material", { color: "#fff" }),
              e.addEventListener("loaded", (t) => {
                (e.object3DMap.mesh.material.clippingPlanes = n),
                  (e.object3DMap.mesh.material.clipIntersection = !1),
                  (e.object3DMap.mesh.material.clipShadows = !0);
              }),
              D.appendChild(e);
          }
        }
      }
      function H() {
        const e = y.location;
        if (e) {
          k.object3D.position.set(e.x / 10, e.y / 10, 0.003),
            (k.object3D.visible = !0);
          const t = Math.max(e.size / 100 + 0.01, 0.03),
            n = t - 0.01;
          k.children[0].object3D.position.set(n + S.x, t + S.y, 0),
            k.children[1].object3D.position.set(t + S.x, n + S.y, 0),
            k.children[2].object3D.position.set(n + S.x, -t + S.y, 0),
            k.children[3].object3D.position.set(t + S.x, -n + S.y, 0),
            k.children[4].object3D.position.set(-n + S.x, -t + S.y, 0),
            k.children[5].object3D.position.set(-t + S.x, -n + S.y, 0),
            k.children[6].object3D.position.set(-n + S.x, t + S.y, 0),
            k.children[7].object3D.position.set(-t + S.x, n + S.y, 0);
        } else k.object3D.visible = !1;
      }
      function R() {
        const e = y.target;
        if (e) {
          T.object3D.position.set(e.x / 10, e.y / 10, 0.003),
            (T.object3D.visible = !0);
          const t = Math.max(e.size / 100 + 0.02, 0.03);
          T.children[0].object3D.position.set(0 + S.x, t + S.y, 0),
            T.children[1].object3D.position.set(t + S.x, 0 + S.y, 0),
            T.children[2].object3D.position.set(0 + S.x, -t + S.y, 0),
            T.children[3].object3D.position.set(-t + S.x, 0 + S.y, 0);
        } else T.object3D.visible = !1;
      }
      L(), H(), R(), M(E, y.fuel), M(x, 0);
    },
    tick: function (e, t) {
      this.updateFuel((0.1 * t) / 1e3);
    },
  });
const sound = {
  select: new Audio(
    jsfxr([
      0,
      ,
      0.1562,
      ,
      0.135,
      0.5,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      0.23,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      0.1,
      ,
      0.2,
    ])
  ),
  error: new Audio(
    jsfxr([
      0,
      ,
      0.1562,
      ,
      0.135,
      0.16,
      ,
      ,
      -0.3399,
      ,
      ,
      ,
      ,
      0.23,
      ,
      ,
      ,
      ,
      1,
      ,
      ,
      0.1,
      ,
      0.2,
    ])
  ),
  start: new Audio(
    jsfxr([
      0,
      ,
      0.0452,
      0.3814,
      0.48,
      0.6154,
      ,
      ,
      ,
      ,
      ,
      0.376,
      0.6638,
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
      0.2,
    ])
  ),
  fuel: new Audio(
    jsfxr([
      2,
      0.62,
      0.42,
      ,
      0.63,
      0.21,
      ,
      ,
      ,
      0.25,
      0.62,
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
      0.12,
    ])
  ),
  jumpStart: new Audio(
    jsfxr([
      3,
      0.1,
      1,
      0.1444,
      0.36,
      0.5,
      ,
      -0.0357,
      0.1,
      0.1817,
      -0.7749,
      ,
      ,
      -0.7661,
      ,
      ,
      0.34,
      0.4399,
      0.13,
      0.06,
      -0.9631,
      0.16,
      ,
      0.2,
    ])
  ),
  jumpEnd: new Audio(
    jsfxr([
      0,
      0.79,
      0.01,
      0.2072,
      ,
      0.3794,
      0.04,
      -0.0025,
      -0.1623,
      ,
      ,
      -0.0234,
      ,
      0.9101,
      -0.3932,
      ,
      -0.0036,
      -0.7505,
      0.9007,
      0.0151,
      ,
      0.0066,
      ,
      0.2,
    ])
  ),
  scan: new Audio(
    jsfxr([
      1,
      ,
      0.2886,
      ,
      0.3707,
      0.3593,
      ,
      0.4056,
      ,
      ,
      ,
      ,
      ,
      ,
      ,
      0.5265,
      ,
      ,
      1,
      ,
      ,
      ,
      ,
      0.2,
    ])
  ),
  gameOver: new Audio(
    jsfxr([
      3,
      0.1252,
      0.0515,
      0.2237,
      0.9898,
      0.0193,
      ,
      0.009,
      -4e-4,
      0.0195,
      0.1324,
      -0.5,
      0.1579,
      ,
      ,
      ,
      -0.0919,
      0.1079,
      0.9937,
      -0.003,
      -0.2091,
      1e-4,
      0.1011,
      0.2,
    ])
  ),
  win: new Audio(
    jsfxr([
      0,
      0.11,
      0.76,
      0.4951,
      0.53,
      0.54,
      ,
      ,
      0.06,
      0.03,
      0.54,
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
      0.2,
    ])
  ),
};
(sound.fuel.loop = !0),
  AFRAME.registerComponent("stars", {
    update: function () {
      const e = new THREE.Geometry();
      for (; e.vertices.length < 1e4; )
        e.vertices.push(this.randomVectorBetweenSpheres(200, 500));
      const t = new THREE.PointsMaterial();
      this.el.setObject3D("stars", new THREE.Points(e, t));
    },
    randomVectorBetweenSpheres: function (e, t) {
      const n = Math.floor(Math.random() * (e + t - e + 1) + e);
      return this.randomSphereSurfaceVector(n);
    },
    randomSphereSurfaceVector: function (e) {
      const t = 2 * Math.PI * Math.random(),
        n = Math.acos(2 * Math.random() - 1),
        i = e * Math.sin(n) * Math.cos(t),
        s = e * Math.sin(n) * Math.sin(t),
        o = e * Math.cos(n);
      return new THREE.Vector3(i, s, o);
    },
  });
//# sourceMappingURL=script.min.js.map
