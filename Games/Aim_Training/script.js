/* ===========================
   Aim Training - Enhanced JS
   Drop-in replacement script
   =========================== */

// --- Game state ---
let score = 0;
let highScore = 0;
let timeLeft = 30;
let level = 1;
let gameInProgress = false;
let paused = false;

// Timers/IDs
let timerId = null;                 // countdown timer (1s)
let spawnIntervalId = null;         // bubble spawner
let speedupIntervalId = null;       // difficulty scaler
let bubbleTTLms = 1200;             // each bubble lifetime
let spawnIntervalMs = 1000;         // initial spawn cadence
const MIN_SPAWN_MS = 250;

// Stats
let totalSpawns = 0;
let hits = 0;
let combo = 0;
let bestCombo = 0;

// Audio / UX
let muted = false;

// --- DOM helpers (safe if elements missing) ---
const $ = (id) => document.getElementById(id);
const text = (id, value) => { const n = $(id); if (n) n.textContent = String(value); };
const show = (id, on) => { const n = $(id); if (n) n.style.display = on ? 'block' : 'none'; };

// Ensure container exists
function getContainer() {
  let el = $('bubbles');
  if (!el) {
    el = document.createElement('div');
    el.id = 'bubbles';
    el.style.position = 'relative';
    el.style.width = '600px';
    el.style.height = '400px';
    el.style.border = '1px solid #ccc';
    el.style.overflow = 'hidden';
    document.body.appendChild(el);
  } else {
    // Make sure it positions children correctly
    const style = window.getComputedStyle(el);
    if (style.position === 'static') el.style.position = 'relative';
    if (style.overflow !== 'hidden') el.style.overflow = 'hidden';
  }
  return el;
}

// Load / save high score
function loadHighScore() {
  const saved = Number(localStorage.getItem('aim_highscore') || 0);
  highScore = Number.isFinite(saved) ? saved : 0;
  text('highScoreValue', highScore);
}
function saveHighScore() {
  localStorage.setItem('aim_highscore', String(highScore));
}

// Audio helpers
function playPopSound() {
  if (muted) return;
  const snd = $('popSound');
  if (!snd) return;
  try { snd.currentTime = 0; snd.play(); } catch {}
}
function playEndSound() {
  if (muted) return;
  const snd = $('endSound');
  if (!snd) return;
  try { snd.currentTime = 0; snd.play(); } catch {}
}

// HUD updater (safe if nodes missing)
function updateHUD() {
  const acc = totalSpawns ? Math.round((hits / totalSpawns) * 100) : 100;
  text('scoreValue', score);
  text('timerValue', timeLeft);
  text('highScoreValue', highScore);
  text('accuracyValue', `${acc}%`);
  text('comboValue', `${combo}${bestCombo ? ` (best ${bestCombo})` : ''}`);
}

// Announce for screen readers (optional live region)
function announce(msg) {
  const live = $('status-live');
  if (live) live.textContent = msg;
}

// Random readable color (avoid ultra dark)
function randomColor() {
  const comp = () => Math.floor(Math.random() * 200) + 30;
  return `rgb(${comp()}, ${comp()}, ${comp()})`;
}

// Create a bubble element (with TTL, keyboard & touch)
function createBubble() {
  const container = getContainer();
  const rect = container.getBoundingClientRect();
  const size = Math.floor(Math.random() * 30) + 20;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.style.position = 'absolute';
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.borderRadius = '50%';
  bubble.style.background = randomColor();
  bubble.style.cursor = 'pointer';
  bubble.style.userSelect = 'none';
  bubble.tabIndex = 0; // focusable for keyboard

  // position within container bounds
  const maxX = Math.max(0, rect.width - size);
  const maxY = Math.max(0, rect.height - size);
  const posX = Math.random() * maxX;
  const posY = Math.random() * maxY;
  bubble.style.left = `${posX}px`;
  bubble.style.top = `${posY}px`;

  // TTL (miss)
  const ttl = setTimeout(() => {
    if (!bubble.parentNode) return;
    onMiss();
    bubble.remove();
  }, bubbleTTLms);

  // Hit handlers: click / keyboard / touch
  const registerHit = () => {
    if (!gameInProgress || paused || !bubble.parentNode) return;
    clearTimeout(ttl);
    hits += 1;
    combo += 1;
    bestCombo = Math.max(bestCombo, combo);
    score += 1;
    updateHUD();
    bubble.remove();
    playPopSound();

    // level progression each 10 hits
    if (hits % 10 === 0) {
      level += 1;
      // Increase difficulty: slightly faster spawns and/or shorter TTL
      spawnIntervalMs = Math.max(MIN_SPAWN_MS, spawnIntervalMs - 50);
      bubbleTTLms = Math.max(700, bubbleTTLms - 20);
      restartSpawner(); // apply new spawn cadence
    }
  };

  bubble.addEventListener('click', registerHit);
  bubble.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      registerHit();
    }
  });
  bubble.addEventListener('touchstart', () => registerHit(), { passive: true });

  totalSpawns += 1;
  return bubble;
}

