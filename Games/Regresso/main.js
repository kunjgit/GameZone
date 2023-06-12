var e = (e) => document.querySelector(e),
  a = (e) => document.querySelectorAll(e),
  o = (e, a, o) => e.addEventListener(a, o),
  r = (e, a, o) => {
    var r = document.createElement(e);
    return r.classList.add(a), (r.innerHTML = o), r;
  },
  t = (a, n, s, i) => {
    if (e(`.log#${i} .new`)) setTimeout(() => t(a, n, s, i), 500);
    else {
      var l = r(
        "p",
        `${n}`,
        `<span class="icon">${s}</span><span class="${n}">${a}</span>`
      );
      l.classList.add("new"),
        e(`.log#${i}`).prepend(l),
        "restart" === n && o(l, "click", k),
        setTimeout(() => {
          l.classList.remove("new");
        }, 200);
    }
  },
  n = (a) => {
    e(a).style.visibility = "visible";
  },
  s = (a) => {
    e(a).classList.remove("hidden");
  },
  i = (a) => {
    e(a).classList.add("hidden");
  },
  l = (a) => {
    e(a).style.visibility = "hidden";
  },
  d = (a) => {
    n(`#${a}`), e("body").classList.add("blured");
  },
  c = (a) => {
    e(`#${a}`).classList.add("closed"), e("body").classList.remove("blured");
  },
  p = (e) => {
    let a = 0,
      o = 0,
      r = null;
    for (a = e.length - 1; a > 0; a -= 1)
      (o = Math.floor(Math.random() * (a + 1))),
        (r = e[a]),
        (e[a] = e[o]),
        (e[o] = r);
    return e;
  };
let u = [];
var h = (e, a) => {
  u.push(setTimeout(e, a));
};
let f = [];
var g = (e, a) => {
    f.push(setInterval(e, a));
  },
  v = () => {
    u.forEach(clearTimeout),
      (u = []),
      f.forEach(clearInterval),
      (f = []),
      clearInterval(me),
      clearInterval(be);
  },
  m = () => {
    v(),
      document.body.style.setProperty("--v", "0"),
      a(".actions button").forEach((e) => (e.style.visibility = "hidden")),
      a(".project").forEach((e) => e.remove()),
      e("#island").remove(),
      e("#main-image").append(V.cloneNode(!0)),
      a(".log").forEach((e) => (e.innerHTML = "")),
      (e("#island").style.filter = null),
      l("#score-board"),
      n("#ship"),
      e("#ship").classList.remove("go"),
      e("#ship").classList.remove("new"),
      ae(),
      resetData();
  },
  b = { foragers: 0, foraging: 0, hunters: 0, hunting: 0, loggers: 0, wood: 0 },
  y = () => {
    var o = (Z.getTime() - S.getTime()) / 864e5,
      r = e("#leave").disabled,
      t = a(".project.done").length,
      n = [
        "Days taken",
        o,
        "Population saved",
        P,
        "Projects completed",
        t,
        "Went back to the sea?",
        r ? "Yes" : "No",
      ];
    r && (n.push("Survived wrath of god?"), n.push(z <= U ? "Yes" : "No"));
    var s = Math.ceil((25 * P + 7 * t + (r ? 10 : 0)) * (1 - z) * (30 / o));
    (e("#score-board .modal .content").innerHTML =
      n.map((e) => `<span>${e}</span>`).join("") +
      `<p>Final Score</p><p>${s} pts</p>`),
      d("score-board");
  },
  w = (a, o, r, s) => () => {
    (b[a] += r), x();
    var i = Math.random() < s * G;
    i
      ? (t(
          `Wild animals killed ${re().name} while ${
            "wood" == a ? "logging" : a
          }`,
          "red",
          "💀",
          "info"
        ),
        (A += o - 1),
        (P -= 1),
        M("population", "red"))
      : (A += o),
      ue.weapons.unlocked ||
        (!i && "hunting" !== a) ||
        ((ue.weapons.unlocked = !0),
        t(
          "Hunters found dangerous animals; you need extra protection",
          "blue",
          "🛡",
          "info"
        ),
        M("projects", "blink"),
        ge("weapons")),
      !B &&
        _.food + b.foraging > 80 &&
        (n("#hunt"),
        M("hunt", "blink"),
        (B = !0),
        t(
          "Animals were sighted far in the valleys, hunting may be possible.",
          "blue",
          "🏹",
          "info"
        )),
      "wood" === a &&
        (!ue.carpentry.unlocked &&
          _.wood + b.wood > 5 &&
          ((ue.carpentry.unlocked = !0),
          t(
            "Develop carpentry to process wood more efficiently",
            "blue",
            "🔨",
            "info"
          ),
          ge("carpentry"),
          M("projects", "blink")),
        C ||
          (e("animate").beginElement(),
          (C = !0),
          t(
            "The crew rejoices the arrival of wood for cooking and heating.",
            null,
            "🔥",
            "info"
          ),
          O.push(() => {
            _.wood > 0 &&
              ((_.wood = Math.max(0, _.wood - 2)),
              ue.carpentry.done || M("wood", "red"));
          }))),
      le();
  };
