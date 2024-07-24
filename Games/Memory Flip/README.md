# Memory Flip Game

This is a simple memory flip game created using HTML, CSS, and JavaScript. The objective of the game is to find all matching pairs of cards by flipping them two at a time.

## Features

- Simple and intuitive user interface
- Dynamic card generation and shuffling
- Smooth card flipping animations
- Matching pairs detection

## How to Play

1. Open the game in a web browser.
2. Click on any card to flip it and reveal its content.
3. Click on another card to try and find its matching pair.
4. If the two flipped cards match, they will remain revealed.
5. If the two flipped cards do not match, they will be flipped back after a short delay.
6. Continue flipping cards to find all matching pairs.

## Getting Started

To run the game locally, follow these steps:

1. Clone the repository or download the source code.
2. Open the `index.html` file in your preferred web browser.

## Files

- `index.html`: The main HTML file containing the structure of the game.
- `styles.css`: The CSS file for styling the game board and cards.
- `script.js`: The JavaScript file containing the game logic and functionality.

## Customization

You can customize the game by modifying the `cardsArray` in the `script.js` file to include different card values or images.

## Example

```javascript
const cardsArray = [
    { name: 'A', img: 'A' },
    { name: 'B', img: 'B' },
    { name: 'C', img: 'C' },
    { name: 'D', img: 'D' },
    { name: 'E', img: 'E' },
    { name: 'F', img: 'F' },
    { name: 'G', img: 'G' },
    { name: 'H', img: 'H' }
];
