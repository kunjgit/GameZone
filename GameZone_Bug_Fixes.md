# GameZone — Bug Fix Notes

This document lists 5 identified bugs in the GameZone repo, along with suggested
code-level fixes. These are pattern-based fixes — verify actual variable/element
names against the real source files before committing, then adjust as needed.

---

## 1. Dark/Light Mode Toggle Not Functioning

**Priority:** Medium | **Component:** Frontend/UI 

**Problem:** The theme toggle button does not switch between dark and light
mode, or the choice doesn't persist across pages.

**Likely cause:** Listener attached before DOM is ready, or theme state isn't
being read from/written to `localStorage` correctly.

**Suggested Fix:**
```javascript
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector("#theme-toggle"); // confirm actual selector
  const root = document.documentElement;

  // Apply saved theme on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") root.classList.add("dark-mode");

  themeToggle.addEventListener("click", () => {
    root.classList.toggle("dark-mode");
    const isDark = root.classList.contains("dark-mode");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });
});
```

**Things to check:**
- Does `document.querySelector("#theme-toggle")` actually find the button? (log it)
- Does the CSS `.dark-mode` class still exist and apply styles, or was it renamed?
- Is this script loaded on every page, or only the homepage?

---

## 2. Homepage Search Bar Does Not Filter Games

**Priority:** Medium | **Component:** Frontend/Search |

**Problem:** Typing into the search bar does not filter the visible games list.

**Likely cause:** Input listener not bound correctly, or game cards are queried
once at load time (stale reference) while the actual cards render later/dynamically.

**Suggested Fix:**
```javascript
const searchInput = document.querySelector("#search-input"); // confirm actual id/class

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();
  const gameCards = document.querySelectorAll(".game-card"); // re-query here, not cached earlier
  gameCards.forEach(card => {
    const name = card.dataset.name?.toLowerCase() || card.textContent.toLowerCase();
    card.style.display = name.includes(query) ? "" : "none";
  });
});
```

**Things to check:**
- Are game cards rendered dynamically from `gamesData.json` after this script runs?
  If so, filter the underlying data array and re-render, rather than querying the DOM.
- Confirm the deployed GitHub Pages build matches the latest `main` branch —
  a maintainer noted the live site may lag behind source changes.

---

## 3. Candy Crush Shows Non-Zero Score on Load

**Priority:** Low-Medium | **Component:** Games/Candy Crush | 

**Problem:** Score displays a non-zero value immediately on page load, before
any player interaction.

**Likely cause:** The initial board-fill routine runs a match-check pass that
awards points, same as a normal in-game match.

**Suggested Fix:**
```javascript
let score = 0;

function initBoard() {
  score = 0;
  updateScoreDisplay();
  generateBoard();
  checkMatches(true); // pass a flag so the initial setup doesn't award points
}

function checkMatches(isInitialSetup = false) {
  // ... existing match-detection logic ...
  if (!isInitialSetup) {
    score += points;
    updateScoreDisplay();
  }
}
```

**Things to check:**
- Confirm `score` isn't declared/reused from a previous game session (e.g. as a
  global that survives across "play again" without reset).

---

## 4. Tetris "Start New Game" Button Non-Functional

**Priority:** Medium | **Component:** Games/Tetris | 

**Problem:** Clicking "Start New Game" does nothing — no reset, no new game.

**Likely cause:** Button click handler not correctly bound, ID mismatch between
HTML and JS, or the reset function fails silently (check browser console) partway
through, or the old game loop interval is never cleared.

**Suggested Fix:**
```javascript
const startBtn = document.querySelector("#start-btn"); // confirm actual id
let gameInterval = null;

function resetGame() {
  clearInterval(gameInterval); // critical — old loop may keep running silently otherwise
  board = createEmptyBoard();
  score = 0;
  currentPiece = spawnPiece();
  gameOver = false;
  render();
  gameInterval = setInterval(gameLoop, 500);
}

startBtn.addEventListener("click", resetGame);
```

**Things to check:**
- Open browser dev tools and click the button — look for a thrown JS error that
  might be silently breaking the reset midway.
- Confirm the button's `id`/`class` in the HTML actually matches the selector
  used in the JS.

---

## 5. Pac-Man Does Not Restart After Game Over (Uses Full Page Refresh)

**Priority:** Medium-High | **Component:** Games/Pac-Man | 

**Problem:** After Game Over, clicking Restart/Play Again reloads the entire
page instead of resetting the game state in place.

**Likely cause:** Restart handler calls `location.reload()` (or equivalent)
instead of a proper in-memory reset function.

**Suggested Fix:**
```javascript
// BEFORE (likely current code):
restartBtn.addEventListener("click", () => {
  location.reload();
});

// AFTER:
function resetGame() {
  score = 0;
  lives = 3;
  pacman.position = { ...startingPosition };
  ghosts.forEach(g => g.reset());
  board = JSON.parse(JSON.stringify(originalBoardLayout)); // deep copy — don't mutate the original
  gameOver = false;
  render();
  requestAnimationFrame(gameLoop);
}

restartBtn.addEventListener("click", resetGame);
```

**Things to check:**
- Make sure `originalBoardLayout` is kept as an untouched reference copy
  separate from the live `board` used during gameplay, so resetting doesn't
  reuse an already-modified board.
- Cancel any running `requestAnimationFrame`/`setInterval` loops before
  restarting a new one, to avoid duplicate game loops stacking up.

---

## General Notes Before Committing
- These are **pattern-based fixes** — variable names, selectors, and file
  structure will need to match the actual source files in each game's folder.
- Test each fix in isolation, then check the browser console for errors after
  every change.
- Since this repo has many independently-contributed games, conventions
  (naming, structure) may differ folder to folder — adjust accordingly.