function k() {
  m(), $e();
}
var $ = {
    leave: () => {
      t(
        `${P} people board the caravela and get ready for departure`,
        null,
        "⛵️",
        "info"
      ),
        e("#ship").classList.add("go"),
        (e("#leave").disabled = !0),
        l("#fishTrail"),
        l("#boatTrail"),
        (A = 0),
        le(),
        v(),
        h(
          z > 0.2
            ? () => {
                t(
                  "A violent storm suddenly formed. The ship sank and there were no survivors.",
                  null,
                  "⛈",
                  "info"
                ),
                  (P = 0),
                  le(),
                  we(),
                  h(y, 5e3);
              }
            : () => {
                t(
                  "The journey back was long, but the weather was perfect.",
                  null,
                  "🌤",
                  "info"
                ),
                  t("Fim.", null, "🌅", "info"),
                  h(y, 5e3);
              },
          7e3
        );
    },
    fetchWood: () => {
      A -= 1;
      var e = 0.6 * X;
      h(w("wood", 1, 3, 0.03), e), b.loggers++, x(), le(), ie(e, "ft", !0);
    },
    pray: () => {
      (A -= 1),
        (J = !0),
        h(() => {
          (A += 1), (J = !1), (z *= 0.7);
          var e = oe();
          t(
            `${e.name} is feeling envigorated after a day at the house of God. Praise the Lord!`,
            null,
            "✝️",
            "info"
          );
        }, X);
    },
    forage: () => {
      A -= 1;
      var e = 0.4 * X;
      h(w("foraging", 1, W, 0), e), b.foragers++, x(), le(), ie(e, "ft", !0);
    },
    hunt: () => {
      A -= 2;
      var e = 1.2 * X;
      h(w("hunting", 2, 20, 0.1), e),
        (b.hunters += 2),
        x(),
        le(),
        ie(e, "huntTrail", !0);
    },
    restart: () => {
      confirm("Restart current game?") && k();
    },
  },
  T = () => {
    a(".actions button").forEach((e) => {
      o(e, "click", $[e.id]);
    }),
      o(e("#projects"), "click", () => {
        pe.classList.toggle("closed"), (e("#requirements").innerText = null);
      }),
      o(e("#score-board button"), "click", k),
      o(e(".dismiss"), "click", () => {
        c("score-board");
      });
  },
  L = {
    wood: { r: "wood", e: "🌳" },
    foraging: { r: "food", e: "🌾" },
    hunting: { r: "food", e: "🏹" },
  },
  j = (e) => {
    b[e] < 1 ||
      (t(`+${b[e]}`, "green", L[e].e, "tasks"),
      (_[L[e].r] += b[e]),
      (b[e] = 0),
      M(L[e].r, "green"));
  },
  x = () => {
    clearInterval(Y),
      (Y = setInterval(() => {
        ["foraging", "hunting", "wood"].forEach(j),
          b.foragers &&
            (t(`${b.foragers}👤 went foraging.`, null, "🌾", "tasks"),
            (b.foragers = 0)),
          b.hunters &&
            (t(`${b.hunters}👥 went hunting .`, null, "🏹", "tasks"),
            (b.hunters = 0)),
          b.loggers &&
            (t(`${b.loggers}👤 went logging.`, null, "🌳", "tasks"),
            (b.loggers = 0)),
          le();
      }, R));
  },
  M = (a, o) => {
    e(`#${a}`).classList.add(o),
      h(
        () => {
          e(`#${a}`).classList.remove(o);
        },
        "no" === o ? 400 : 100
      );
  },
  I = () => {
    let e = _.food - P;
    if ((M("food", "red"), e >= 0)) (F = H), (H = 0), (_.food = e);
    else {
      var a = Math.min(H, -e);
      a > 0 &&
        (t(
          `${ne(te(a).map((e) => e.name))} died from starvation.`,
          "red",
          "💀",
          "info"
        ),
        (P -= a),
        (A -= a),
        (H = 0),
        M("population", "red"));
      var o = Math.min(F, -e);
      (F = Math.min(P - o, -e)),
        o > 0
          ? ((H = o),
            t(`${o} are starving and can't work.`, "red", "😔", "info"))
          : F > 0 &&
            t(
              `${oe().name} ${
                F > 2 ? `and ${F - 1} others are` : "is"
              } getting hungry`,
              null,
              "💭",
              "info"
            ),
        (_.food = 0);
    }
  },
  q = (e) => A - H >= e,
  D = () => {
    if ((de(), I(), P < 1))
      return (
        t(
          "Your population was decimated. <strong>Restart?<strong>",
          "restart",
          "☠️",
          "info"
        ),
        we(),
        void le()
      );
    O.forEach((e) => e()), le();
  },
  E = () => {
    e("#island").classList.toggle("night");
  },
  S = new Date("1549/08/13");
