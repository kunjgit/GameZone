let ctx = document.getElementById("13canvas").getContext("2d"),
  w = 768,
  h = 640,
  vx = 0,
  mapw = 3e3,
  running = null,
  keys = {},
  gravity = 9.81,
  dt = 0.001,
  controlKeys = {},
  actions = {},
  antiActions = {},
  groundHeight = 200,
  fixed = !1,
  hero = null,
  boss = null,
  bossActive = !1,
  globalSnapshot = {},
  heroSnapshot = [],
  bowForce = 50,
  shooting = !1,
  moving = !1,
  sky = [],
  superTime = 1e3,
  cd = { destory: [9e3, 1e4], summon: [1e4, 15e3] },
  cycler = 1,
  monster1Die = !1,
  events = [],
  happend = [!0, !0, !0, !0, !0],
  startEvents = [],
  startHappend = [!0, !0, !0],
  enemyView = 500,
  groups = {},
  isSave = !0,
  difGupContacts = {},
  sameGupContacts = {},
  enemyVeclocity = 3e12,
  timeouts = [];
(bound = { uX: 3e3, uY: 1e3, lX: 0, lY: 0 }),
  (stoneConfig = { den: 2e-4, space: 10 }),
  (demStepInPerFrame = 100),
  (toolText = [
    "â†‘â†“â†â†’ to move",
    "'c' to jump",
    "'x' to attack",
    "'z' to backtracking",
  ]),
  (toolTextIndex = -1),
  (winCap = 0),
  (dieCap = 0),
  (saveCap = 0),
  (onresize = function () {
    var e,
      t,
      o = innerWidth,
      n = innerHeight,
      r = o / n,
      s = document.querySelector("#in").style;
    r <= 1.2 ? (t = (e = o) / 1.2) : (e = 1.2 * (t = n)),
      (s.width = e + "px"),
      (s.height = t + "px");
  }),
  (onkeydown = function (e) {
    switch (e.keyCode) {
      case 38:
        controlKeys.up = !0;
        break;
      case 40:
        controlKeys.down = !0;
        break;
      case 37:
        controlKeys.left = !0;
        break;
      case 39:
        controlKeys.right = !0;
        break;
      case 67:
        controlKeys.c = !0;
        break;
      case 90:
        controlKeys.z = !0;
        break;
      case 69:
        controlKeys.e = !0;
        break;
      case 88:
        controlKeys.x = !0;
        break;
      case 77:
        controlKeys.m = !0;
    }
  }),
  (onkeyup = function (e) {
    switch (e.keyCode) {
      case 38:
        controlKeys.up = !1;
        break;
      case 40:
        controlKeys.down = !1;
        break;
      case 37:
        controlKeys.left = !1;
        break;
      case 39:
        controlKeys.right = !1;
        break;
      case 67:
        controlKeys.c = !1;
        break;
      case 90:
        controlKeys.z = !1;
        break;
      case 69:
        controlKeys.e = !1;
        break;
      case 88:
        controlKeys.x = !1;
        break;
      case 77:
        controlKeys.m = !1;
    }
  });
let dot = (e, t) => e[0] * t[0] + e[1] * t[1],
  scale = (e, t) => [t[0] * e, t[1] * e],
  normalization = (e) => {
    let t = Math.sqrt(dot(e, e));
    return scale(t, e);
  },
  distance = (e, t) => {
    let o = minus(e, t);
    return Math.sqrt(dot(o, o));
  },
  minus = (e, t) => [t[0] - e[0], t[1] - e[1]],
  plus = (e, t) => [e[0] + t[0], e[1] + t[1]],
  randomRange = (e, t) => {
    if (e > t) throw new Error(`n1-${e} must bigger than n2-${t}`);
    let o = t - e;
    return e + Math.floor(Math.random() * o);
  };
