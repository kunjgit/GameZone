# Shadow Runner

Shadow Runner is a simple browser-based game where the player must navigate through obstacles and collect power-ups to score points. The game area scrolls continuously, and the player must avoid obstacles while collecting power-ups to increase their score.

## Table of Contents

- [Gameplay](#gameplay)
- [Usage](#usage)
- [Controls](#controls)
- [Code Structure](#code-structure)

## Gameplay

- **Objective**: Avoid obstacles and collect power-ups to score points.
- **Scoring**:
  - Yellow Squares: -5 points
  - Green Triangles: +10 points
  - Red Balls: +15 points
  - Double points in darker areas

## Usage

1. Open `index.html` in your web browser to start the game.

## Controls

- Use the **Arrow** keys to move the player.

## Code Structure

- **HTML**: [index.html](index.html)
  - Defines the game layout and elements.
- **CSS**: [style.css](style.css)
  - Styles the game elements and animations.
- **JavaScript**: [script.js](script.js)
  - Implements the game logic and interactions.

### Key JavaScript Functions and Variables

- **Variables**:
  - `gameArea`: The main game area element.
  - `player`: The player element.
  - `startButton`: The button to start the game.
  - `scoreDisplay`: The element displaying the score.
  - `timeDisplay`: The element displaying the remaining time.
  - `gameInterval`: The interval for the game loop.
  - `lights`, `obstacles`, `powerUps`: Arrays to hold game elements.
  - `isGameRunning`: Boolean indicating if the game is running.
  - `score`: The player's score.
  - `time`: The remaining time.

- **Functions**:
  - `startGame()`: Starts the game.
  - `resetGame()`: Resets the game state.
  - `updateHUD()`: Updates the HUD with the current score and time.
  - `moveElements()`: Moves game elements (lights, obstacles, power-ups).
  - `updateGame()`: Updates the game state.
  - `checkCollisions()`: Checks for collisions between the player and game elements.
  - `gameOver(win)`: Ends the game and displays the win/lose message.
  - `createLights()`, `createObstacles()`, `createPowerUps()`: Creates game elements.