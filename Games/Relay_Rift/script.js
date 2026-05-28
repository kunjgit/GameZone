"use strict";

// ── DOM refs ──────────────────────────────────────────────
const boardEl       = document.getElementById("board");
const messageEl     = document.getElementById("message");
const levelLabel    = document.getElementById("levelLabel");
const progressLabel = document.getElementById("progressLabel");
const movesLabel    = document.getElementById("movesLabel");
const scoreLabel    = document.getElementById("scoreLabel");
const bestLabel     = document.getElementById("bestLabel");
const receiverList  = document.getElementById("receiverList");
const objectiveText = document.getElementById("objectiveText");
const hintBtn       = document.getElementById("hintButton");
const resetBtn      = document.getElementById("resetButton");
const nextBtn       = document.getElementById("nextButton");
const toastEl       = document.getElementById("toast");
const winOverlay    = document.getElementById("winOverlay");
const winNextBtn    = document.getElementById("winNextBtn");
const winRetryBtn   = document.getElementById("winRetryBtn");
const winScoreText  = document.getElementById("winScoreText");
const particleCanvas= document.getElementById("particleCanvas");
const tutOverlay    = document.getElementById("tutorialOverlay");
const tutPrev       = document.getElementById("tutPrev");
const tutNext       = document.getElementById("tutNext");
const tutSkip       = document.getElementById("tutSkip");
const tutDotsEl     = document.getElementById("tutDots");
const startGameBtn  = document.getElementById("startGameBtn");
const helpBtn       = document.getElementById("helpBtn");

// ── Direction helpers ─────────────────────────────────────
const DIRS     = { n:[-1,0], e:[0,1], s:[1,0], w:[0,-1] };
const OPPOSITE = { n:"s", s:"n", e:"w", w:"e" };
const DIR_ORDER = ["n","e","s","w"];

const SHAPE_PORTS = {
  straight: ["n","s"],
  corner:   ["n","e"],
  tee:      ["n","e","s"],
  cross:    ["n","e","s","w"],
};

// ── SVG wire builder ──────────────────────────────────────
function buildWireSVG(shape) {
  const h = 8, cx = 50, cy = 50;
  const portLines = {
    n:`M${cx-h},${cy} L${cx-h},0 L${cx+h},0 L${cx+h},${cy} Z`,
    s:`M${cx-h},${cy} L${cx-h},100 L${cx+h},100 L${cx+h},${cy} Z`,
    e:`M${cx},${cy-h} L100,${cy-h} L100,${cy+h} L${cx},${cy+h} Z`,
    w:`M${cx},${cy-h} L0,${cy-h} L0,${cy+h} L${cx},${cy+h} Z`,
  };
  const ports = SHAPE_PORTS[shape] || SHAPE_PORTS.cross;
  const paths = ports.map(p=>`<path class="wire-path" d="${portLines[p]}"/>`).join("");
  return `<svg class="tile-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${paths}</svg>`;
}