class ContactPlane {
  constructor(e, t) {
    (this.nc = [0, 0]),
      (this.gc = 0),
      (this.dis = 0),
      (this.f = [0, 0]),
      (this.rV = [0, 0]),
      (this.inD = [0, 0]),
      (this.isContact = !1),
      (this.isBound = !1),
      (this.element1Index = e),
      (this.element2Index = t);
  }
}
class Rectangle {
  constructor(e, t, o, n, r, s, i) {
    (this.mass = o * n * i),
      (this.invm = 1 / this.mass),
      (this.pos = [e + 0.5 * o, t + 0.5 * n]),
      (this.lt = [e, t]),
      (this.rd = [e + o, t + n]),
      (this.len = { w: o, h: n }),
      (this.f = [0, 0]),
      (this.v = [r, s]);
  }
}
class Contact {
  constructor(e, t, o, n) {
    (this.kn = o),
      (this.pkn = n),
      (this.group1Index = e),
      (this.group2Index = t),
      (this.contactPlanes = {});
  }
}
class Group {
  constructor(e, t, o, n) {
    (this.isRigid = n),
      (this.damp = o),
      (this.density = t),
      (this.name = e),
      (this.elements = []),
      (this.bc = [0, 0]),
      (this.snapshots = []);
  }
}
class Hero extends Rectangle {
  constructor(e, t, o, n, r, s, i, a, l) {
    super(e, t, o, n, r, s, i),
      (this.face = 1),
      (this.canJump = !1),
      (this.isSuper = !1),
      (this.canBack = !1),
      (this.hp = a),
      (this.maxHp = a),
      (this.atk = l);
  }
}
class Enemy extends Rectangle {
  constructor(e, t, o, n, r, s, i, a, l, c, h) {
    super(e, t, o, n, r, s, i),
      (this.id = h),
      (this.face = 1),
      (this.canMove = !0),
      (this.skin = a),
      (this.hp = l),
      (this.maxHp = l),
      (this.atk = c);
  }
}
class Boss extends Rectangle {
  constructor(e, t, o, n, r, s, i, a, l) {
    super(e, t, o, n, r, s, i),
      (this.hp = a),
      (this.maxHp = a),
      (this.atk = l),
      (this.skill = { canDestory: !1, canSummon: !1 });
  }
}
class Ground extends Rectangle {
  constructor(e, t, o, n, r, s, i) {
    super(e, t, o, n, r, s, i), (this.stones = []);
    let a = stoneConfig.den * o * n,
      l = stoneConfig.space;
    for (let e = 0; e < a; e++) {
      let e = Math.random() * (o - 20),
        t = Math.random() * (n - 40);
      switch (Math.floor(5 * Math.random())) {
        case 0:
        case 1:
          this.stones.push([e, t]);
          break;
        case 2:
          this.stones.push([e, t], [e + l, t], [e, t + l], [e + l, t + l]);
          break;
        case 3:
          this.stones.push([e, t], [e + l, t]);
          break;
        case 4:
          this.stones.push([e, t], [e + l, t], [e + 2 * l, t]);
      }
    }
  }
}
class Arrow extends Rectangle {
  constructor(e, t, o, n, r, s, i, a) {
    super(e, t, o, n, r, s, i), (this.face = a);
  }
}
!(function (e, t) {
  "function" == typeof define && define.amd
    ? define(["exports"], t)
    : t(
        "object" == typeof exports && "string" != typeof exports.nodeName
          ? exports
          : (e.TinyMusic = {})
      );
})(this, function (e) {
  function t(e) {
    var o = e.split(s);
    (this.frequency = t.getFrequency(o[0]) || 0),
      (this.duration = t.getDuration(o[1]) || 0);
  }
  function o(e, t, o) {
    (this.ac = e || new AudioContext()),
      this.createFxNodes(),
      (this.tempo = t || 120),
      (this.loop = !0),
      (this.smoothing = 0),
      (this.staccato = 0),
      (this.notes = []),
      this.push.apply(this, o || []);
  }
  var n = 440 * Math.pow(Math.pow(2, 1 / 12), -9),
    r = /^[0-9.]+$/,
    s = /\s+/,
    i = /(\d+)/,
    a = {};
  "B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb"
    .split("|")
    .forEach(function (e, t) {
      e.split("-").forEach(function (e) {
        a[e] = t;
      });
    }),
    (t.getFrequency = function (e) {
      var t = e.split(i),
        o = a[t[0]],
        r = (t[1] || 4) - 4;
      return n * Math.pow(Math.pow(2, 1 / 12), o) * Math.pow(2, r);
    }),
    (t.getDuration = function (e) {
      return r.test(e)
        ? parseFloat(e)
        : e
            .toLowerCase()
            .split("")
            .reduce(function (e, t) {
              return (
                e +
                ("w" === t
                  ? 4
                  : "h" === t
                  ? 2
                  : "q" === t
                  ? 1
                  : "e" === t
                  ? 0.5
                  : "s" === t
                  ? 0.25
                  : 0)
              );
            }, 0);
    }),
    (o.prototype.createFxNodes = function () {
      var e = (this.gain = this.ac.createGain());
      return (
        [
          ["bass", 100],
          ["mid", 1e3],
          ["treble", 2500],
        ].forEach(
          function (t, o) {
            ((o = this[t[0]] = this.ac.createBiquadFilter()).type = "peaking"),
              (o.frequency.value = t[1]),
              e.connect((e = o));
          }.bind(this)
        ),
        e.connect(this.ac.destination),
        this
      );
    }),
    (o.prototype.push = function () {
      return (
        Array.prototype.forEach.call(
          arguments,
          function (e) {
            this.notes.push(e instanceof t ? e : new t(e));
          }.bind(this)
        ),
        this
      );
    }),
    (o.prototype.createCustomWave = function (e, t) {
      t || (t = e),
        (this.waveType = "custom"),
        (this.customWave = [new Float32Array(e), new Float32Array(t)]);
    }),
    (o.prototype.createOscillator = function () {
      return (
        this.stop(),
        (this.osc = this.ac.createOscillator()),
        this.customWave
          ? this.osc.setPeriodicWave(
              this.ac.createPeriodicWave.apply(this.ac, this.customWave)
            )
          : (this.osc.type = this.waveType || "square"),
        this.osc.connect(this.gain),
        this
      );
    }),
    (o.prototype.scheduleNote = function (e, t) {
      var o = (60 / this.tempo) * this.notes[e].duration,
        n = o * (1 - (this.staccato || 0));
      return (
        this.setFrequency(this.notes[e].frequency, t),
        this.smoothing && this.notes[e].frequency && this.slide(e, t, n),
        this.setFrequency(0, t + n),
        t + o
      );
    }),
    (o.prototype.getNextNote = function (e) {
      return this.notes[e < this.notes.length - 1 ? e + 1 : 0];
    }),
    (o.prototype.getSlideStartDelay = function (e) {
      return e - Math.min(e, (60 / this.tempo) * this.smoothing);
    }),
    (o.prototype.slide = function (e, t, o) {
      var n = this.getNextNote(e),
        r = this.getSlideStartDelay(o);
      return (
        this.setFrequency(this.notes[e].frequency, t + r),
        this.rampFrequency(n.frequency, t + o),
        this
      );
    }),
    (o.prototype.setFrequency = function (e, t) {
      return this.osc.frequency.setValueAtTime(e, t), this;
    }),
    (o.prototype.rampFrequency = function (e, t) {
      return this.osc.frequency.linearRampToValueAtTime(e, t), this;
    }),
    (o.prototype.play = function (e) {
      return (
        (e = "number" == typeof e ? e : this.ac.currentTime),
        this.createOscillator(),
        this.osc.start(e),
        this.notes.forEach(
          function (t, o) {
            e = this.scheduleNote(o, e);
          }.bind(this)
        ),
        this.osc.stop(e),
        (this.osc.onended = this.loop ? this.play.bind(this, e) : null),
        this
      );
    }),
    (o.prototype.stop = function () {
      return (
        this.osc &&
          ((this.osc.onended = null), this.osc.disconnect(), (this.osc = null)),
        this
      );
    }),
    (e.Note = t),
    (e.Sequence = o);
});
var ac =
    "undefined" != typeof AudioContext
      ? new AudioContext()
      : new webkitAudioContext(),
  tempo = 240,
  lead = [
    "- h",
    "A4 h",
    "Bb4 h",
    "D5 h",
    "C5 h",
    "Bb4 q",
    "A4 q",
    "G4 h",
    "C4 h",
    "F4 h",
    "G4 h",
    "A4 h",
    "Bb4 q",
    "A4 q",
    "G4 8",
    "- h",
    "A3 h",
    "Bb3 h",
    "D4 h",
    "C4 w",
    "G4 q",
    "A4 q",
    "Bb4 q",
    "G4 q",
    "A4 h",
    "A3 h",
    "Bb3 h",
    "Bb4 h",
    "G4 h",
    "G4 q",
    "A4 q",
    "Bb4 h",
    "G4 h",
    "A4 w",
    "C5 w",
    "Bb4 6",
    "A4 q",
    "D5 w",
    "C5 w",
    "G4 h",
    "G4 q",
    "A4 q",
    "Bb4 w",
    "G4 w",
    "A4 w",
    "C5 w",
    "Bb4 6",
    "A4 h",
    "D5 q",
    "E4 q",
    "C5 q",
    "C3 q",
    "C5 h",
    "G4 q",
    "A4 q",
    "Bb4 h",
    "B4 h",
    "C5 h",
    "G4 q",
    "A4 q",
    "Bb4 h",
    "B4 h",
    "C5 h",
    "G4 q",
    "A4 q",
    "Bb4 h",
    "B4 h",
    "C5 h",
    "G4 q",
    "A4 q",
    "Bb4 h",
    "B4 h",
    "C5 h",
    "A4 q",
    "Bb4 q",
    "C5 h",
    "Db5 h",
    "D5 h",
    "Bb4 q",
    "C5 q",
    "D5 h",
    "E5 h",
    "F5 h",
    "D5 q",
    "E5 q",
    "F5 h",
    "G5 h",
    "A5 h",
    "A5 h",
    "Bb5 h",
    "D6 h",
  ],
  horn = [
    "C3 8",
    "C3 8",
    "C3 8",
    "C3 8",
    "F3 w",
    "D3 w",
    "E3 w",
    "C3 w",
    "F3 w",
    "D3 w",
    "E3 6",
    "C3 h",
    "F3 w",
    "C4 w",
    "C4 6",
    "F3 q",
    "B2 w",
    "C4 w",
    "C4 8",
    "F3 w",
    "A3 w",
    "G3 6",
    "F3 h",
    "F3 w",
    "F3 w",
    "G3 6",
    "D4 h",
    "G3 6",
    "D4 h",
    "G3 6",
    "D4 h",
    "G3 h",
    "- 6",
    "- h",
    "A3 q",
    "Bb3 q",
    "C4 h",
    "Cb4 h",
    "D4 h",
    "Bb3 q",
    "C4 q",
    "D4 h",
    "E4 h",
    "F4 h",
    "D4 q",
    "E4 q",
    "F4 h",
    "G4 h",
    "C3 h",
    "C3 h",
    "C3 h",
    "3 h3",
  ],
  fen = 0.125,
  shootF = [
    `G3 ${fen}`,
    `A3 ${fen}`,
    `B3 ${fen}`,
    `C4 ${fen}`,
    `D4 ${fen}`,
    `E4 ${fen}`,
  ],
  jumpF = ["B2 s", "C2 s"];
(mainAudio = new TinyMusic.Sequence(ac, tempo, lead)),
  (subAudio = new TinyMusic.Sequence(ac, tempo, horn)),
  (jumpAudio = new TinyMusic.Sequence(ac, tempo, jumpF)),
  (shootAudio = new TinyMusic.Sequence(ac, tempo, shootF)),
  (reverseMainAudio = new TinyMusic.Sequence(ac, 10 * tempo, lead.reverse())),
  (reverseSubAudio = new TinyMusic.Sequence(ac, 10 * tempo, horn.reverse())),
  (mainAudio.loop = !0),
  (subAudio.loop = !0),
  (reverseMainAudio.loop = !0),
  (reverseSubAudio.loop = !0),
  (jumpAudio.loop = !1),
  (shootAudio.loop = !1),
  (mainAudio.staccato = 0.55),
  (subAudio.staccato = 0.55),
  (jumpAudio.staccato = 0.55),
  (shootAudio.staccato = 0.55),
  (mainAudio.gain.gain.value = 0.05),
  (subAudio.gain.gain.value = 0.03),
  (jumpAudio.gain.gain.value = 0.03),
  (shootAudio.gain.gain.value = 0.03),
  (reverseMainAudio.gain.gain.value = 0.05),
  (reverseSubAudio.gain.gain.value = 0.03),
  (mainAudio.mid.frequency.value = 1e3),
  (mainAudio.mid.gain.value = 2),
  (jumpAudio.mid.gain.value = 2),
  (reverseMainAudio.mid.frequency.value = 1e3),
  (reverseMainAudio.mid.gain.value = 2),
  (reverseSubAudio.mid.gain.value = 2);
let playReserverMusic = () => {
    reverseMainAudio.play(), reverseSubAudio.play();
  },
  stopReserverMusic = () => {
    reverseMainAudio.stop(), reverseSubAudio.stop();
  },
  playMusic = () => {
    mainAudio.play(), subAudio.play();
  },
  stopMusic = () => {
    mainAudio.stop(), subAudio.stop();
  },
  playJumpAudio = () => {
    jumpAudio.stop(), jumpAudio.play();
  },
  playShootMusic = () => {
    shootAudio.stop(), shootAudio.play();
  };
