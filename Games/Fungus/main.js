class Game {
  constructor(e, t = 0) {
    (this.levelDescriptions = e),
      (this.currentLevel = void 0),
      (this.levelIndex = t);
  }
  start() {
    this.nextLevel(), window.setInterval(() => this.render(), 20);
  }
  nextLevel() {
    this.levelIndex >= this.levelDescriptions.length ||
      (this.levelIndex++, music && music.modulate(), this.resetLevel());
  }
  resetLevel() {
    const e = this.levelDescriptions[this.levelIndex - 1];
    void 0 !== e.t &&
      ((introBox.innerHTML = e.t), introBox.classList.remove("closed"));
    const t = e.m.map((e) => DraggableMolecule.from(e));
    this.currentLevel = new Level(t, () => this.nextLevel());
  }
  resetGame() {
    (this.levelIndex = 1), this.resetLevel();
  }
  render() {
    ctx.save(),
      (ctx.fillStyle = "white"),
      ctx.fillRect(0, 0, canvas.width, canvas.height),
      ctx.restore(),
      this.currentLevel.render(ctx);
  }
}
class SavedGame extends Game {
  constructor(e) {
    super(e, localStorage.getItem("levelIndex") ?? 0);
  }
  resetLevel() {
    localStorage.setItem("levelIndex", this.levelIndex - 1), super.resetLevel();
  }
}
class Grid {
  constructor(e, t, s, r) {
    (this.radius = e),
      (this.center = t),
      (this.size = s),
      (this.color = r),
      (this.circle = Array.from(Position.circle(this.size)).map((e) =>
        this.getHexagon(e)
      ));
  }
  render() {
    for (const e of this.circle) new RenderedHexagon(e, this.color).render();
  }
  getHexagon(e) {
    const t = this.getCartesian(e);
    return new Hexagon(this.radius, t);
  }
  getCartesian(e) {
    return e.toNormalizedCartesian().scale(this.radius).add(this.center);
  }
  getPositions(e) {
    const t = e.subtract(this.center).scale(1 / this.radius);
    return Position.fromNormalizedCartesian(t);
  }
  maxPositionsBetween(e, t) {
    return Math.floor(
      e.distance(t) / (2 * Math.cos(Math.PI / 3) * this.radius)
    );
  }
  *traceToPositions(e) {
    const t = [];
    for (const s of e) {
      const e = this.getPositions(s).filter(
        (e) => void 0 === t.find((t) => e.equals(t))
      );
      for (const s of e) t.push(s), yield s;
    }
  }
  isInside(e) {
    return e.isInside(this.size);
  }
  output() {
    return { c: this.center.output(), r: this.radius, s: this.size };
  }
  static from({ r: e, c: t, s: s }) {
    return new Grid(e, new Vector(...t), s, "#777");
  }
}
class ReactiveGrid {
  constructor() {
    (this.mousePosition = void 0),
      this.setListeners(),
      [
        "mousedown",
        "mouseup",
        "mousemove",
        "touchstart",
        "touchend",
        "touchmove",
      ].forEach((e) =>
        canvas.addEventListener(e, (t) => this.handleMouseTouchEvent(e, t))
      );
    const e = { KeyQ: "left", KeyE: "right", KeyD: "special" };
    window.addEventListener("keydown", (t) => {
      Object.entries(e).forEach(([e, s]) =>
        e === t.code ? this.listeners[s].call() : {}
      );
    }),
      canvas.addEventListener("mouseout", (e) =>
        this.handleMouseTouchEvent("mouseup", e)
      ),
      canvas.addEventListener("touchcancel", (e) =>
        this.handleMouseTouchEvent("touchend", e)
      );
  }
  handleMouseTouchEvent(e, t) {
    t.preventDefault();
    let [s, r] = [0, 0];
    if (e.startsWith("touch")) {
      const e = t.changedTouches[0],
        i = t.target.getBoundingClientRect();
      (s = e.clientX - i.left), (r = e.clientY - i.top);
    } else [s, r] = [t.offsetX, t.offsetY];
    const i = grid.getPositions(new Vector(s, r))[0];
    switch (e) {
      case "mousedown":
      case "touchstart":
        this.listeners.mousedown(i);
        break;
      case "mouseup":
      case "touchend":
        this.listeners.mouseup(i);
        break;
      case "mousemove":
      case "touchmove":
        (this.mousePosition && this.mousePosition.equals(i)) ||
          ((this.mousePosition = i), this.listeners.mousemove(i));
    }
  }
  setListeners(
    e = {
      mousedown: () => {},
      mousemove: () => {},
      mouseup: () => {},
      left: () => {},
      right: () => {},
      special: () => {},
    }
  ) {
    this.listeners = e;
  }
}
class Position {
  constructor(e, t) {
    (this.u = e),
      (this.v = t),
      Position.base ||
        (Position.base = [
          [1 + Math.cos(Math.PI / 3), -(1 + Math.cos(Math.PI / 3))],
          [Math.sin(Math.PI / 3), Math.sin(Math.PI / 3)],
        ]);
  }
  static *circle(e) {
    for (let t = 0; t < e; t++)
      for (let s = 0; s < e; s++)
        for (let r = 0; r < e; r++)
          [t, s, r].some((e) => 0 === e) && (yield new Position(t - r, s - r));
  }
  static fromNormalizedCartesian(e) {
    let t = new Matrix(Position.base)
        .invert()
        .multiply(e)
        .rounded()
        .map((e) => new Position(...e)),
      s = 1 / 0;
    const r = t.map((t) => {
      const r = t.toNormalizedCartesian(),
        i = e.distance(r);
      return i < s && (s = i), i;
    });
    return t
      .filter((e, t) => Math.abs(s - r[t]) < 0.01)
      .filter((e, t, s) => s.findIndex((t) => t.equals(e)) === t);
  }
  toNormalizedCartesian() {
    return new Matrix(Position.base).multiply(new Vector(this.u, this.v));
  }
  isInside(e) {
    return Math.sign(this.u) === Math.sign(this.v)
      ? Math.abs(this.u) < e && Math.abs(this.v) < e
      : Math.abs(this.u) + Math.abs(this.v) < e;
  }
  equals(e) {
    return this.u === e.u && this.v === e.v;
  }
  output() {
    return [this.u, this.v];
  }
}
class Matrix {
  constructor(e) {
    this.rows = e;
  }
  multiply(e) {
    return new Vector(...this.rows.map((t) => e.dotProduct(new Vector(...t))));
  }
  scale(e) {
    return new Matrix(this.rows.map((t) => t.map((t) => t * e)));
  }
  invert() {
    return new Matrix([
      [this.rows[1][1], -this.rows[0][1]],
      [-this.rows[1][0], this.rows[0][0]],
    ]).scale(1 / this.determinant());
  }
  determinant() {
    return (
      this.rows[0][0] * this.rows[1][1] - this.rows[1][0] * this.rows[0][1]
    );
  }
}
class Vector {
  constructor(...e) {
    this.v = e;
  }
  add(e) {
    return new Vector(...this.v.map((t, s) => t + e.v[s]));
  }
  subtract(e) {
    return this.add(e.scale(-1));
  }
  scale(e) {
    return new Vector(...this.v.map((t) => t * e));
  }
  dotProduct(e) {
    return this.v.reduce((t, s, r) => t + s * e.v[r], 0);
  }
  distance(e) {
    const t = e.subtract(this);
    return Math.sqrt(t.dotProduct(t));
  }
  rounded() {
    const { ceil: e, floor: t } = Math,
      s = this.v;
    return [
      [t(s[0]), t(s[1])],
      [t(s[0]), e(s[1])],
      [e(s[0]), e(s[1])],
      [e(s[0]), t(s[1])],
    ];
  }
  output() {
    return [...this.v];
  }
}
class Hexagon {
  constructor(e, t) {
    (this.center = t), (this.radius = e), (this.corners = []);
  }
  getCorners() {
    return (
      0 === this.corners.length &&
        (this.corners = Array.from({ length: 6 }, (e, t) =>
          this.center.add(
            new Vector(
              this.radius * Math.cos((t * Math.PI) / 3),
              this.radius * Math.sin((t * Math.PI) / 3)
            )
          )
        )),
      this.corners
    );
  }
}
class RenderedHexagon {
  constructor(e, t = "#000", s = 0) {
    (this.hexagon = e), (this.color = t), (this.alpha = s);
  }
  render() {
    const e = this.hexagon.getCorners();
    ctx.save(),
      (ctx.strokeStyle = this.color),
      ctx.beginPath(),
      ctx.moveTo(e[0].v[0], e[0].v[1]);
    for (const t of e) ctx.lineTo(t.v[0], t.v[1]);
    ctx.closePath(),
      ctx.stroke(),
      (ctx.fillStyle = this.color),
      (ctx.globalAlpha = this.alpha),
      ctx.fill(),
      ctx.restore();
  }
}
class Hint {
  constructor(e, t) {
    (this.hexagon = e), (this.expire = t), (this.fade = 10);
  }
  render() {
    0 !== this.fade
      ? (new RenderedHexagon(this.hexagon, "white", this.fade / 10).render(),
        this.fade--)
      : this.expire(this);
  }
}
class Level {
  constructor(e, t = () => {}) {
    (this.molecules = e),
      (this.hints = []),
      (this.completed = t),
      reactive.setListeners({
        mousedown: (e) => this.handleMousedown(e),
        mousemove: (e) => this.handleMousemove(e),
        mouseup: (e) => this.handleMouseup(e),
        left: this.handleLeft.bind(this),
        right: this.handleRight.bind(this),
      });
  }
  isOccupied(e, t) {
    return e.some((e) => e.isAt(t));
  }
  dissovle(e) {
    (this.molecules = this.molecules.filter((t) => t !== e)),
      0 === this.molecules.length && this.completed();
  }
  hintAt(e) {
    this.hints.push(new Hint(grid.getHexagon(e), this.expireHint.bind(this)));
  }
  expireHint(e) {
    this.hints = this.hints.filter((t) => e !== t);
  }
  render() {
    ctx.save(),
      (ctx.fillStyle = "#222"),
      ctx.fillRect(0, 0, canvas.width, canvas.height),
      ctx.restore(),
      grid.render(),
      this.molecules.forEach((e) => e.render()),
      this.hints.forEach((e) => e.render());
  }
  handleMousedown(e) {
    this.molecules.forEach((t) => t.mousedown(e));
  }
  handleMousemove(e) {
    this.triggerMoleculeEvents("mousemove", e);
  }
  handleMouseup() {
    this.molecules.forEach((e) => e.mouseup());
  }
  handleLeft() {
    this.triggerMoleculeEvents("left");
  }
  handleRight() {
    this.triggerMoleculeEvents("right");
  }
  triggerMoleculeEvents(e, ...t) {
    this.molecules.forEach((s) =>
      s[e].bind(s, ...t)(
        this.dissovle.bind(this),
        this.isOccupied.bind(
          this,
          this.molecules.filter((e) => e !== s)
        ),
        this.hintAt.bind(this)
      )
    );
  }
}
let game, canvas, ctx, introBox, grid, reactive;
function setupGlobals() {
  (canvas = document.getElementById("canvas")),
    (ctx = canvas.getContext("2d")),
    (introBox = document.getElementById("intro")),
    introBox.addEventListener("click", () => introBox.classList.add("closed")),
    (grid = new Grid(
      15,
      new Vector(canvas.width / 2, canvas.height / 2),
      15,
      "#777"
    )),
    (reactive = new ReactiveGrid());
}
function startGame() {
  setupGlobals();
  const e = new URLSearchParams(window.location.search).get("level");
  if (e) {
    const t = window.atob(e),
      s = JSON.parse(t);
    game = new Game([s]);
  } else game = new SavedGame(levelCollection);
  game.start();
}
function translateLevel() {
  const e = new URLSearchParams(window.location.search).get("level"),
    t = window.atob(e),
    s = JSON.parse(t).m.map(({ c: e, s: t }) => ({
      c: e,
      s: t.map((e) => [e[0] - e[2], e[1] - e[2]]),
    }));
  console.log(JSON.stringify({ m: s }));
}
class Molecule {
  constructor(e, t) {
    (this.shape = e), (this.color = t);
  }
  isAt(e) {
    return this.shape.some((t) => t.equals(e));
  }
  transform(e, t, s, r) {
    let i = !1;
    const o = this.shape.map((t) => e.transform(t, s, () => (i = !0), r));
    return (
      !i && (o.every((e) => !grid.isInside(e)) && t(), (this.shape = o), !0)
    );
  }
  overlaps(e) {
    return this.shape.some((t) => e.isAt(t));
  }
  render() {
    ctx.save(),
      (ctx.lineWidth = 3),
      this.shape.forEach((e) => {
        let t = grid.getHexagon(e);
        new RenderedHexagon(t, this.color, 0.4).render();
      }),
      ctx.restore();
  }
  output() {
    return { c: this.color, s: this.shape.map((e) => e.output()) };
  }
  highlighted() {
    return new HighlightedMolecule(this.shape, this.color);
  }
  unhighlighted() {
    return new Molecule(this.shape, this.color);
  }
  draggable() {
    return new DraggableMolecule(this.shape, this.color);
  }
  static from({ s: e, c: t }) {
    const s = e.map((e) => new Position(...e));
    return new Molecule(s, t);
  }
}
class HighlightedMolecule extends Molecule {
  constructor(e, t) {
    super(e, t);
  }
  render() {
    ctx.save(),
      (ctx.lineWidth = 3),
      this.shape.forEach((e) => {
        let t = grid.getHexagon(e);
        new RenderedHexagon(t, this.color, 0.7).render();
      }),
      ctx.restore();
  }
}
class DraggableMolecule extends Molecule {
  constructor(e, t) {
    super(e, t), (this.selected = void 0);
  }
  mousedown(e) {
    this.selected = super.isAt(e) ? e : void 0;
  }
  mousemove(e, t, s, r) {
    if (!this.selected) return;
    super.transform(new Transpose(this.selected, e), () => t(this), s, r) &&
      (this.selected = e);
  }
  mouseup() {
    this.selected = void 0;
  }
  left(e, t, s) {
    this.selected &&
      super.transform(new Rotation(this.selected, 1), () => e(this), t, s);
  }
  right(e, t, s) {
    this.selected &&
      super.transform(new Rotation(this.selected, -1), () => e(this), t, s);
  }
  static from(e) {
    return Molecule.from(e).draggable();
  }
}
class Transformation {
  transform(e, t, s, r) {
    const i = this.getTrace(e),
      o = Array.from(grid.traceToPositions(i));
    for (const i of o) if (t(i)) return r(i), r(e), s(), e;
    return o[o.length - 1];
  }
}
class Transpose extends Transformation {
  constructor(e, t) {
    super(), (this.source = e), (this.target = t);
  }
  getTrace(e) {
    const t = grid.getCartesian(this.source),
      s = grid.getCartesian(this.target),
      r = s.subtract(t),
      i = grid.getCartesian(e),
      o = grid.maxPositionsBetween(t, s);
    return 0 === o
      ? [i.add(r)]
      : Array.from(Array(o + 1), (e, t) => i.add(r.scale(t / o)));
  }
}
class Rotation extends Transformation {
  constructor(e, t) {
    super(), (this.pivot = e), (this.rotation = t);
  }
  getTrace(e) {
    const { sin: t, cos: s, PI: r } = Math,
      i = grid.getCartesian(this.pivot),
      o = grid.getCartesian(e).subtract(i);
    return Array.from(Array(31), (e, t) => t / 30).map((e) => {
      const n = (e * this.rotation * r) / 3;
      return new Matrix([
        [s(n), -t(n)],
        [t(n), s(n)],
      ])
        .multiply(o)
        .add(i);
    });
  }
}
const TEMPO = 10;
let key = 0;
const keys = [
  [
    makeScale([0, 5, 8], 1, 1),
    makeScale([2, 3, 5, 11], 2, 2),
    makeScale([0, 2, 3, 5, 7, 8, 11], 3, 2),
  ],
  [
    makeScale([3, 8, 11], 1, 1),
    makeScale([2, 5, 6, 8], 2, 2),
    makeScale([2, 3, 5, 6, 8, 10, 11], 3, 2),
  ],
  [
    makeScale([2, 6, 11], 1, 1),
    makeScale([5, 8, 9, 11], 2, 2),
    makeScale([1, 2, 5, 6, 8, 9, 11], 3, 2),
  ],
  [
    makeScale([2, 5, 9], 1, 1),
    makeScale([0, 2, 8, 11], 2, 2),
    makeScale([0, 2, 4, 5, 8, 9, 11], 3, 2),
  ],
];
let audioCtx,
  merger,
  gain,
  playing = !1;
