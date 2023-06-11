function Bridge(t) {
  const e = [243, 65],
    n = +new Date(),
    r = new Anim(
      [
        [[30, 59, 59, 60, 60, 68, 29, 67], "", "brown2", 1],
        [[62, 60, 61, 68, 85, 70, 85, 61], "", "brown1", 1],
        [[87, 62, 87, 70, 112, 72, 112, 63], "", "brown2", 1],
        [[114, 72, 138, 73, 138, 65, 115, 64], "", "brown1", 1],
        [[140, 65, 141, 73, 163, 71, 162, 63], "", "brown3", 1],
        [[165, 62, 167, 70, 191, 66, 191, 59], "", "brown2", 1],
        [[194, 59, 194, 66, 220, 64, 219, 57], "", "brown1", 1],
        [[37, 64, 37, 0, 33, 0, 34, 65], "", "brown4", 1],
        [[216, 62, 213, 62, 212, 2, 215, 2], "", "brown4", 1],
        [[6, 56, 35, 3, 109, 66], "brown5", "", 0],
        [[239, 54, 214, 4, 145, 68], "brown5", "", 0],
        [[0, 54, 6, 50, 13, 68, 12, 69], "", "brown4", 1],
        [[243, 52, 238, 48, 231, 65, 233, 66], "", "brown4", 1],
      ],
      []
    );
  let o = !0,
    i = !1;
  const a = t.angle,
    s = t.start.distance(t.end),
    l = new Vector(
      t.start.x + (t.end.x - t.start.x) / 2,
      t.start.y + (t.end.y - t.start.y) / 2
    );
  let h = 0,
    g = 0;
  function d() {
    particles.dying(l.get().apply(new Vector(l.x, l.y + 20)), [
      "brown1",
      "brown2",
      "brown3",
      "brown4",
    ]);
  }
  (this.getBlockId = () => t.id),
    (this.destroy = () => {
      (o = !1), (i = !0);
    }),
    (this.isActive = () => o),
    (this.isDead = () => i),
    (this.n = () => {
      const t = +new Date() - n;
      avalanche.collision(l, 40) && ((o = !1), (i = !0), d()),
        t >= 3e3
          ? ((o = !1), (i = !0), d())
          : t >= 2e3 && h <= 0
          ? ((h = 1), (g = 10))
          : t >= 2500 && h <= 1 && ((h = 2), (g = 10)),
        g > 0 && g--;
    }),
    (this.r = () => {
      if (!g) {
        const t = s / (0.8 * e[0]);
        c.save(),
          (c.lineWidth = 2),
          c.translate(
            l.x - (t * e[0] * 0.2) / 2,
            gc.res.y - l.y - (t * e[1]) / 2
          ),
          c.rotate(-a),
          c.scale(t, t),
          draw.r(r.n(), e),
          c.restore();
      }
    });
}
function Panel(t, e) {
  const n = [104, 83],
    r = +new Date(),
    o = new Anim(
      [
        [[63, 2, 70, 0, 79, 25, 74, 27], "", "brown1", 1],
        [[74, 27, 80, 26, 88, 44, 82, 45], "", "brown2", 1],
        [[82, 47, 88, 44, 96, 60, 90, 62], "", "brown1", 1],
        [[91, 64, 98, 82, 104, 80, 96, 61], "", "brown3", 1],
        [[66, 11, 65, 11, 94, 78, 96, 77], "", "brown4", 1],
        [[87, 50, 49, 82, 51, 83, 89, 52], "", "brown4", 1],
        [[72, 15, 0, 81, 2, 83, 74, 16], "", "brown4", 1],
      ],
      []
    );
  let i = !0,
    a = !1,
    s = e.angle,
    l = 0,
    h = 0;
  function g() {
    particles.dying(t.get().apply(new Vector(t.x, t.y + 40)), [
      "brown1",
      "brown2",
      "brown3",
      "brown4",
    ]);
  }
  (this.position = t),
    (this.destroy = () => {
      (i = !1), (a = !0);
    }),
    (this.isActive = () => i),
    (this.isDead = () => a),
    (this.n = () => {
      const e = +new Date() - r;
      avalanche.collision(t, 40) && ((i = !1), (a = !0), g()),
        e >= 3e3
          ? ((i = !1), (a = !0), g())
          : e >= 2e3 && l <= 0
          ? ((l = 1), (h = 10))
          : e >= 2500 && l <= 1 && ((l = 2), (h = 10)),
        h > 0 && h--;
    }),
    (this.r = () => {
      h ||
        (c.save(),
        c.translate(t.x, gc.res.y - t.y - n[1] / 2 + 5),
        c.rotate(-s),
        draw.r(o.n(), n),
        c.restore());
    });
}
function Stone(t) {
  const e = [
      [
        [[28, 0, 34, 20, 27, 30, 24, 27, 10, 35, 0, 21, 12, 6], "", "rock1", 1],
        [[28, 0, 49, 8, 45, 41, 34, 20], "", "rock2", 1],
        [[49, 8, 54, 22, 45, 40], "", "rock3", 1],
        [[0, 21, 7, 44, 14, 48, 11, 35], "", "rock2", 1],
        [[11, 35, 14, 47, 36, 47, 27, 30, 24, 27], "", "rock4", 1],
        [[27, 30, 34, 20, 45, 40, 36, 47], "", "rock2", 1],
      ],
      [
        [[0, 20, 12, 3, 25, 17, 16, 29], "", "rock4", 1],
        [[25, 17, 38, 0, 54, 18, 45, 23], "", "rock2", 1],
        [[45, 23, 26, 40, 22, 51, 48, 42], "", "rock3", 1],
        [[25, 17, 16, 28, 27, 40, 46, 23], "", "rock1", 1],
        [[25, 17, 12, 2, 38, 0], "", "rock4", 1],
        [[17, 29, 0, 20, 0, 36, 22, 51, 27, 40], "", "rock2", 1],
        [[45, 22, 54, 18, 48, 42], "", "rock3", 1],
      ],
    ],
    n = [
      [54, 48],
      [53, 51],
    ],
    r = void 0 !== t ? t : rInt(0, e.length),
    o = rFloat(0.2, 0.4);
  let i = 1;
  const a = (n[r][0] + n[r][1]) / 4,
    s = new Anim(e[r], []);
  let l = 1,
    h = 0,
    g = 0.01;
  const d = gc.res.x - camera.getPosition().x + 100,
    w = mountain.getHeight(d),
    p = (mountain.getAngle(d), new Vector(d, w));
  let y = new Vector(rFloat(-7, -13), rFloat(7, 13));
  const u = { DYING_TIME: 1e3, type: 0, dead: !1, dying: !1, startDying: 0 };
  function f(t) {
    (u.type = t), (u.startDying = +new Date()), (u.dead = !1), (u.dying = !0);
  }
  (this.isActive = () => !u.dead),
    (this.collision = (t, e) => {
      if (u.dying || u.dead) return !1;
      const n = p.distance(t) <= a + e;
      return (
        n &&
          ((u.dead = !0),
          particles.dying(p.get().apply(new Vector(p.x, p.y + 40)), [
            "rock1",
            "rock2",
            "rock3",
            "rock4",
          ])),
        n
      );
    }),
    (this.n = () => {
      if (u.dying) {
        if (u.type) {
          if (1 === u.type) {
            (l -= 0.01), (i = (i -= 0.02) < 0 ? 0 : i);
            let t = new Vector(-0.7, -2);
            p.add(t);
          }
        } else l -= 0.01;
        l = l < 0 ? 0 : l;
      } else {
        let t = y.get().normalize().mult(-0.017);
        t.add(gc.gravity.get().mult(o)),
          y.add(t),
          y.mag() > 10 ? y.div(y.mag()).mult(10) : y.mag() < 1 && f(2),
          p.add(y),
          p.x < -camera.getPosition().x - 300 && (u.dead = !0),
          (function () {
            const t = mountain.getBlock(p.x),
              e = mountain.getHeight(p.x),
              o = t.end.get().normal(t.start);
            if (p.y - 10 <= e)
              if ("hole" === t.type) f(1);
              else {
                p.y = e + 10;
                const t = y.get().sub(o.get().mult(1.5 * y.get().dot(o)));
                (g = (y.mag() / (2 * a * Math.PI)) * (2 * Math.PI)),
                  y.apply(t),
                  particles.addRockRolling(
                    p.get().apply(new Vector(p.x, p.y - n[r][1] / 2)),
                    y.mag()
                  );
              }
          })(),
          (h -= g = g <= 0 ? 0 : g - 0.001);
      }
      u.dying &&
        +new Date() - u.startDying >= u.DYING_TIME &&
        ((u.dead = !0),
        (u.dying = !1),
        2 === u.type &&
          particles.dying(p.get().apply(new Vector(p.x, p.y + 40)), [
            "rock1",
            "rock2",
            "rock3",
            "rock4",
          ]));
    }),
    (this.r = () => {
      c.save(),
        c.translate(p.x, gc.res.y - p.y),
        c.rotate(h),
        c.scale(i, i),
        (c.globalAlpha = l),
        draw.r(s.n(), n[r]),
        c.restore();
    });
}
function MountainDecoration(t) {
  const e = "rgba(0, 0, 0, .05)";
  let n = [
      [
        [
          [17, 6, 15, 26, 0, 38, 15, 55, 40, 46, 63, 54, 76, 28, 56, 27, 49, 0],
          "",
          e,
          1,
        ],
      ],
      [
        [
          [
            13, 16, 0, 38, 14, 59, 41, 43, 46, 57, 71, 57, 70, 13, 76, 5, 37, 0,
            16, 1,
          ],
          "",
          e,
          1,
        ],
      ],
      [
        [
          [13, 1, 25, 36, 0, 43, 4, 57, 31, 38, 51, 56, 52, 28, 44, 11, 33, 0],
          "",
          e,
          1,
        ],
      ],
      [
        [
          [0, 4, 21, 29, 1, 62, 25, 67, 43, 68, 56, 45, 51, 21, 66, 10, 28, 0],
          "",
          e,
          1,
        ],
      ],
      [
        [
          [
            18, 12, 18, 0, 8, 4, 13, 15, 0, 19, 2, 27, 14, 20, 76, 51, 72, 57,
            80, 63, 86, 56, 81, 49, 92, 42, 88, 34, 77, 44,
          ],
          "",
          "rock1",
          1,
        ],
      ],
      [
        [[101, 42, 112, 62, 93, 67, 90, 44, 95, 59], "", "rock1", 1],
        [[104, 55, 107, 60, 98, 61, 99, 55], "", "rock1", 1],
        [[91, 63, 91, 66, 84, 67, 84, 64], "", "rock1", 1],
        [[82, 66, 77, 68, 75, 41], "", "rock1", 1],
        [[72, 67, 68, 68, 68, 36], "", "rock1", 1],
        [[64, 67, 58, 67, 63, 40], "", "rock1", 1],
        [[56, 67, 46, 65, 46, 62, 54, 64], "", "rock1", 1],
        [[42, 63, 35, 58, 37, 57, 42, 61], "", "rock1", 1],
        [[32, 58, 38, 48, 31, 47, 25, 52], "", "rock1", 1],
        [[22, 51, 23, 48, 17, 46, 15, 47], "", "rock1", 1],
        [[12, 44, 14, 41, 7, 36, 3, 34], "", "rock1", 1],
        [[2, 33, 6, 33, 0, 22], "", "rock1", 1],
        [[41, 46, 53, 24, 48, 27, 39, 44], "", "rock1", 1],
        [[52, 22, 49, 19, 34, 17, 32, 19], "", "rock1", 1],
        [[29, 20, 32, 2, 29, 11, 22, 0, 27, 15, 20, 13], "", "rock1", 1],
      ],
    ],
    r = [
      [76, 55],
      [76, 59],
      [52, 57],
      [66, 68],
      [92, 63],
      [112, 68],
    ],
    o = [];
  t
    .filter(
      (e, n) =>
        !n ||
        ("hole" !== e.type &&
          t[n - 1] &&
          "hole" !== t[n - 1].type &&
          t[n + 1] &&
          "hole" !== t[n + 1].type)
    )
    .forEach((t) => {
      let e = rInt(1, 5);
      for (let r = 0; r < e; r++) {
        let e = rInt(0, n.length);
        o.push({
          g: e,
          scale: rFloat(0.4, 2),
          rotate: rFloat(0, 2 * Math.PI),
          position: new Vector(
            rInt(t.start.x, t.end.x),
            rInt(
              Math.min(t.start.y, t.end.y) - 100,
              Math.min(t.start.y, t.end.y) - 600
            )
          ),
          anim: new Anim(n[e], []),
        });
      }
    }),
    (this.n = () => {}),
    (this.r = () => {
      o.filter(
        (t) =>
          t.position.x >= camera.getView().start.x &&
          t.position.x < camera.getView().end.x
      ).forEach((t) => {
        c.save(),
          c.translate(t.position.x, -t.position.y),
          c.rotate(t.rotate),
          c.scale(t.scale, t.scale),
          draw.r(t.anim.n(), r[t.g]),
          c.restore();
      });
    });
}
function Bench(t, e) {
  let n = new Anim(
    [
      [[5, 3, 5, 9, 14, 9, 14, 3], "", "benchBottom", 1],
      [[0, 3, 18, 3, 17, 0, 0, 0], "", "benchTop", 1],
    ],
    []
  );
  (this.front = void 0 !== e ? e : !rInt(0, 2)),
    (this.position = t),
    (this.n = () => {}),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y - 7),
        draw.r(n.n(), [18, 9]),
        c.restore();
    });
}
function Bush(t, e, n) {
  const r = [
      [
        [
          [
            [
              4, 26, 0, 20, 2, 12, 8, 9, 15, 15, 23, 2, 31, 0, 38, 7, 42, 17,
              38, 26,
            ],
            "",
            "#7e916b",
            1,
          ],
        ],
        [
          [
            [
              4, 26, -1, 20, 0, 12, 7, 10, 13, 15, 21, 2, 30, 1, 36, 7, 41, 17,
              38, 26,
            ],
          ],
          [
            [
              4, 26, 1, 19, 3, 12, 9, 9, 16, 15, 24, 2, 33, 0, 40, 7, 43, 17,
              38, 26,
            ],
          ],
        ],
      ],
      [
        [
          [
            [
              6, 42, 0, 32, 3, 19, 15, 14, 25, 21, 26, 10, 33, 3, 49, 0, 61, 13,
              72, 5, 80, 9, 83, 21, 83, 34, 76, 42,
            ],
            "",
            "#7e9b61",
            1,
          ],
        ],
        [
          [
            [
              6, 42, -1, 32, 1, 18, 13, 13, 22, 21, 25, 9, 32, 1, 48, -1, 58,
              13, 70, 5, 78, 9, 82, 21, 82, 33, 76, 42,
            ],
          ],
          [
            [
              6, 42, 2, 32, 4, 19, 16, 13, 26, 21, 28, 10, 35, 1, 51, -1, 64,
              13, 73, 3, 81, 8, 85, 21, 85, 35, 76, 42,
            ],
          ],
        ],
      ],
    ],
    o = [
      [42, 26],
      [83, 42],
    ],
    i = void 0 === e ? rInt(0, r.length) : e,
    a = new Anim(r[i][0], r[i][1], rInt(1200, 2500)),
    s = mountain.getAngle(t.x);
  (this.front = void 0 !== n ? n : !rInt(0, 2)),
    (this.position = t),
    (this.n = () => {}),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y - o[i][1] / 2),
        c.rotate(-s),
        draw.r(a.n(), o[i]),
        c.restore();
    });
}
function Fire(t) {
  let e, n, r, o, i, a, s, l, h;
  function g() {
    (e = 0.001),
      (n = +new Date()),
      (r = t ? rInt(1e3, 1300) : rInt(4e3, 9e3)),
      (o = t
        ? new Vector(rInt(-50, 50), rInt(-10, 10))
        : new Vector(rInt(-10, 10), rInt(-80, -90))),
      (i = t
        ? new Vector(o.x < 0 ? rFloat(0.1, 1) : rFloat(-1, 0.1), rFloat(-1, -2))
        : new Vector(rFloat(-0.3, 0.3), rFloat(-1.2, -2))),
      (a = t ? 1 : 0),
      (s = 0),
      (l = rFloat(-0.03, 0.03)),
      (h = 10);
  }
  (this.active = !0),
    g(),
    (this.n = () => {
      const c = +new Date() - n;
      let d = i.get().normalize().mult(0.001);
      d.add(gc.gravity.get().mult(e)),
        i.add(d),
        o.add(i),
        (a = (a = 0.8 - (c / r) * 0.8) < 0 ? 0 : a),
        t
          ? (h = 10)
          : ((h = 20),
            (h = 5 + 40 * (a = (c / (r / 2)) * 0.5)),
            (a = a > 0.5 ? 0.5 - a + 0.5 : a)),
        (s += l),
        (this.active = c <= r),
        !this.active && g();
    }),
    (this.r = () => {
      c.save(),
        (c.fillStyle = t
          ? "hsl(" + (40 - 50 * a) + ", 70%, 50%)"
          : color.get("smoke")),
        c.translate(o.x, o.y),
        c.rotate(s),
        bp(),
        (c.globalAlpha = a),
        c.fillRect(-h, -h, 2 * h, 2 * h),
        c.restore();
    });
}
function Campfire(t) {
  let e = [],
    n = new Anim(
      [
        [[10, 4, 3, 0, 0, 6, 3, 9, 9, 9], "", "rock1", 1],
        [[11, 2, 6, 8, 10, 10, 23, 9], "", "rock2", 1],
        [[33, 4, 31, 8, 45, 9, 43, 3], "", "rock2", 1],
        [[24, 4, 29, 0, 35, 3, 36, 6, 33, 9, 25, 9], "", "rock3", 1],
        [[27, 6, 18, 5, 17, 8, 19, 10, 25, 10], "", "rock4", 1],
      ],
      []
    );
  for (let t = 0; t < 100; t++)
    setTimeout(() => {
      e.push(new Fire(!0));
    }, 10 * t);
  for (let t = 0; t < 150; t++)
    setTimeout(() => {
      e.push(new Fire(!1));
    }, 500 + 50 * t);
  (this.front = !1),
    (this.position = t),
    (this.n = () => {
      e.forEach((t) => t.n());
    }),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y - 9),
        c.save(),
        c.scale(0.2, 0.2),
        e.forEach((t) => t.r()),
        c.restore(),
        c.translate(-20, -5),
        c.scale(0.9, 1),
        draw.r(n.n()),
        c.restore();
    });
}
function House(t, e, n) {
  const r = [
      [
        [
          [
            0, 66, 17, 46, 30, 29, 39, 15, 48, 0, 58, 15, 68, 32, 80, 48, 95,
            67,
          ],
          "",
          "camp1",
          1,
        ],
        [[48, 1, 48, 66, 65, 66], "", "camp2", 1],
      ],
    ],
    o = [[95, 67]],
    i = void 0 === e ? rInt(0, r.length) : e,
    a = new Anim(r[i], []);
  (this.front = void 0 !== n ? n : !rInt(0, 2)),
    (this.position = t),
    (this.n = () => {}),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y - o[i][1] / 2),
        draw.r(a.n(), o[i]),
        c.restore();
    });
}
function Owl(t) {
  const e = [
      [
        [
          [
            [
              1, 0, 3, 6, 1, 9, 0, 14, 2, 19, 7, 24, 13, 20, 14, 14, 14, 10, 13,
              6, 15, 1, 11, 4, 8, 3, 6, 4,
            ],
            "",
            "owl1",
            1,
          ],
          [[5, 6, 3, 8, 3, 10, 5, 11, 7, 10, 7, 8, 7, 7], "", "#fff", 1],
          [[9, 7, 8, 9, 9, 11, 11, 11, 12, 10, 12, 8, 11, 7], "", "#fff", 1],
          [[1, 9, 3, 11, 3, 14, 4, 17, 3, 20, 2, 19, 0, 14], "", "owl2", 1],
          [
            [14, 9, 12, 11, 11, 14, 11, 17, 12, 20, 13, 20, 14, 14],
            "",
            "owl2",
            1,
          ],
        ],
        [
          [
            0,
            [5, 8, 3, 8, 3, 9, 5, 9, 7, 9, 7, 8, 7, 8],
            [9, 8, 8, 9, 9, 9, 11, 9, 12, 9, 12, 8, 11, 8],
            0,
            0,
          ],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0],
        ],
      ],
    ],
    n = [[15, 24]];
  (this.front = !0), (this.type = 0), (this.position = t);
  const r = new Anim(e[this.type][0], e[this.type][1], 100);
  (this.n = () => {}),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y),
        draw.r(r.n(), n[this.type]),
        c.restore();
    });
}
function Tree(t, e, n) {
  const r = [
      [
        [
          [
            [12, 74, 43, 74, 32, 68, 29, 43, 22, 43, 16, 68],
            "",
            "tree1Bottom",
            1,
          ],
          [
            [25, 25, 0, 67, 11, 61, 19, 67, 26, 60, 36, 66, 41, 58, 52, 64],
            "",
            "tree1_1",
            1,
          ],
          [
            [24, 8, 3, 43, 12, 39, 18, 45, 24, 38, 31, 44, 37, 38, 46, 42],
            "",
            "tree1_2",
            1,
          ],
          [[24, 0, 7, 25, 17, 19, 23, 25, 29, 18, 41, 25], "", "tree1_3", 1],
        ],
        [
          [
            0,
            [21, 26, 3, 67, 13, 60, 21, 67, 28, 59, 38, 64, 43, 57, 53, 60],
            [19, 9, 4, 43, 12, 39, 19, 44, 23, 38, 31, 44, 37, 38, 46, 39],
            [18, 1, 7, 25, 16, 20, 22, 24, 28, 18, 39, 21],
          ],
          [
            0,
            [28, 25, 0, 64, 11, 61, 18, 67, 25, 61, 33, 66, 40, 59, 49, 65],
            [30, 10, 5, 41, 14, 40, 18, 46, 25, 40, 31, 47, 38, 41, 46, 45],
            [33, -1, 12, 21, 22, 19, 26, 27, 35, 20, 43, 25],
          ],
        ],
      ],
      [
        [
          [[50, 48, 45, 151, 56, 148], "", "tree2Bottom", 1],
          [[31, 61, 0, 88, 21, 89, 57, 98, 101, 83, 74, 61], "", "tree2_1", 1],
          [
            [38, 26, 5, 72, 30, 79, 62, 79, 64, 63, 95, 71, 58, 25],
            "",
            "tree2_2",
            1,
          ],
          [[47, 0, 8, 50, 41, 30, 57, 52, 78, 37], "", "tree2_3", 1],
        ],
        [
          [
            [46, 48, 46, 151, 56, 147],
            [26, 62, -3, 91, 18, 91, 55, 97, 97, 79, 68, 59],
            [33, 27, 2, 75, 28, 80, 60, 79, 60, 63, 92, 68, 52, 25],
            [40, 2, 5, 54, 36, 31, 54, 52, 74, 36],
          ],
          [
            [54, 48, 45, 151, 56, 148],
            [36, 59, 2, 82, 23, 86, 57, 99, 102, 89, 78, 64],
            [50, 24, 10, 65, 33, 75, 65, 81, 69, 66, 98, 78, 69, 27],
            [70, 5, 20, 43, 56, 32, 67, 57, 91, 49],
          ],
        ],
      ],
    ],
    o = [
      [52, 70],
      [101, 145],
    ],
    i = rInt(0, 2) ? -1 : 1,
    a = rFloat(0.8, 1.7),
    s = void 0 !== e ? e : rInt(0, r.length),
    l = new Anim(...r[s], rInt(2800, 5e3));
  (this.front = void 0 !== n ? n : !rInt(0, 2)),
    (this.position = t),
    (this.n = () => {}),
    (this.r = () => {
      c.save(),
        c.translate(t.x, gc.res.y - t.y - (o[s][1] * a) / 2),
        c.scale(i * a, a),
        draw.r(l.n(), o[s]),
        c.restore();
    });
}
function Particle(t, e, n, r, o, i) {
  this.isActive = !0;
  let a = n.get(),
    s = r.get(),
    l = new Vector();
  const h = +new Date();
  (this.n = () => {
    l.add(s.get().normalize().mult(0.001)),
      l.add(gc.gravity.get().mult(t)),
      s.add(l),
      a.add(s),
      l.mult(0),
      +new Date() - h >= o && (this.isActive = !1);
  }),
    (this.r = () => {
      const t = 1 - (+new Date() - h) / o;
      c.save(),
        c.translate(a.x, gc.res.y - a.y),
        (c.globalAlpha = t >= 0 ? t : 0),
        bp(),
        (c.fillStyle = color.get(i) || i),
        c.rect(-e / 2, -e / 2, 2 * e, 2 * e),
        c.fill(),
        cp(),
        c.restore();
    });
}
function Anim(t, e, n, r) {
  const o = n || 200,
    c = e.length + 1,
    i = [];
  let a,
    s = 0,
    l = 0,
    h = 0,
    g = +new Date(),
    d = g,
    w = !1;
  i.push(t),
    e.forEach((e) => {
      i.push(
        t.map((t, n) => {
          let r = t;
          return e[n] && (r = t.map((t, r) => (r ? t : e[n]))), r;
        })
      );
    }),
    (this.n = () => {
      (d = +new Date() - g),
        (l += d),
        (s = Math.floor((l % (c * o)) / o)) + 1 === c && (w = !0);
      const t = s + 1 === c ? (r ? s : 0) : s + 1;
      return (
        (h = (l % (c * o)) % o),
        (g = +new Date()),
        (a =
          r && w
            ? i[c - 1]
            : i[s].map((e, n) =>
                e.map((e, r) =>
                  r ? e : e.map((e, c) => e + ((i[t][n][r][c] - e) * h) / o)
                )
              ))
      );
    });
}
function Vector(t, e) {
  (this.x = t || 0),
    (this.y = e || 0),
    (this.add = (t) => ((this.x += t.x), (this.y += t.y), this)),
    (this.angle = (t) =>
      void 0 === t
        ? Math.atan2(this.y, this.x)
        : Math.atan2(t.y - this.y, t.x - this.x)),
    (this.apply = (t) => ((this.x = t.x), (this.y = t.y), this)),
    (this.distance = (t) => Math.hypot(this.x - t.x, this.y - t.y)),
    (this.div = (t) => ((this.x /= t), (this.y /= t), this)),
    (this.dot = (t) => this.mag() * t.mag() * Math.cos(this.angle(t))),
    (this.get = () => new Vector(this.x, this.y)),
    (this.mag = () => Math.hypot(this.x, this.y)),
    (this.mult = (t) => ((this.x *= t), (this.y *= t), this)),
    (this.normalize = () => {
      let t = this.mag();
      return t > 0 && this.div(t), this;
    }),
    (this.perpendicular = () => {
      let t = this.x;
      return (this.x = this.y), (this.y = -t), this;
    }),
    (this.round = () => (
      (this.x = Math.round(this.x)), (this.y = Math.round(this.y)), this
    )),
    (this.sub = (t) => ((this.x -= t.x), (this.y -= t.y), this)),
    (this.normal = (t) =>
      new Vector(this.x - t.x, this.y - t.y).perpendicular().normalize()),
    (this.center = (t) =>
      new Vector(this.x + (t.x - this.x) / 2, this.y + (t.y - this.y) / 2));
}
function Rain() {
  let t = [],
    e = rFloat(0.25, 0.95);
  var n;
  (this.active = !0),
    (this.n = (n) => {
      if (n) t.length || (this.active = !1);
      else if (Math.random() < e) {
        let e = {
          active: !0,
          m: 0.6,
          acceleration: new Vector(),
          velocity: new Vector(),
          position: new Vector(rFloat(0, 1.1 * gc.res.x), -50),
          r: rFloat(2, 16),
        };
        t.push(e);
      }
      t.forEach((t) => {
        t.acceleration.add(t.velocity.get().normalize().mult(0.001)),
          t.acceleration.add(gc.gravity.get().mult(-t.m * t.r * 0.1)),
          t.velocity.add(t.acceleration),
          t.position.add(t.velocity),
          t.position.add(new Vector(-1, 0)),
          t.acceleration.mult(0),
          ((t = t).active = t.position.y <= gc.res.y);
      }),
        (t = t.filter(function (t) {
          return t.active;
        }));
    }),
    (this.r = () => {
      (c.strokeStyle = color.get("snow")),
        (c.lineWidth = 2),
        t.forEach((t) => {
          bp(),
            m(t.position.x, t.position.y),
            l(t.position.x - 1, t.position.y + 20),
            c.stroke(),
            cp();
        });
    });
}
function Snow() {
  let t = [],
    e = rFloat(0.05, 0.45);
  var n;
  (this.active = !0),
    (this.n = (n) => {
      n
        ? t.length || (this.active = !1)
        : Math.random() < e &&
          t.push({
            active: !0,
            m: 0.01,
            acceleration: new Vector(),
            velocity: new Vector(),
            position: new Vector(rFloat(-0.5 * gc.res.x, 1.5 * gc.res.x), -50),
            r: rFloat(2, 16),
          }),
        t.forEach((t) => {
          t.acceleration.add(t.velocity.get().normalize().mult(0.001)),
            t.acceleration.add(gc.gravity.get().mult(-t.m * t.r * 0.1)),
            t.velocity.add(t.acceleration),
            t.position.add(t.velocity),
            t.position.add(new Vector(-1, 0)),
            t.acceleration.mult(0),
            ((t = t).active = t.position.y <= gc.res.y);
        }),
        (t = t.filter(function (t) {
          return t.active;
        }));
    }),
    (this.r = () => {
      (c.fillStyle = color.get("snow")),
        t.forEach((t) => {
          bp(),
            c.rect(t.position.x - t.r / 2, t.position.y - t.r / 2, t.r, t.r),
            c.fill(),
            cp();
        });
    });
}
(() => {
  function t() {
    (gc.size = { x: window.innerWidth, y: window.innerHeight }),
      (gc.originalRatio = Math.min(gc.size.x / gc.res.x, gc.size.y / gc.res.y)),
      (gc.canvas.style.width = Math.round(gc.res.x * gc.originalRatio) + "px"),
      (gc.canvas.style.height = Math.round(gc.res.y * gc.originalRatio) + "px"),
      (gc.ratio = gc.originalRatio),
      (gc.canvas.width = Math.round(gc.res.x * gc.ratio)),
      (gc.canvas.height = Math.round(gc.res.y * gc.ratio));
  }
  function e() {
    (gc.last = +new Date()),
      (function () {
        gc.paused ||
          ((gc.night =
            !sun.getTime().day && Math.abs(sun.getTime().part) >= 0.8
              ? (1 - Math.abs(sun.getTime().part)) / 0.2
              : sun.getTime().day
              ? 0
              : 1),
          (gc.sunset =
            Math.abs(sun.getTime().part) > 0.8
              ? (Math.abs(sun.getTime().part) - 0.8) / 0.2
              : 0));
        scene.n(), character.isDead() && n(!1);
        character.isFinish() && n(!0);
      })(),
      c.save(),
      c.scale(gc.ratio, gc.ratio),
      scene.r(),
      c.restore(),
      requestAnimationFrame(e);
  }
  function n(t) {
    (gc.night = 0),
      (gc.sunset = 0),
      (gc.byDeath = !t),
      (gc.byWin = t),
      (gc.paused = !0),
      character.reset(),
      camera.reset(),
      particles.reset(),
      barricades.reset(),
      avalanche.reset();
  }
  (window.rInt = (t, e) => Math.floor(t + Math.random() * (e - t))),
    (window.rFloat = (t, e) => t + Math.random() * (e - t)),
    (window.gc = {
      res: { x: 1280, y: 720 },
      mousePosition: new Vector(),
      start: +new Date(),
      last: +new Date(),
      paused: !0,
      byDeath: !1,
      byWin: !1,
      night: 0,
      sunset: 0,
    }),
    (window.onload = function () {
      (gc.canvas = document.getElementById("app")),
        (window.c = gc.canvas.getContext("2d")),
        (window.l = c.lineTo.bind(c)),
        (window.m = c.moveTo.bind(c)),
        (window.bp = c.beginPath.bind(c)),
        (window.cp = c.closePath.bind(c)),
        (gc.gravity = new Vector(0, -0.8)),
        t(),
        scene.i(),
        e(),
        gc.canvas.addEventListener("click", (t) => {
          gc.paused
            ? ((gc.paused = !1), (gc.byDeath = !1), (gc.byWin = !1))
            : scene.interaction(
                new Vector(t.offsetX, t.offsetY).div(gc.originalRatio)
              );
        }),
        gc.canvas.addEventListener("mousemove", (t) => {
          gc.mousePosition = new Vector(t.offsetX, t.offsetY);
        });
    }),
    (window.onresize = t);
})(),
  (window.barricades = (() => {
    let t = [],
      e = [];
    return {
      checkBridges: (e) => {
        return !!t.filter((t) => e === t.getBlockId()).length;
      },
      checkPanels: (t) => {
        return !!e.filter((e) => t.distance(e.position) <= 10).length;
      },
      add: (n) => {
        const r = -camera.getPosition().x + n.x,
          o = mountain.getBlock(r),
          c = mountain.getHeight(r);
        "camp" !== o.type &&
          ("hole" === o.type
            ? (t = []).push(new Bridge(o))
            : (e = []).push(new Panel(new Vector(r, c), o)));
      },
      reset: () => {
        (t = []), (e = []);
      },
      n: () => {
        (e = e.filter((t) => t.isActive())).forEach((t) => {
          t.n();
        }),
          (t = t.filter((t) => t.isActive())).forEach((t) => {
            t.n();
          });
      },
      r: () => {
        e.forEach((t) => {
          t.r();
        }),
          t.forEach((t) => {
            t.r();
          });
      },
    };
  })()),
  (window.character = (() => {
    const t = 0.5,
      e = 2;
    let n = {
      walking: [
        [
          [[15, 16, 10, 20, 8, 28], "chTopL", "", 0],
          [[14, 33, 17, 40, 21, 48], "chBottomL", "", 0],
          [[16, 8, 16, 25, 14, 33], "chTopC", "", 0],
          [[13, 12, 12, 31, 4, 31, 0, 17, 3, 7], "", "back", 1],
          [[14, 33, 10, 41, 5, 47], "chBottomR", "", 0],
          [[23, 10, 18, 9, 15, 4, 17, 0], "", "skin", 1],
          [[11, 2, 17, 16, 23, 15, 22, 10, 18, 9, 15, 3, 17, 0], "", "hair", 1],
          [[18, 3, 17, 4, 19, 4], "", "#000", 1],
          [[16, 16, 19, 23, 24, 28], "chTopR", "", 0],
        ],
        [
          [
            [15, 16, 10, 20, 6, 27],
            [14, 34, 19, 39, 18, 48],
            [15, 9, 15, 26, 13, 34],
            [13, 13, 12, 32, 4, 32, 0, 18, 2, 8],
            [14, 34, 12, 42, 4, 44],
            [23, 10, 18, 10, 15, 4, 17, 1],
            [11, 3, 17, 17, 23, 15, 22, 10, 18, 10, 15, 4, 17, 1],
            [18, 4, 17, 5, 19, 5],
            [15, 17, 19, 24, 27, 27],
          ],
          [
            [15, 16, 12, 23, 16, 32],
            [13, 34, 12, 41, 9, 48],
            [15, 9, 15, 25, 14, 34],
            0,
            [14, 34, 19, 40, 12, 46],
            0,
            0,
            0,
            [15, 16, 11, 23, 16, 32],
          ],
          [
            [16, 15, 17, 24, 26, 27],
            [14, 31, 10, 40, 5, 47],
            [16, 7, 16, 24, 14, 32],
            [13, 10, 12, 29, 4, 30, 0, 16, 3, 5],
            [14, 32, 19, 39, 14, 47],
            [23, 8, 18, 8, 15, 2, 17, -1],
            [11, 1, 17, 15, 23, 13, 22, 8, 18, 8, 15, 2, 17, -1],
            [18, 2, 17, 4, 19, 4],
            [15, 15, 9, 21, 12, 30],
          ],
          [
            [16, 16, 20, 23, 28, 27],
            [13, 34, 9, 41, 0, 42],
            [16, 8, 16, 25, 13, 34],
            0,
            [14, 34, 19, 40, 24, 47],
            0,
            0,
            0,
            [15, 16, 8, 22, 7, 30],
          ],
          [
            [15, 19, 20, 24, 28, 26],
            [14, 33, 13, 42, 5, 44],
            [16, 9, 16, 25, 14, 34],
            [13, 13, 12, 32, 4, 32, 0, 18, 2, 8],
            [14, 33, 21, 39, 19, 47],
            [23, 11, 18, 11, 15, 5, 17, 2],
            [11, 3, 17, 18, 23, 16, 22, 11, 18, 11, 15, 5, 17, 2],
            [17, 4, 17, 6, 19, 6],
            [15, 19, 8, 23, 3, 30],
          ],
          [
            [15, 16, 13, 24, 15, 32],
            [14, 33, 17, 41, 10, 46],
            [15, 8, 16, 25, 14, 32],
            0,
            [13, 32, 13, 39, 9, 47],
            0,
            0,
            0,
            [16, 16, 17, 24, 19, 33],
          ],
          [
            [15, 14, 10, 19, 11, 27],
            [14, 32, 19, 39, 16, 46],
            [16, 7, 16, 24, 14, 32],
            [13, 10, 12, 29, 4, 30, 0, 16, 3, 5],
            [14, 31, 11, 40, 6, 47],
            [23, 8, 18, 8, 15, 2, 17, -1],
            [11, 0, 17, 15, 23, 13, 22, 8, 18, 8, 15, 2, 17, -1],
            [18, 2, 17, 3, 19, 3],
            [16, 15, 18, 23, 25, 26],
          ],
        ],
      ],
      running: [
        [
          [[15, 15, 9, 19, 8, 27], "chTopL", "", 0],
          [[14, 32, 20, 39, 22, 47], "chBottomL", "", 0],
          [[16, 8, 16, 24, 14, 33], "chTopC", "", 0],
          [[13, 11, 12, 30, 4, 30, 0, 17, 3, 6], "", "back", 1],
          [[16, 15, 21, 23, 28, 19], "chTopR", "", 0],
          [[14, 32, 8, 40, 0, 44], "chBottomR", "", 0],
          [[24, 7, 19, 8, 13, 4, 14, 0], "", "skin", 1],
          [[9, 4, 20, 15, 26, 11, 22, 7, 19, 8, 13, 4, 14, 0], "", "hair", 1],
          [[16, 2, 16, 4, 17, 4], "", "#000", 1],
        ],
        [
          [
            [15, 17, 8, 20, 6, 29],
            [13, 34, 20, 40, 18, 49],
            [15, 10, 15, 27, 13, 35],
            [13, 14, 12, 33, 4, 34, 0, 20, 2, 9],
            [16, 18, 22, 25, 29, 20],
            [14, 34, 12, 43, 3, 42],
            [23, 9, 19, 11, 13, 7, 14, 3],
            [9, 7, 20, 18, 25, 14, 22, 10, 19, 11, 13, 7, 14, 3],
            [16, 5, 16, 7, 17, 7],
          ],
          [
            [15, 15, 12, 22, 16, 31],
            [13, 33, 12, 41, 8, 49],
            [15, 8, 15, 24, 14, 33],
            0,
            [15, 15, 11, 22, 16, 31],
            [14, 33, 19, 40, 10, 41],
            [24, 7, 19, 8, 13, 4, 14, 0],
            [9, 4, 20, 15, 26, 11, 22, 7, 19, 8, 13, 4, 14, 0],
            0,
          ],
          [
            [16, 12, 17, 21, 26, 23],
            [13, 29, 9, 38, 3, 46],
            [16, 5, 16, 21, 13, 29],
            [13, 9, 12, 28, 4, 28, 0, 14, 3, 4],
            [16, 13, 8, 17, 8, 26],
            [13, 30, 21, 35, 14, 41],
            [24, 5, 19, 6, 14, 2, 15, -2],
            [10, 2, 21, 13, 26, 9, 23, 5, 19, 6, 14, 2, 15, -2],
            [16, 0, 16, 2, 18, 2],
          ],
          [
            [16, 15, 23, 23, 30, 18],
            [13, 33, 9, 40, 1, 44],
            [16, 8, 16, 24, 13, 33],
            0,
            [15, 15, 7, 19, 4, 27],
            [14, 33, 19, 40, 22, 48],
            [24, 7, 19, 8, 13, 4, 14, 0],
            [9, 4, 20, 15, 26, 11, 22, 7, 19, 8, 13, 4, 14, 0],
            0,
          ],
          [
            [15, 18, 23, 25, 30, 19],
            [13, 34, 12, 43, 2, 42],
            [15, 11, 15, 28, 13, 35],
            [12, 15, 11, 34, 3, 34, 0, 21, 2, 10],
            [15, 18, 7, 22, 3, 29],
            [13, 34, 20, 40, 17, 48],
            [23, 11, 19, 12, 13, 8, 14, 4],
            [9, 8, 20, 19, 25, 15, 22, 11, 19, 12, 13, 8, 14, 4],
            [16, 6, 16, 8, 17, 8],
          ],
          [
            [15, 15, 13, 23, 15, 31],
            [14, 32, 18, 41, 8, 39],
            [15, 8, 16, 24, 14, 31],
            0,
            [16, 15, 17, 24, 19, 32],
            [13, 31, 12, 41, 10, 49],
            [24, 7, 19, 8, 13, 4, 14, 0],
            [9, 4, 20, 15, 26, 11, 22, 7, 19, 8, 13, 4, 14, 0],
            0,
          ],
          [
            [15, 13, 11, 18, 12, 27],
            [13, 29, 22, 35, 16, 41],
            [16, 4, 16, 21, 13, 29],
            [13, 8, 12, 27, 4, 27, 0, 14, 3, 3],
            [16, 13, 18, 21, 25, 24],
            [13, 29, 9, 38, 4, 46],
            [24, 3, 19, 4, 14, 1, 15, -4],
            [10, 1, 21, 11, 26, 7, 23, 3, 19, 4, 14, 1, 15, -4],
            [16, -1, 16, 1, 17, 1],
          ],
        ],
      ],
      sitting: [
        [
          [[14, 14, 8, 18, 7, 27], "chTopL", "", 0],
          [[15, 33, 19, 41, 23, 48], "chBottomL", "", 0],
          [[16, 8, 16, 24, 14, 33], "chTopC", "", 0],
          [[13, 11, 12, 30, 4, 30, 0, 17, 3, 6], "", "back", 1],
          [[16, 15, 21, 23, 28, 19], "chTopR", "", 0],
          [[14, 33, 8, 41, 1, 44], "chBottomR", "", 0],
          [[24, 7, 19, 8, 13, 4, 14, 0], "", "skin", 1],
          [[9, 4, 20, 15, 26, 11, 22, 7, 19, 8, 13, 4, 14, 0], "", "hair", 1],
          [[16, 2, 16, 4, 17, 4], "", "#000", 1],
        ],
        [
          [
            [15, 18, 14, 25, 21, 31],
            [8, 37, 17, 40, 16, 49],
            [18, 13, 12, 30, 7, 36],
            [16, 15, 7, 32, 0, 29, 1, 15, 8, 6],
            [17, 18, 16, 25, 23, 31],
            [7, 38, 16, 40, 13, 49],
            [25, 16, 21, 14, 19, 8, 22, 5],
            [16, 5, 18, 20, 24, 21, 24, 16, 21, 14, 19, 8, 23, 5],
            [22, 9, 21, 9, 22, 11],
          ],
          [
            [9, 20, 9, 27, 16, 33],
            [7, 39, 17, 40, 15, 49],
            [10, 14, 10, 31, 8, 39],
            [7, 17, 6, 36, -2, 37, -6, 23, -3, 12],
            [9, 20, 12, 27, 19, 32],
            [7, 41, 16, 41, 13, 49],
            [18, 17, 13, 16, 9, 10, 12, 7],
            [6, 8, 11, 23, 17, 21, 16, 16, 13, 16, 9, 10, 12, 7],
            [13, 10, 12, 11, 13, 12],
          ],
        ],
        400,
        !0,
      ],
      falling: [
        [
          [[15, 16, 16, 24, 22, 30], "chTopL", "", 0],
          [[15, 33, 19, 41, 23, 48], "chBottomL", "", 0],
          [[16, 8, 16, 25, 14, 33], "chTopC", "", 0],
          [[13, 12, 12, 31, 4, 31, 0, 17, 3, 7], "", "back", 1],
          [[14, 33, 8, 41, 0, 44], "chBottomR", "", 0],
          [[23, 10, 18, 9, 15, 3, 18, 0], "", "skin", 1],
          [[12, 1, 16, 16, 23, 15, 22, 10, 18, 9, 15, 3, 18, 0], "", "hair", 1],
          [[19, 3, 17, 4, 19, 5], "", "#000", 1],
          [[16, 16, 17, 23, 23, 29], "chTopR", "", 0],
        ],
        [
          [
            [15, 16, 18, 24, 27, 25],
            [15, 33, 24, 34, 31, 39],
            0,
            0,
            [14, 33, 16, 41, 5, 41],
            0,
            0,
            0,
            [16, 16, 24, 16, 32, 12],
          ],
          [
            [15, 16, 23, 17, 32, 16],
            [15, 33, 24, 34, 18, 43],
            0,
            0,
            [14, 33, 24, 34, 20, 43],
            0,
            0,
            0,
            [16, 16, 25, 12, 32, 6],
          ],
          [
            [15, 16, 19, 10, 19, 2],
            [15, 34, 14, 43, 12, 50],
            0,
            0,
            [14, 33, 15, 43, 11, 51],
            0,
            0,
            0,
            [16, 16, 21, 10, 22, 2],
          ],
        ],
        500,
        !0,
      ],
      hiding: [
        [
          [[14, 16, 14, 23, 21, 29], "chTopL", "", 0],
          [[15, 33, 17, 42, 17, 49], "chBottomL", "", 0],
          [[16, 8, 16, 25, 14, 33], "chTopC", "", 0],
          [[13, 11, 12, 30, 4, 31, 0, 17, 3, 6], "", "back", 1],
          [[13, 33, 13, 42, 11, 50], "chBottomR", "", 0],
          [[24, 10, 19, 9, 16, 3, 19, 0], "", "skin", 1],
          [[13, 1, 17, 16, 23, 15, 22, 10, 19, 9, 16, 3, 19, 0], "", "hair", 1],
          [[20, 3, 18, 4, 20, 5], "", "#000", 1],
          [[16, 16, 17, 24, 24, 27], "chTopR", "", 0],
        ],
        [
          [
            [20, 23, 19, 30, 23, 40],
            [18, 40, 15, 50, 5, 50],
            [20, 15, 20, 32, 18, 40],
            [17, 20, 16, 39, 8, 39, 4, 25, 7, 15],
            [19, 40, 27, 42, 23, 50],
            [28, 16, 23, 15, 19, 10, 21, 6],
            [15, 9, 22, 22, 28, 20, 27, 16, 23, 15, 19, 10, 21, 6],
            [22, 9, 21, 10, 22, 11],
            [20, 22, 21, 30, 25, 37],
          ],
        ],
        300,
        !0,
      ],
      drinking: [
        [
          [[15, 20, 15, 28, 21, 34], "chTopL", "", 0],
          [[14, 39, 23, 41, 20, 49], "chBottomL", "", 0],
          [[15, 15, 15, 31, 14, 40], "chTopC", "", 0],
          [[13, 17, 12, 36, 4, 36, 0, 23, 3, 12], "", "back", 1],
          [[14, 41, 22, 42, 19, 49], "chBottomR", "", 0],
          [[23, 16, 19, 16, 15, 10, 18, 7], "", "skin", 1],
          [
            [11, 8, 17, 23, 24, 21, 22, 16, 19, 16, 15, 10, 18, 7],
            "",
            "hair",
            1,
          ],
          [[19, 9, 17, 11, 19, 11], "", "#000", 1],
          [[15, 20, 18, 27, 25, 33], "chTopR", "", 0],
          [[25, 27, 26, 35, 30, 35, 31, 27], "", "cup", 1],
        ],
        [
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            [16, 21, 21, 25, 29, 21],
            [27, 17, 31, 24, 35, 22, 32, 14],
          ],
          [
            0,
            0,
            0,
            0,
            0,
            [24, 14, 19, 15, 14, 11, 15, 7],
            [10, 11, 20, 22, 25, 19, 22, 15, 19, 15, 14, 11, 15, 7],
            [17, 10, 16, 11, 18, 11],
            [15, 20, 22, 22, 28, 16],
            [24, 15, 31, 19, 33, 16, 28, 10],
          ],
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            [16, 20, 21, 25, 29, 23],
            [28, 19, 30, 26, 34, 25, 33, 17],
          ],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ],
        1500,
      ],
    };
    const r = {
      finish: !1,
      canRun: !0,
      walkingIn: !1,
      walkingOut: !1,
      resting: !1,
      restPoints: [
        [0, 400, 450],
        [8100, 200, 250],
        [24100, 200, 250],
        [36100, 150, 200],
      ],
    };
    let o,
      i,
      a,
      s = new Vector(),
      l = 0.1,
      h = 0,
      g = 1.5;
    const d = [28, 48],
      w = { DYING_TIME: 2e3, type: 0, dead: !1, dying: !1, startDying: 0 };
    let p = !1;
    function y() {
      if (r.resting || r.walkingIn || r.walkingOut) {
        if (r.walkingIn) {
          r.restPoints.filter((t) => a.x >= t[0] + t[1] && a.x < t[0] + t[2])
            .length &&
            ((r.resting = !0),
            (r.walkingIn = !1),
            (o = new Anim(...n.sitting)),
            (i = 0),
            s.apply(new Vector()),
            setTimeout(() => {
              r.resting &&
                ((o = new Anim(...n.drinking)),
                (i = 0),
                s.apply(new Vector()),
                a.add(new Vector(-6, 0)));
            }, 1500));
        } else if (r.walkingOut) {
          r.restPoints.filter(
            (t) => a.x >= t[0] + t[2] && a.x < t[0] + t[2] + 200
          ).length && ((r.walkingOut = !1), f());
        }
      } else {
        r.restPoints.filter((t) => a.x > t[0] && a.x < t[0] + t[1]).length &&
          ((r.walkingIn = !0), m());
      }
    }
    function u(t) {
      (w.type = t),
        (w.startDying = +new Date()),
        (w.dead = !1),
        (w.dying = !0),
        (o = new Anim(...n.falling)),
        (i = 0),
        s.apply(new Vector()),
        t || s.apply(new Vector(-3, 3));
    }
    function f() {
      (o = new Anim(...n.running, 100)), (i = e);
    }
    function m() {
      (o = new Anim(...n.walking, 200)), (i = t);
    }
    function x() {
      const t = mountain.getBlock(a.x);
      "hole" !== t.type || barricades.checkBridges(t.id) || u(1),
        barricades.checkPanels(a)
          ? p ||
            ((p = !0),
            (o = new Anim(...n.hiding)),
            (i = 0),
            s.apply(new Vector()))
          : p && ((p = !1), f()),
        avalanche.collision(a, 30) && u(0);
    }
    return {
      isFinish: () => r.finish,
      isResting: () => r.resting,
      isDead: () => w.dead,
      interaction: () => {
        r.resting && ((r.resting = !1), (r.walkingOut = !0), m());
      },
      i: () => {
        (a = new Vector(200, 0)), (i = e), f();
      },
      reset: () => {
        (w.dead = !1),
          (w.dying = !1),
          (r.finish = !1),
          (s = new Vector()),
          (l = 0.1),
          (h = 0),
          (g = 1.5),
          (a = new Vector(200, 0)),
          (i = e),
          f();
      },
      n: () => {
        if (w.dead) return !1;
        if (w.dying || r.finish) {
          if (w.dying)
            if (w.type)
              a.add(new Vector(0.3, -1)),
                (h += 0.02),
                (g = g - 0.013 < 0 ? 0 : g - 0.013);
            else {
              let t = s.get().normalize().mult(-0.017);
              t.add(gc.gravity.get().mult(0.1)),
                s.add(t),
                a.add(s),
                a.y < mountain.getHeight(a.x) - 20 &&
                  (a.y = mountain.getHeight(a.x) - 20),
                (h -= 0.02);
            }
        } else {
          const e = mountain.getDirection(a.x);
          s.x <= i
            ? ((s.x += l), (s.x = s.x > i ? i : s.x))
            : ((s.x -= l), (s.x = s.x < i ? i : s.x)),
            i > t && particles.addRunning(a),
            a.add(new Vector(e.x * s.x, 0)),
            (a.y = mountain.getHeight(a.x)),
            a.x > 4e4 &&
              ((r.finish = !0),
              (o = new Anim(...n.hiding)),
              (i = 0),
              s.apply(new Vector())),
            y(),
            x();
        }
        w.dying &&
          +new Date() - w.startDying >= w.DYING_TIME &&
          ((w.dead = !0), (w.dying = !1));
      },
      r: () => {
        c.save(),
          c.translate(a.x, gc.res.y - a.y - d[1] / 2),
          c.rotate(h),
          c.scale(g > 1 ? 1 : g, g > 1 ? 1 : g),
          draw.r(o.n(), d, 6),
          c.restore();
      },
      getPosition: () => a,
    };
  })()),
  (window.avalanche = (() => {
    let t,
      e,
      n = [];
    const r = 500;
    function o() {
      if (
        (function () {
          const t = character.getPosition().x;
          return (
            (t > 1100 && t < 8e3 - gc.res.x) ||
            (t > 8900 && t < 24e3 - gc.res.x) ||
            (t > 24900 && t < 36e3 - gc.res.x) ||
            (t > 36700 && t < 4e4 - gc.res.x)
          );
        })() &&
        +new Date() - e >= r
      ) {
        const r = +new Date() - t;
        (r >= 4e3 || rFloat(0, 1) < 0.1 + (r / 4e3) * 0.6) &&
          (n.push(new Stone()), (t = +new Date())),
          (e = +new Date());
      }
    }
    return {
      collision: (t, e) => {
        let r = !1;
        return (
          n.forEach((n) => {
            n.collision(t, e) && (r = !0);
          }),
          r
        );
      },
      i: () => {
        (e = +new Date()), (t = +new Date());
      },
      reset: () => {
        (n = []), (e = +new Date()), (t = +new Date());
      },
      n: () => {
        o(),
          (n = n.filter((t) => t.isActive())).forEach((t) => {
            t.n();
          });
      },
      r: () => {
        n.forEach((t) => {
          t.r();
        });
      },
    };
  })()),
  (window.mountain = (() => {
    const t = [
        [
          48, 4, 15, 43, 37, 90, 59, 86, 73, 129, 97, 109, 114, 76, 166, 75,
          150, 33, 119, 0,
        ],
        [
          48, 4, 2, 67, 28, 118, 54, 102, 78, 109, 97, 136, 117, 111, 187, 98,
          141, 60, 118, 2,
        ],
        [48, 4, 0, 43, 58, 122, 110, 137, 133, 95, 198, 96, 119, 1],
      ],
      e = 100,
      n = 0.08,
      r = [],
      o = [
        [-200, 0, 1200],
        [8e3, 3e3, 800],
        [24e3, 6500, 800],
        [36e3, 10500, 600],
      ],
      i = [44e3, 1e4],
      a = 12500,
      s = 4e4;
    let h, g, d;
    function w() {
      const t = [];
      return (
        r.forEach((r) => {
          if ("empty" === r.type) {
            const o = r.start.distance(r.end);
            if (o > 2 * e) {
              const e = r.start.angle(r.end),
                c = r.start.center(r.end),
                i = -n + rFloat(0, 2 * n),
                a = new Vector(
                  -Math.sin(e) * (o * i) + c.x,
                  Math.cos(e) * (o * i) + c.y
                );
              t.push({
                o: r,
                n: [
                  {
                    type: "empty",
                    start: r.start.get(),
                    end: a.get(),
                    angle: r.start.get().angle(a.get()),
                    direction: a.get().sub(r.start.get()).normalize(),
                  },
                  {
                    type: "empty",
                    start: a.get(),
                    end: r.end.get(),
                    angle: a.get().angle(r.end.get()),
                    direction: r.end.get().sub(r.start.get()).normalize(),
                  },
                ],
              });
            }
          }
        }),
        t.forEach((t) => {
          r.splice(r.indexOf(t.o), 1, t.n[0], t.n[1]);
        }),
        !!t.length
      );
    }
    function p() {
      o.forEach((t, e) => {
        const n = o[e + 1] || [s, a];
        r.push({
          type: "camp",
          start: new Vector(t[0], t[1]),
          end: new Vector(t[0] + t[2], t[1]),
          angle: 0,
          direction: new Vector(1, 0),
        }),
          r.push({
            type: "empty",
            start: new Vector(t[0] + t[2], t[1]),
            end: new Vector(n[0], n[1]),
          });
      }),
        r.push({
          type: "empty",
          start: new Vector(s, a),
          end: new Vector(i[0], i[1]),
        });
      let e = !0;
      for (; e; ) e = w();
      !(function () {
        let e = -1;
        r.map((n) => {
          if ("empty" === n.type && n.start.x > 3e3 && n.start.x < o[3][0]) {
            if (e > 1 && rFloat(0, 1) <= 0.1 + (e / 100) * 0.9) {
              const r = rInt(0, 3),
                o = t[r][0];
              rFloat(1, 3),
                (n.type = "hole"),
                (n.g = t[r].map((e, c) =>
                  c
                    ? 1 === c
                      ? n.start.y
                      : c === t[r].length - 2
                      ? n.end.x
                      : c === t[r].length - 1
                      ? n.end.y
                      : c % 2
                      ? c % 2
                        ? n.start.y - 4 * e
                        : e
                      : n.start.x + e - o
                    : n.start.x
                )),
                (e = -1);
            }
            e++;
          }
          return n;
        });
      })(),
        r.map((t, e) => ((t.id = e), t)),
        (d = new MountainDecoration(r));
    }
    function y(t) {
      return r.filter((e) => e.start.x <= t && e.end.x > t);
    }
    return {
      i: () => {
        p();
      },
      n: () => {},
      r: () => {
        c.save(),
          c.translate(0, gc.res.y),
          (c.lineWidth = 10),
          (c.lineJoin = "round"),
          (h = c.createLinearGradient(s / 2, 0, s / 2, -a)).addColorStop(
            0,
            color.get("g1")
          ),
          h.addColorStop(2500 / a, color.get("g2")),
          h.addColorStop(3300 / a, color.get("g3")),
          h.addColorStop(5e3 / a, color.get("g3")),
          h.addColorStop(6500 / a, color.get("g4")),
          h.addColorStop(10500 / a, color.get("g4")),
          h.addColorStop(1, color.get("g5")),
          (c.strokeStyle = h),
          (g = c.createLinearGradient(s / 2, 0, s / 2, -a)).addColorStop(
            0,
            color.get("gf1")
          ),
          g.addColorStop(2500 / a, color.get("gf2")),
          g.addColorStop(3300 / a, color.get("gf3")),
          g.addColorStop(5e3 / a, color.get("gf3")),
          g.addColorStop(6500 / a, color.get("gf4")),
          g.addColorStop(10500 / a, color.get("gf4")),
          g.addColorStop(1, color.get("gf5")),
          (c.fillStyle = g),
          bp(),
          r
            .filter(
              (t) =>
                t.end.x >= camera.getView().start.x &&
                t.start.x <= camera.getView().end.x
            )
            .forEach((t, e, n) => {
              if ((e || m(t.start.x, -t.start.y), "hole" === t.type))
                for (let e = 0; e < t.g.length; e += 2) l(t.g[e], -t.g[e + 1]);
              else l(t.end.x, -t.end.y);
              e === n.length - 1 && (l(t.end.x, 1400), l(r[0].start.x, 1400));
            }),
          c.fill(),
          c.stroke(),
          cp(),
          d.r(),
          c.restore();
      },
      getBlock: (t) => y(t)[0],
      isHole: (t) => {
        const e = y(t);
        return !!e[0] && "hole" === e[0].type;
      },
      getHeight: (t) => {
        const e = y(t);
        if (e[0]) {
          let n = (t - e[0].start.x) / (e[0].end.x - e[0].start.x);
          return e[0].start.y + 5 + (e[0].end.y + 5 - (e[0].start.y + 5)) * n;
        }
        return -1;
      },
      getAngle: (t) => {
        const e = y(t);
        return e[0] ? e[0].angle : 0;
      },
      getDirection: (t) => {
        const e = y(t);
        return e[0] ? e[0].direction.get() : new Vector();
      },
      getTrip: () => r,
    };
  })()),
  (window.objects = (() => {
    let t = [];
    return {
      i: () => {
        mountain
          .getTrip()
          .filter((t) => "hole" !== t.type && "camp" !== t.type)
          .forEach((e) => {
            if (e.start.x > 1e3 && e.start.x < 1e4 && !rInt(0, 5)) {
              const n = rInt(e.start.x, e.end.x),
                r =
                  e.start.y +
                  5 +
                  (e.end.y + 5 - (e.start.y + 5)) *
                    ((n - e.start.x) / (e.end.x - e.start.x));
              t.push(new Bush(new Vector(n, r)));
            }
            if (e.start.x > 1e3 && e.start.x < 36e3) {
              const n = Math.floor(rFloat(0, 1 + 2 * (1 - e.start.x / 36e3)));
              for (let r = 0; r < n; r++) {
                const n = rInt(e.start.x, e.end.x),
                  r =
                    e.start.y +
                    5 +
                    (e.end.y + 5 - (e.start.y + 5)) *
                      ((n - e.start.x) / (e.end.x - e.start.x));
                t.push(new Tree(new Vector(n, r)));
              }
            }
          }),
          t.push(new House(new Vector(670, 0), void 0, !1)),
          t.push(new Owl(new Vector(670, 75))),
          t.push(new Campfire(new Vector(450, 0))),
          t.push(new Campfire(new Vector(8350, 3e3))),
          t.push(new Campfire(new Vector(24350, 6500))),
          t.push(new Campfire(new Vector(36300, 10500))),
          [396, 504, 8296, 8404, 24296, 24404, 36246, 36354].forEach((e) => {
            t.push(new Bench(new Vector(e, mountain.getHeight(e) - 5), !1));
          }),
          [
            100, 140, 200, 580, 850, 940, 8100, 8180, 8450, 8600, 24050, 24200,
            24480, 24640,
          ].forEach((e) => {
            t.push(new Tree(new Vector(e, mountain.getHeight(e) - 5), 1));
          });
      },
      n: () => {
        t.forEach((t) => {
          t.n();
        });
      },
      r: (e) => {
        t.filter((t) =>
          gc.paused
            ? t.position.x >= camera.getView().start.x &&
              t.position.x <= camera.getView().end.x &&
              (t instanceof Campfire ||
                t instanceof Bench ||
                t instanceof House)
            : t.position.x >= camera.getView().start.x &&
              t.position.x <= camera.getView().end.x &&
              ((!e && !t.front) || (e && t.front))
        ).forEach((t) => {
          t.r();
        });
      },
    };
  })()),
  (window.camera = (() => {
    let t,
      e,
      n = new Vector(200, -100),
      r = { start: new Vector(), end: new Vector() };
    return {
      i: () => {
        (t = new Vector(200, 0)), (e = new Vector());
      },
      reset: () => {
        (t = new Vector(200, 0)), (e = new Vector());
      },
      n: (o) => {
        const c = o.get().sub(t);
        (c.x *= 0.05),
          (c.y *= 0.05),
          t.add(c),
          t.x > 4e4 - gc.res.x / 2 + 200 && (t.x = 4e4 - gc.res.x / 2 + 200),
          t.y > 12500 - gc.res.y / 2 - 100 &&
            (t.y = 12500 - gc.res.y / 2 - 100);
        const i = new Vector(
          5 - (gc.mousePosition.x / (gc.res.x * gc.ratio)) * 10,
          5 - (gc.mousePosition.y / (gc.res.y * gc.ratio)) * 10
        );
        e.apply(new Vector(-t.x, t.y).add(n).add(i)),
          (r.start = new Vector(t.x - 400, 0)),
          (r.end = new Vector(t.x + gc.res.x, 0));
      },
      getPosition: () => e,
      getView: () => r,
    };
  })()),
  (window.scene = (() => ({
    interaction: (t) => {
      character.isResting() || barricades.add(t), character.interaction(t);
    },
    i: () => {
      sky.i(),
        sun.i(),
        camera.i(),
        mountain.i(),
        character.i(),
        avalanche.i(),
        objects.i();
    },
    n: () => {
      sky.n(),
        sun.n(),
        character.n(),
        particles.n(),
        mountain.n(),
        objects.n(),
        avalanche.n(),
        barricades.n(),
        camera.n(character.getPosition()),
        weather.n();
    },
    r: () => {
      if (gc.paused)
        splashScreen.r(),
          c.save(),
          c.translate(camera.getPosition().x, camera.getPosition().y),
          objects.r(),
          character.r(),
          c.restore();
      else {
        c.save();
        let t = c.createLinearGradient(0, 0, 0, gc.res.y);
        t.addColorStop(0, color.get("st")),
          t.addColorStop(0.75, color.get("sb")),
          (c.fillStyle = t),
          c.fillRect(0, 0, gc.res.x, gc.res.y),
          sky.r(),
          sun.r(),
          c.save(),
          c.translate(camera.getPosition().x, camera.getPosition().y),
          objects.r(!1),
          mountain.r(),
          character.r(),
          particles.r(),
          avalanche.r(),
          barricades.r(),
          objects.r(!0),
          c.restore(),
          weather.r(),
          c.save(),
          (c.globalAlpha = 0.2 * gc.sunset),
          (c.fillStyle = "rgb(253, 111, 34)"),
          c.fillRect(0, 0, gc.res.x, gc.res.y),
          c.restore(),
          c.restore();
      }
    },
  }))()),
  (window.splashScreen = (() => ({
    n: () => {},
    r: () => {
      c.save(),
        (c.fillStyle = "rgba(0, 0, 0, .2)"),
        c.rect(0, 0, gc.res.x, gc.res.y),
        c.fill(),
        c.save(),
        c.translate(gc.res.x / 2, 150),
        (c.font = "120px Courier New"),
        (c.textAlign = "left"),
        (c.fillStyle = "white"),
        c.fillText("Hoverla", 0, 0),
        c.translate(0, 200),
        (c.font = "40px Courier New"),
        c.fillText("Try to reach the peak!", 30, 0),
        c.restore(),
        (gc.byDeath || gc.byWin) &&
          (c.save(),
          c.translate(50, 150),
          (c.font = "60px Courier New"),
          (c.textAlign = "let"),
          (c.fillStyle = gc.byDeath ? "#ed6031" : "#61bd62"),
          c.fillText(gc.byDeath ? "[Try Again]" : "[You Did It]", 0, 0),
          c.restore()),
        c.restore();
    },
  }))()),
  (window.particles = (function () {
    let t = [],
      e = +new Date();
    return {
      reset: () => {
        t = [];
      },
      addRunning: (n) => {
        if (+new Date() - e < 400) return !1;
        for (let e = 0; e < 10; e++)
          t.push(
            new Particle(
              rFloat(0.1, 0.15),
              1,
              n.get(),
              new Vector(rFloat(0, 2), rFloat(1.5, 1.8)),
              500,
              "walking"
            )
          );
        e = +new Date();
      },
      addRockRolling: (e, n) => {
        for (let r = 0; r < n; r++)
          t.push(
            new Particle(
              rFloat(0.1, 0.15),
              rInt(1, 4),
              e.get(),
              new Vector(rFloat(-2, 2), rFloat(-1, 3)),
              500,
              ["rock1", "rock2", "rock3", "rock4"][rInt(0, 4)]
            )
          );
      },
      dying: (e, n) => {
        for (let r = 0; r < 30; r++)
          t.push(
            new Particle(
              rFloat(0.1, 0.3),
              rInt(3, 10),
              e.get(),
              new Vector(
                rFloat(0.5, 2) * Math.sin(rFloat(0, 2 * Math.PI)),
                rFloat(0.5, 2) * Math.cos(rFloat(0, 2 * Math.PI))
              ),
              500,
              n[rInt(0, n.length)]
            )
          );
      },
      n: () => {
        t = t.filter(function (t) {
          return t.n(), t.isActive;
        });
      },
      r: () => {
        t.forEach(function (t) {
          t.r();
        });
      },
    };
  })()),
  (window.sky = (() => {
    const t = [];
    return {
      i: () => {
        for (let e = 0; e < 200; e++)
          t.push([rInt(0, gc.res.x), rInt(0, gc.res.y), rFloat(0.3, 3)]);
      },
      n: () => {},
      r: () => {
        c.save(),
          (c.globalAlpha = gc.night),
          t.forEach((t) => {
            bp(),
              (c.fillStyle = "white"),
              c.rect(t[0], t[1], t[2], t[2]),
              c.fill(),
              cp();
          }),
          c.restore();
      },
    };
  })()),
  (window.sun = (() => {
    let t,
      e,
      n = Math.PI,
      r = { day: !0, part: Math.cos(n) };
    return {
      getTime: () => r,
      getPosition: () => t,
      i: () => {
        (t = new Vector()), (e = new Vector());
      },
      n: () => {
        (n += 8e-4) > 2 * Math.PI && (n -= 2 * Math.PI),
          (r.part = Math.cos(n)),
          (r.day = n >= Math.PI && n <= 2 * Math.PI),
          t.apply(
            new Vector(
              gc.res.x / 2 + (gc.res.x / 2) * Math.cos(n),
              gc.res.y + 0.7 * gc.res.y * Math.sin(n)
            )
          ),
          (e = new Vector(
            gc.res.x / 2 + (gc.res.x / 2) * Math.cos(n + Math.PI),
            gc.res.y + 0.7 * gc.res.y * Math.sin(n + Math.PI)
          ));
      },
      r: () => {
        c.save(),
          c.translate(t.x, t.y),
          (c.fillStyle = "rgb(253, 214, 49)"),
          bp(),
          c.arc(30, 30, 30, 0, 2 * Math.PI),
          c.fill(),
          cp(),
          c.restore(),
          c.save(),
          c.translate(e.x, e.y),
          (c.miterLimit = 4),
          (c.fillStyle = "#FCFC65"),
          bp(),
          m(68, 55),
          c.bezierCurveTo(45, 58, 25, 42, 23, 19),
          c.bezierCurveTo(22, 12, 23, 6, 26, 0),
          c.bezierCurveTo(9, 5, -1, 22, 0, 41),
          c.bezierCurveTo(2, 62, 22, 78, 43, 76),
          c.bezierCurveTo(57, 74, 68, 66, 74, 54),
          c.bezierCurveTo(72, 55, 70, 55, 68, 55),
          cp(),
          c.fill(),
          c.restore();
      },
    };
  })()),
  (window.color = (() => {
    const t = {
      st: ["hsl(214, 100%, c%)", 75],
      sb: ["hsl(214, 100%, c%)", 90],
      g1: ["hsl(87, 39%, c%)", 66],
      g2: ["hsl(87, 39%, c%)", 75],
      g3: ["hsl(206, 3%, c%)", 58],
      g4: ["hsl(181, 5%, c%)", 100],
      g5: ["hsl(181, 79%, c%)", 85],
      gf1: ["hsl(31, 24%, c%)", 39],
      gf2: ["hsl(31, 24%, c%)", 45],
      gf3: ["hsl(206, 3%, c%)", 48],
      gf4: ["hsl(181, 5%, c%)", 90],
      gf5: ["hsl(181, 79%, c%)", 75],
      chTopL: ["hsl(37, 56%, c%)", 40],
      chTopC: ["hsl(37, 56%, c%)", 45],
      chTopR: ["hsl(37, 56%, c%)", 54],
      chBottomL: ["hsl(94, 5%, c%)", 40],
      chBottomR: ["hsl(94, 5%, c%)", 52],
      skin: ["hsl(33, 80%, c%)", 75],
      hair: ["hsl(33, 22%, c%)", 35],
      back: ["hsl(96, 30%, c%)", 60],
      benchTop: ["hsl(42, 41%, c%)", 41],
      benchBottom: ["hsl(42, 41%, c%)", 31],
      smoke: ["hsl(224, 4%, c%)", 84],
      tree1Bottom: ["hsl(17, 81%, c%)", 30],
      tree1_1: ["hsl(154, 43%, c%)", 31],
      tree1_2: ["hsl(170, 36%, c%)", 35],
      tree1_3: ["hsl(169, 21%, c%)", 48],
      tree2Bottom: ["hsl(30, 84%, c%)", 30],
      tree2_1: ["hsl(154, 43%, c%)", 31],
      tree2_2: ["hsl(127, 34%, c%)", 30],
      tree2_3: ["hsl(109, 29%, c%)", 36],
      walking: ["hsl(224, 4%, c%)", 75],
      rock1: ["hsl(260, 2%, c%)", 75],
      rock2: ["hsl(260, 2%, c%)", 65],
      rock3: ["hsl(260, 2%, c%)", 55],
      rock4: ["hsl(260, 2%, c%)", 45],
      snow: ["hsl(181, 5%, c%)", 90],
      brown1: ["hsl(42, 41%, c%)", 41],
      brown2: ["hsl(33, 33%, c%)", 55],
      brown3: ["hsl(39, 58%, c%)", 33],
      brown4: ["hsl(17, 81%, c%)", 23],
      brown5: ["hsl(52, 36%, c%)", 52],
      cup: ["hsl(15, 69%, c%)", 49],
      camp1: ["hsl(11, 77%, c%)", 37],
      camp2: ["hsl(112, 49%, c%)", 9],
      owl1: ["hsl(28, 8%, c%)", 37],
      owl2: ["hsl(28, 8%, c%)", 11],
    };
    return {
      i: () => {},
      n: () => {},
      get: (e) => {
        if (!t[e]) return !1;
        let n = t[e][1] - 70 * gc.night;
        return (n = n >= 0 ? n : 0), t[e][0].replace("c", n);
      },
    };
  })()),
  (window.draw = (() => ({
    r: (t, e, n) => {
      c.save(),
        e && c.translate(-e[0] / 2, -e[1] / 2),
        t.forEach((t) => {
          bp(),
            (c.fillStyle = color.get(t[2]) || t[2] || "transparent"),
            (c.strokeStyle = color.get(t[1]) || t[1] || "transparent"),
            (c.lineWidth = t[3] ? 1 : n),
            (c.lineJoin = "round"),
            m(t[0][0], t[0][1]);
          for (let e = 2; e < t[0].length; e += 2) l(t[0][e], t[0][e + 1]);
          t[3] && cp(), c.stroke(), t[3] && c.fill();
        }),
        c.restore();
    },
  }))()),
  (window.weather = (function () {
    let t = [!1],
      e = +new Date(),
      n = 5e3;
    return {
      n: () => {
        (t = t.filter(
          (e, n) => (e && e.n(n < t.length - 1), !1 === e || e.active)
        )),
          e + n <= +new Date() &&
            (function () {
              let r = rInt(0, 3);
              (e = +new Date()),
                (t = t.filter(function (t) {
                  return t;
                })),
                r
                  ? 1 === r
                    ? (t.push(new Snow()), (n = rInt(2e4, 7e4)))
                    : (t.push(new Rain()), (n = rInt(2e4, 7e4)))
                  : (t.push(!1), (n = rInt(2e4, 4e4)));
            })();
      },
      r: () => {
        t.forEach((t) => {
          c.save(), t && t.r(), c.restore();
        });
      },
    };
  })());