(heroSkin = {
  priority: [
    "face",
    "cloth",
    "hair",
    "eye",
    "bow",
    "hand",
    "left-foot",
    "right-foot",
  ],
  hair: {
    main: {
      color: "#040000",
      points: [
        [
          [2, 1],
          [7, 9],
        ],
        [
          [8, 1],
          [12, 5],
        ],
        [
          [13, 2],
          [18, 4],
        ],
        [
          [6, 0],
          [9, 0],
        ],
        [3, 0],
        [11, 0],
        [12, 0],
        [15, 0],
        [
          [15, 1],
          [17, 1],
        ],
        [19, 1],
        [
          [1, 2],
          [1, 6],
        ],
        [0, 3],
        [19, 3],
        [19, 3],
        [19, 4],
        [0, 5],
        [0, 6],
        [8, 6],
        [9, 6],
        [16, 6],
        [17, 6],
        [18, 6],
        [8, 7],
        [
          [17, 7],
          [19, 7],
        ],
        [1, 8],
        [19, 8],
        [
          [0, 9],
          [2, 9],
        ],
        [10, 9],
        [0, 10],
        [1, 10],
        [10, 10],
        [11, 10],
        [11, 11],
        [
          [3, 10],
          [6, 12],
        ],
        [6, 13],
      ],
    },
  },
  face: {
    main: {
      color: "#F9D4A5",
      points: [
        [
          [6, 5],
          [15, 13],
        ],
        [
          [16, 6],
          [16, 12],
        ],
        [
          [17, 8],
          [17, 10],
        ],
        [
          [6, 14],
          [9, 14],
        ],
      ],
    },
  },
  eye: { main: { color: "#FFFFFF", points: [[15, 9]] } },
  cloth: {
    main: {
      color: "#404040",
      points: [
        [
          [3, 13],
          [16, 30],
        ],
        [
          [17, 15],
          [17, 29],
        ],
      ],
    },
  },
  hand: {
    border: {
      color: "#000000",
      points: [
        [
          [7, 18],
          [7, 25],
        ],
        [
          [13, 17],
          [13, 25],
        ],
        [
          [7, 26],
          [13, 26],
        ],
      ],
    },
    body: {
      color: "#F9D4A5",
      points: [
        [
          [9, 27],
          [12, 28],
        ],
      ],
    },
  },
  bow: {
    wood: {
      color: "#77634C",
      points: [
        [0, 21],
        [19, 21],
        [0, 22],
        [1, 22],
        [18, 22],
        [19, 22],
        [1, 23],
        [2, 23],
        [18, 23],
        [
          [2, 24],
          [5, 24],
        ],
        [17, 24],
        [18, 24],
        [
          [3, 25],
          [5, 25],
        ],
        [16, 25],
        [17, 25],
        [
          [6, 26],
          [8, 26],
        ],
        [15, 26],
        [16, 26],
        [
          [6, 27],
          [15, 27],
        ],
        [
          [8, 28],
          [12, 28],
        ],
      ],
    },
    line: {
      color: "#777268",
      points: [
        [
          [1, 26],
          [1, 18],
        ],
      ],
    },
  },
  "left-foot": {
    pants: {
      color: "#0E0E0E",
      points: [
        [
          [3, 31],
          [8, 37],
        ],
      ],
    },
    foot: {
      color: "#F9D4A5",
      points: [
        [
          [3, 38],
          [8, 39],
        ],
      ],
    },
  },
  "right-foot": {
    pants: {
      color: "#0E0E0E",
      points: [
        [
          [12, 31],
          [17, 37],
        ],
      ],
    },
    foot: {
      color: "#F9D4A5",
      points: [
        [
          [12, 38],
          [17, 39],
        ],
      ],
    },
  },
}),
  (heroShootSkin = JSON.parse(JSON.stringify(heroSkin))),
  (heroShootSkin.hand = {
    main: {
      color: "#F9D4A5",
      points: [
        [
          [7, 19],
          [7, 22],
        ],
        [8, 19],
      ],
    },
  }),
  (heroShootSkin.bow = {
    wood: {
      color: "#77634C",
      points: [
        [12, 9],
        [13, 9],
        [
          [13, 10],
          [15, 11],
        ],
        [
          [16, 11],
          [17, 13],
        ],
        [15, 12],
        [17, 14],
        [17, 15],
        [
          [18, 14],
          [18, 19],
        ],
        [
          [19, 17],
          [19, 26],
        ],
        [
          [18, 24],
          [18, 29],
        ],
        [
          [17, 28],
          [17, 31],
        ],
        [16, 30],
        [16, 31],
        [15, 31],
        [15, 32],
        [14, 32],
        [14, 33],
        [13, 33],
      ],
    },
    line: {
      color: "#777268",
      points: [
        [
          [12, 10],
          [12, 12],
        ],
        [
          [11, 12],
          [11, 14],
        ],
        [
          [10, 14],
          [10, 16],
        ],
        [
          [9, 16],
          [9, 19],
        ],
        [
          [8, 20],
          [8, 22],
        ],
        [
          [9, 23],
          [9, 24],
        ],
        [
          [10, 24],
          [10, 26],
        ],
        [
          [11, 26],
          [11, 29],
        ],
        [
          [12, 29],
          [12, 31],
        ],
        [
          [13, 31],
          [13, 32],
        ],
      ],
    },
    arrow: {
      color: "#55461F",
      points: [
        [
          [9, 21],
          [13, 22],
        ],
        [
          [13, 20],
          [18, 21],
        ],
      ],
    },
  }),
  (heroMoveSkin = JSON.parse(JSON.stringify(heroSkin))),
  delete heroMoveSkin["left-foot"],
  delete heroMoveSkin["right-foot"],
  heroMoveSkin.priority.push("foot"),
  (heroMoveSkin.foot = {
    pants: {
      color: "#0E0E0E",
      points: [
        [
          [5, 29],
          [15, 30],
        ],
        [
          [6, 31],
          [14, 31],
        ],
        [
          [8, 32],
          [14, 32],
        ],
        [
          [7, 33],
          [14, 33],
        ],
        [
          [6, 34],
          [15, 34],
        ],
        [
          [5, 35],
          [9, 35],
        ],
        [
          [12, 35],
          [16, 35],
        ],
        [
          [6, 36],
          [8, 36],
        ],
        [
          [14, 36],
          [16, 36],
        ],
        [15, 37],
        [16, 37],
      ],
    },
    foot: {
      color: "#F9D4A5",
      points: [
        [4, 37],
        [5, 37],
        [12, 37],
        [16, 37],
        [
          [4, 38],
          [7, 39],
        ],
        [3, 39],
        [12, 38],
        [13, 38],
        [16, 38],
        [17, 38],
        [
          [12, 39],
          [17, 39],
        ],
      ],
    },
  }),
  (heroMoveAndShoot = JSON.parse(JSON.stringify(heroSkin))),
  delete heroMoveAndShoot["left-foot"],
  delete heroMoveAndShoot["right-foot"],
  heroMoveAndShoot.priority.push("foot"),
  (heroMoveAndShoot.foot = heroMoveSkin.foot),
  (heroMoveAndShoot.hand = heroShootSkin.hand),
  (heroMoveAndShoot.bow = heroShootSkin.bow),
  (arrowSkin = {
    priority: ["arrow"],
    arrow: {
      wood: {
        color: "#55461F",
        points: [
          [
            [0, 4],
            [6, 4],
          ],
        ],
      },
      sliver: {
        color: "#C7D3CF",
        points: [
          [
            [7, 2],
            [7, 6],
          ],
          [
            [8, 3],
            [8, 5],
          ],
          [9, 4],
        ],
      },
      "brown-feather": {
        color: "#999886",
        points: [
          [1, 2],
          [2, 3],
          [2, 5],
          [1, 6],
        ],
      },
      "black-feather": {
        color: "#182219",
        points: [
          [0, 2],
          [1, 3],
          [1, 5],
          [0, 6],
        ],
      },
    },
  }),
  (monsterSkin1 = {
    priority: ["body", "line"],
    body: {
      main: {
        color: "#656f7d",
        points: [
          [
            [1, 9],
            [5, 14],
          ],
          [
            [6, 7],
            [13, 13],
          ],
          [
            [14, 9],
            [18, 14],
          ],
        ],
      },
    },
    line: {
      main: {
        color: "#632871",
        points: [
          [
            [0, 9],
            [0, 15],
          ],
          [0, 18],
          [
            [1, 8],
            [1, 11],
          ],
          [1, 15],
          [1, 17],
          [1, 18],
          [
            [2, 3],
            [2, 5],
          ],
          [
            [2, 8],
            [2, 10],
          ],
          [
            [2, 15],
            [3, 18],
          ],
          [
            [3, 5],
            [3, 9],
          ],
          [
            [4, 7],
            [4, 12],
          ],
          [4, 15],
          [5, 2],
          [5, 3],
          [
            [5, 6],
            [5, 8],
          ],
          [5, 10],
          [5, 12],
          [
            [5, 14],
            [6, 17],
          ],
          [
            [6, 2],
            [6, 12],
          ],
          [
            [7, 5],
            [7, 7],
          ],
          [
            [7, 14],
            [12, 14],
          ],
          [
            [8, 12],
            [11, 12],
          ],
          [8, 13],
          [11, 13],
          [
            [8, 4],
            [11, 6],
          ],
          [8, 1],
          [8, 2],
          [11, 1],
          [11, 2],
          [
            [9, 2],
            [10, 3],
          ],
          [
            [12, 5],
            [12, 7],
          ],
          [
            [13, 2],
            [13, 12],
          ],
          [
            [13, 14],
            [14, 17],
          ],
          [14, 2],
          [14, 3],
          [
            [14, 6],
            [14, 8],
          ],
          [14, 12],
          [14, 10],
          [1, 12],
          [
            [15, 7],
            [15, 12],
          ],
          [15, 15],
          [
            [16, 5],
            [16, 10],
          ],
          [
            [16, 15],
            [17, 18],
          ],
          [
            [17, 3],
            [17, 5],
          ],
          [
            [17, 8],
            [17, 11],
          ],
          [
            [18, 9],
            [18, 12],
          ],
          [18, 15],
          [18, 17],
          [18, 18],
          [
            [19, 10],
            [19, 15],
          ],
          [19, 18],
          [
            [6, 4],
            [7, 5],
          ],
        ],
      },
    },
  }),
  (monsterSkin2 = {
    priority: ["body", "line"],
    body: {
      main: {
        color: "#656f7d",
        points: [
          [17, 14],
          [
            [16, 11],
            [16, 14],
          ],
          [14, 1],
          [
            [1, 2],
            [15, 17],
          ],
          [4, 1],
          [3, 1],
          [13, 18],
          [12, 18],
          [
            [5, 18],
            [7, 18],
          ],
        ],
      },
    },
    line: {
      main: {
        color: "#632871",
        points: [
          [
            [2, 0],
            [5, 0],
          ],
          [
            [13, 0],
            [15, 0],
          ],
          [1, 1],
          [2, 1],
          [
            [5, 1],
            [13, 1],
          ],
          [15, 1],
          [
            [16, 1],
            [16, 10],
          ],
          [
            [0, 2],
            [0, 18],
          ],
          [1, 2],
          [
            [5, 3],
            [7, 5],
          ],
          [
            [12, 4],
            [13, 5],
          ],
          [
            [1, 11],
            [1, 13],
          ],
          [
            [2, 13],
            [2, 15],
          ],
          [3, 15],
          [
            [3, 16],
            [6, 16],
          ],
          [
            [4, 10],
            [4, 12],
          ],
          [
            [6, 10],
            [6, 12],
          ],
          [
            [5, 12],
            [5, 14],
          ],
          [
            [6, 14],
            [6, 16],
          ],
          [7, 13],
          [7, 14],
          [8, 14],
          [8, 15],
          [9, 15],
          [10, 16],
          [
            [10, 10],
            [10, 12],
          ],
          [
            [11, 12],
            [11, 16],
          ],
          [
            [12, 10],
            [12, 13],
          ],
          [13, 13],
          [13, 14],
          [14, 14],
          [
            [14, 15],
            [18, 15],
          ],
          [
            [17, 10],
            [17, 13],
          ],
          [
            [18, 13],
            [18, 15],
          ],
          [
            [0, 18],
            [4, 18],
          ],
          [
            [4, 19],
            [8, 19],
          ],
          [
            [8, 18],
            [11, 18],
          ],
          [
            [11, 19],
            [14, 19],
          ],
          [
            [14, 18],
            [16, 18],
          ],
          [
            [16, 16],
            [16, 18],
          ],
        ],
      },
    },
  }),
  (bossSkin = {
    priority: ["body", "belly", "thorn", "border"],
    body: {
      main: {
        color: "#17A14D",
        points: [
          [1, 5],
          [1, 6],
          [
            [4, 1],
            [10, 2],
          ],
          [
            [2, 3],
            [14, 8],
          ],
          [
            [5, 9],
            [16, 14],
          ],
          [17, 1],
          [17, 14],
          [
            [13, 15],
            [19, 36],
          ],
          [
            [12, 37],
            [16, 37],
          ],
          [
            [13, 38],
            [15, 38],
          ],
          [
            [3, 35],
            [8, 38],
          ],
        ],
      },
    },
    border: {
      main: {
        color: "#211D19",
        points: [
          [4, 4],
          [5, 4],
          [5, 3],
          [6, 3],
          [1, 4],
          [1, 3],
          [2, 3],
          [2, 2],
          [3, 2],
          [3, 1],
          [4, 1],
          [
            [5, 0],
            [9, 0],
          ],
          [9, 1],
          [10, 1],
          [
            [11, 2],
            [13, 2],
          ],
          [
            [13, 1],
            [15, 1],
          ],
          [15, 2],
          [15, 3],
          [12, 4],
          [14, 4],
          [13, 5],
          [14, 5],
          [14, 6],
          [14, 7],
          [15, 6],
          [
            [16, 5],
            [18, 5],
          ],
          [18, 6],
          [18, 7],
          [17, 8],
          [15, 8],
          [15, 9],
          [
            [16, 9],
            [16, 11],
          ],
          [
            [17, 11],
            [17, 13],
          ],
          [18, 10],
          [19, 9],
          [
            [18, 13],
            [18, 15],
          ],
          [19, 13],
          [19, 15],
          [19, 16],
          [
            [0, 5],
            [0, 7],
          ],
          [1, 7],
          [1, 8],
          [
            [2, 9],
            [6, 9],
          ],
          [6, 8],
          [5, 10],
          [5, 11],
          [
            [4, 11],
            [4, 15],
          ],
          [
            [5, 14],
            [9, 14],
          ],
          [5, 15],
          [
            [9, 15],
            [12, 15],
          ],
          [12, 16],
          [13, 16],
          [13, 17],
          [14, 17],
          [14, 18],
          [
            [15, 18],
            [15, 20],
          ],
          [
            [16, 21],
            [16, 26],
          ],
          [
            [17, 26],
            [17, 29],
          ],
          [
            [16, 29],
            [16, 31],
          ],
          [
            [15, 31],
            [15, 34],
          ],
          [14, 34],
          [14, 35],
          [13, 34],
          [
            [10, 36],
            [13, 36],
          ],
          [11, 37],
          [11, 38],
          [12, 38],
          [
            [12, 39],
            [16, 39],
          ],
          [16, 38],
          [17, 38],
          [17, 37],
          [18, 37],
          [18, 36],
          [19, 36],
          [
            [3, 15],
            [3, 17],
          ],
          [
            [2, 17],
            [2, 20],
          ],
          [
            [1, 20],
            [1, 24],
          ],
          [
            [0, 24],
            [0, 28],
          ],
          [1, 28],
          [1, 29],
          [2, 29],
          [2, 30],
          [3, 31],
          [3, 32],
          [4, 32],
          [4, 33],
          [5, 33],
          [5, 34],
          [6, 34],
          [
            [7, 35],
            [9, 35],
          ],
          [9, 36],
          [9, 37],
          [8, 37],
          [8, 38],
          [
            [3, 35],
            [5, 35],
          ],
          [3, 36],
          [3, 38],
          [
            [2, 36],
            [2, 38],
          ],
          [
            [3, 39],
            [7, 39],
          ],
        ],
      },
    },
    belly: {
      main: {
        color: "#D9CAAD",
        points: [
          [
            [4, 15],
            [12, 17],
          ],
          [
            [2, 18],
            [15, 24],
          ],
          [
            [1, 25],
            [16, 28],
          ],
          [
            [3, 29],
            [15, 31],
          ],
          [
            [5, 32],
            [14, 33],
          ],
          [
            [7, 34],
            [13, 35],
          ],
        ],
      },
    },
    thorn: {
      main: {
        color: "#172987",
        points: [
          [
            [12, 2],
            [14, 4],
          ],
          [
            [15, 6],
            [17, 8],
          ],
          [
            [18, 10],
            [19, 13],
          ],
        ],
      },
    },
  }),
  (titleSkin = {
    priority: ["traver", "sor"],
    traver: {
      main: {
        color: "#588055",
        points: [
          [
            [0, 0],
            [11, 1],
          ],
          [
            [5, 2],
            [6, 13],
          ],
          [
            [9, 9],
            [9, 13],
          ],
          [10, 10],
          [11, 10],
          [
            [13, 9],
            [15, 9],
          ],
          [
            [15, 10],
            [15, 13],
          ],
          [
            [13, 11],
            [13, 13],
          ],
          [14, 11],
          [14, 13],
          [16, 13],
          [
            [17, 9],
            [17, 11],
          ],
          [
            [18, 11],
            [18, 13],
          ],
          [
            [20, 11],
            [20, 13],
          ],
          [
            [21, 9],
            [21, 11],
          ],
          [19, 13],
          [
            [23, 9],
            [25, 9],
          ],
          [
            [23, 11],
            [25, 11],
          ],
          [
            [23, 13],
            [25, 13],
          ],
          [23, 10],
          [25, 10],
          [23, 12],
          [
            [27, 9],
            [27, 13],
          ],
          [28, 10],
          [29, 10],
        ],
      },
    },
    sor: {
      main: {
        color: "#399c32",
        points: [
          [
            [0, 15],
            [35, 15],
          ],
          [
            [36, 14],
            [37, 15],
          ],
          [37, 13],
          [
            [38, 12],
            [38, 14],
          ],
          [
            [39, 11],
            [39, 13],
          ],
          [
            [40, 10],
            [40, 12],
          ],
          [
            [41, 8],
            [41, 11],
          ],
          [
            [42, 8],
            [42, 10],
          ],
          [43, 8],
          [43, 9],
          [
            [31, 8],
            [33, 9],
          ],
          [
            [34, 8],
            [40, 8],
          ],
          [
            [32, 7],
            [34, 7],
          ],
          [
            [33, 6],
            [35, 6],
          ],
          [
            [34, 5],
            [36, 5],
          ],
          [
            [35, 4],
            [37, 4],
          ],
          [
            [36, 3],
            [38, 3],
          ],
          [
            [37, 2],
            [39, 2],
          ],
          [38, 1],
          [
            [39, 0],
            [48, 1],
          ],
          [
            [41, 15],
            [47, 15],
          ],
          [41, 14],
          [42, 14],
          [42, 13],
          [43, 13],
          [43, 12],
          [44, 12],
          [44, 11],
          [45, 11],
          [45, 10],
          [46, 10],
          [46, 9],
          [47, 9],
          [
            [47, 8],
            [52, 8],
          ],
          [51, 9],
          [51, 10],
          [50, 10],
          [50, 11],
          [49, 11],
          [49, 12],
          [48, 12],
          [48, 13],
          [47, 13],
          [47, 14],
          [46, 14],
          [49, 15],
          [50, 15],
          [50, 14],
          [51, 14],
          [51, 13],
          [52, 13],
          [52, 12],
          [53, 12],
          [53, 11],
          [
            [54, 8],
            [54, 11],
          ],
          [
            [55, 10],
            [57, 10],
          ],
          [
            [57, 9],
            [59, 9],
          ],
        ],
      },
    },
  });