// ══════════════════════════════════════════════════════════
//  LEVELS  (30 verified-solvable puzzles)
//
//  Design contract:
//    • Every PATH tile is scrambled exactly 1 step back from its
//      solution rotation: puzzle = (solution - 1 + 4) % 4
//    • Filler tiles = "C1" (corner [e,s]) – never on signal path
//    • X = cross (all ports, rotation-independent, no scrambling)
//    • Source S0 and Receivers R0 never scrambled
//
//  Shape key  L=straight  C=corner  T=tee  X=cross  S=source  R=receiver
//  Puzzle→Solution mappings:
//    L0→L1(horiz)  L3→L0(vert)
//    C0→C1  C1→C2  C2→C3  C3→C0
//    T0→T1
// ══════════════════════════════════════════════════════════
const LEVELS = [
  // ─── 3×3 · Levels 1-6 ────────────────────────────────
  { size:3, budget:5, objective:"Basic L-route — connect source to receiver in 3 rotations.",
    tiles:["S0","L0","C1","C1","C1","L3","C1","C1","R0"] },
  // Spiral: S→E,E,S,W,W,S,E,E→R  (all 9 cells on path)
  { size:3, budget:10, objective:"Spiral — signal winds through every tile on the board.",
    tiles:["S0","L0","C1","C0","L0","C2","C3","L0","R0"] },
  // Zigzag: S→S,E,N,E,S,S→R
  { size:3, budget:7, objective:"Zigzag — the path doubles back before the receiver.",
    tiles:["S0","C0","C1","C3","C2","L3","C1","C1","R0"] },
  // U-shape: S→S,S,E,E,N,N→R
  { size:3, budget:7, objective:"U-turn — route the signal all the way around.",
    tiles:["S0","C1","R0","L3","C1","L3","C3","L0","C2"] },
  // V-split: 2 RX at (0,2) and (2,2)
  { size:3, budget:7, objective:"V-split — power two receivers from one source.",
    tiles:["S0","L0","R0","L3","C1","C1","C3","L0","R0"] },
  // Fork: RX at (1,2) and (2,0)
  { size:3, budget:7, objective:"Fork — one branch right, one branch down.",
    tiles:["S0","C1","C1","L3","C3","R0","R0","C1","C1"] },

  // ─── 4×4 · Levels 7-12 ───────────────────────────────
  // Cross: RX at (0,3) top-right and (3,0) bottom-left
  { size:4, budget:7, objective:"Cross — route power along both axes simultaneously.",
    tiles:["S0","L0","L0","R0","L3","C1","C1","C1","L3","C1","C1","C1","R0","C1","C1","C1"] },
  // Long L: S→E,E,E(C1corner)→S,S,S→R
  { size:4, budget:8, objective:"Long L — three steps right, three steps down.",
    tiles:["S0","L0","L0","C1","C1","C1","C1","L3","C1","C1","C1","L3","C1","C1","C1","R0"] },
  // U-route: S→S,S,S,E,E,E,N,N,N→R at (0,3)
  { size:4, budget:11, objective:"U-route — down the left, across the bottom, back up the right.",
    tiles:["S0","C1","C1","R0","L3","C1","C1","L3","L3","C1","C1","L3","C3","L0","L0","C2"] },
  // Zigzag: S→E,E,S,W,W,S,E,E,S,E→R
  { size:4, budget:12, objective:"Zigzag — alternates direction every row across the grid.",
    tiles:["S0","L0","C1","C1","C0","L0","C2","C1","C3","L0","C1","C1","C1","C1","C3","R0"] },
  // W-shape: 2 RX at (3,1) and (3,3)
  { size:4, budget:11, objective:"W-shape — two inner branches reach separate receivers.",
    tiles:["S0","L0","L0","C1","C3","C1","C1","L3","C1","L3","C1","L3","C1","R0","C1","R0"] },
  // Staircase: diagonal + left column; 2 RX at (3,0) and (3,3)
  { size:4, budget:10, objective:"Staircase — diagonal path plus a vertical trunk.",
    tiles:["S0","C1","C1","C1","L3","C3","C1","C1","L3","C1","C3","C1","R0","C1","C1","R0"] },

  // ─── 5×5 · Levels 13-18 ──────────────────────────────
  // Zigzag across 3 rows, 1 RX at (4,4)
  { size:5, budget:14, objective:"Zigzag descent — weave across three rows to the corner.",
    tiles:["S0","L0","C1","C1","C1","C1","C1","C3","L0","C1","C1","C1","C0","L0","C2","C1","C1","C3","L0","C1","C1","C1","C1","C1","R0"] },
  // Rectangle edges: 2 RX at (2,4) and (4,2)
  { size:5, budget:14, objective:"Rectangle edges — trace two perpendicular borders.",
    tiles:["S0","L0","L0","L0","C1","L3","C1","C1","C1","L3","L3","C1","C1","C1","R0","L3","C1","C1","C1","C1","C3","L0","R0","C1","C1"] },
  // Full snake: 5 rows, 2 RX at (0,4) and (4,0)
  { size:5, budget:22, objective:"Snake — signal winds left and right through all five rows.",
    tiles:["S0","L0","L0","L0","R0","C0","L0","L0","L0","C2","C3","L0","L0","L0","C1","C0","L0","L0","L0","C2","R0","C1","C1","C1","C1"] },
  // Perimeter: 3 RX at (0,4),(4,0),(4,4)
  { size:5, budget:13, objective:"Perimeter — run signal around the full border of the grid.",
    tiles:["S0","L0","L0","L0","R0","L3","C1","C1","C1","L3","L3","C1","C1","C1","L3","L3","C1","C1","C1","L3","R0","C1","C1","C1","R0"] },
  // W-shape: 3 RX at (2,2),(4,0),(4,4)
  { size:5, budget:13, objective:"W-shape — two inner branches plus the outer frame.",
    tiles:["S0","C1","C1","C1","C1","L3","L3","C1","C1","C1","L3","C3","R0","C1","C1","L3","C1","C1","C1","C1","R0","L0","L0","L0","R0"] },
  // Diagonal wave: 3 RX at (0,4),(4,0),(4,4)
  { size:5, budget:20, objective:"Diagonal wave — staircase path to right, branches to bottom.",
    tiles:["S0","C1","C1","C1","R0","L3","C3","C1","L3","L3","L3","C1","C3","C1","L3","L3","C1","C1","C3","C2","R0","L0","L0","L0","R0"] },

  // ─── 6×6 · Levels 19-24 ──────────────────────────────
  // Perimeter: 3 RX at (0,5),(5,0),(5,5)
  { size:6, budget:16, objective:"Perimeter 6×6 — signal hugs three edges of the large grid.",
    tiles:["S0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","L3","R0","C1","C1","C1","C1","R0"] },
  // Diagonal descent + branches: 3 RX at (0,5),(5,0),(5,5)
  { size:6, budget:20, objective:"Diagonal descent — path steps diagonally to the corner.",
    tiles:["S0","L0","L0","L0","L0","R0","C3","C1","C1","C1","C1","L3","C1","C3","C1","C1","C1","L3","C1","C1","C3","C1","C1","L3","C1","C1","C1","C3","C1","L3","R0","L0","L0","L0","C2","R0"] },
  // Full 6-row snake: 4 RX at (0,5),(2,5),(4,5),(5,0)
  { size:6, budget:36, objective:"Full snake — signal weaves through all six rows of the grid.",
    tiles:["S0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","C2","C3","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","C2","C3","L0","L0","L0","L0","R0","R0","L0","L0","L0","L0","C2"] },
  // T-junction branch: 4 RX at (0,5),(3,3),(5,0),(5,5)
  { size:6, budget:21, objective:"T-branch — a T-junction splits signal east and south.",
    tiles:["S0","T0","L0","L0","L0","R0","L3","L3","C1","C1","C1","L3","L3","L3","C1","C1","C1","L3","L3","C3","L0","R0","C1","L3","L3","C1","C1","C1","C1","L3","R0","C1","C1","C1","C1","R0"] },
  // Perimeter + mid-right RX: 4 RX at (0,5),(3,5),(5,0),(5,5)
  { size:6, budget:19, objective:"Border + midpoint — full perimeter with a waypoint receiver.",
    tiles:["S0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","R0","L3","C1","C1","C1","C1","L3","R0","L0","L0","L0","L0","R0"] },
  // X-cross branch: 4 RX at (0,5),(2,2),(5,0),(5,5)
  { size:6, budget:16, objective:"X-branch — a cross junction splits the signal mid-grid.",
    tiles:["S0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","C1","X0","L0","R0","C1","C1","C1","L3","C1","C1","C1","C1","C1","L3","C1","C1","C1","C1","C1","R0","L0","L0","L0","L0","R0"] },

  // ─── 7×7 · Levels 25-30 ──────────────────────────────
  // Perimeter + mid-right: 4 RX at (0,6),(3,6),(6,0),(6,6)
  { size:7, budget:23, objective:"Frame + waypoint — four receivers around the 7×7 grid.",
    tiles:["S0","L0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","R0","C1","C1","C1","C1","C1","R0"] },
  // T-junction + full frame: 4 RX at (0,6),(3,3),(6,0),(6,6)
  { size:7, budget:28, objective:"T-branch 7×7 — inner junction branches to center and corners.",
    tiles:["S0","T0","L0","L0","L0","L0","R0","L3","L3","C1","C1","C1","C1","L3","L3","L3","C1","C1","C1","C1","L3","L3","C3","L0","R0","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","R0","L0","L0","L0","L0","L0","R0"] },
  // Full 7-row snake: 5 RX at (0,6),(2,6),(4,6),(6,0),(6,6)
  { size:7, budget:48, objective:"Full snake — signal winds through all seven rows. Stay focused!",
    tiles:["S0","L0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","L0","C2","C3","L0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","L0","C2","C3","L0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","L0","C2","R0","L0","L0","L0","L0","L0","R0"] },
  // Multi-RX columns: 5 RX at (0,6),(2,6),(4,6),(6,0),(6,6)
  { size:7, budget:22, objective:"Multi-column — power five receivers across three columns.",
    tiles:["S0","L0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","R0","L3","C1","C1","C1","C1","C1","L3","R0","L0","L0","L0","L0","L0","R0"] },
  // X-cross + columns: 5 RX at (0,6),(3,3),(3,6),(6,0),(6,6)
  { size:7, budget:24, objective:"Five-way spread — cross junction + column receivers.",
    tiles:["S0","L0","L0","L0","L0","L0","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","X0","L0","L0","R0","C1","C1","R0","L3","C1","C1","C1","C1","C1","L3","L3","C1","C1","C1","C1","C1","L3","R0","L0","L0","L0","L0","L0","R0"] },
  // Ultimate: 7-row snake + center cross + 6 RX
  { size:7, budget:46, objective:"FINAL — 6 receivers, full snake + cross junction. Route them all!",
    tiles:["S0","L0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","L0","C2","C3","L0","L0","L0","L0","L0","R0","X0","L0","L0","R0","L0","L0","C2","C3","L0","L0","L0","L0","L0","R0","C0","L0","L0","L0","L0","L0","C2","R0","L0","L0","L0","L0","L0","R0"] },
];

