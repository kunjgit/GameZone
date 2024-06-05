# 8 Puzzle Game

An interactive 8-puzzle game built with HTML, CSS, and JavaScript. The objective of the game is to arrange the tiles in numerical order by sliding them into the empty space. 

## Features

- Shuffle the puzzle tiles.
- Reset the puzzle to the solved state.
- Timer to track the time taken to solve the puzzle.

## Getting Started

### Prerequisites

To run this project, you need a web browser that supports HTML, CSS, and JavaScript.

### Installation

1. Clone the repository or download the files.
2. Open the `index.html` file in your preferred web browser.

### Files

- `index.html`: The main HTML file that contains the structure of the game.
- `styles.css`: The CSS file that styles the game.
- `script.js`: The JavaScript file that contains the game logic.

### Usage

1. Open `index.html` in your browser.
2. Click the **Shuffle** button to shuffle the tiles.
3. Arrange the tiles in numerical order by clicking on them to slide them into the empty space.
4. The timer starts when you click the **Shuffle** button and stops when you solve the puzzle.
5. Click the **Reset** button to reset the puzzle to the solved state and reset the timer.

## Code Structure

### HTML

The HTML file sets up the structure of the game with a container for the puzzle and buttons for shuffling and resetting the tiles.

### CSS

The CSS file styles the game elements, including the puzzle tiles and buttons, and provides a responsive layout.

### JavaScript

The JavaScript file contains the game logic:
- `createTiles()`: Creates and displays the puzzle tiles.
- `moveTile(index)`: Moves a tile if it is adjacent to the empty space.
- `canMove(index)`: Checks if a tile can be moved.
- `shuffleTiles()`: Shuffles the tiles.
- `resetTiles()`: Resets the tiles to the solved state.
- `startTimer()`: Starts the timer.
- `resetTimer()`: Resets the timer.

## Demo

You can see a live demo of the game [here](#).

## Contributing

If you'd like to contribute to this project, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