let initGaming = () => {
    (isSave = !0),
      (sky = []),
      (vx = 0),
      (happend = [!0, !0, !0, !0, !0]),
      (enemyView = 500),
      (fixed = !1),
      (bossActive = !1),
      (bound = { uX: 3e3, uY: 1e3, lX: 0, lY: 0 }),
      (toolTextIndex = -1),
      (heroSnapshot = []),
      _initHero(),
      _initGround(),
      _initEnemy(),
      _initBoss(),
      _initArrow(),
      _initSky();
    let e = { happend: happend, groups: groups, vx: vx };
    (globalSnapshot = JSON.stringify(e)), cycler > 1 && (hero.canBack = !0);
  },
  _initHero = () => {
    let e = new Group("hero", 100, 0.999, !1);
    e.elements.push(new Hero(100, 400, 20, 40, 0, 0, 15, 100, 20)),
      (groups.hero = e),
      (hero = e.elements[0]);
  },
  _initGround = () => {
    let e = new Group("ground", 0, 0, !0);
    e.elements.push(
      new Ground(0, 550, 200, 90, 0, 0, 9999),
      new Ground(200, 140, 150, 500, 0, 0, 9999),
      new Ground(350, 400, 600, 240, 0, 0, 9999),
      new Ground(950, 60, 120, 640, 0, 0, 9999),
      new Ground(1070, 500, 800, 140, 0, 0, 9999),
      new Ground(1200, 150, 820, 140, 0, 0, 9999),
      new Ground(1870, 0, 150, 640, 0, 0, 9999),
      new Ground(2020, 500, 980, 140, 0, 0, 9999)
    ),
      (contact = new Contact("hero", "ground", 1e8, 100)),
      (difGupContacts["ground-hero"] = contact),
      (groups.ground = e);
  },
  _initEnemy = () => {
    let e = new Group("enemy", 100, 0.99, !1),
      t = 100 * (1 + 0.4 * cycler),
      o = 300 * (1 + 0.2 * cycler),
      n = 10 * (1 + 0.4 * cycler),
      r = 30 * (1 + 0.2 * cycler);
    cycler <= 1
      ? e.elements.push(
          new Enemy(500, 200, 100, 100, 0, 0, 55, monsterSkin2, t, n, 1),
          new Enemy(700, 200, 100, 100, 0, 0, 55, monsterSkin2, t, n, 2),
          new Enemy(1600, 200, 100, 100, 0, 0, 55, monsterSkin1, o, r, 3)
        )
      : e.elements.push(
          new Enemy(530, 200, 100, 100, 0, 0, 55, monsterSkin2, t, n, 1),
          new Enemy(610, 200, 100, 100, 0, 0, 55, monsterSkin2, t, n, 2),
          new Enemy(420, 200, 100, 100, 0, 0, 55, monsterSkin1, t + 100, n, 3),
          new Enemy(1600, 200, 100, 100, 0, 0, 55, monsterSkin1, o, r, 4),
          new Enemy(1092, 200, 100, 100, 0, 0, 55, monsterSkin1, o, r, 4)
        );
    let s = new Contact("enemy", "ground", 9e9, 100),
      i = new Contact("enemy", "hero", 1e10, 100),
      a = new Contact("enemy", "enemy", 1e10, 100);
    (groups.enemy = e),
      (difGupContacts["enemy-ground"] = s),
      (difGupContacts["enemy-hero"] = i),
      (sameGupContacts["enemy-enemy"] = a);
  },
  _initBoss = () => {
    let e = new Group("boss", 100, 0.99, !0),
      t = 1e3 * (1 + 0.3 * cycler);
    e.elements.push(new Boss(2723, 100, 200, 400, 0, 0, 100, t, 25));
    let o = new Group("rock", 100, 0.99, !0),
      n = new Contact("hero", "rock", 1e8, 100);
    (difGupContacts["hero-rock"] = n),
      (boss = e.elements[0]),
      (groups.boss = e),
      (groups.rock = o);
  },
  _initArrow = () => {
    let e = new Group("arrow", 50, 0.999999, !1);
    (contact = new Contact("arrow", "ground", 1e12, 0)),
      (contactEnemy = new Contact("arrow", "enemy", 1e10, 0)),
      (contactBoss = new Contact("arrow", "boss", 1e10, 0)),
      (difGupContacts["arrow-ground"] = contact),
      (difGupContacts["arrow-enemy"] = contactEnemy),
      (difGupContacts["arrow-boss"] = contactBoss),
      (groups.arrow = e);
  },
  _initSky = () => {
    sky = [];
    let e = w * h * 0.3333 * 0.001;
    for (let t = 0; t < e; t++) {
      let e = Math.random() * mapw,
        t = 0.3333 * Math.random() * h,
        o = 5;
      switch (Math.floor(3 * Math.random())) {
        case 0:
          sky.push([e, t], [e + o, t + o], [e - o, t + o], [e, t + 2 * o]);
          break;
        case 1:
          sky.push([e, t]);
          break;
        case 2:
          sky.push(
            [e, t],
            [e - o, t + o],
            [e, t + o],
            [e + o, t + o],
            [e, t + 2 * o]
          );
      }
    }
  },
  initStarting = () => {
    (bound = { uX: w, uY: h + 300, lX: 0, lY: 0 }),
      _initStartHero(),
      _initStartGround(),
      _initArrow(),
      _initStartEnemy(),
      _initSky();
  },
  _initStartHero = () => {
    let e = new Group("hero", 100, 0.999, !1);
    e.elements.push(new Hero(40, 400, 20, 40, 0, 0, 15, 100, 20)),
      (groups.hero = e),
      (hero = e.elements[0]);
  },
  _initStartGround = () => {
    let e = new Group("ground", 0, 0, !0);
    e.elements.push(
      new Ground(0, 550, 150, h - 550, 0, 0, 50),
      new Ground(150, 400, 150, h - 400, 0, 0, 50),
      new Ground(550, 550, 250, h - 340, 0, 0, 50),
      new Ground(600, 400, 168, h - 350, 0, 0, 50)
    ),
      (contact = new Contact("hero", "ground", 1e8, 100)),
      (difGupContacts["ground-hero"] = contact),
      (groups.ground = e);
  },
  _initStartEnemy = () => {
    let e = new Group("enemy", 100, 0.99, !1);
    e.elements.push(
      new Enemy(630, 300, 100, 100, 0, 0, 55, monsterSkin2, 30, 10, 4)
    ),
      (e.elements[0].face = -1);
    let t = new Contact("enemy", "ground", 9e9, 100),
      o = new Group("boss", 100, 0.99, !0);
    (groups.enemy = e), (groups.boss = o), (difGupContacts["enemy-ground"] = t);
  },
  demStep = () => {
    handleContact(), receiveForce(), verlet(), resetForce();
  },
  disMax = 0.5,
  disMin = -0.5,
  verlet = () => {
    for (let e in groups) {
      let t = groups[e];
      if (t.isRigid)
        for (let e in t.elements) {
          let o = t.elements[e],
            n = scale(dt, o.v);
          o.lt[0] + n[0] > bound.lX &&
            o.rd[0] + n[0] < bound.uX &&
            ((o.pos[0] += n[0]), (o.lt[0] += n[0]), (o.rd[0] += n[0])),
            o.lt[1] + n[1] > bound.lY &&
              o.rd[1] + n[1] < bound.uY &&
              ((o.pos[1] += n[1]), (o.lt[1] += n[1]), (o.rd[1] += n[1]));
        }
      else
        for (let e in t.elements) {
          let o = t.elements[e];
          o.v = scale(t.damp, o.v);
          let n = 1 - t.damp;
          (o.v[0] += o.f[0] * o.invm * n * dt),
            (o.v[1] += (o.f[1] * o.invm + gravity * o.mass) * n * dt);
          let r = scale(dt, o.v);
          r[0] > disMax ? (r[0] = disMax) : r[0] < disMin && (r[0] = disMin),
            r[1] > disMax ? (r[1] = disMax) : r[1] < disMin && (r[1] = disMin),
            o.lt[0] + r[0] > bound.lX &&
              o.rd[0] + r[0] < bound.uX &&
              ((o.pos[0] += r[0]), (o.lt[0] += r[0]), (o.rd[0] += r[0])),
            o.lt[1] + r[1] > bound.lY &&
              o.rd[1] + r[1] < bound.uY &&
              ((o.pos[1] += r[1]), (o.lt[1] += r[1]), (o.rd[1] += r[1]));
        }
    }
  },
  handleContact = () => {
    for (let e in difGupContacts) {
      let t = difGupContacts[e],
        o = groups[t.group1Index],
        n = groups[t.group2Index];
      for (let e = 0; e < o.elements.length; e++)
        for (let r = 0; r < n.elements.length; r++) {
          let s = o.elements[e],
            i = n.elements[r],
            a = `${e}-${r}`,
            l = new ContactPlane(e, r);
          _updateContactPlane(s, i, l, t), (t.contactPlanes[a] = l);
        }
    }
    for (let e in sameGupContacts) {
      let t = sameGupContacts[e],
        o = groups[t.group1Index];
      for (let e = 0; e < o.elements.length; e++)
        for (let n = e + 1; n < o.elements.length; n++) {
          let r = o.elements[e],
            s = o.elements[n],
            i = `${e}-${n}`,
            a = new ContactPlane(e, n);
          _updateContactPlane(r, s, a, t), (t.contactPlanes[i] = a);
        }
    }
  },
  _updateContactPlane = (e, t, o, n) => {
    if (
      ((o.isContact = !0),
      (e.lt[0] > t.rd[0] || t.lt[0] > e.rd[0]) && (o.isContact = !1),
      (e.lt[1] > t.rd[1] || t.lt[1] > e.rd[1]) && (o.isContact = !1),
      o.isContact)
    ) {
      o.isEverContact = !0;
      distance(e.pos, t.pos);
      let r = Math.max(e.lt[0], e.rd[0], t.lt[0], t.rd[0]),
        s = Math.min(e.lt[0], e.rd[0], t.lt[0], t.rd[0]),
        i = Math.max(e.lt[1], e.rd[1], t.lt[1], t.rd[1]),
        a = Math.min(e.lt[1], e.rd[1], t.lt[1], t.rd[1]),
        l = e.len.w + t.len.w - (r - s),
        c = e.len.h + t.len.h - (i - a);
      l > c
        ? e.rd[1] > t.lt[1] && e.pos[1] < t.pos[1]
          ? (nc = [0, 1])
          : (nc = [0, -1])
        : e.rd[0] > t.lt[0] && e.pos[0] < t.pos[0]
        ? (nc = [1, 0])
        : (nc = [-1, 0]),
        (o.gc = l * c),
        (o.nc = nc),
        (o.f = scale(n.kn, scale(o.gc, o.nc)));
    }
    o.isBound &&
      ((o.rV = minus(t.v, e.v)),
      (o.inD = plus(o.inD, scale(dt, o.rV))),
      (o.f = plus(o.f, scale(n.pkn, o.inD))));
  },
  receiveForce = () => {
    for (let e in difGupContacts) {
      let t = difGupContacts[e],
        o = groups[t.group1Index],
        n = groups[t.group2Index];
      for (let e in t.contactPlanes) {
        let r = t.contactPlanes[e];
        if (!r.isContact) continue;
        let s = o.elements[r.element1Index],
          i = n.elements[r.element2Index];
        (s.f = minus(r.f, s.f)), (i.f = plus(r.f, i.f));
      }
    }
    for (let e in sameGupContacts) {
      let t = sameGupContacts[e],
        o = groups[t.group1Index];
      for (let e in t.contactPlanes) {
        let n = t.contactPlanes[e];
        if (!n.isContact && !n.isBound) continue;
        let r = o.elements[n.element1Index],
          s = o.elements[n.element2Index];
        (r.f = minus(n.f, r.f)), (s.f = plus(n.f, s.f));
      }
    }
  },
  resetForce = () => {
    for (let e in groups) {
      let t = groups[e];
      for (let e in t.elements) t.elements[e].f = [0, 0];
    }
  };
