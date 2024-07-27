# Catch the Circle - A Fun and Challenging Game

Catch the Circle is a dynamic and engaging game where players aim to catch as many circles as possible within a limited time while avoiding obstacles. This README provides an overview of the game's setup, functionality, and how to play.

## Table of Contents
- [Game Overview](#game-overview)
- [Features](#features)
- [Setup](#setup)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [License](#license)

## Game Overview
Catch the Circle is a simple yet challenging game designed to test your reflexes and coordination. Players must catch circles that appear randomly on the game board and avoid obstacles that can prematurely end the game.

## Features
- **Dynamic Circle Spawning**: Circles appear at random positions on the game board every second.
- **Obstacle Avoidance**: Obstacles appear along with circles and must be avoided.
- **Score Tracking**: Your score increases each time you catch a circle.
- **Time Limit**: The game has a 30-second timer, adding urgency to the gameplay.
- **Responsive Design**: The game adapts to various screen sizes.

## Setup
To set up the game, follow these steps:
1. Clone or download the repository containing the HTML file.
2. Open the `index.html` file in your web browser to start playing the game.

## How to Play
1. **Start the Game**: Open the `index.html` file in a web browser.
2. **Catch the Circles**: Click on the blue circles that appear randomly on the game board to increase your score.
3. **Avoid Obstacles**: Red obstacles also appear randomly. Hovering over an obstacle will drastically reduce your remaining time to 1 second.
4. **Track Your Score and Time**: The current score and remaining time are displayed on the screen.
5. **End of Game**: When the timer reaches zero, an alert will show your final score. The game will then reset automatically.

## Game Mechanics
### HTML Structure
- **Game Board**: The main area where circles and obstacles appear (`#game-board`).
- **Score Display**: Displays the current score (`.score`).
- **Timer Display**: Displays the remaining time (`#timer`).

### CSS Styling
- **Body**: Ensures no horizontal overflow.
- **Game Board**: Centered, styled container for game elements.
- **Circles**: Blue circles with a click event to increase score.
- **Obstacles**: Red bars that reduce time when hovered over.

### JavaScript Functionality
- **Game Initialization**: Circles and obstacles are created every second.
- **Movement**: Circles and obstacles move to random positions every second.
- **Score Update**: Clicking a circle increases the score.
- **Timer Update**: Counts down from 30 seconds, ending the game when it reaches zero.
- **Game Reset**: Resets score, time, and game elements after each round.

## License
This project is open-source and available under the [MIT License](LICENSE).