function onMiss() {
  combo = 0;
  updateHUD();
}

// Spawner controls
function startSpawner() {
  stopSpawner();
  const container = getContainer();
  spawnIntervalId = setInterval(() => {
    if (!gameInProgress || paused) return;
    container.appendChild(createBubble());
  }, spawnIntervalMs);
}
function restartSpawner() {
  if (!gameInProgress) return;
  startSpawner();
}
function stopSpawner() {
  if (spawnIntervalId) {
    clearInterval(spawnIntervalId);
    spawnIntervalId = null;
  }
}

// Difficulty scaler over time
function startSpeedup() {
  stopSpeedup();
  speedupIntervalId = setInterval(() => {
    if (!gameInProgress || paused) return;
    // every 5s, make spawns faster down to min
    spawnIntervalMs = Math.max(MIN_SPAWN_MS, spawnIntervalMs - 50);
    restartSpawner();
  }, 5000);
}
function stopSpeedup() {
  if (speedupIntervalId) {
    clearInterval(speedupIntervalId);
    speedupIntervalId = null;
  }
}

// Countdown tick
function startTimer() {
  stopTimer();
  timerId = setInterval(() => {
    if (!gameInProgress || paused) return;
    timeLeft -= 1;
    text('timerValue', timeLeft);

    // Accessible countdown in last 10s
    if (timeLeft <= 10 && timeLeft > 0) {
      const msg = `${timeLeft} seconds left!`;
      const alertEl = $('countdown-alert');
      if (alertEl) { alertEl.textContent = msg; alertEl.style.display = 'block'; }
      announce(msg);
    } else {
      show('countdown-alert', false);
    }

    if (timeLeft <= 0) {
      stopTimer();
      endGame();
    }
  }, 1000);
}
function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

// Game lifecycle
function startGame() {
  if (gameInProgress) return;

  // Reset state
  score = 0;
  hits = 0;
  combo = 0;
  bestCombo = 0;
  totalSpawns = 0;
  level = 1;
  timeLeft = 30;
  spawnIntervalMs = 1000;
  bubbleTTLms = 1200;
  paused = false;
  gameInProgress = true;

  // Clear container
  const container = getContainer();
  while (container.firstChild) container.firstChild.remove();

  // UI
  loadHighScore();
  updateHUD();
  const startBtn = $('startButton');
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = 'Pause'; // will act as Pause during game
  }

  // Start systems
  startTimer();
  startSpawner();
  startSpeedup();

  // Announce
  announce('Game started.');
}

function endGame(silent = false) {
  // stop systems
  gameInProgress = false;
  paused = false;
  stopSpawner();
  stopSpeedup();
  stopTimer();

  // hide countdown
  show('countdown-alert', false);

  // High score
  if (score > highScore) {
    highScore = score;
    saveHighScore();
  }
  updateHUD();
  playEndSound();

  const startBtn = $('startButton');
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.textContent = 'Start';
  }

  if (!silent) {
    // Slight delay so HUD updates render
    setTimeout(() => alert(`Game Over! Your score: ${score}`), 100);
  }

  announce(`Game over. Your score is ${score}.`);
}

function togglePause() {
  if (!gameInProgress) return;
  paused = !paused;
  const startBtn = $('startButton');
  if (paused) {
    stopTimer();
    stopSpawner();
    if (startBtn) startBtn.textContent = 'Resume';
    announce('Game paused');
  } else {
    startTimer();
    startSpawner();
    if (startBtn) startBtn.textContent = 'Pause';
    announce('Game resumed');
  }
}

function restartGame() {
  if (gameInProgress) endGame(true);
  startGame();
}

// --- Event wiring ---
function wireControls() {
  // Start / Pause / Resume button
  const startBtn = $('startButton');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (!gameInProgress) startGame();
      else togglePause();
    });
  }

  // Keyboard shortcuts: P = pause/resume, R = restart
  document.addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase();
    if (k === 'p') togglePause();
    if (k === 'r') restartGame();
  });

  // Mute toggle (if present)
  const muteBtn = $('muteToggle');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      muted = !muted;
      muteBtn.textContent = muted ? 'Unmute' : 'Mute';
    });
    // initialize button label
    muteBtn.textContent = muted ? 'Unmute' : 'Mute';
  }

  // Initialize HUD on load
  loadHighScore();
  updateHUD();
}

// Initialize after DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', wireControls);
} else {
  wireControls();
}