(actions.c = function () {
  let e = groups.hero;
  if (hero.canJump) {
    let t = (e) => {
      e.f[1] -= 1e12;
    };
    controlKeys.left &&
      (t = (e) => {
        e.f[1] -= 5e11;
      }),
      controlKeys.right &&
        (t = (e) => {
          e.f[1] -= 5e11;
        }),
      e.elements.forEach(t),
      playJumpAudio(),
      (hero.canJump = !1);
  }
}),
  (actions.right = function () {
    (hero.f[0] += 1e11), (hero.face = 1), (moving = !0);
  }),
  (actions.left = function () {
    (hero.f[0] -= 1e11), (hero.face = -1), (moving = !0);
  }),
  (actions.down = function () {
    groups.hero.elements.forEach((e) => {
      e.f[1] += 1e11;
    });
  }),
  (actions.up = function () {
    groups.hero.elements.forEach((e) => {
      e.f[1] -= 15e9;
    });
  }),
  (actions.z = function () {
    hero.canBack && (running = heroTimeBack);
  }),
  (actions.x = function () {
    bowForce < 200 && (bowForce += 1), (shooting = !0);
  }),
  (antiActions.x = function () {}),
  (actions.m = function () {
    stopMusic();
  }),
  events.push((e, t) => {
    happend[e] &&
      ((hero.pos[0] > 1078 && hero.pos[1] > 450) || t) &&
      ((running = eventing),
      groupMove("ground", 5, 0, -130),
      groupMove("ground", 6, 1, 150),
      (happend[e] = !1));
  }),
  events.push((e, t) => {
    happend[e] &&
      ((hero.pos[0] > 2200 && hero.pos[1] > 450) || t) &&
      ((running = eventing),
      groupMove("ground", 6, 1, -150),
      (happend[e] = !1));
  }),
  events.push((e, t) => {
    happend[e] &&
      (hero.pos[0] > 2340 || t) &&
      ((fixed = !0),
      (vx = 1955),
      (toolTextIndex = -1),
      isSave && (save(), (isSave = !1)),
      groupMove("boss", 0, 0, -200),
      timeouts.push(
        setTimeout(() => {
          (bossActive = !0), (enemyView = 1e3);
        }, 3e3)
      ),
      timeouts.push(
        setTimeout(() => {
          boss.skill.canSummon = !0;
        }, randomRange(1e3, 3e3))
      ),
      timeouts.push(
        setTimeout(() => {
          boss.skill.canDestory = !0;
        }, 8e3)
      ),
      (happend[e] = !1));
  }),
  events.push((e) => {
    let t = groups.enemy.elements.filter((e) => 3 === e.id);
    happend[e] &&
      1 === cycler &&
      0 === t.length &&
      (setTimeout(() => {
        (toolTextIndex = 3), (hero.canBack = !0);
      }, 3e3),
      (happend[e] = !1));
  }),
  events.push((e) => {
    happend[e] &&
      hero.pos[1] < 140 &&
      3 === toolTextIndex &&
      ((toolTextIndex = -1), (happend[e] = !1));
  });