const TOTAL_LEVELS = LEVELS.length;

// ── State ─────────────────────────────────────────────────
const state = {
  levelIndex: 0,
  moves: 0,
  score: 0,
  solved: false,
  tiles: [],
  powered: new Set(),
};
const STORAGE_KEY  = "relay-rift-v3-best";
const SEEN_KEY     = "relay-rift-seen-tutorial";

// ── Tile parsing ──────────────────────────────────────────
const TYPE_MAP = { S:"source", R:"receiver", L:"straight", C:"corner", T:"tee", X:"cross" };

function parseTile(code, index) {
  return { id:index, type:TYPE_MAP[code[0]], rotation:Number(code.slice(1)), initialRotation:Number(code.slice(1)) };
}
function getShapeName(tile) {
  return (tile.type==="source"||tile.type==="receiver") ? "cross" : tile.type;
}
function rotatedPorts(tile) {
  return SHAPE_PORTS[getShapeName(tile)].map(d => DIR_ORDER[(DIR_ORDER.indexOf(d)+tile.rotation)%4]);
}

// ── Toast ─────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg) {
  clearTimeout(toastTimer);
  toastEl.textContent = msg;
  toastEl.hidden = false;
  toastEl.classList.remove("visible");
  void toastEl.offsetWidth;
  toastEl.classList.add("visible");
  toastTimer = setTimeout(()=>{
    toastEl.classList.remove("visible");
    setTimeout(()=>{ toastEl.hidden = true; }, 250);
  }, 2400);
}
function setMessage(text) { messageEl.textContent = text; }

