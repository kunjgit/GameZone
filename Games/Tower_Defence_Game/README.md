# Tower Defense Game

## Introduction

This is a simple tower defense game where players place towers to defend against waves of enemies. The objective is to prevent enemies from reaching the end of the path. The player loses if more than 3 enemies reach the end.

## How to Play

1. **Start the Game**:
   - Open `index.html` in your web browser.

2. **Select a Tower**:
   - On the left sidebar, there are buttons to select different types of towers:
     - **Basic Tower**: A standard tower with balanced stats.
     - **Sniper Tower**: A tower with long range and high damage but slower attack speed.
     - **Rapid Fire Tower**: A tower with a high attack speed but lower damage.
     - **Splash Damage Tower**: A tower that deals damage in an area, useful against groups of enemies.

3. **Place a Tower**:
   - After selecting a tower, click on the desired location on the canvas to place it.

4. **Gameplay**:
   - Enemies will start spawning from the left and move towards the right.
   - Towers will automatically attack enemies within their range.
   - You earn points for each enemy defeated.
   - The game progresses in levels, with each level introducing more or tougher enemies.

5. **Score and Lives**:
   - The scoreboard on the left shows your current score, lives, and level.
   - You start with 3 lives. Each enemy that reaches the end of the path reduces your lives by 1.
   - If your lives reach 0, the game is over.

## Game Elements

### Towers

1. **Basic Tower**:
   - Range: 100 units
   - Damage: 10
   - Attack Speed: 60 frames

2. **Sniper Tower**:
   - Range: 200 units
   - Damage: 30
   - Attack Speed: 120 frames

3. **Rapid Fire Tower**:
   - Range: 80 units
   - Damage: 5
   - Attack Speed: 20 frames

4. **Splash Damage Tower**:
   - Range: 100 units
   - Damage: 20
   - Attack Speed: 90 frames

### Enemies

1. **Basic Enemy**:
   - Health: 100
   - Speed: 1 unit/frame
   - Radius: 10 units

2. **Fast Enemy**:
   - Health: 50
   - Speed: 2 units/frame
   - Radius: 10 units

3. **Tank Enemy**:
   - Health: 300
   - Speed: 0.5 units/frame
   - Radius: 10 units

4. **Flying Enemy**:
   - Health: 70
   - Speed: 1.5 units/frame
   - Radius: 5 units

## Development

### Prerequisites

- A modern web browser (Google Chrome, Mozilla Firefox, etc.)

### Files

- `index.html`: The main HTML file.
- `styles.css`: The CSS file for styling the game.
- `game.js`: The JavaScript file containing the game logic.

### Running the Game

1. Download or clone the repository.
2. Open `index.html` in a web browser.
