document.addEventListener('DOMContentLoaded', () => {
    // Get the game board element
    const gameBoard = document.getElementById('gameBoard');

    // Initialize variables
    const grid = []; // Array to hold the grid cells
    const rows = 20; // Number of rows in the grid
    const cols = 20; // Number of columns in the grid
    let score = 0; // Player's score
    const totalPacDots = document.querySelectorAll('.pac-dot').length; // Total number of pac-dots in the game

    // Level layout (0 = empty, 1 = wall, 2 = pac-dot)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,
        1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

// Create the gameboard
layout.forEach((cell, index) => {
    const div = document.createElement('div'); // Create a new div element for each cell
    div.classList.add('cell'); // Add the 'cell' class to the div

    // Add wall class if the cell is a wall, pac-dot class if the cell contains a pac-dot
    if (cell === 1) {
        div.classList.add('wall'); // Add the 'wall' class to the div if the cell represents a wall
    } else if (cell === 2) {
        div.classList.add('pac-dot'); // Add the 'pac-dot' class to the div if the cell contains a pac-dot
    }

    gameBoard.appendChild(div); // Add the div to the game board element in the HTML
    grid.push(div); // Add the div element to the grid array for tracking
});

    // Place Pac-Man
    let pacmanCurrentIndex = 21; // Set Pac-Man's initial position to index 21
    grid[pacmanCurrentIndex].classList.add('pacman'); // Add 'pacman' class to the cell at Pac-Man's initial position

    // Remove pac-dot at initial position if present
    if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
    grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove 'pac-dot' class if present at Pac-Man's initial position
    score += 10; // Increase the score by 10 points
    console.log('Score:', score); // Output the current score to the console
}

// Function to move Pac-Man
const movePacman = () => {
    if (direction !== null) {
        let newIndex = pacmanCurrentIndex; // Initialize newIndex with the current Pac-Man index

        // Move Pac-Man based on the current direction
        switch (direction) {
            case 'ArrowUp': // Move Pac-Man up if the direction is 'ArrowUp'
                // Check if moving up is possible and there is no wall in the way
                if (pacmanCurrentIndex - cols >= 0 && !grid[pacmanCurrentIndex - cols].classList.contains('wall')) {
                    newIndex -= cols; // Move Pac-Man up by one row
                }
                break;
            case 'ArrowDown': // Move Pac-Man down if the direction is 'ArrowDown'
                // Check if moving down is possible and there is no wall in the way
                if (pacmanCurrentIndex + cols < cols * rows && !grid[pacmanCurrentIndex + cols].classList.contains('wall')) {
                    newIndex += cols; // Move Pac-Man down by one row
                }
                break;
            case 'ArrowLeft': // Move Pac-Man left if the direction is 'ArrowLeft'
                // Check if moving left is possible and there is no wall in the way
                if (pacmanCurrentIndex % cols !== 0 && !grid[pacmanCurrentIndex - 1].classList.contains('wall')) {
                    newIndex -= 1; // Move Pac-Man left by one column
                }
                break;
            case 'ArrowRight': // Move Pac-Man right if the direction is 'ArrowRight'
                // Check if moving right is possible and there is no wall in the way
                if (pacmanCurrentIndex % cols < cols - 1 && !grid[pacmanCurrentIndex + 1].classList.contains('wall')) {
                    newIndex += 1; // Move Pac-Man right by one column
                }
                break;
        }

          // Check if Pac-Man's position has changed
          if (newIndex !== pacmanCurrentIndex) {
            // Remove Pac-Man from the current position
            grid[pacmanCurrentIndex].classList.remove('pacman');
            pacmanCurrentIndex = newIndex; // Update Pac-Man's current index
            grid[pacmanCurrentIndex].classList.add('pacman'); // Add Pac-Man to the new position
            
            // Check if Pac-Man has eaten a pac-dot
            if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
                grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove the pac-dot
                score += 10; // Increase the score
                document.getElementById('scoreValue').textContent = score; // Update the score display
                console.log('Score:', score);
                
                // Check if all pac-dots are collected
                if (score === totalPacDots * 10) {
                    console.log('Congratulations! You won!');
                }
                }
            }
        }
    };

    // Check for keydown events to set Pac-Man's direction
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
            direction = key; // Set Pac-Man's direction based on the pressed key
        }
    });

    // Game loop
    setInterval(movePacman, 200); // Move Pac-Man every 200ms

    //Ghost
    class Ghost {
        constructor(startIndex, color) {
            // Initialize Ghost
            this.currentIndex = startIndex; // Set the current index of the ghost
            this.color = color; // Set the color of the ghost
        }    

        moveGhost() {
            const directions = [-1, +1, -cols, +cols]; // Possible directions for the ghost
            let direction = directions[Math.floor(Math.random() * directions.length)]; // Initial direction
            
            // Move the ghost at regular intervals
            this.timerId = setInterval(() => {
                // Logic for ghost movement
                const nextMove = this.currentIndex + direction; // Calculate the next potential position for the ghost
                if (!grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost')) { // Check if next move isn't a wall
                    // Remove ghost from the current position
                    grid[this.currentIndex].classList.remove('ghost', this.color);
                    // Move the ghost to the next position
                    this.currentIndex = nextMove;
                    // Place the ghost on the new position
                    grid[this.currentIndex].classList.add('ghost', this.color);
                } else {
                    // Choose a new random direction if the ghost can't move
                    direction = directions[Math.floor(Math.random() * directions.length)];
                }
            }, 200); // Move Ghost every 200ms
        }
    }
    
    // Create ghosts
    const ghost1 = new Ghost(209, 'red'); // Place the first ghost
    const ghost2 = new Ghost(229, 'blue'); // Place the second ghost

    // Start ghost movement
    ghost1.moveGhost();
    ghost2.moveGhost();
});