let V,
  _,
  P,
  A,
  F,
  H,
  N,
  W,
  B,
  C,
  G,
  R,
  Y,
  z,
  J,
  O,
  X,
  K = 0,
  Q = 1,
  U = 0.2,
  Z = new Date(S);
var resetData = () => {
    (_ = { wood: 0, food: K }),
      (P = 15),
      (A = 15),
      (F = 0),
      (H = 0),
      (N = 0),
      (W = 2),
      (B = !1),
      (C = !1),
      (G = 1),
      (R = 400),
      (Y = null),
      (z = 1),
      (J = !1),
      (O = []),
      (X = 1e4),
      (Z = new Date(S)),
      (V = e("#island").cloneNode(!0));
  },
  ee = p([
    ["Abraão", "👨🏻‍🦱"],
    ["Simão", "👨🏼‍🦱"],
    ["João", "👨🏻"],
    ["Jacinto", "🧔🏽"],
    ["Paulo", "👴🏼"],
    ["Tiago", "👦🏻"],
    ["Isaías", "🧑🏻"],
    ["Henrique", "👨🏼‍🦰"],
    ["Tomás", "🧓🏼"],
    ["Amélia", "👩🏼‍🦳"],
    ["Camila", "👩🏾‍🦱"],
    ["Benedita", "👩🏻‍🦱"],
    ["Madalena", "👩🏻"],
    ["Teresa", "👩🏼"],
    ["Lúcia", "👩🏼‍🦰"],
  ]).reduce((a, o) => {
    var t = r("div", "icon", o[1]);
    return (
      (t.id = o[0]),
      (t.title = o[0]),
      e(".ppl").append(t),
      a.push({ name: o[0], alive: !0 }),
      a
    );
  }, []),
  ae = () => {
    ee.map((a) => {
      (a.alive = !0), e(`#${a.name}`).classList.remove("dead");
    });
  },
  oe = () => {
    var e = ee.filter((e) => e.alive);
    return e[Math.round(Math.random() * (e.length - 1))];
  },
  re = () => {
    var a = oe();
    return (a.alive = !1), e(`#${a.name}`).classList.add("dead"), a;
  },
  te = (e) => {
    var a = [];
    for (let o = 0; o < e; o++) a.push(re());
    return a;
  },
  ne = (e) => {
    if (e.length < 2) return e[0];
    var a = e.join(", "),
      o = a.lastIndexOf(",");
    return a.substr(0, o) + " and" + a.substr(o + 1);
  };