let groupMove = (e, t, o, n) => {
    let r = 0.01 * n,
      s = groups[e].elements[t],
      i = s.lt[o];
    for (let e = 0; e < 100; e++)
      setTimeout(() => {
        s.lt[o] += r;
      }, 20 * e);
    setTimeout(() => {
      (running = gaming), (s.pos[o] += n), (s.rd[o] += n), (s.lt[o] = i + n);
    }, 2e3);
  },
  skepEvent = () => {
    (running = eventing),
      groupMove(5, 0, -130),
      groupMove(6, 1, 150),
      (running = eventing),
      (happend[0] = !1),
      (happend[1] = !1);
  },
  showBoss = () => {
    (vx = 1955), (fixed = !0);
  },
  save = () => {
    console.log("save fixed", fixed);
    let e = {
      happend: happend,
      groups: groups,
      vx: vx,
      bossActive: bossActive,
      fixed: fixed,
    };
    globalSnapshot = JSON.stringify(e);
    for (let e = 0; e < 100; e++)
      setTimeout(() => {
        saveCap = 0.01 * e;
      }, 10 * e),
        setTimeout(() => {
          saveCap = 0.01 * (99 - e);
        }, 10 * e + 2e3);
  },
  load = () => {
    let e = JSON.parse(globalSnapshot);
    (groups = e.groups),
      (vx = e.vx),
      (happend = e.happend),
      (bossActive = e.bossActive),
      (fixed = e.fixed),
      ((hero = e.groups.hero.elements[0]).hp = hero.maxHp),
      ((boss = e.groups.boss.elements[0]).skill = {
        canDestory: !1,
        canSummon: !1,
      }),
      groups.enemy.elements.forEach((e) => {
        e.canMove = !0;
      }),
      (heroSnapshot = []),
      timeouts.forEach((e) => {
        clearTimeout(e);
      }),
      (timeouts = []);
  },
  tutorMove = () => {
    hero.pos[0] <= 95 && (toolTextIndex = 0);
  },
  tutorJump = () => {
    hero.pos[0] > 95 && hero.pos[1] > 400 && (toolTextIndex = 1);
  },
  tutorAttack = () => {
    hero.pos[0] > 172 && hero.pos[0] < 280 && (toolTextIndex = 2);
  };
