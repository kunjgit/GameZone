# Relay Rift

**Relay Rift** is a production-grade signal-routing puzzle game built for [GameZone](https://github.com/kunjgit/GameZone). Players rotate conductive wire tiles to route power from a source node through the grid to every receiver — before the move budget runs out.

## ✨ Features

- **30 hand-crafted levels** — grids grow from 3×3 to 7×7 with 1–6 receivers per level
- **Mathematically verified solvable** — every puzzle is built from a proven solution path
- **Varied path shapes** — L, U, zigzag, snake, spiral, W, staircase, diagonal wave, and more
- **Progressive difficulty** — budgets tighten and grid complexity increases level-by-level
- **Smart Hint system** — highlights the next tile and tells you exactly how many rotations it needs
- **"How to Play" tutorial** — 5-step illustrated modal on first visit, reopenable via `?`
- **Full keyboard support** — Arrow keys to navigate, Space/Enter to rotate, `H` hint, `R` reset
- **Score system** — bonus points for efficiency, persistent best score via `localStorage`
- **Particle explosion** on level completion
- **No build step** — pure HTML, CSS, and vanilla JavaScript

## 🎮 How to Play

1. **Click** (or press `Space`) a tile to rotate it 90° clockwise
2. Connect wires so signal flows from the **cyan source** node through the grid
3. Light up every **red receiver** before using all your moves
4. Press **`H`** for a hint or **`R`** to reset the level

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Click` / `Space` | Rotate focused tile |
| `Arrow keys` | Navigate between tiles |
| `H` | Show hint |
| `R` | Reset level |
| `?` | Re-open tutorial |

## 🗂️ File Structure

```
Games/Relay_Rift/
├── index.html   — game layout, HUD, win overlay, how-to-play modal
├── style.css    — cyberpunk dark theme, responsive grid, tile animations
└── script.js   — 30 levels, BFS power propagation, hint engine, tutorial
```

## 🔧 Technical Notes

- **BFS power routing** — signal propagates from source via connected wire ports each click
- **Tile encoding** — `L`=straight, `C`=corner, `T`=tee, `X`=cross, `S`=source, `R`=receiver; digit = rotation (0–3)
- **Verified solvability** — each level's solution path is traced manually; path tiles are scrambled exactly 1 step back, guaranteeing a minimum-click solution exists
- **Google Fonts** — Orbitron (display) + DM Mono (body)
- **Responsive** — adapts from 320px mobile to 1240px desktop

## 🚀 Running Locally

Open `Games/Relay_Rift/index.html` directly in any modern browser, or serve the repository root:

```bash
python -m http.server 3000
# then open http://localhost:3000/Games/Relay_Rift/
```