let se = 0;
var ie = (a, o, r) => {
    var t = e(`#${o}`),
      n = r ? t.cloneNode() : t;
    let s = o;
    r && ((s = "trail" + ++se), (n.id = s), t.after(n)),
      setTimeout(() => {
        var e = Math.round(t.getTotalLength());
        "huntTrail" == o
          ? (n.style.strokeDasharray = `0,${e}px,0.5,1,0.5,1,0.5,1,0.5,100%`)
          : ("ft" == o &&
              (n.style.transform = `scaleX(${1 + 0.7 * Math.random() - 0.2})`),
            (n.style.strokeDasharray = `0,${e}px,${"boatTrail" == o ? 2 : 1}`));
      }, 100),
      setTimeout(() => {
        n.style.strokeDasharray = null;
      }, a / 2),
      r &&
        h(() => {
          n && n.remove();
        }, a);
  },
  le = () => {
    (e("#wood .value").innerText = _.wood),
      (e("#food .value").innerText = _.food),
      (e("#population .value").innerText = P),
      (e("#ready .value").innerText = Math.max(0, A - H)),
      (e("#starving .value").innerText = H),
      H < 1 ? i("#starving") : s("#starving"),
      (e("#fishers .value").innerText = N),
      N > 1 && s("#fishers"),
      (e("#forage .return").innerText = W),
      (e("#forage").disabled = !q(1)),
      (e("#fetchWood").disabled = !q(1)),
      (e("#hunt").disabled = !q(2)),
      (e("#pray").disabled = !q(1) || J);
  },
  de = () => {
    Z.setDate(Z.getDate() + 1),
      (e("#days .value").innerText = `${Z.getDate()} / ${
        Z.getMonth() + 1
      } / ${Z.getFullYear()}`);
  },
  ce = () => {
    var a = e("#ss");
    a.removeAttribute("transform"),
      e("#sail").beginElement(),
      e("#sink").beginElement(),
      setTimeout(() => {
        l("#ship"),
          a.transform.baseVal.appendItem(
            a.transform.baseVal.createSVGTransformFromMatrix(
              e("#island").createSVGMatrix()
            )
          ),
          a.transform.baseVal.appendItem(
            a.transform.baseVal.createSVGTransformFromMatrix(
              e("#island").createSVGMatrix()
            )
          ),
          a.transform.baseVal.getItem(1).setScale(-1, 1),
          a.transform.baseVal.getItem(0).setTranslate(-20, 0);
      }, 990 * (e("#sink").getSimpleDuration() - 2));
  },
  pe = e(".projects");