startEvents.push(tutorMove, tutorJump, tutorAttack);
let drawBackground = () => {
    let e = ctx.createLinearGradient(0, 0, w, h);
    e.addColorStop(0, "#53468E"),
      e.addColorStop(0.33, "#5B65A3"),
      e.addColorStop(1, "#418DB0"),
      (ctx.fillStyle = e),
      ctx.fillRect(0, 0, w, h),
      (ctx.fillStyle = "#9BADCE"),
      sky.forEach((e) => {
        ctx.fillRect(e[0] - vx, e[1], 5.5, 5.5);
      });
  },
  drawGround = () => {
    let e = groups.ground;
    e.elements.forEach((e) => {
      (ctx.fillStyle = "#3CA836"),
        ctx.fillRect(e.lt[0] - vx, e.lt[1], e.len.w + 1, 10),
        (ctx.fillStyle = "#978426"),
        ctx.fillRect(e.lt[0] - vx, e.lt[1] + 10, e.len.w + 1, 15),
        (ctx.fillStyle = "#A94823"),
        ctx.fillRect(e.lt[0] - vx, e.lt[1] + 10 + 15, e.len.w + 1, e.len.h),
        (ctx.fillStyle = "#A98F81"),
        e.stones.forEach((t) => {
          ctx.fillRect(t[0] - vx + e.lt[0], t[1] + e.lt[1], 11, 11);
        });
    });
  },
  drawHero = () => {
    ctx.fillStyle = "blue";
    let e = heroSkin;
    shooting && moving
      ? (e = heroMoveAndShoot)
      : shooting
      ? (e = heroShootSkin)
      : moving && (e = heroMoveSkin),
      renderSkin(hero, e, 1, 1);
  },
  drawEnemy = () => {
    (ctx.fillStyle = "#2c362e"),
      groups.enemy.elements.forEach((e) => {
        renderSkin(e, e.skin, 5, 5);
      }),
      boss && drawBoss();
  },
  drawBackEffect = (e, t) => {
    let o = ctx.createRadialGradient(
      0.5 * w,
      0.5 * h,
      250,
      0.5 * w,
      0.5 * h,
      450
    );
    o.addColorStop(0, e),
      o.addColorStop(1, t),
      (ctx.fillStyle = o),
      ctx.fillRect(0, 0, w, h);
  },
  drawArrow = () => {
    groups.arrow.elements.forEach((e) => {
      renderSkin(e, arrowSkin, 1, 1);
    });
  },
  drawBoss = () => {
    let e = bossSkin;
    boss.face = 1;
    let t = (boss.hp / boss.maxHp) * 130;
    boss.hp < 0 && (t = 0),
      (ctx.fillStyle = "#121211"),
      ctx.fillRect(boss.lt[0] - vx + 20, boss.lt[1] - 40, 130, 10),
      (ctx.fillStyle = "#ebc934"),
      ctx.fillRect(boss.lt[0] - vx + 20, boss.lt[1] - 40, t, 10),
      renderSkin(boss, e, 10, 10);
  },
  drawRock = () => {
    groups.rock.elements.forEach((e) => {
      let t = ctx.createLinearGradient(e.lt[0] - vx, 0, e.rd[0] - vx, 0);
      t.addColorStop(0, "#ad5e09"),
        t.addColorStop(0.25, "#81e629"),
        t.addColorStop(0.75, "#81e629"),
        t.addColorStop(1, "#ad5e09"),
        (ctx.fillStyle = t),
        ctx.fillRect(e.lt[0] - vx, e.lt[1], e.len.w, e.len.h);
    });
  },
  drawHead = () => {
    (ctx.fillStyle = "#060001"),
      (ctx.lineWidth = 5),
      (ctx.lineJoin = "round"),
      ctx.strokeRect(98, 18, 205, 24);
    let e = (hero.hp / hero.maxHp) * 200,
      t = ((hero.maxHp - hero.hp) / hero.maxHp) * 200;
    (ctx.fillStyle = "#E61E18"),
      ctx.fillRect(100, 20, e, 20),
      (ctx.fillStyle = "#474646"),
      ctx.fillRect(100 + e, 20, t, 20),
      (ctx.fillStyle = "#87372f"),
      ctx.beginPath(),
      ctx.arc(25, 15, 80, 0, 2 * Math.PI),
      ctx.fill(),
      (ctx.strokeStyle = "black"),
      ctx.stroke();
    let o = heroSkin,
      n = ["face", "hair", "eye"],
      r = [10, 10];
    for (let e in n) {
      let t = o[n[e]];
      for (let e in t) {
        let o = t[e];
        (ctx.fillStyle = o.color),
          (ctx.fillStyle = o.color),
          o.points.forEach((e) => {
            if (Array.isArray(e[0]))
              for (let t = e[0][0]; t <= e[1][0]; t++)
                for (let o = e[0][1]; o <= e[1][1]; o++)
                  ctx.fillRect(4 * t + r[0], 4 * o + r[1], 4, 4);
            else ctx.fillRect(4 * e[0] + r[0], 4 * e[1] + r[1], 4, 4);
          });
      }
    }
  },
  renderSkin = (e, t, o, n) => {
    let r = t.priority;
    if (1 === e.face)
      for (let s in r) {
        let i = t[r[s]];
        for (let t in i) {
          let r = i[t];
          (ctx.fillStyle = r.color),
            r.points.forEach((t) => {
              if (Array.isArray(t[0]))
                for (let r = t[0][0]; r <= t[1][0]; r++)
                  for (let s = t[0][1]; s <= t[1][1]; s++)
                    ctx.fillRect(
                      e.lt[0] + r * o - vx,
                      e.lt[1] + s * n,
                      o + 1,
                      n + 1
                    );
              else
                ctx.fillRect(
                  e.lt[0] + t[0] * o - vx,
                  e.lt[1] + t[1] * n,
                  o + 1,
                  n + 1
                );
            });
        }
      }
    else
      for (let s in r) {
        let i = t[r[s]];
        for (let t in i) {
          let r = i[t];
          ctx.fillStyle = r.color;
          let s = e.len.w / o;
          r.points.forEach((t) => {
            if (Array.isArray(t[0]))
              for (let r = s - t[1][0]; r <= s - t[0][0]; r++)
                for (let s = t[0][1]; s <= t[1][1]; s++)
                  ctx.fillRect(e.lt[0] + r * o - vx, e.lt[1] + s * n, o, n);
            else
              ctx.fillRect(
                e.lt[0] + (s - t[0]) * o - vx,
                e.lt[1] + t[1] * n,
                o,
                n
              );
          });
        }
      }
  },
  drawWin = () => {
    (ctx.fillStyle = `rgb(124, 161, 159, ${winCap})`), ctx.fillRect(0, 0, w, h);
  },
  drawDie = () => {
    (ctx.fillStyle = `rgb(255, 41, 41, ${dieCap})`), ctx.fillRect(0, 0, w, h);
  },
  drawCycle = () => {
    cycler > 1 &&
      ((ctx.fillStyle = "rgb(125, 85, 85, 0.8)"),
      ctx.fillRect(570, 10, 200, 40),
      (ctx.fillStyle = "#bd9d9d"),
      (ctx.font = "bold 18pt Arial"),
      ctx.fillText(`${cycler} New Game +`, 580, 40));
  },
  drawTitle = () => {
    (ctx.fillStyle = "rgb(255, 255, 255, 0.3)"),
      ctx.fillRect(50, 30, 668, 200),
      renderSkin({ face: 1, lt: [90, 50] }, titleSkin, 10, 10);
  },
  drawText = () => {
    if (toolTextIndex >= 0) {
      (ctx.fillStyle = "#34ebd2"), (ctx.font = "20px Arial");
      let e = toolText[toolTextIndex],
        t = 3 * e.length;
      ctx.fillText(e, hero.lt[0] - t - vx, hero.lt[1] - 10);
    }
    (ctx.fillStyle = `rgb(52, 235, 210, ${saveCap})`),
      ctx.fillText("saving ...", 680, 630);
  },
  handleArrowContact = () => {
    let e = {},
      t = {};
    for (let t in difGupContacts["arrow-ground"].contactPlanes) {
      let o = difGupContacts["arrow-ground"].contactPlanes[t];
      o.isEverContact && (e[o.element1Index] = !0);
    }
    for (let t in difGupContacts["arrow-enemy"].contactPlanes) {
      let o = difGupContacts["arrow-enemy"].contactPlanes[t];
      o.isEverContact &&
        ((e[o.element1Index] = !0),
        (groups.enemy.elements[o.element2Index].hp -= hero.atk));
    }
    for (let t in difGupContacts["arrow-boss"].contactPlanes) {
      let o = difGupContacts["arrow-boss"].contactPlanes[t];
      o.isEverContact && ((e[o.element1Index] = !0), (boss.hp -= hero.atk));
    }
    groups.arrow.elements.forEach((t, o) => {
      (t.lt[0] <= bound.lX + 1 || t.rd[0] >= bound.uX - 1) && (e[o] = !0);
    }),
      (groups.arrow.elements = groups.arrow.elements.filter((t, o) => !e[o])),
      groups.rock &&
        (groups.rock.elements.forEach((e, o) => {
          (e.lt[1] <= bound.lY + 1 || e.rd[1] >= bound.uY - 1) &&
            (console.log("rock dead"), (t[o] = !0));
        }),
        (groups.rock.elements = groups.rock.elements.filter((e, o) => !t[o]))),
      (difGupContacts["arrow-ground"].contactPlanes = {}),
      (difGupContacts["arrow-enemy"].contactPlanes = {}),
      (difGupContacts["arrow-boss"].contactPlanes = {});
  },
  handleEnemyMove = () => {
    groups.enemy.elements.forEach((e) => {
      let t = enemyVeclocity * (1 + 0.4 * cycler);
      if (e.canMove) {
        if (distance(hero.pos, e.pos) < enemyView) {
          let o = hero.pos[0] > e.pos[0] ? 1 : -1;
          (e.face = o),
            (e.f = plus(e.f, scale(t, [o, -10]))),
            (e.canMove = !1),
            setTimeout(() => (e.canMove = !0), 100);
        }
      }
    });
  },
  handleViewMove = () => {
    if (fixed) return;
    let e = hero.pos,
      t = e[0] - 0.5 * w,
      o = e[0] + 0.5 * w;
    t > 0 ? o < mapw && (vx = t) : (vx = 0);
  },
  handleHeroAttaced = () => {
    if (!hero.isSuper)
      for (let e in difGupContacts["enemy-hero"].contactPlanes) {
        let t = difGupContacts["enemy-hero"].contactPlanes[e];
        t.isEverContact &&
          ((hero.isSuper = !0),
          (hero.hp -= groups.enemy.elements[t.element1Index].atk),
          setTimeout(() => {
            hero.isSuper = !1;
          }, superTime));
      }
    for (let e in difGupContacts["hero-rock"].contactPlanes) {
      difGupContacts["hero-rock"].contactPlanes[e].isEverContact &&
        (hero.hp = -1);
    }
  },
  handleControl = () => {
    moving = !1;
    for (let e in controlKeys) controlKeys[e] && actions[e] && actions[e]();
    controlKeys.z && hero.canBack && (stopMusic(), playReserverMusic());
  },
  handleShooting = () => {
    if (shooting && !controlKeys.x) {
      let e = scale(bowForce, [hero.face, -0.1]);
      playShootMusic(),
        cycler > 1
          ? (groups.arrow.elements.push(
              new Arrow(
                hero.pos[0],
                hero.pos[1] - 4,
                10,
                10,
                e[0],
                e[1],
                200,
                hero.face
              )
            ),
            groups.arrow.elements.push(
              new Arrow(
                hero.pos[0],
                hero.pos[1] + 6,
                10,
                10,
                e[0],
                e[1],
                200,
                hero.face
              )
            ))
          : groups.arrow.elements.push(
              new Arrow(
                hero.pos[0],
                hero.pos[1],
                10,
                10,
                e[0],
                e[1],
                200,
                hero.face
              )
            ),
        (bowForce = 100),
        (shooting = !1);
    }
  },
  handleHeroCanJump = () => {
    for (let e in difGupContacts) {
      if (-1 === e.indexOf("hero")) continue;
      let t = difGupContacts[e].contactPlanes;
      for (let e in t)
        if (!hero.canJump && t[e].isEverContact) {
          hero.canJump = !0;
          break;
        }
    }
    for (let e in difGupContacts) {
      if (-1 === e.indexOf("hero")) continue;
      let t = difGupContacts[e].contactPlanes;
      for (let e in t) t[e].isEverContact = !1;
    }
  };