// ── Level loading ─────────────────────────────────────────
function loadLevel(index) {
  const level = LEVELS[index];
  state.levelIndex = index;
  state.moves = 0;
  state.solved = false;
  state.tiles = level.tiles.map(parseTile);
  state.powered = new Set();
  objectiveText.textContent = level.objective;
  boardEl.style.gridTemplateColumns = `repeat(${level.size}, 1fr)`;
  nextBtn.disabled = true;
  winOverlay.hidden = true;
  renderBoard();
  updatePower();
  updateHud();
  setMessage("Rotate tiles to route the signal to all receivers.");
}

// ── Render board ──────────────────────────────────────────
function renderBoard() {
  boardEl.innerHTML = "";
  state.tiles.forEach(tile => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tile";
    if (tile.type==="source")   btn.classList.add("source");
    if (tile.type==="receiver") btn.classList.add("receiver");
    btn.dataset.id = tile.id;
    btn.setAttribute("role","gridcell");
    btn.innerHTML = buildWireSVG(getShapeName(tile)) + `<div class="tile-node"></div>`;
    applyRotationToSvg(btn, tile.rotation);
    btn.addEventListener("click",   () => rotateTile(tile.id));
    btn.addEventListener("keydown", e  => handleTileKey(e, tile.id));
    boardEl.appendChild(btn);
  });
}