let ue;
var he = () => {
    ue = {
      fishing: {
        emoji: "🎣",
        done: !1,
        unlocked: !0,
        cost: { wood: 10, food: 10, ppl: 4, days: 2 },
        description: "Develop fishing tools (+3🍒/day, -1 ready 👤)",
        callback: () => {
          t(
            "Fishing preparations have been developed (+3 food per day).",
            "blue",
            "🎣",
            "info"
          ),
            n("#fh"),
            (A -= 1),
            N++,
            g(() => {
              ie(X / 3, "fishTrail", !1);
            }, X / 3),
            O.push(() => {
              (_.food += 3), t("+3🍒", "blue", "🐟", "tasks");
            });
        },
      },
      high_sea_fishing: {
        emoji: "🚣‍",
        done: !1,
        unlocked: !0,
        requires: ["shipyard", "fishing"],
        cost: { wood: 25, food: 10, ppl: 5, days: 5 },
        description: "Build a fishing boat (+5🍒/day, -1 ready 👤).",
        callback: () => {
          (A -= 1),
            N++,
            n("#boatTrail"),
            g(() => {
              ie(X / 2, "boatTrail", !1);
            }, X / 2),
            O.push(() => {
              (_.food += 5), t("+5🍒", "blue", "🐟", "tasks");
            });
        },
      },
      carpentry: {
        emoji: "🔨",
        done: !1,
        unlocked: !1,
        cost: { wood: 10, food: 10, ppl: 4, days: 2 },
        description:
          "Recycle wood and build better buildings (+5 wood per day)",
        callback: () => {
          t(
            "Carpentry was perfected, new buildings are now available.",
            "blue",
            "🔨",
            "info"
          ),
            M("projects", "blink"),
            ge("shipyard"),
            ge("spinning_wheel"),
            ge("chapel"),
            O.push(() => {
              (_.wood += 5),
                M("wood", "green"),
                t("+5🌳", "blue", "🔨", "tasks");
            });
        },
      },
      weapons: {
        emoji: "🛡",
        done: !1,
        unlocked: !1,
        description:
          "Produce weapons and armor (-75% chance of animal attack deaths)",
        cost: { wood: 50, food: 15, ppl: 4, days: 2 },
        callback: () => {
          G *= 0.25;
        },
      },
      spinning_wheel: {
        emoji: "🧶",
        done: !1,
        unlocked: !0,
        description:
          "Some foragers will start gathering fibers, spinning into thread, producing cloth. (-50% food from foraging)",
        cost: { wood: 10, food: 20, ppl: 2, days: 3 },
        callback: () => {
          t(
            "Foragers have started producing cloth from fibers.",
            "blue",
            "🧶",
            "info"
          ),
            (W -= 1),
            M("forage", "blink"),
            fe();
        },
      },
      shipyard: {
        emoji: "⚓",
        done: !1,
        unlocked: !0,
        requires: ["carpentry"],
        cost: { wood: 100, food: 10, ppl: 5, days: 7 },
        description: "Build a shipyard where boats and ships can be built.",
        callback: () => {
          t("The shipyard construction has finished!", "blue", "⚓", "info"),
            n("#sy"),
            ge("high_sea_fishing"),
            fe();
        },
      },
      caravela: {
        description:
          "Build a caravela and return home. Requires a shipyard, carpentry, textiles, as well as food for the trip.",
        emoji: "⛵️",
        done: !1,
        unlocked: !1,
        requires: ["shipyard", "spinning_wheel"],
        cost: { wood: 100, food: 200, ppl: 10, days: 8 },
        callback: () => {
          t(
            "The Caravela construction is complete! Shall we?",
            "green",
            "🌊",
            "info"
          ),
            n("#ship"),
            e("#ship").classList.add("new"),
            (e("#leave").disabled = !1),
            n("#leave");
        },
      },
      chapel: {
        description:
          "A place where people can gather to support, encorage and service each other.",
        requires: ["carpentry"],
        emoji: "🙏",
        cost: { wood: 20, food: 20, ppl: 3, days: 3 },
        callback: () => {
          (z -= 0.5), n("#pray"), n("#cp");
        },
      },
    };
  },
  fe = () => {
    ue.spinning_wheel.done &&
      ue.shipyard.done &&
      (t(
        "The caravela construction project is in sight!",
        "green",
        "🌊",
        "info"
      ),
      (ue.caravela.unlocked = !0));
  },
  ge = (a) => {
    var t = ue[a],
      n = r("div", "project", null);
    let s = t.emoji;
    "caravela" === a &&
      (s = `<svg height="50px" viewBox="0 0 50 50" width="50px">${e(
        "#ss"
      ).outerHTML.replace('"ss"', "")}</svg>`),
      (n.id = a),
      (n.innerHTML = `<div class="icon">${s}</div>\n<div class="title caps">${a.replace(
        /_/g,
        " "
      )}</div>\n<small class="description">${
        t.description
      }</small>\n<div class="cost">\n  ${t.cost.wood} 🌳  ${t.cost.food} 🍒  ${
        "caravela" == a ? "1 - 10" : t.cost.ppl
      } 👥  ${t.cost.days} days ⏳\n</div>`),
      pe.append(n),
      o(n, "click", ve(a));
  },
  ve = (a) => () => {
    if (pe.classList.contains("closed")) pe.classList.remove("closed");
    else {
      var o = ue[a];
      if (!o.done) {
        if ("caravela" === a && !o.unlocked) {
          var r = ue.caravela.requires
            .filter((e) => !ue[e].done)
            .map((e) => `[${e.replace(/_/g, " ")}]`);
          if (r.length > 0) {
            M(a, "no");
            var n = `Construction of the new caravela requires ${r.join(
              " and "
            )}.`;
            return (
              (e("#requirements").innerText = n), void t(n, null, "❌", "info")
            );
          }
        }
        if ((r = ["wood", "food"].filter((e) => _[e] < o.cost[e])).length > 0) {
          M(a, "no");
          n = `There is not enough ${r.join(
            " and "
          )} to start the ${a} project`;
          return (
            (e("#requirements").innerText = n), void t(n, null, "❌", "info")
          );
        }
        if (!q(o.cost.ppl)) {
          if ("caravela" !== a) {
            n = `Not enough people ready to start the ${a} project`;
            return (
              (e("#requirements").innerText = n), void t(n, null, "❌", "info")
            );
          }
          var s = A - H,
            i = o.cost.ppl * o.cost.days,
            l = Math.ceil(i / s);
          t(
            `The Caravela contruction started, but with only ${s} people, it will take ${l} days.`,
            null,
            "⚒",
            "info"
          ),
            (o.cost.ppl = s),
            (o.cost.days = l);
        }
        (_.wood -= o.cost.wood),
          (_.food -= o.cost.food),
          (A -= o.cost.ppl),
          (o.done = !0);
        var d = e(`.project#${a}`);
        l = o.cost.days * X;
        (d.style.transition = `height ${l}ms linear`),
          d.classList.add("in-progress"),
          pe.classList.add("closed"),
          h(() => {
            d.classList.add("done"),
              d.classList.remove("in-progress"),
              (d.style.transition = null),
              (A += o.cost.ppl),
              o.callback();
          }, l);
      }
    }
  };