class Music {
  constructor(e) {
    this.oscillators = e[key].map(
      (e, t) => new Oscillator(1 / (1 + 4 * t), e, 10 * 3 ** t)
    );
  }
  on() {
    this.oscillators.forEach((e) => e.start());
  }
  off() {
    this.oscillators.forEach((e) => e.stop());
  }
  modulate() {
    (key = (key + 1) % keys.length),
      this.oscillators.forEach((e, t) => (e.scale = keys[key][t]));
  }
}
class Oscillator {
  constructor(e, t, s) {
    (this.scale = t),
      (this.tempo = 6e4 / s),
      (this.amplitude = e),
      (this.osc = audioCtx.createOscillator()),
      this.osc.connect(gain),
      (this.index = 0),
      this.osc.frequency.setValueAtTime(
        this.randomNote(),
        audioCtx.currentTime
      ),
      this.osc.start();
  }
  start() {
    gain.gain.setValueAtTime(this.amplitude, audioCtx.currentTime),
      (this.interval = setInterval(() => {
        this.osc.frequency.setValueAtTime(
          this.randomNote(),
          audioCtx.currentTime
        );
      }, this.tempo));
  }
  stop() {
    gain.gain.setValueAtTime(0, audioCtx.currentTime),
      clearInterval(this.interval);
  }
  randomNote() {
    let e = Math.floor(Math.random() * this.scale.length);
    return (
      e === this.index && (e = (e + 1) % this.scale.length),
      (this.index = e),
      this.scale[e]
    );
  }
}
let music = null;
function toggleMusic(e) {
  null === music && initialize(),
    playing ? music.off() : music.on(),
    (e.target.textContent = playing ? "Music On" : "Music Off"),
    (playing = !playing);
}
function makeScale(e, t, s = 1) {
  return Array.from({ length: 12 * s }, (e, t) => 27.5 * 2 ** (t / 12))
    .filter((t, s) => e.includes(s % 12))
    .map((e) => e * 2 ** t);
}
function initialize() {
  const e = window.AudioContext || window.webkitAudioContext;
  (audioCtx = new e()),
    (gain = audioCtx.createGain()),
    gain.connect(audioCtx.destination),
    (music = new Music(keys));
}
const texts = {
    bird: "a tree so high.<br>\na chick too small to fly.<br>\nmama wouldn't listen.<br>\nyou are a fungus.<br>\ndecompose the bird.<br>\n<br>\n<em>drag and drop the molecules off the grid.<br>\n(click this box to start)</em>",
    bug: "a yummy apple.<br>\na sudden burst of light.<br>\nthe smell of pesticides.<br>\nlegs won't move.<br>\nyou are a fungus.<br>\ndecompose the bug.<br>\n<br>\n<em>rotate a molecule around the clicked position with Q and E.</em>",
    giraffe:
      "the majestic creature.<br>\nnature's work of art for some.<br>\nfor others a mere souvenir.<br>\nthey arrived just in time.<br>\nin time to catch the predators.<br>\ntoo late to save their prey.<br>\nyou are a fungus.<br>\ndecompose the giraffe",
    fish: "swimming in circles all day.<br>\ndirty water.<br>\nno food for days.<br>\nthe world turning upside down.<br>\nyou are a fungus.<br>\ndecompose the fish.",
    bee: "a clear blue sky.<br>\nhumans playing in the grass.<br>\nthe last resort - a sting.<br>\nno use.<br>\nyou are a fungus.<br>\ndecompose the bee.",
    cat: "tired from the hunt.<br>\nalmost home.<br>\njust there over the street.<br>\ntwo huge glaring eyes.<br>\nthey move so fast.<br>\nyou are a fungus.<br>\ndecompose the cat.",
    spider:
      "lurking in the corner for the prey.<br>\na fierce scream.<br>\nnot the prey - way too big.<br>\nthe clap of a shoe.<br>\nyou are a fungus.<br>\ndecompose the spider.",
    octopus:
      "deep blue water.<br>\na lost fishing net.<br>\nhow did it get here?<br>\nno chance to escape.<br>\nyou are a fungus.<br>\ndecompose the octopus.",
    whale:
      'falling from the sky.<br>\nbig, blue, a potted plant next to it.<br>\nweirdly thinking:<br>\n"not again"<br>\nyou are a fungus.<br>\ndecompose the blue whale.',
    alien:
      "the arrival of the strangers.<br>\nlooking for a new home.<br>\nlooking for a second chance.<br>\nlooking for new work force...<br>\nweapons never seen before.<br>\nyou are a space fungus.<br>\ndecompose the space creature.",
    can: 'vague memories of a hazy night.<br>\nsubstances one shouldn\'t mix.<br>\nyet one memory remains unchanged.<br>\nafter all those years.<br>\nyou are a fungus.<br>\n<span class="indented">...when will you lastly...<span><br>\ndecompose the can.<br>',
  },
  levelCollection = [
    {
      t: texts.bird,
      m: [
        {
          c: "#8caef2",
          s: [
            [-5, -4],
            [-4, -4],
            [-4, -5],
            [-3, -5],
            [-2, -5],
            [-1, -5],
            [0, -5],
            [0, -4],
            [0, -3],
            [0, -2],
            [0, -1],
            [-1, -1],
          ],
        },
        {
          c: "#eef76e",
          s: [
            [1, 3],
            [1, 2],
            [2, 2],
            [3, 2],
          ],
        },
        {
          c: "#77f76e",
          s: [
            [-6, -2],
            [-7, -3],
            [-7, -4],
            [-6, -4],
            [-7, -5],
            [-6, -5],
            [-5, -5],
          ],
        },
        {
          c: "#f764b2",
          s: [
            [-2, -4],
            [-1, -4],
            [-1, -3],
            [-1, -2],
          ],
        },
        {
          c: "#64f7b7",
          s: [
            [-4, -2],
            [-4, -3],
            [-3, -3],
            [-2, -3],
            [-2, -2],
            [-2, -1],
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 0],
            [1, -1],
            [1, -2],
            [1, -3],
            [1, -4],
            [2, -4],
            [3, -4],
          ],
        },
        {
          c: "#f76464",
          s: [
            [-3, -2],
            [-3, -1],
            [-3, 0],
            [-2, 1],
            [-1, 1],
            [0, 1],
          ],
        },
        {
          c: "#f7ab64",
          s: [
            [-3, 1],
            [-4, 0],
            [-4, -1],
            [-5, -2],
            [-5, -1],
            [-6, -1],
            [-6, 0],
          ],
        },
      ],
    },
    {
      t: texts.bug,
      m: [
        {
          c: "#82eff7",
          s: [
            [-5, 1],
            [-6, 0],
            [-7, -1],
            [-7, -2],
            [-7, -3],
            [-7, -4],
            [-7, -5],
            [-7, -6],
            [-7, -7],
            [-7, -8],
            [-6, -8],
            [-5, -8],
            [-4, -8],
            [-3, -8],
            [-2, -8],
            [-1, -8],
            [0, -7],
            [1, -6],
            [2, -5],
            [3, -4],
            [4, -3],
            [5, -2],
            [5, -1],
            [5, 0],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
            [5, 5],
            [5, 6],
            [4, 6],
            [3, 6],
            [2, 6],
          ],
        },
        {
          c: "#9a7d6a",
          s: [
            [-6, -1],
            [-5, 0],
            [-4, 1],
            [-4, 2],
            [-5, 2],
            [-6, 1],
            [-7, 1],
            [-7, 2],
            [-7, 3],
            [-6, 4],
            [-5, 5],
            [-8, 3],
            [-9, 3],
            [-10, 3],
            [-4, 5],
            [-3, 5],
          ],
        },
        {
          c: "#ffc87a",
          s: [
            [3, 5],
            [2, 5],
            [1, 5],
            [1, 6],
            [2, 7],
            [2, 8],
            [2, 9],
            [1, 9],
            [0, 9],
            [-1, 9],
            [-1, 10],
            [-1, 11],
            [-1, 12],
            [-2, 8],
            [-3, 7],
            [-4, 6],
            [-3, 6],
            [-2, 6],
          ],
        },
        {
          c: "#f56b3d",
          s: [
            [0, 5],
            [0, 4],
            [1, 4],
            [2, 4],
            [3, 4],
            [4, 4],
            [4, 5],
            [2, 3],
            [2, 2],
            [1, 2],
            [0, 2],
          ],
        },
        {
          c: "#3df553",
          s: [
            [0, 1],
            [1, 1],
            [2, 1],
            [3, 1],
            [3, 2],
          ],
        },
        {
          c: "#dd84f5",
          s: [
            [-1, 1],
            [-1, 0],
            [-1, -1],
            [-1, -2],
            [-1, -3],
            [-1, -4],
            [-1, -5],
            [-1, -6],
            [0, -5],
            [1, -4],
            [2, -3],
            [2, -2],
          ],
        },
        {
          c: "#84a6f5",
          s: [
            [-5, 3],
            [-4, 3],
            [-3, 3],
            [-2, 3],
            [-2, 2],
            [-2, 1],
            [-2, 0],
          ],
        },
        {
          c: "#813d9c",
          s: [
            [6, 6],
            [8, 10],
            [8, 11],
            [6, 5],
            [6, 4],
            [6, 3],
            [7, 3],
            [8, 3],
            [9, 3],
            [10, 3],
            [11, 3],
            [11, 2],
            [11, 1],
            [11, 0],
            [11, -1],
            [6, 2],
            [6, 1],
            [6, 0],
            [6, -1],
            [7, -1],
            [8, -1],
            [8, -2],
            [8, -3],
            [8, -4],
            [8, -5],
            [8, -6],
            [8, 8],
            [7, 7],
            [8, 9],
            [-8, -2],
            [-8, -3],
            [-8, -4],
            [-9, -2],
            [-10, -2],
            [-11, -2],
            [-11, -1],
            [-11, 0],
            [-11, 1],
            [-8, -5],
            [-9, -6],
            [-10, -7],
            [-11, -8],
            [-12, -9],
            [-12, -10],
            [-12, -11],
            [-12, -12],
            [-12, -13],
            [-8, -6],
            [-8, -7],
            [-9, -8],
            [-10, -9],
            [-10, -10],
            [-10, -11],
            [-10, -12],
            [-10, -13],
            [-10, -14],
            [-8, -8],
            [-8, -9],
            [-7, -9],
            [-6, -9],
            [-5, -9],
            [-4, -9],
            [-3, -9],
            [-2, -9],
            [-1, -9],
            [0, -8],
            [1, -7],
            [2, -6],
            [3, -5],
            [4, -4],
            [5, -3],
            [6, -2],
          ],
        },
      ],
    },
    {
      t: texts.fish,
      m: [
        {
          c: "#ff7a8e",
          s: [
            [-3, 1],
            [-4, 1],
            [-5, 1],
            [-6, 1],
            [-7, 1],
            [-7, 2],
            [-6, 3],
            [-5, 4],
            [-4, 5],
            [-3, 5],
            [-3, 6],
            [-2, 7],
            [-1, 7],
            [0, 8],
            [1, 8],
            [1, 7],
            [1, 6],
            [1, 5],
            [1, 4],
            [1, 3],
            [0, 2],
            [0, 1],
          ],
        },
        {
          c: "#feb376",
          s: [
            [-4, 2],
            [-3, 2],
            [-2, 2],
            [-2, 1],
            [-2, 0],
          ],
        },
        {
          c: "#80b7ff",
          s: [
            [-1, 5],
            [-1, 4],
            [-1, 3],
            [-1, 2],
            [-1, 1],
            [-1, 0],
            [-2, -1],
            [-3, -1],
            [-3, 0],
            [-4, -2],
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, -3],
            [-1, -2],
          ],
        },
        {
          c: "#7589a3",
          s: [
            [1, 2],
            [1, 1],
            [1, 0],
            [2, 0],
            [3, 0],
            [3, -1],
            [3, -2],
            [3, -3],
            [2, -3],
            [1, -4],
            [0, -5],
            [0, -4],
          ],
        },
        {
          c: "#e6fd72",
          s: [
            [4, 0],
            [4, -1],
            [4, -2],
            [4, -3],
            [4, -4],
            [4, -5],
            [3, -6],
            [4, -6],
            [3, -7],
            [2, -8],
            [3, -4],
            [2, -4],
            [1, -5],
            [0, -6],
            [-1, -7],
            [0, -7],
          ],
        },
        {
          c: "#72fd83",
          s: [
            [1, -6],
            [1, -7],
            [0, -8],
            [-1, -8],
            [-2, -8],
            [-2, -7],
            [-2, -6],
          ],
        },
        {
          c: "#f472fd",
          s: [
            [1, -8],
            [2, -7],
            [2, -6],
          ],
        },
        {
          c: "#f79c5f",
          s: [
            [-1, -5],
            [-1, -4],
            [0, -3],
            [1, -2],
            [2, -1],
          ],
        },
        {
          c: "#f75fe2",
          s: [
            [-2, -5],
            [-2, -4],
            [-2, -3],
            [-3, -3],
            [-4, -3],
            [-5, -3],
            [-6, -3],
            [-2, -2],
          ],
        },
        {
          c: "#5ff77d",
          s: [
            [-5, 3],
            [-4, 3],
            [-3, 3],
            [-2, 3],
          ],
        },
      ],
    },
    {
      t: texts.giraffe,
      m: [
        {
          c: "#fdc835",
          s: [
            [-1, -5],
            [0, -5],
            [1, -5],
            [2, -5],
            [3, -5],
            [5, -5],
            [6, -4],
            [6, -3],
            [6, -2],
            [6, 0],
            [-1, -2],
            [-1, -3],
            [-1, -4],
            [4, 4],
            [1, 4],
            [0, 3],
            [-1, 2],
            [-2, 1],
            [-2, -1],
            [-2, -2],
            [2, 4],
            [6, 1],
            [5, 4],
            [6, 4],
            [6, 2],
          ],
        },
        {
          c: "#e66100",
          s: [
            [6, -1],
            [7, 0],
            [8, 1],
            [9, 2],
            [10, 3],
            [11, 4],
            [12, 5],
            [7, 1],
            [5, -2],
            [5, -3],
          ],
        },
        {
          c: "#c24766",
          s: [
            [2, 1],
            [1, 0],
            [0, 0],
            [2, 2],
          ],
        },
        {
          c: "#a72a30",
          s: [
            [-3, -6],
            [-3, -7],
            [-2, 2],
            [-3, 1],
            [-3, 0],
            [-3, -2],
            [-4, -3],
            [-4, -4],
            [-4, -5],
            [-3, -5],
            [-2, -5],
            [-2, -7],
            [0, -7],
            [-5, -7],
            [-3, -1],
            [-2, 4],
            [0, -6],
            [-4, -9],
            [1, -6],
            [-3, 6],
          ],
        },
        {
          c: "#c0bfbc",
          s: [
            [5, -6],
            [6, -5],
            [7, -4],
            [8, -3],
            [9, -2],
            [10, -2],
            [4, -6],
            [4, -5],
            [4, -4],
            [3, -4],
          ],
        },
        {
          c: "#b5835a",
          s: [
            [5, 6],
            [6, 7],
            [7, 8],
            [8, 9],
            [9, 10],
            [3, 4],
            [4, 5],
            [2, 3],
            [1, 3],
            [5, 5],
          ],
        },
        {
          c: "#e5a50a",
          s: [
            [-10, -1],
            [-11, -1],
            [-12, -1],
            [-13, 0],
            [-13, 1],
            [-12, 0],
            [-12, 1],
            [-10, 0],
            [-9, 0],
            [-8, 0],
            [-7, 0],
            [-6, 0],
            [-5, 0],
            [-11, 0],
            [-13, 2],
            [-12, 2],
            [-10, -2],
            [-9, -2],
            [-7, -2],
            [-5, -2],
            [-2, -3],
            [-2, -4],
            [-3, -3],
            [-2, 0],
            [-1, 1],
            [0, 2],
            [1, 2],
          ],
        },
        {
          c: "#cdab8f",
          s: [
            [4, 1],
            [5, 2],
            [7, 4],
            [8, 5],
            [9, 6],
            [10, 7],
            [11, 8],
            [12, 9],
            [6, 3],
          ],
        },
        {
          c: "#77767b",
          s: [
            [-8, -2],
            [-8, -1],
            [-6, -2],
            [-6, -1],
            [-14, -2],
            [-13, -1],
          ],
        },
        {
          c: "#b5835a",
          s: [
            [3, -2],
            [4, -1],
            [5, 0],
            [7, 2],
            [8, 3],
            [9, 4],
            [10, 5],
          ],
        },
      ],
    },
    {
      t: texts.bee,
      m: [
        {
          c: "#87eec1",
          s: [
            [4, -10],
            [5, -9],
            [6, -8],
            [7, -7],
            [8, -6],
            [9, -5],
            [10, -4],
            [11, -3],
            [11, -2],
            [11, -1],
            [11, 0],
            [8, 0],
            [9, 0],
            [4, -6],
            [4, -7],
            [4, -8],
            [4, -9],
          ],
        },
        {
          c: "#fd5861",
          s: [
            [-8, -8],
            [-6, -9],
            [-6, -10],
            [-7, -10],
            [-5, -9],
            [-5, -10],
            [-7, -11],
            [-6, -11],
            [-9, -8],
            [-9, -7],
            [-8, -7],
            [-8, -6],
            [-7, -6],
            [-7, -7],
          ],
        },
        {
          c: "#fd58e7",
          s: [
            [3, -11],
            [0, -5],
            [0, -6],
            [0, -7],
            [0, -8],
            [0, -9],
            [0, -10],
            [0, -11],
            [1, -11],
            [2, -11],
            [-5, -5],
            [-4, -5],
            [-3, -5],
            [-2, -5],
            [-1, -5],
            [1, -4],
            [2, -3],
            [3, -2],
            [3, -1],
            [3, 0],
            [3, 1],
            [3, -10],
            [3, -9],
            [5, -7],
            [6, -6],
            [6, -5],
          ],
        },
        {
          c: "#58c6fd",
          s: [
            [-8, -14],
            [-9, -14],
            [-10, -14],
            [-11, -14],
            [-10, -13],
            [-9, -12],
            [-9, -11],
            [-9, -10],
          ],
        },
        {
          c: "#fbfd58",
          s: [
            [2, -2],
            [2, -1],
            [2, 0],
            [2, 1],
            [1, 1],
            [1, 2],
            [0, 2],
            [0, 3],
            [-1, 3],
            [5, 1],
            [5, 2],
            [5, 3],
            [5, 4],
            [4, 4],
            [3, 4],
            [3, 5],
            [3, 6],
            [2, 6],
          ],
        },
        {
          c: "#e8ac45",
          s: [
            [-4, 1],
            [-3, 2],
            [-2, 3],
            [-1, 4],
            [0, 5],
            [1, 6],
            [2, 7],
            [3, 8],
            [3, 9],
          ],
        },
        {
          c: "#e8fe7c",
          s: [
            [-9, -13],
            [-8, -12],
            [-7, -12],
            [-6, -12],
            [-5, -11],
            [-4, -10],
            [-3, -9],
            [-2, -8],
            [-2, -7],
            [-2, -6],
            [-8, -11],
          ],
        },
        {
          c: "#f54747",
          s: [
            [10, 10],
            [11, 11],
            [12, 12],
            [13, 13],
            [4, 9],
            [5, 9],
            [6, 9],
            [7, 9],
            [8, 9],
            [8, 8],
            [9, 9],
          ],
        },
        {
          c: "#4dff8b",
          s: [
            [-4, -4],
            [-5, -4],
            [-6, -4],
            [-5, -3],
            [-5, -2],
            [-5, -1],
            [-7, -4],
            [-8, -5],
            [-9, -6],
            [-10, -7],
            [-10, -8],
            [-10, -9],
            [-10, -10],
            [-10, -11],
            [-11, -9],
            [-12, -9],
            [-13, -9],
            [-13, -8],
            [-13, -7],
            [-12, -6],
            [-4, 0],
            [-5, 1],
            [-4, 2],
            [-4, 3],
            [-4, 4],
            [-6, -5],
            [-6, -6],
          ],
        },
        {
          c: "#4dd2ff",
          s: [
            [-6, 0],
            [-7, 0],
            [-8, 0],
            [-9, 0],
            [-10, 0],
            [-11, 0],
            [-11, 1],
            [-10, 3],
            [-9, 4],
            [-8, 5],
            [-7, 6],
            [-10, 2],
            [-5, 6],
            [-4, 6],
          ],
        },
        {
          c: "#db83ec",
          s: [
            [2, 8],
            [2, 9],
            [4, 10],
            [5, 10],
            [6, 10],
            [3, 10],
            [2, 10],
            [1, 10],
            [0, 10],
            [-1, 10],
            [-2, 10],
            [-3, 9],
            [-4, 8],
            [-5, 7],
            [-6, 6],
            [-7, 5],
            [-7, 4],
            [-7, 3],
            [-7, 2],
          ],
        },
        {
          c: "#d2fb60",
          s: [
            [7, 10],
            [8, 11],
            [9, 11],
            [10, 11],
            [11, 10],
            [11, 9],
            [11, 8],
            [11, 7],
            [10, 6],
            [8, 6],
            [8, 5],
            [8, 4],
          ],
        },
        {
          c: "#dc77f8",
          s: [
            [9, 8],
            [9, 7],
            [9, 6],
            [9, 5],
            [4, -1],
            [5, 0],
            [6, 1],
            [7, 2],
            [8, 3],
            [9, 4],
            [10, 4],
            [11, 4],
            [11, 3],
            [11, 2],
            [11, 1],
            [9, -1],
            [10, 0],
            [8, -2],
          ],
        },
      ],
    },
    {
      t: texts.cat,
      m: [
        {
          c: "#91f7d1",
          s: [
            [-3, -2],
            [-3, -3],
            [-3, -4],
            [-3, -5],
            [-2, -6],
            [-1, -6],
            [0, -6],
            [-3, -6],
            [-1, -5],
            [-1, -4],
            [-2, 1],
            [-2, 2],
            [-2, 3],
            [-4, 3],
            [-4, 2],
            [-2, 0],
            [-3, 4],
            [-2, 4],
            [-2, -1],
          ],
        },
        {
          c: "#e69e90",
          s: [
            [3, 0],
            [3, -1],
            [3, -2],
            [4, -2],
            [5, -2],
            [6, -2],
            [7, -1],
            [8, 0],
          ],
        },
        {
          c: "#f66ff0",
          s: [
            [2, -6],
            [2, -7],
            [1, -8],
            [0, -9],
            [-1, -10],
            [-2, -11],
            [-3, -11],
            [-4, -11],
            [-5, -11],
            [-5, -10],
            [1, -5],
            [0, -5],
            [0, -4],
            [0, -3],
            [0, -2],
            [-2, -5],
            [-2, -4],
            [-1, -3],
            [1, -6],
          ],
        },
        {
          c: "#e1cbc9",
          s: [
            [4, -1],
            [4, 0],
            [4, 1],
            [4, 2],
            [4, 3],
            [3, 4],
            [2, 4],
            [1, 4],
            [0, 4],
            [0, 5],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
            [7, 8],
            [1, 3],
            [1, 2],
          ],
        },
        {
          c: "#8dbf64",
          s: [
            [2, 2],
            [1, 1],
            [0, 1],
            [0, 2],
            [2, 1],
          ],
        },
        {
          c: "#ffac7b",
          s: [
            [-3, 6],
            [-2, 7],
            [1, 7],
            [1, 6],
            [1, 5],
            [2, 5],
            [3, 6],
            [4, 7],
            [5, 8],
            [5, 9],
            [-1, 8],
            [0, 8],
            [1, 8],
            [-1, 4],
            [-1, 5],
            [0, 6],
            [-4, 6],
            [-4, 5],
          ],
        },
        {
          c: "#cc97b8",
          s: [
            [1, -1],
            [1, -2],
            [1, -3],
            [1, -4],
            [2, -4],
            [3, -5],
            [4, -5],
            [5, -5],
            [6, -5],
            [7, -4],
            [2, -5],
          ],
        },
        {
          c: "#eff5ae",
          s: [
            [2, 0],
            [2, -1],
            [2, -2],
            [2, -3],
            [3, 1],
          ],
        },
        {
          c: "#85989d",
          s: [
            [-3, 2],
            [-5, 1],
            [-5, 2],
            [-5, 3],
            [-5, 4],
            [-5, 5],
            [-5, 6],
            [-5, 7],
            [-4, 7],
            [-3, 7],
            [-6, 4],
            [-7, 3],
            [-6, 3],
            [-4, 1],
            [-3, 3],
            [-3, 1],
          ],
        },
      ],
    },
    {
      t: texts.whale,
      m: [
        {
          c: "#2488c6",
          s: [
            [-8, 4],
            [-8, 3],
            [-8, 2],
            [-8, 1],
            [-8, 0],
            [-8, -1],
            [-8, -2],
            [-8, -3],
            [-8, -4],
            [-8, -5],
            [-7, -5],
            [-7, -6],
            [-6, -6],
            [-5, -6],
            [-5, -7],
            [-4, -7],
            [-3, -7],
            [-2, -7],
            [-1, -7],
            [0, -6],
            [1, -5],
            [-6, 7],
            [-5, 7],
            [-4, 7],
            [-2, 7],
            [-1, 7],
            [0, 7],
            [5, 5],
            [6, 5],
            [7, 4],
            [7, 3],
            [-7, 6],
            [-8, 5],
            [1, 7],
            [2, 7],
            [3, 7],
            [4, 7],
            [4, 6],
            [5, 6],
            [7, 5],
          ],
        },
        {
          c: "#1855cd",
          s: [
            [-2, -6],
            [-1, -5],
            [0, -4],
            [1, -4],
            [2, -4],
            [2, -5],
            [2, -6],
            [2, -7],
            [2, -8],
            [2, -9],
            [2, -10],
            [2, -11],
            [1, -12],
            [3, -10],
            [4, -9],
            [5, -8],
            [6, -7],
            [9, -4],
            [7, -6],
            [8, -5],
            [10, -3],
            [11, -2],
            [12, -1],
            [14, 1],
            [13, 0],
            [12, 0],
            [11, 0],
            [10, 0],
            [8, 0],
            [7, 0],
            [6, 0],
            [9, 0],
            [5, 0],
          ],
        },
        {
          c: "#6d291d",
          s: [
            [11, 4],
            [10, 3],
            [9, 2],
            [8, 1],
            [7, 1],
            [6, 1],
            [5, 1],
            [4, 1],
            [3, 1],
            [3, 2],
            [3, 3],
          ],
        },
        {
          c: "#7f789d",
          s: [
            [6, -4],
            [4, -4],
            [5, -3],
            [6, -2],
            [5, -4],
            [6, -3],
            [4, -5],
            [4, -6],
            [5, -5],
          ],
        },
        { c: "#a5c0bf", s: [[3, 4]] },
        {
          c: "#69a489",
          s: [
            [-6, 0],
            [-5, 1],
            [-4, 1],
            [-4, 0],
            [-5, -1],
          ],
        },
        {
          c: "#89ecc1",
          s: [
            [-5, 0],
            [-6, -1],
            [-6, -2],
            [-7, -1],
          ],
        },
        {
          c: "#258bcb",
          s: [
            [-3, 7],
            [4, -7],
            [5, -6],
            [4, -8],
            [3, -8],
            [-10, -6],
            [-10, -7],
            [-9, -7],
          ],
        },
        { c: "#54031b", s: [[7, 2]] },
        {
          c: "#6c9789",
          s: [
            [2, 5],
            [1, 5],
            [0, 5],
            [-1, 5],
            [-2, 5],
            [-3, 5],
          ],
        },
      ],
    },
    {
      t: texts.spider,
      m: [
        {
          c: "#bfa972",
          s: [
            [5, 13],
            [6, 13],
            [7, 13],
            [8, 13],
            [9, 13],
            [10, 13],
            [11, 13],
            [12, 13],
            [12, 12],
            [12, 11],
            [12, 10],
            [12, 9],
            [12, 8],
            [12, 7],
            [12, 5],
            [9, 2],
            [10, 3],
            [11, 4],
            [10, 2],
            [11, 2],
            [12, 2],
            [13, 2],
            [13, 1],
            [13, 0],
            [13, -1],
            [10, 14],
            [13, 12],
            [9, 4],
            [10, 5],
            [12, 6],
            [11, 6],
            [7, 12],
            [6, 11],
            [5, 11],
          ],
        },
        {
          c: "#262626",
          s: [
            [-6, -2],
            [-4, -2],
            [-4, 0],
            [-3, -3],
            [-1, -3],
            [-2, -1],
            [-3, -5],
          ],
        },
        {
          c: "#1ac125",
          s: [
            [-5, -1],
            [-5, -2],
            [-5, -3],
            [-4, -3],
            [-3, -2],
          ],
        },
        {
          c: "#90f3d4",
          s: [
            [-5, -7],
            [-5, -8],
            [-5, -9],
            [-6, -10],
            [-5, -6],
            [-4, -5],
            [-3, -4],
            [-2, -4],
            [-4, -7],
            [-3, -7],
            [-6, -6],
            [-2, -7],
            [-1, -6],
            [0, -5],
            [1, -4],
          ],
        },
        {
          c: "#6f5df8",
          s: [
            [-7, -7],
            [-8, -7],
            [-7, -6],
            [-6, -5],
            [-5, -4],
            [-4, -4],
          ],
        },
        {
          c: "#c56bf5",
          s: [
            [-2, -3],
            [-1, -2],
            [0, -2],
            [1, -2],
            [2, -2],
            [3, -2],
            [4, -2],
            [-2, -2],
          ],
        },
        {
          c: "#f05151",
          s: [
            [-4, -6],
            [-3, -6],
            [-2, -5],
            [-1, -4],
            [0, -3],
            [1, -3],
            [2, -3],
            [3, -3],
            [4, -3],
            [5, -2],
          ],
        },
        {
          c: "#b382a7",
          s: [
            [-6, -3],
            [-7, -3],
            [-7, -2],
            [-6, -1],
            [-5, 0],
            [-4, 1],
            [-8, -3],
            [-8, -4],
            [-8, -5],
            [-7, -5],
            [-9, -5],
            [-10, -6],
            [-10, -7],
            [-6, 0],
          ],
        },
        {
          c: "#759683",
          s: [
            [-4, -1],
            [-3, -1],
            [-3, 0],
            [-3, 1],
            [-3, 2],
            [-3, 3],
            [-4, 3],
            [-5, 2],
            [-6, 1],
            [-7, 0],
            [-8, -1],
            [-8, -2],
          ],
        },
        {
          c: "#cdbadb",
          s: [
            [-2, 0],
            [-1, 0],
            [-1, -1],
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4],
            [3, 5],
            [2, 5],
            [4, 5],
            [5, 5],
            [6, 5],
          ],
        },
        {
          c: "#e3df7e",
          s: [
            [-1, -12],
            [0, -11],
            [2, -9],
            [1, -10],
            [3, -8],
            [4, -7],
            [5, -6],
            [5, -5],
            [5, -4],
            [5, -3],
            [6, -2],
            [6, -1],
            [3, 3],
            [3, 2],
            [3, 1],
            [3, 0],
            [4, 3],
            [5, 0],
            [6, 0],
            [3, -1],
            [4, -1],
          ],
        },
        {
          c: "#816693",
          s: [
            [4, -9],
            [5, -8],
            [6, -7],
            [7, -6],
            [7, -5],
            [7, -4],
            [7, -3],
            [7, -2],
            [7, -1],
            [7, 0],
            [7, 1],
            [7, 2],
            [7, 3],
            [7, 4],
            [6, 4],
            [5, 4],
            [8, 2],
            [9, 3],
            [10, 4],
          ],
        },
        {
          c: "#9d8a9b",
          s: [
            [1, 4],
            [0, 4],
            [-1, 4],
            [-2, 4],
            [-3, 7],
            [-4, 7],
            [-5, 7],
            [-6, 7],
            [-7, 6],
            [-8, 5],
            [-9, 4],
            [-10, 3],
            [-11, 2],
            [-3, 6],
            [-3, 5],
            [-3, 4],
            [-12, 1],
            [-2, 8],
            [2, 4],
          ],
        },
        {
          c: "#a4e9b7",
          s: [
            [-10, 4],
            [-9, 5],
            [-8, 6],
            [-7, 7],
            [-6, 8],
            [-5, 9],
            [-3, 9],
            [-2, 9],
            [-4, 9],
            [-1, 9],
            [-1, 8],
            [-2, 7],
            [1, 9],
            [0, 9],
            [2, 10],
          ],
        },
        {
          c: "#e196b7",
          s: [
            [-3, 11],
            [-1, 13],
            [-2, 12],
            [0, 14],
            [1, 14],
            [1, 13],
            [1, 12],
            [1, 11],
            [2, 11],
            [1, 10],
            [3, 12],
            [6, 12],
            [4, 12],
            [5, 12],
            [3, 9],
            [2, 8],
            [3, 11],
            [3, 10],
          ],
        },
      ],
    },
    {
      t: texts.alien,
      m: [
        { c: "#c9f7af", s: [[-3, 1]] },
        { c: "#d47172", s: [[-3, 0]] },
        { c: "#b67077", s: [[-2, 1]] },
        { c: "#9986b3", s: [[-1, 2]] },
        { c: "#f089c5", s: [[-2, 2]] },
        { c: "#e8b47c", s: [[-3, 2]] },
        { c: "#fcfb65", s: [[-4, 0]] },
        { c: "#6769fd", s: [[-4, 1]] },
        { c: "#dbc9f8", s: [[-5, 0]] },
        {
          c: "#81fc86",
          s: [
            [-5, -4],
            [-5, -5],
            [-5, -6],
            [-5, -7],
            [-4, -7],
            [-3, -7],
            [-2, -7],
            [-2, -8],
            [-2, -9],
            [-1, -9],
            [0, -9],
            [0, -10],
            [-4, -3],
            [-3, -2],
            [-2, -1],
            [-1, 0],
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 3],
            [6, 1],
            [10, -1],
            [10, -2],
            [-1, -1],
            [-1, -2],
            [-1, -3],
            [0, -3],
            [1, -3],
            [2, -5],
            [3, -5],
            [4, -5],
            [4, -6],
            [5, -5],
            [5, -6],
            [3, 1],
            [3, 2],
            [3, 0],
            [4, 0],
            [5, 1],
            [2, -3],
            [3, -3],
            [2, -4],
            [1, -4],
            [0, -4],
            [5, -1],
            [6, 0],
            [6, -1],
            [7, -1],
            [8, -1],
            [8, -2],
            [9, -2],
          ],
        },
        {
          c: "#c873aa",
          s: [
            [-4, -4],
            [-3, -3],
            [-2, -2],
          ],
        },
        {
          c: "#978d68",
          s: [
            [0, 0],
            [1, 1],
            [2, 2],
          ],
        },
        {
          c: "#668c7d",
          s: [
            [0, 2],
            [1, 3],
            [1, 4],
            [2, 5],
            [3, 6],
            [3, 7],
            [3, 8],
            [3, 9],
            [2, 9],
            [3, 10],
            [2, 10],
            [1, 10],
            [0, 10],
            [-3, 9],
            [-4, 8],
            [-5, 7],
            [-6, 7],
            [-6, 6],
            [-7, 6],
            [-8, 5],
            [-9, 4],
            [-10, 3],
            [-10, 2],
            [-11, 1],
            [-12, 0],
            [-13, -1],
            [-13, -3],
            [-12, -3],
            [-13, -4],
            [-12, -4],
            [-11, -4],
            [-11, -5],
            [-10, -5],
            [-10, -6],
            [-9, -6],
            [-8, -6],
            [-7, -5],
            [-6, -4],
            [-5, -3],
            [-4, -2],
            [-3, -1],
            [-2, 0],
            [-1, 1],
            [-8, 4],
            [-6, 4],
            [-6, 3],
            [-6, 2],
            [-7, 1],
            [-8, 0],
            [-8, -1],
            [-7, -1],
            [-11, -3],
            [-10, -3],
            [-10, -4],
            [-9, -4],
            [-8, -3],
            [-9, -3],
            [-7, -3],
            [-6, -2],
            [-10, -2],
            [-5, 3],
            [-4, 3],
            [-3, 3],
            [-2, 3],
            [-1, 3],
            [0, 3],
          ],
        },
        {
          c: "#bf9d94",
          s: [
            [-14, -2],
            [-10, -1],
            [-10, 0],
            [-15, -2],
            [-16, -2],
            [-9, 1],
          ],
        },
        {
          c: "#b5cb48",
          s: [
            [-1, 12],
            [-1, 11],
            [-1, 10],
            [-1, 9],
            [-1, 7],
            [0, 7],
            [-1, 5],
            [-2, 5],
            [-1, 13],
            [-1, 14],
            [-1, 15],
            [-1, 16],
            [-1, 17],
            [-1, 18],
            [-1, 19],
            [-1, 20],
          ],
        },
        { c: "#c0a2ba", s: [[-1, 6]] },
        { c: "#b9d049", s: [[-2, 6]] },
        { c: "#74a3a9", s: [[-5, 1]] },
        { c: "#cafcf4", s: [[-4, 2]] },
        { c: "#e868db", s: [[-6, 0]] },
        { c: "#b5cb43", s: [[0, 6]] },
        { c: "#b1c841", s: [[-1, 8]] },
      ],
    },
    {
      t: texts.octopus,
      m: [
        {
          c: "#8ec8a7",
          s: [
            [-1, -1],
            [6, 5],
            [1, -5],
            [2, -4],
            [3, -3],
            [0, -6],
            [5, -1],
            [5, 0],
            [5, 1],
            [-2, -7],
            [-6, -7],
            [-5, -7],
            [-7, -3],
            [-7, -4],
            [-7, -5],
            [4, 5],
            [3, 5],
            [2, 5],
            [1, 5],
            [-3, 3],
            [-4, 2],
            [6, 4],
            [-2, 4],
            [-1, 5],
            [-7, -2],
            [6, 3],
            [6, 2],
            [4, -2],
            [-1, -7],
            [-3, -7],
            [-4, -7],
            [-7, -7],
            [-7, -6],
            [-7, -1],
            [-5, 1],
            [-6, 0],
            [0, 5],
          ],
        },
        {
          c: "#aeaa7d",
          s: [
            [3, 3],
            [4, 4],
            [5, 5],
            [6, 6],
            [7, 7],
            [7, 8],
            [9, 12],
            [10, 12],
            [11, 12],
            [12, 8],
            [11, 7],
            [10, 6],
            [8, 5],
            [7, 4],
            [12, 12],
            [9, 5],
            [13, 12],
            [13, 11],
            [13, 10],
            [13, 9],
            [2, 3],
            [5, 7],
            [5, 8],
            [6, 9],
            [7, 10],
            [8, 11],
          ],
        },
        {
          c: "#b2a7dd",
          s: [
            [0, 3],
            [0, 2],
            [0, 6],
            [0, 7],
            [0, 8],
            [0, 9],
            [1, 10],
            [1, 11],
            [2, 12],
            [3, 13],
            [4, 14],
            [0, 1],
            [0, 4],
            [1, 1],
            [2, 1],
          ],
        },
        {
          c: "#ffdb9d",
          s: [
            [8, 2],
            [9, 2],
            [10, 3],
            [11, 4],
            [12, 4],
            [13, 5],
            [14, 5],
            [15, 5],
            [7, 1],
            [4, 1],
            [2, 0],
            [3, 0],
            [1, 0],
            [0, 0],
          ],
        },
        {
          c: "#b57cb6",
          s: [
            [-3, 5],
            [-3, 6],
            [-2, 7],
            [-2, 8],
            [-1, 9],
            [-1, 10],
            [-1, 11],
            [0, 12],
            [0, 13],
            [0, 14],
            [-3, 2],
            [-2, 2],
            [-2, 1],
            [-1, 1],
          ],
        },
        {
          c: "#efb38a",
          s: [
            [3, -2],
            [6, -2],
            [7, -2],
            [8, -2],
            [9, -1],
            [10, -1],
            [10, -2],
            [11, -2],
            [2, -2],
            [1, -2],
            [0, -2],
            [-1, -2],
          ],
        },
        {
          c: "#dfdf6d",
          s: [
            [0, -8],
            [1, -8],
            [1, -9],
            [3, -8],
            [4, -8],
            [5, -8],
            [6, -8],
            [7, -7],
            [-1, -3],
            [-1, -4],
            [2, -9],
            [-2, -5],
          ],
        },
        {
          c: "#b49595",
          s: [
            [-3, -6],
            [-3, -9],
            [-4, -10],
            [-4, -11],
            [-4, -12],
            [-5, -13],
            [-6, -13],
            [-7, -13],
            [-8, -14],
            [-3, -5],
            [-5, -5],
            [-4, -5],
          ],
        },
        {
          c: "#71cbb7",
          s: [
            [-6, -5],
            [-9, -9],
            [-10, -10],
            [-11, -10],
            [-12, -10],
            [-12, -9],
            [-14, -10],
            [-15, -11],
            [-5, -4],
            [-5, -3],
            [-5, -2],
            [-13, -9],
          ],
        },
        {
          c: "#ce6f6b",
          s: [
            [-8, 0],
            [-9, -1],
            [-10, -1],
            [-11, -1],
            [-11, 0],
            [-12, 0],
            [-12, 1],
            [-12, 2],
            [-11, 4],
            [-10, 4],
            [-9, 5],
            [-8, 6],
            [-7, 7],
            [-2, -1],
            [-2, -2],
            [-12, 3],
            [-3, 0],
            [-4, 0],
            [-3, -1],
            [-5, 0],
          ],
        },
      ],
    },
    {
      t: texts.can,
      m: [
        {
          c: "#e01b24",
          s: [
            [-8, 2],
            [-8, 1],
            [-8, 0],
            [-8, -1],
            [-8, -2],
            [-8, -3],
            [-8, -4],
            [-8, -5],
            [-8, -6],
            [-8, -7],
            [-8, -8],
            [-8, -10],
            [-8, 3],
            [-7, 4],
            [-6, 5],
            [-5, 6],
            [-4, 7],
            [-3, 8],
            [-2, 9],
            [-1, 10],
            [0, 10],
            [1, 10],
            [2, 10],
            [3, 10],
            [4, 10],
            [5, 10],
            [6, 10],
            [7, 10],
            [8, 10],
            [8, 9],
            [8, 1],
            [8, 0],
            [8, -1],
            [8, -2],
            [8, -3],
            [-8, -12],
            [-7, -11],
            [-6, -10],
            [-5, -9],
            [-4, -8],
            [-3, -7],
            [-2, -6],
            [-1, -5],
            [0, -4],
            [1, -4],
            [2, -4],
            [3, -4],
            [4, -4],
            [7, -4],
            [7, -5],
            [-7, -12],
            [-6, -12],
            [-4, -12],
            [-3, -12],
            [-2, -12],
            [-1, -12],
            [0, -12],
            [1, -11],
            [2, -10],
            [3, -9],
            [4, -8],
            [5, -7],
            [6, -6],
            [-8, -9],
            [-8, -11],
            [5, -4],
            [6, -4],
            [8, -4],
            [8, 2],
            [-7, -10],
            [-7, -9],
            [-7, -8],
            [-7, -7],
            [-6, -9],
            [-6, -8],
            [-5, -7],
            [-5, -8],
            [-4, -7],
            [-4, -6],
            [-3, -6],
            [-2, -5],
            [-1, -4],
            [-3, -5],
            [-1, -6],
            [0, -5],
            [1, -5],
            [-2, -11],
            [-1, -11],
            [0, -11],
            [1, -10],
            [2, -9],
            [-3, -11],
            [0, -10],
            [4, -3],
            [5, -3],
            [1, -3],
            [2, -3],
            [3, -3],
            [-5, -12],
            [-6, -7],
            [-5, -6],
          ],
        },
        {
          c: "#ffffff",
          s: [
            [-4, -4],
            [-5, -5],
            [-6, -5],
            [-6, -4],
            [-7, -4],
            [-7, -3],
            [-7, -2],
            [-7, -1],
            [-7, 0],
            [-6, 1],
            [-6, 2],
            [-5, 2],
            [-4, 3],
            [-3, 3],
            [-2, 4],
            [-1, 4],
            [0, 4],
            [1, 4],
            [2, 5],
            [3, 5],
            [4, 6],
            [-1, 0],
            [-2, 0],
            [-3, 0],
            [-3, 1],
            [-2, 1],
            [0, 0],
            [3, 1],
            [2, 1],
            [3, 2],
            [6, -1],
            [5, -1],
            [4, -1],
            [4, 0],
            [4, 1],
            [4, 2],
            [4, 3],
            [0, 1],
            [0, 2],
            [1, 2],
            [6, -2],
            [7, 1],
            [7, 0],
            [5, 5],
            [5, 6],
            [6, 7],
            [4, 4],
            [4, 5],
            [8, 4],
            [7, 4],
            [7, 5],
            [7, 8],
            [8, 8],
            [9, 8],
            [6, 6],
            [-7, 1],
            [-5, 3],
            [0, 5],
            [1, 5],
            [5, 8],
            [9, 5],
            [9, 6],
            [9, 7],
            [6, 1],
            [4, 7],
            [3, 6],
            [2, 2],
            [1, 0],
            [-2, 2],
            [-3, 2],
            [-4, 5],
            [-3, 6],
            [-2, 7],
            [-1, 7],
            [0, 7],
            [1, 8],
            [2, 8],
            [3, 9],
            [4, 9],
            [5, 9],
            [6, 9],
            [7, 9],
            [-5, 5],
            [-6, 4],
            [-4, 6],
            [-3, 7],
            [-1, 8],
            [0, 8],
            [2, 9],
          ],
        },
        {
          c: "#c0bfbc",
          s: [
            [0, -8],
            [1, -7],
            [1, -8],
            [2, -7],
          ],
        },
      ],
    },
  ];