function applyRotationToSvg(tileEl, rotation) {
  const svg = tileEl.querySelector(".tile-svg");
  if (svg) svg.style.transform = `rotate(${rotation*90}deg)`;
}

// ── Keyboard nav ──────────────────────────────────────────
function handleTileKey(event, id) {
  const size = LEVELS[state.levelIndex].size;
  if (event.key==="Enter"||event.key===" ") { event.preventDefault(); rotateTile(id); return; }
  const moves = { ArrowRight:1, ArrowLeft:-1, ArrowDown:size, ArrowUp:-size };
  if (!(event.key in moves)) return;
  event.preventDefault();
  const next = id + moves[event.key];
  const horiz = event.key==="ArrowRight"||event.key==="ArrowLeft";
  const sameRow = Math.floor(id/size)===Math.floor(next/size);
  if (next>=0 && next<state.tiles.length && (!horiz||sameRow))
    boardEl.querySelector(`[data-id="${next}"]`)?.focus();
}

// ── Rotate tile ───────────────────────────────────────────
function rotateTile(id) {
  if (state.solved) return;
  const tile = state.tiles[id];
  tile.rotation = (tile.rotation+1)%4;
  state.moves++;
  const tileEl = boardEl.querySelector(`[data-id="${id}"]`);
  if (tileEl) applyRotationToSvg(tileEl, tile.rotation);
  updatePower();
  updateHud();
  const budget = LEVELS[state.levelIndex].budget;
  if (state.moves===budget)       setMessage("Move budget reached — finish soon!");
  else if (state.moves>budget)    setMessage("Over budget. Reset for a clean run.");
}

// ── Power propagation (BFS) ───────────────────────────────
function updatePower() {
  const level = LEVELS[state.levelIndex];
  const srcIdx = state.tiles.findIndex(t=>t.type==="source");
  if (srcIdx<0) return;
  const energized = new Set([srcIdx]);
  const queue = [srcIdx];
  while (queue.length) {
    const cur = queue.shift();
    const tile = state.tiles[cur];
    const row = Math.floor(cur/level.size), col = cur%level.size;
    rotatedPorts(tile).forEach(dir => {
      const [dr,dc] = DIRS[dir];
      const nr=row+dr, nc=col+dc;
      if (nr<0||nc<0||nr>=level.size||nc>=level.size) return;
      const nIdx = nr*level.size+nc;
      if (!rotatedPorts(state.tiles[nIdx]).includes(OPPOSITE[dir])) return;
      if (!energized.has(nIdx)) { energized.add(nIdx); queue.push(nIdx); }
    });
  }
  state.powered = energized;
  paintPower();
  updateReceivers();
  checkWin();
}

function paintPower() {
  boardEl.querySelectorAll(".tile").forEach((el,i) => {
    const on = state.powered.has(i);
    el.classList.toggle("powered", on);
    el.classList.toggle("solved",  on && state.tiles[i].type==="receiver");
  });
}

function updateReceivers() {
  receiverList.innerHTML = "";
  state.tiles.filter(t=>t.type==="receiver").forEach((rx,i) => {
    const div = document.createElement("div");
    div.className = "receiver-pill";
    div.textContent = `RX-${String(i+1).padStart(2,"0")}`;
    div.classList.toggle("online", state.powered.has(rx.id));
    receiverList.appendChild(div);
  });
}