let me, be;
var ye = () => {
    clearInterval(me), clearInterval(be);
  },
  we = () => {
    ye(),
      (e("#island").style.filter = "brightness(.5) contrast(1.0) saturate(0)");
  },
  ke = () => {
    (me = setInterval(D, X)), (be = setInterval(E, X / 2));
  },
  $e = () => {
    resetData(),
      de(),
      le(),
      c("intro"),
      ce(),
      setTimeout(() => {
        document.body.style.setProperty("--v", "1");
      }, 4e3),
      h(Te, 4e3);
  },
  Te = () => {
    resetData(),
      he(),
      de(),
      le(),
      ke(),
      ge("caravela"),
      x(),
      t("People settled by the sea.", null, "⛺️", "info"),
      h(() => {
        t(
          `${oe().name} found good foraging grounds nearby.`,
          "blue",
          "🌾",
          "info"
        ),
          n("#forage"),
          n("#restart"),
          M("forage", "blink");
      }, 2e3),
      h(() => {
        t(
          `${oe().name} made some rudimentary axes for logging`,
          "blue",
          "🌳",
          "info"
        ),
          n("#fetchWood"),
          M("fetchWood", "blink");
      }, X),
      h(() => {
        t(
          "The river can provide you food if you develop fishing.",
          "blue",
          "🐟",
          "info"
        ),
          M("projects", "blink"),
          ge("fishing");
      }, 2 * X);
  };
o(e("#intro button"), "click", () => {
  T(), $e();
}),
  document.monetization &&
    "started" === document.monetization.state &&
    (s("#monetization"), (U = 0.3), (K = 30));
