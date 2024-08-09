# Rainy Day

## Description

Water Drop Catcher is an interactive browser-based game where players control a cloud to catch falling water drops. The game aims to raise awareness about water conservation in a fun and engaging way.

## Features

- Responsive cloud movement using arrow keys or touch controls
- Randomly falling water drops
- Score tracking for caught water drops
- Lives system (game over after 5 missed drops)
- Modern and sleek design
- Restart functionality

## How to Play

1. Use the left and right arrow keys (on desktop) or touch the left/right sides of the screen (on mobile) to move the cloud.
2. Catch as many water drops as you can with the cloud.
3. Avoid letting water drops hit the ground - you have 5 lives.
4. The game ends when you lose all lives or reach a score of 10.
5. Click the "Continue" button to restart the game.


## Files

- `index.html`: The main HTML file that structures the game
- `styles.css`: Contains all the styling for the game
- `script.js`: The JavaScript file that handles game logic and interactions

## Customization

You can easily customize various aspects of the game by modifying the following in `script.js`:

- Cloud speed: Adjust the `speed` property in the `cloud` object
- Drop creation frequency: Modify the condition in `if (Math.random() < 0.01)`
- Maximum number of drops: Change the `maxDrops` variable
- Drop speed: Alter the speed calculation in the `createDrop()` function

## Technologies Used

- HTML5
- CSS3
- JavaScript
- HTML5 Canvas

## Installation

1. Clone this repository .
```bash
  clone git https://github.com/kunjgit/GameZone/tree/main/Games/Rainy_Day 
```
2. Open the `index.html` file in a web browser to start the game.