// ── Win check ─────────────────────────────────────────────
function checkWin() {
  const receivers = state.tiles.filter(t=>t.type==="receiver");
  if (!receivers.every(t=>state.powered.has(t.id))||state.solved) return;
  state.solved = true;
  const level = LEVELS[state.levelIndex];
  const bonus = Math.max(0,level.budget-state.moves)*20;
  const lvlScore = 300+bonus+receivers.length*100;
  state.score += lvlScore;
  saveBest();
  updateHud();
  const isLast = state.levelIndex===TOTAL_LEVELS-1;
  winScoreText.textContent = `+${lvlScore} pts`;
  winNextBtn.disabled = isLast;
  winNextBtn.textContent = isLast ? "🏆 All Clear!" : "Next Level →";
  winOverlay.hidden = false;
  setMessage(isLast ? "All 30 levels complete! You are the Relay Master." : `Level ${state.levelIndex+1} clear!`);
  nextBtn.disabled = isLast;
  launchParticles();
}

function saveBest() {
  const prev = Number(localStorage.getItem(STORAGE_KEY)||0);
  if (state.score>prev) localStorage.setItem(STORAGE_KEY, String(state.score));
}

// ── HUD ───────────────────────────────────────────────────
function updateHud() {
  const level = LEVELS[state.levelIndex];
  const over = state.moves>level.budget;
  levelLabel.textContent   = String(state.levelIndex+1);
  progressLabel.textContent= `${state.levelIndex+1} / ${TOTAL_LEVELS}`;
  movesLabel.textContent   = `${state.moves} / ${level.budget}`;
  movesLabel.style.color   = over ? "var(--red)" : "";
  scoreLabel.textContent   = String(state.score);
  bestLabel.textContent    = localStorage.getItem(STORAGE_KEY)||"0";
}

// ── Reset ─────────────────────────────────────────────────
function resetLevel() {
  state.tiles.forEach(t=>{ t.rotation=t.initialRotation; });
  state.moves = 0;
  state.solved = false;
  nextBtn.disabled = true;
  winOverlay.hidden = true;
  boardEl.querySelectorAll(".tile").forEach((el,i)=>applyRotationToSvg(el,state.tiles[i].rotation));
  updatePower();
  updateHud();
  setMessage("Grid reset.");
}

function goNext() {
  if (state.levelIndex<TOTAL_LEVELS-1) loadLevel(state.levelIndex+1);
}

// ── Smart Hint ────────────────────────────────────────────
// Finds the first unpowered tile adjacent to a powered tile
// and tells the player exactly how many rotations it needs.
function revealHint() {
  const level = LEVELS[state.levelIndex];
  let bestTarget=null, rotationsNeeded=0;

  outer:
  for (let i=0; i<state.tiles.length; i++) {
    if (state.powered.has(i)||state.tiles[i].type==="source") continue;
    const row=Math.floor(i/level.size), col=i%level.size;
    for (const dir of DIR_ORDER) {
      const [dr,dc]=DIRS[dir];
      const nr=row+dr, nc=col+dc;
      if (nr<0||nc<0||nr>=level.size||nc>=level.size) continue;
      const ni=nr*level.size+nc;
      if (!state.powered.has(ni)) continue;
      if (!rotatedPorts(state.tiles[ni]).includes(dir)) continue;
      const needed=OPPOSITE[dir];
      const tile=state.tiles[i];
      for (let r=1; r<=4; r++) {
        const testPorts = SHAPE_PORTS[getShapeName(tile)].map(
          d=>DIR_ORDER[(DIR_ORDER.indexOf(d)+(tile.rotation+r))%4]
        );
        if (testPorts.includes(needed)) {
          bestTarget=i; rotationsNeeded=(r===4)?0:r; break outer;
        }
      }
    }
  }
  if (bestTarget===null) {
    const rx=state.tiles.find(t=>t.type==="receiver"&&!state.powered.has(t.id));
    if (rx) { bestTarget=rx.id; rotationsNeeded=0; }
  }
  if (bestTarget===null) return;

  const el=boardEl.querySelector(`[data-id="${bestTarget}"]`);
  if (!el) return;
  el.classList.remove("hint"); void el.offsetWidth; el.classList.add("hint");
  el.addEventListener("animationend",()=>el.classList.remove("hint"),{once:true});

  const msg = rotationsNeeded===1 ? "Highlighted tile needs 1 more rotation"
    : rotationsNeeded>1 ? `Highlighted tile needs ${rotationsNeeded} rotations`
    : "Highlighted tile is a receiver — trace the path to it";
  showToast(msg);
}