handleBossActive = () => {
  if (bossActive) {
    if (boss.skill.canSummon) {
      let e = Math.floor(3 * Math.random()) + 1,
        t = groups.enemy.elements,
        o = 100 * (1 + 0.4 * cycler),
        n = 12 * (1 + 0.4 * cycler);
      for (let r = 0; r < e; r++)
        t.push(
          new Enemy(
            2530 + 100 * r,
            400,
            100,
            100,
            0,
            0,
            55,
            monsterSkin2,
            o,
            n,
            10
          )
        );
      (boss.skill.canSummon = !1),
        timeouts.push(
          setTimeout(() => {
            boss.skill.canSummon = !0;
          }, randomRange(cd.summon[0], cd.summon[1]))
        );
    }
    if (boss.skill.canDestory) {
      switch (((boss.skill.canDestory = !1), Math.floor(4 * Math.random()))) {
        case 0:
          groups.rock.elements.push(
            new Rectangle(2700, 2, 20, h - 2, -30, 0, 200)
          );
          break;
        case 1:
          groups.rock.elements.push(
            new Rectangle(1800, 2, 20, h - 2, 30, 0, 200)
          );
          break;
        case 2:
          cycler >= 3
            ? (console.log("create a new row down"),
              groups.rock.elements.push(
                new Rectangle(1800, 2, 1200, 20, 0, 15, 200)
              ))
            : (console.log("create a new row up"),
              groups.rock.elements.push(
                new Rectangle(1800, 678, 1200, 20, 0, -15, 200)
              ));
          break;
        case 3:
          console.log("create a new row up"),
            groups.rock.elements.push(
              new Rectangle(1800, 678, 1200, 20, 0, -20, 200)
            );
      }
      timeouts.push(
        setTimeout(() => {
          boss.skill.canDestory = !0;
        }, randomRange(cd.destory[0], cd.destory[1]))
      );
    }
  }
};
let handleEnemyDie = () => {
    if (
      ((groups.enemy.elements = groups.enemy.elements.filter((e) => e.hp > 0)),
      boss && boss.hp < 0)
    ) {
      running = winning;
      for (let e = 0; e < 100; e++)
        setTimeout(() => {
          winCap = 0.01 * e;
        }, 50 * e);
      setTimeout(() => {
        cycler++, initGaming(), (running = gaming);
      }, 5e3);
    }
  },
  handleResetContactPlane = () => {
    for (let e in difGupContacts) difGupContacts[e].contactPlanes = {};
    for (let e in sameGupContacts) sameGupContacts[e].contactPlanes = {};
  },
  handleMakeSnapshot = () => {
    heroSnapshot.push({
      pos: [hero.pos[0], hero.pos[1]],
      v: [hero.v[0], hero.v[1]],
      lt: [hero.lt[0], hero.lt[1]],
      rd: [hero.rd[0], hero.rd[1]],
      vx: vx,
      hp: hero.hp,
      face: hero.face,
    });
  },
  handleHeroDie = () => {
    if (hero.hp < 0) {
      running = dieing;
      for (let e = 0; e < 100; e++)
        setTimeout(() => {
          dieCap = 0.01 * e;
        }, 20 * e);
      setTimeout(() => {
        load(), (running = gaming);
      }, 2e3);
    }
  },
  handleHeroTimeBack = () => {
    if ((console.log("back tracking !!!"), heroSnapshot.length > 0)) {
      let e = heroSnapshot[heroSnapshot.length - 1];
      (hero.pos[0] = e.pos[0]),
        (hero.pos[1] = e.pos[1]),
        (hero.lt[0] = e.lt[0]),
        (hero.lt[1] = e.lt[1]),
        (hero.rd[0] = e.rd[0]),
        (hero.rd[1] = e.rd[1]),
        (hero.v[0] = e.v[0]),
        (hero.v[1] = e.v[1]),
        (hero.hp = e.hp),
        (hero.face = e.face),
        (vx = e.vx),
        heroSnapshot.pop();
    } else console.log("snapshot is no more");
  },
  handleIdel = () => {
    hero.pos[1] > 700 && initStarting();
  },
  handleEnterGaming = () => {
    0 === groups.enemy.elements.length && ((running = gaming), initGaming());
  },
  winning = () => {
    drawBackground(),
      drawGround(),
      drawHero(),
      drawEnemy(),
      drawArrow(),
      drawHead(),
      drawWin();
  },
  starting = () => {
    drawBackground(),
      drawGround(),
      drawHero(),
      drawEnemy(),
      drawArrow(),
      drawTitle(),
      drawText();
    for (let e = 0; e < demStepInPerFrame; e++) demStep();
    startEvents.forEach((e, t) => e(t)),
      handleControl(),
      handleArrowContact(),
      handleShooting(),
      handleHeroCanJump(),
      handleResetContactPlane(),
      handleEnemyDie(),
      handleIdel(),
      handleEnterGaming();
  },
  dieing = () => {
    drawBackground(),
      drawGround(),
      drawHero(),
      drawEnemy(),
      drawArrow(),
      drawHead(),
      drawDie();
  },
  gaming = () => {
    drawBackground(),
      drawGround(),
      drawHero(),
      drawEnemy(),
      drawArrow(),
      drawHead(),
      drawText(),
      drawCycle(),
      drawRock();
    for (let e = 0; e < demStepInPerFrame; e++) demStep();
    events.forEach((e, t) => e(t)),
      handleViewMove(),
      handleControl(),
      handleArrowContact(),
      handleEnemyMove(),
      handleHeroAttaced(),
      handleShooting(),
      handleMakeSnapshot(),
      handleHeroCanJump(),
      handleEnemyDie(),
      handleResetContactPlane(),
      handleBossActive(),
      handleHeroDie();
  },
  eventing = () => {
    drawBackground(),
      drawGround(),
      drawHero(),
      drawEnemy(),
      drawArrow(),
      drawHead();
  };
function execute() {
  running(), requestAnimationFrame(execute);
}
let heroTimeBack = () => {
  drawBackground(),
    drawGround(),
    drawEnemy(),
    drawHero(),
    drawArrow(),
    drawRock(),
    drawBackEffect("rgb(34, 150, 227, 0.08", "rgb(0, 183, 255, 1"),
    handleHeroTimeBack(),
    !1 === controlKeys.z &&
      hero.canBack &&
      ((running = gaming), stopReserverMusic(), playMusic());
};
const main = () => {
  onresize(),
    initStarting(),
    (running = starting),
    execute(),
    setTimeout(() => {
      playMusic();
    }, 1e3);
};
window.onload = main;