// ── Particles ─────────────────────────────────────────────
function launchParticles() {
  const ctx=particleCanvas.getContext("2d");
  particleCanvas.width=window.innerWidth;
  particleCanvas.height=window.innerHeight;
  const particles=Array.from({length:80},()=>({
    x:particleCanvas.width/2+(Math.random()-.5)*120,
    y:particleCanvas.height/2+(Math.random()-.5)*120,
    vx:(Math.random()-.5)*14, vy:(Math.random()-.8)*14,
    r:2+Math.random()*4, alpha:1,
    color:Math.random()>.5?"#00f0c8":"#ffb830",
    decay:0.016+Math.random()*0.012,
  }));
  let raf;
  function draw() {
    ctx.clearRect(0,0,particleCanvas.width,particleCanvas.height);
    let alive=false;
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.38; p.alpha-=p.decay;
      if (p.alpha<=0) return;
      alive=true;
      ctx.globalAlpha=p.alpha; ctx.fillStyle=p.color;
      ctx.shadowColor=p.color; ctx.shadowBlur=8;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha=1; ctx.shadowBlur=0;
    if (alive) raf=requestAnimationFrame(draw);
  }
  raf=requestAnimationFrame(draw);
}

// ══════════════════════════════════════════════════════════
//  TUTORIAL / HOW-TO-PLAY SYSTEM
// ══════════════════════════════════════════════════════════
const TOTAL_STEPS = 5;
let currentStep = 1;

function buildDots() {
  tutDotsEl.innerHTML="";
  for (let i=1; i<=TOTAL_STEPS; i++) {
    const d=document.createElement("button");
    d.type="button";
    d.className="tut-dot"+(i===currentStep?" active":"");
    d.setAttribute("aria-label",`Step ${i}`);
    d.addEventListener("click",()=>goToStep(i));
    tutDotsEl.appendChild(d);
  }
}

function goToStep(n) {
  currentStep=Math.max(1,Math.min(TOTAL_STEPS,n));
  document.querySelectorAll(".tut-step").forEach(s=>{
    s.classList.toggle("active",Number(s.dataset.step)===currentStep);
  });
  buildDots();
  // Show/hide Next vs Start button
  const isLast = currentStep===TOTAL_STEPS;
  tutNext.style.display = isLast ? "none" : "";
  tutPrev.style.display = currentStep===1 ? "none" : "";
}

function closeTutorial() {
  tutOverlay.hidden=true;
  localStorage.setItem(SEEN_KEY,"1");
}

function openTutorial() {
  tutOverlay.hidden=false;
  goToStep(1);
}

tutNext.addEventListener("click", ()=>goToStep(currentStep+1));
tutPrev.addEventListener("click", ()=>goToStep(currentStep-1));
tutSkip.addEventListener("click", closeTutorial);
startGameBtn.addEventListener("click", closeTutorial);
helpBtn.addEventListener("click", openTutorial);

// ── Event wiring ──────────────────────────────────────────
hintBtn.addEventListener("click",  revealHint);
resetBtn.addEventListener("click", resetLevel);
nextBtn.addEventListener("click",  goNext);
winNextBtn.addEventListener("click",  ()=>{ winOverlay.hidden=true; goNext(); });
winRetryBtn.addEventListener("click", ()=>{ winOverlay.hidden=true; resetLevel(); });

window.addEventListener("keydown", e => {
  if (!tutOverlay.hidden||!winOverlay.hidden) return;
  if (e.key.toLowerCase()==="r") resetLevel();
  if (e.key.toLowerCase()==="h") revealHint();
});

// ── Boot ──────────────────────────────────────────────────
buildDots();
loadLevel(0);

// Show tutorial on first visit
if (!localStorage.getItem(SEEN_KEY)) {
  openTutorial();
} else {
  tutOverlay.hidden = true;
}
